import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// CUSTOMER SCHEMA
const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    leadSource: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
customerSchema.plugin(toJSON);

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
