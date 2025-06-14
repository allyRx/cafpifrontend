import { Schema, model, Document } from 'mongoose';
import { ResultFileSchema, IResultFile } from './ResultFile'; // Import schema and interface

interface IProcessingJob extends Document {
  folderId: Schema.Types.ObjectId;
  fileName: string; // Or perhaps UploadedFileId: Schema.Types.ObjectId;
  status: string; // e.g., 'queued', 'processing', 'completed', 'failed'
  progress: number; // Percentage 0-100
  createdAt: Date;
  completedAt?: Date;
  results: IResultFile[]; // Array of result files
  id: string;
}

const ProcessingJobSchema = new Schema<IProcessingJob>({
  folderId: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
  fileName: { type: String, required: true }, // Consider referencing UploadedFile model
  status: { type: String, required: true, default: 'queued' },
  progress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  results: [ResultFileSchema], // Embed the ResultFile schema
});

ProcessingJobSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ProcessingJobSchema.set('toJSON', {
  virtuals: true,
});

export default model<IProcessingJob>('ProcessingJob', ProcessingJobSchema);
