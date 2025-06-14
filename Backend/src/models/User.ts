import { Schema, model, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

interface IUser extends Document {
  email: string;
  name: string;
  subscription: string;
  password?: string; // Made password optional on interface for safety, required in schema
  id: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true, select: false }, // select: false by default
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) { // also check if password exists
    return next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false; // Should not happen if password is required and selected
  return await bcryptjs.compare(enteredPassword, this.password);
};

UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // Ensure password is not sent in JSON responses
  }
});

export default model<IUser>('User', UserSchema);
