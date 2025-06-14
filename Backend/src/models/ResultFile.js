const { Schema } = require('mongoose'); // Only Schema is needed as it's not a standalone model

// Interface IResultFile (commented out, was for TypeScript)
// interface IResultFile extends Document {
//   name: string;
//   type: string;
//   size: number;
//   createdAt: Date;
//   content: Buffer;
//   id: string;
// }

const ResultFileSchema = new Schema({
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

// Note: This schema will be used as a subdocument in ProcessingJob.js
// For now, we just export the schema.
// The type export { IResultFile } is removed as interfaces are not used in JS.
module.exports = { ResultFileSchema };
