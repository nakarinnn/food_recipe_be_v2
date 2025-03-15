import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: "Food" | "Comment";
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetId: { type: Schema.Types.ObjectId, ref: "Food",required: true },
  targetType: { type: String, required: true, enum: ["Food", "Comment"] },
  createdAt: { type: Date, default: Date.now }
});

const Like = mongoose.model<ILike>("Like", LikeSchema, "likes");

export default Like;
