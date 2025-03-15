import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar_url: string;
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar_url: { type: String, required: true },
});

const User = mongoose.model<IUser>("User", userSchema, "users");

export default User;
