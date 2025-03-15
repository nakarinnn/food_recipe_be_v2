import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  foodId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", CommentSchema, "comments");

export default Comment;
