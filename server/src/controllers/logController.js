import Log from "../models/Log.js";
import { getLogStatsService } from "../services/logService.js";
import mongoose from 'mongoose';


// GET /logs
export const getLogs = async (req, res) => {
  try {
    const {
      level, service, from, to, q,
      limit: limitRaw = 100,
      afterTs,                 // ISO date string of the last item's timestamp
      afterId,                 // last item's _id as hex string
    } = req.query;

    // 1) Parse & clamp
    const pageSize = Math.min(Math.max(parseInt(limitRaw, 10) || 100, 1), 500);


    // 2) Build filters (CSV support)
    const filters = {};
    if (level) {
      const levels = String(level).split(',').map(s => s.trim()).filter(Boolean);
      if (levels.length) filters.level = { $in: levels };
    }
    if (service) {
      const services = String(service).split(',').map(s => s.trim()).filter(Boolean);
      if (services.length) filters.service = { $in: services };
    }
    if (from || to) {
      filters.timestamp = {};
      if (from) filters.timestamp.$gte = new Date(from);
      if (to) filters.timestamp.$lte = new Date(to);
    }
    if (q && q.trim()) {
      filters.message = { $regex: q.trim(), $options: 'i' };
    }

    // 3) Stable sort (tie-break on _id)
    const sort = { timestamp: -1, _id: -1 };

    // Be strict: only paginate when BOTH parts of the keyset are present and valid
    if (afterTs && afterId) {
      const ts = new Date(afterTs);
      const oid = new mongoose.Types.ObjectId(afterId);
      filters.$or = [
        { timestamp: { $lt: ts } },         // strictly older
        { timestamp: ts, _id: { $lt: oid } } // same-ts tie-break by _id
      ];
    }

    // 4) Over-fetch by one to detect "has more"
    const docsPlusOne = await Log.find(filters)
      .sort(sort)
      .limit(pageSize + 1)   // no skip when using keyset
      .hint({ timestamp: -1, _id: -1 })
      .lean()

      .exec();

    const hasMore = docsPlusOne.length > pageSize;
    const data = hasMore ? docsPlusOne.slice(0, pageSize) : docsPlusOne;

    // 5) Cursors
    
    const last = data[data.length - 1];
    const nextCursor = hasMore ? {
      afterTs: new Date(last.timestamp).toISOString(),
      afterId: String(last._id),
    } : null;
    // With keyset pagination, "prev" is non-trivial. Handle "Back" on the client
    // via a stack of previous cursors, or omit it:
    const prevCursor = null;
    console.log('IN afterTs/afterId', afterTs, afterId);
    console.log('OUT nextCursor', nextCursor);
    console.log('PAGE first..last _id', data[0]?._id, last?._id);
    res.json({
      data,
      pageSize,
      // cursor,        // current offset used for this page
      nextCursor,    // null when no more results
      prevCursor,    // null when at the start
      hasMore
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

// GET /logs/stats
export const getLogStats = async (req, res) => {
  try {
    const { seconds } = req.query;
    const stats = await getLogStatsService(seconds);
    res.json(stats);
  } catch (err) {
    console.error("Error fetching log stats:", err);
    res.status(500).json({ error: "Failed to fetch log stats" });
  }
};