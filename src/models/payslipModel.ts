// src/models/payslipModel.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './userModel';

export interface IPayslip extends Document {
    user: IUser | mongoose.Types.ObjectId; // Reference to the user
    logo: string; // URL of the logo
    name: string; // Company name
    address: string; // Company address
    contact: string; // Primary contact number
    emailOrWebsite: string; // Email or website
}

const payslipSchema: Schema<IPayslip> = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Linked user
        logo: { type: String, required: false }, // Optional logo file
        name: { type: String, required: true }, // Company name
        address: { type: String, required: true }, // Address
        contact: { type: String, required: true }, // Contact number
        emailOrWebsite: { type: String, required: true }, // Email or Website
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Payslip: Model<IPayslip> =
    mongoose.models.Payslip || mongoose.model<IPayslip>('Payslip', payslipSchema);

export default Payslip;
