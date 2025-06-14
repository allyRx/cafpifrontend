import { Schema, model, Document } from 'mongoose';

interface IResultFile extends Document {
  name: string;
  type: string;
  size: number;
  createdAt: Date;
  content: Buffer;
  id: string;
}

const ResultFileSchema = new Schema<IResultFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  content: { type: Buffer, required: true },
});

ResultFileSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ResultFileSchema.set('toJSON', {
  virtuals: true,
});

// Note: This schema will be used as a subdocument in ProcessingJob.ts
// If it were a standalone model, it would be:
// export default model<IResultFile>('ResultFile', ResultFileSchema);
// For now, we just export the schema.
export { ResultFileSchema }; // Exporting the schema itself
export type { IResultFile }; // Exporting the interface for use in ProcessingJob
