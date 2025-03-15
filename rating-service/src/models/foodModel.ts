import mongoose, { Schema, Document } from "mongoose";

interface IInstruction {
  name: number;
  amount: string;
  unit: string;
}

interface IIngredients {
  step: number;
  description: string;
}

interface IFood extends Document {
  name: string;
  category: "อาหารคาว" | "อาหารหวาน" | "เครื่องดื่ม";
  description: string;
  image: string;
  cookTime: Number
  ingredients: IIngredients[];
  instructions: IInstruction[];
  ratings: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ["อาหารคาว", "อาหารหวาน", "เครื่องดื่ม"] },
    description: { type: String, required: true },
    image: { type: String, required: true },
    cookTime: { type: Number, required: true },
    ingredients: [{
      name: { type: String, required: true },
      amount: { type: String, required: true },
      unit: { type: String, required: true },
    }],
    instructions: [
      {
        step: { type: Number, required: true },
        description: { type: String, required: true },
      }
    ],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Food = mongoose.model<IFood>("Food", FoodSchema, "foods");

export default Food;
