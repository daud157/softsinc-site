import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ReviewSchema = new Schema(
  {
    image: {
      type: String,
      required: [true, "image is required"],
      trim: true,
    },
    service: {
      type: String,
      required: [true, "service is required"],
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

export type ReviewDoc = InferSchemaType<typeof ReviewSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Review: Model<ReviewDoc> =
  (mongoose.models.Review as Model<ReviewDoc> | undefined) ??
  mongoose.model<ReviewDoc>("Review", ReviewSchema);
