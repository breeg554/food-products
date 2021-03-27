import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 200,
    },
    nutrients: {
      calories: {
        type: Number,
        required: true,
        max: 10000,
      },
      protein: {
        type: Number,
        required: true,
        max: 500,
      },
      fat: {
        type: Number,
        required: true,
        max: 500,
      },
      carbohydrates: {
        type: Number,
        required: true,
        max: 500,
      },
    },
    gramsPerUnit: {
      type: Number,
      required: true,
    },
    _categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    _authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model("Product", productSchema);
