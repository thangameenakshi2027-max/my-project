import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    image: { type: String },

    // 🆕 Add this line:
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {timestamps: true}
);

export default mongoose.model("Item", itemSchema);
