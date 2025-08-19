
import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  id: { type: String, index: true, required: true },
  timestamp: { type: Date, index: true, required: true, default: Date.now },
  level: { type: String, enum: ['INFO', 'WARN', 'ERROR'], index: true, required: true },
  service: { type: String, enum: ['auth', 'payments', 'notifications'], index: true, required: true },
  message: { type: String, required: true }
}, { versionKey: false });

// LogSchema.index({ level: 1, service: 1, timestamp: -1 });
LogSchema.index({ timestamp: -1, _id: -1 });   // stable paging
LogSchema.index({ message: 'text' });

// export const Log = mongoose.model('Log', LogSchema);
const Log = mongoose.model("Log", LogSchema);
export default Log;