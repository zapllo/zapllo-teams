import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the Tutorial document
export interface ITutorial extends Document {
    title: string;
    thumbnail: string;
    link: string;
    category: "Task Delegation App" | "Leave and Attendance App" | "Zapllo WABA" | "Zapllo CRM";
    description?: string;
    duration?: number;
    tags?: string[];
}

// Define the schema
const tutorialSchema: Schema<ITutorial> = new mongoose.Schema(
    {
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        link: { type: String, required: true },
        category: {
            type: String,
            enum: ["Task Delegation App", "Leave and Attendance App", "Zapllo WABA", "Zapllo CRM"],
            required: true,
        },
        description: { type: String },
        duration: { type: Number },
        tags: [{ type: String }]
    },
    { timestamps: true }
);

// Define and export the Tutorial model
const Tutorial: Model<ITutorial> = mongoose.models.tutorials || mongoose.model<ITutorial>('tutorials', tutorialSchema);

export default Tutorial;
