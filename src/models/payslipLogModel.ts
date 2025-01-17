import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayslipLog extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user
    month: number; // Month of the payslip
    year: number; // Year of the payslip
    uniqueLink: string; // Unique link for accessing the payslip
    generatedAt: Date; // Timestamp when payslip was generated
}

const payslipLogSchema: Schema<IPayslipLog> = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        uniqueLink: { type: String, required: true, unique: true },
        generatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const PayslipLog: Model<IPayslipLog> =
    mongoose.models.PayslipLog || mongoose.model<IPayslipLog>("PayslipLog", payslipLogSchema);

export default PayslipLog;
