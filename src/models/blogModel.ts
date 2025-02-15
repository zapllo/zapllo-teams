// src/models/Blog.ts
import mongoose, { Document, Model, Schema } from "mongoose";

const USER_COLLECTION_NAME = "users";

interface IComment {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  media?: string[];
  categories?: string[];
  tags?: string[];
  author: mongoose.Types.ObjectId;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  readingTime: number; // NEW FIELD
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
    readingTime: { type: Number, default: 0 }, // ✅ NOT required, default value set
  },
  { timestamps: true }
);

// Function to calculate reading time (~200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Pre-save hook to calculate reading time before saving
BlogSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.readingTime = calculateReadingTime(this.content);
  }
  next();
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
