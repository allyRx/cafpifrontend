import { Schema, model, Document } from 'mongoose';

interface IUploadedFile extends Document {
  name: string;
  type: string;
  size: number;
  status: string; // e.g., 'uploaded', 'processing', 'processed', 'failed'
  userId: Schema.Types.ObjectId;
  content: Buffer;
  id: string;
}

const UploadedFileSchema = new Schema<IUploadedFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  status: { type: String, required: true, default: 'uploaded' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: Buffer, required: true },
});

UploadedFileSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

UploadedFileSchema.set('toJSON', {
  virtuals: true,
});

export default model<IUploadedFile>('UploadedFile', UploadedFileSchema);
