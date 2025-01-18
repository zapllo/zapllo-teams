import mongoose, { Schema, Document, Model } from "mongoose";


interface Allowance {
    name: string;
    amount: number;
}


export interface IPayslipLog extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user
    month: number; // Month of the payslip
    year: number; // Year of the payslip
    uniqueLink: string; // Unique link for accessing the payslip
    publicLink: string; // Unique link for accessing the payslip
    generatedAt: Date; // Timestamp when payslip was generated
    salaryDetails?: Allowance[]; // New field for salary details
    deductionDetails?: Allowance[]; // New field for salary details
}


const payslipLogSchema: Schema<IPayslipLog> = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        uniqueLink: { type: String, required: true, unique: true },
        publicLink: { type: String, required: true, unique: true },
        generatedAt: { type: Date, default: Date.now },
        salaryDetails: [
            {
                name: { type: String, },
                amount: { type: Number, },
            },
        ],
        deductionDetails: [
            {
                name: { type: String, },
                amount: { type: Number, },
            },
        ],
    },
    { timestamps: true }
);

const PayslipLog: Model<IPayslipLog> =
    mongoose.models.PayslipLog || mongoose.model<IPayslipLog>("PayslipLog", payslipLogSchema);

export default PayslipLog;
