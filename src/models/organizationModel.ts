import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: false,
  },
  industry: {
    type: String,
    required: true,
    enum: [
      "Retail/E-Commerce",
      "Technology",
      "Service Provider",
      "Healthcare(Doctors/Clinics/Physicians/Hospital)",
      "Logistics",
      "Financial Consultants",
      "Trading",
      "Education",
      "Manufacturing",
      "Real Estate/Construction/Interior/Architects",
      "Other",
    ], // Updated industry options
  },
  teamSize: {
    type: String,
    required: true,
    enum: ["1-10", "11-20", "21-30", "31-50", "51+"], // Updated team size ranges
  },
  description: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  isPro: {
    type: Boolean,
    default: false,
  },
  userExceed: {
    type: Boolean,
    default: false,
  },
  credits: { type: Number, default: 0 },
  subscribedPlan: {
    type: String, // e.g., "Basic", "Standard", "Premium"
  },
  subscribedUserCount: {
    type: Number, // The number of subscribed users
  },
  subscriptionExpires: {
    type: Date,
  },
  trialExpires: {
    type: Date,
    required: true,
  },

  leavesTrialExpires: {
    type: Date,
  },
  country: {
    type: String,
    required: true,
  },
  attendanceTrialExpires: {
    type: Date,
  },
  loginTime: {
    type: String, // Store as a string like "08:00"
  },
  logoutTime: {
    type: String, // Store as a string like "17:00"
  },
  location: {
    lat: Number,
    lng: Number
  },
  allowGeofencing: {
    type: Boolean,
    default: false,
  },
  // Store geofence radius in meters
  geofenceRadius: {
    type: Number,
    default: 0,
  },
  penaltyOption: { type: String, enum: ["", "leave", "salary"], default: "leave" },
  lateLoginThreshold: { type: Number, default: 0 },
  penaltyLeaveType: { type: String, enum: ["", "half day", "Full Day", "quarter day"], default: "half day" },
  penaltySalaryAmount: { type: Number, default: 0 },
  isEnterprise: {
    type: Boolean,
    default: false,
  },
  whatsAppWallet: {
    balance: { type: Number, default: 0 },
    lastRecharge: { type: Date },
    rechargeHistory: [{
      amount: Number,
      transactionId: String,
      date: { type: Date, default: Date.now }
    }]
  },
  aiCredits: {
    type: Number,
    default: 100,  // Default 100 credits for each organization
  },
  aiCreditsHistory: [{
    amount: Number,      // Amount paid in currency
    credits: Number,     // Number of credits purchased/used
    transactionId: String, // Payment ID or task ID
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['recharge', 'usage'] }, // Type of transaction
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // User who performed the action
    task: { type: String, default: null }, // Task name (for usage)
    taskId: { type: String, default: null }, // Task ID (for usage)
    gstNumber: { type: String, default: null } // GST number (for recharge)
  }]
}, { timestamps: true });

// Model for organizations
const Organization =
  mongoose.models.organizations ||
  mongoose.model("organizations", organizationSchema);

export default Organization;
