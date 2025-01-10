// types.ts
import { Document } from 'mongoose';

export interface User {
    firstName: string;
    whatsappNo: string;
}

export interface Task {
    dueDate: Date;
    reminder: {
        type: 'minutes' | 'hours' | 'days';
        value: number;
    } | null;
    title: string;
    priority: string;
    user: User;
}

export interface TaskDocument extends Document, Task {}
