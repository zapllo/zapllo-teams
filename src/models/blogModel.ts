// src/models/Blog.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// Use the existing user model name "users" so we can reference it properly
const USER_COLLECTION_NAME = "users"; 

interface IComment {
  user: mongoose.Types.ObjectId; // references the User model
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;  // can store HTML or Quill Delta (JSON)
  coverImage?: string;
  media?: string[];
  categories?: string[];
  tags?: string[];
  author: mongoose.Types.ObjectId; // referencing the 'users' collection
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: USER_COLLECTION_NAME, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    coverImage: { type: String },
    media: [{ type: String }],
    categories: [{ type: String }],
    tags: [{ type: String }],
    author: {
      type: Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    published: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
