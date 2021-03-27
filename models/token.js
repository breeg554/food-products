import mongoose from "mongoose";
const { Schema } = mongoose;

const tokenSchema = new Schema({
  _userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});
export default mongoose.model("Token", tokenSchema);
