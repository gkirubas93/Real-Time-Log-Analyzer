import Joi from "joi";

// Query validation for GET /logs
export const logQuerySchema = Joi.object({
  level: Joi.string(),    // allow CSV; validated later by your parser
  service: Joi.string(),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
  limit: Joi.number().min(1).max(100000).default(10),
  afterTs: Joi.date().iso().optional(),
  afterId: Joi.string().hex().length(24).optional(),
  q: Joi.string().allow(""),
});

// Validation for GET /logs/stats
export const logStatsSchema = Joi.object({
  seconds: Joi.number().min(1).max(3600).default(60), // default last 60s
});