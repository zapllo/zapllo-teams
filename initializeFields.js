import mongoose from 'mongoose';
import User from './src/models/userModel'; // Update the path to your user model

const initializeFields = async () => {
    try {
        // Connect to your MongoDB database
        await mongoose.connect('mongodb+srv://shubhodeep:AEcW-rxMj-4AdJu@zapllo.syhexj6.mongodb.net/production?retryWrites=true&w=majority&appName=zapllo', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Initialize fields for all users
        const updatedUsers = await User.updateMany(
            {},
            {
                $set: {
                    salaryDetails: [
                        { name: 'Basic Salary', amount: 0 },
                        { name: 'Dearness Allowance (DA)', amount: 0 },
                        { name: 'House Rent Allowance (HRA)', amount: 0 },
                        { name: 'Travelling Allowance', amount: 0 },
                        { name: 'Internet Allowance', amount: 0 },
                        { name: 'Medical Allowance', amount: 0 },
                    ],
                    status: 'Active', // Default status for all users
                },
            },
            { upsert: false, multi: true }
        );

        console.log(`${updatedUsers.modifiedCount} users updated successfully.`);

        // Close the database connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error updating users:', error);
    }
};

// Run the script
initializeFields();
