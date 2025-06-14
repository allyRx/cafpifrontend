const { Schema, model } = require('mongoose');

// Interface IUploadedFile (commented out)
// interface IUploadedFile extends Document {
//   name: string;
//   type: string;
//   size: number;
//   status: string;
//   userId: Schema.Types.ObjectId;
//   content: Buffer;
//   id: string;
// }

const UploadedFileSchema = new Schema({
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

module.exports = model('UploadedFile', UploadedFileSchema);
