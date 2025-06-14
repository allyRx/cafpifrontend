const { Schema, model } = require('mongoose');
const { ResultFileSchema } = require('./ResultFile.js'); // Adjusted to .js

// Interface IProcessingJob (commented out)
// interface IProcessingJob extends Document {
//   folderId: Schema.Types.ObjectId;
//   fileName: string;
//   status: string;
//   progress: number;
//   createdAt: Date;
//   completedAt?: Date;
//   results: IResultFile[]; // IResultFile interface was also removed from ResultFile.js
//   id: string;
// }

const ProcessingJobSchema = new Schema({
  folderId: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
  fileName: { type: String, required: true },
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

module.exports = model('ProcessingJob', ProcessingJobSchema);
