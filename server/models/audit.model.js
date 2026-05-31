import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'CANCEL', 'STATUS_CHANGE']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userType: {
      type: String,
      enum: ['USER', 'EMPLOYEE', 'ADMIN'],
      required: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    previousData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for better query performance
auditSchema.index({ orderId: 1 });
auditSchema.index({ userId: 1 });
auditSchema.index({ action: 1 });
auditSchema.index({ timestamp: -1 });

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;
