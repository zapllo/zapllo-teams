import mongoose, { Document, Model, Schema } from "mongoose";

interface ILead extends Document {
    firstName: string;
    lastName: string;
    email: string;
    mobNo: string;
    message: string;
    // New field
    subscribedStatus: "Yes, I need Support" | "No, I need a callback for my queries and then subscribe";
}

const LeadSchema: Schema<ILead> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    mobNo: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    subscribedStatus: {
        type: String,
        enum: [
            "Yes, I need Support",
            "No, I need a callback for my queries and then subscribe",
        ],
        required: true,
    },
}, { timestamps: { createdAt: true, updatedAt: false } }); // Automatically add `createdAt` field);

const Lead: Model<ILead> =
    mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
