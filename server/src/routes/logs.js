
import express from 'express';
import Log from '../models/Log.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getLogs, getLogStats } from "../controllers/logController.js";
import { validate } from "../middlewares/validate.js";
import { logQuerySchema, logStatsSchema } from '../validation/schemas.js';

const router = express.Router();

router.get("/", validate(logQuerySchema), getLogs);
router.get("/stats", validate(logStatsSchema), getLogStats);

export default router;
