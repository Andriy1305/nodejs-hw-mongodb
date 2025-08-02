import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);
userSchema.method('toJSON', function () {
  const obj = this.toObject();
  delete obj.password;
  //console.log('CONSOL OBJ:', obj);
  return obj;
});

export const User = mongoose.model('User', userSchema);
