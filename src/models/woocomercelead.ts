import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWoocomerceLead extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    amount: string;
    webinarDate: Date;
    webinarTime: string;
    webinarUrl: string;
}

const WoocomerceLeadSchema: Schema<IWoocomerceLead> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        webinarDate: { type: Date, required: true },
        webinarTime: { type: String, required: true },
        webinarUrl: { type: String, required: true },
    },
    { timestamps: true }
);

const WoocommerceLead: Model<IWoocomerceLead> = mongoose.models.WoocommerceLead || mongoose.model<IWoocomerceLead>('WoocommerceLead', WoocomerceLeadSchema);

export default WoocommerceLead;
