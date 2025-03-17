// /models/taskTemplateModel.ts

import mongoose, { Document, Schema, Model } from 'mongoose';

enum RepeatType {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Daily = 'Daily',
  Yearly = 'Yearly',
  Periodically = 'Periodically',
}

enum Status {
  Pending = 'Pending',
  Completed = 'Completed',
  InProgress = 'In Progress',
  Reopen = 'Reopen',
}

export interface ITaskTemplate extends Document {
  title: string;
  description: string;
  category?: mongoose.Types.ObjectId;
  priority: 'High' | 'Medium' | 'Low';
  repeatType?: RepeatType;
  repeat: boolean;
  days?: Array<
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  >;
  dates?: number[];
  attachment?: string[];
  audioUrl?: string;
  links?: string[];
  status?: Status;
  organization?: mongoose.Types.ObjectId;
  repeatInterval?: number;
  comments: {
    userName: string;
    fileUrl: string[];
    tag: string;
    comment: string;
    createdAt?: Date;
  }[];
  reminders: {
    notificationType: 'email' | 'whatsapp';
    type: 'minutes' | 'hours' | 'days' | 'specific';
    value?: number;
    date?: Date;
    sent: boolean;
  }[];
}

const taskTemplateSchema = new Schema<ITaskTemplate>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Low' },
    repeatType: { type: String, enum: Object.values(RepeatType) },
    repeat: { type: Boolean, default: false },
    repeatInterval: Number,
    days: [{ type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] }],
    dates: [Number],
    attachment: [String],
    audioUrl: String,
    links: [String],
    status: { type: String, enum: Object.values(Status), default: Status.Pending },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    reminders: [
      {
        notificationType: { type: String, enum: ['email', 'whatsapp'] },
        type: { type: String, enum: ['minutes', 'hours', 'days', 'specific'] },
        value: Number,
        date: Date,
        sent: { type: Boolean, default: false },
      },
    ],
    comments: [
      {
        userName: { type: String, required: true },
        comment: { type: String, required: true },
        fileUrl: [String],
        tag: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const TaskTemplate: Model<ITaskTemplate> =
  mongoose.models.TaskTemplate || mongoose.model<ITaskTemplate>('TaskTemplate', taskTemplateSchema);

export default TaskTemplate;
