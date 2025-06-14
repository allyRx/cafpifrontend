const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

// Interface IUser (commented out)
// interface IUser extends Document {
//   email: string;
//   name: string;
//   subscription: string;
//   password?: string;
//   id: string;
//   comparePassword(enteredPassword: string): Promise<boolean>;
// }

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true, select: false }, // select: false by default
});

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware or save operation
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
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

module.exports = model('User', UserSchema);
