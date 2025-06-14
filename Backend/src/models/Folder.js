const { Schema, model } = require('mongoose');

// Interface IFolder (commented out)
// interface IFolder extends Document {
//   name: string;
//   description?: string;
//   createdAt: Date;
//   fileCount: number;
//   status: string;
//   userId: Schema.Types.ObjectId;
//   id: string;
// }

const FolderSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  fileCount: { type: Number, default: 0 },
  status: { type: String, required: true, default: 'pending' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

FolderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

FolderSchema.set('toJSON', {
  virtuals: true,
});

module.exports = model('Folder', FolderSchema);
