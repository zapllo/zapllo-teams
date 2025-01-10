// Import necessary modules and models
import connectDB from "@/lib/db";
import Task from "@/models/taskModal";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail, SendEmailOptions } from "@/lib/sendEmail"; // Assuming you have this function
import Category from "@/models/categoryModel";
import { RepeatType, Status } from "@/types/enums";


connectDB();
// Define the RepeatType enum





const sendWebhookNotification = async (
    templateName: string,
    taskData: any,
    taskCreator: any,
    assignedUser: any,
    status: any,
    userName: any,
    comment: any,
    taskCategory: any
) => {
    const formattedDueDate = formatDate(taskData.dueDate);

    // Construct body variables based on the template
    let bodyVariables: string[] = [];

    if (templateName === "task_notification_nu") {
        // Body variables for task creation
        bodyVariables = [
            assignedUser.firstName,
            taskCreator.firstName,
            taskCategory.name,
            taskData.title,
            taskData.description,
            taskData.priority,
            formattedDueDate,
            "zapllo.com",
        ];
    } else if (templateName === "taskupdate") {
        // Body variables for task update
        bodyVariables = [
            taskCreator.firstName,
            userName,
            status, // Task status
            comment,
            taskCategory.name,
            taskData.title,
            formattedDueDate,
            taskData.priority,
        ];
    }

    // Create the payload with phone number and country
    const payload = {
        phoneNumber: taskCreator.whatsappNo, // Local phone number
        country: taskCreator.country, // Country code (e.g., IN, US)
        templateName,
        bodyVariables,
    };

    console.log(payload, "Payload being sent for webhook notification");

    try {
        const response = await fetch("https://zapllo.com/api/webhook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(`Webhook API error: ${responseData.message}`);
        }

        console.log("Webhook notification sent successfully:", payload);
    } catch (error) {
        console.error("Error sending webhook notification:", error);
        throw new Error("Failed to send webhook notification");
    }
};




export async function PATCH(request: NextRequest) {
    try {
        const { id, status, comment, userName, fileUrl } = await request.json();

        // Find the task by ID
        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Determine newStatus to store in the database
        let newStatus = status;
        if (status === 'Reopen') {
            newStatus = 'Pending'; // Store "Pending" in the database for Reopen tasks
        } else {
            newStatus = status;
            if (status === 'Completed') {
                task.completionDate = new Date(); // Add completion date for completed tasks
            }
        }

        task.status = newStatus;
        console.log(newStatus, 'huh')
        // Add a comment to the task with a status tag
        task.comments.push({
            userName,
            comment,
            fileUrl,
            tag: status, // Use the original status (e.g., "Reopen") in comments
            createdAt: new Date(),
        });

        await task.save();
        // Respond immediately to the client
        const response = NextResponse.json({ message: "Task updated successfully", task }, { status: 200 });

        // Handle background tasks asynchronously
        setImmediate(async () => {
            try {
                const backgroundTasks: Promise<any>[] = [];



                // Notification logic
                const taskCreator = await User.findById(task.user);
                const assignedUser = await User.findById(task.assignedUser);
                const taskCategory = await Category.findById(task.category);

                if (!taskCreator || !assignedUser || !taskCategory) {
                    console.error("Creator, assignee, or category not found. Skipping notifications.");
                    return;
                }

                // Send Email to the task creator
                if (assignedUser.notifications.email) { // Check if email notifications are enabled
                    const emailOptions: SendEmailOptions = {
                        to: assignedUser.email,
                        subject: "New Task Assigned",
                        text: "Zapllo",
                        html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
                          <div style="background-color: #f0f4f8; padding: 20px;">
                              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                  <div style="padding: 20px; text-align: center;">
                                      <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
                                  </div>
                                  <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
                                      <h1 style="margin: 0; font-size: 20px;">New Task Assigned</h1>
                                  </div>
                                  <div style="padding: 20px;">
                                      <p><strong>Dear ${assignedUser.firstName},</strong></p>
                                      <p>A new task has been assigned to you. Below are the details:</p>
                                      <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                                          <p><strong>Title:</strong> ${task.title}</p>
                                          <p><strong>Description:</strong> ${task.description}</p>
                                          <p><strong>Due Date:</strong> ${formatDate(task.dueDate)}</p>
                                          <p><strong>Assigned By:</strong> ${taskCreator.firstName}</p>
                                          <p><strong>Category:</strong> ${taskCategory.name}</p>
                                          <p><strong>Priority:</strong> ${task.priority}</p>
                                      </div>
                                      <div style="text-align: center; margin-top: 20px;">
                                          <a href="https://zapllo.com/dashboard/tasks" style="background-color: #0C874B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Task App</a>
                                      </div>
                                      <p style="margin-top: 20px; text-align: center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                                  </div>
                              </div>
                          </div>
                      </body>`,
                    };

                    backgroundTasks.push(sendEmail(emailOptions));
                }
                backgroundTasks.push(
                    sendWebhookNotification(
                        "taskupdate",
                        task,
                        taskCreator,
                        assignedUser,
                        status,
                        userName,
                        comment,
                        taskCategory
                    )
                );
                // Task repetition logic
                if (status === Status.Completed && task.repeat) {
                    let nextDueDate: Date | null = null;

                    if (task.repeatType === RepeatType.Daily) {
                        nextDueDate = new Date(task.dueDate);
                        nextDueDate.setDate(nextDueDate.getDate() + 1);
                    } else if (task.repeatType === RepeatType.Weekly && task.days) {

                        const currentDayIndex = new Date(task.dueDate).getDay();
                        const dayIndexes = task.days.map(day =>
                            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(day)
                        );
                        // Find the next closest day
                        const nextDayIndex = dayIndexes
                            .filter(index => index > currentDayIndex) // Days after the current day
                            .sort((a, b) => a - b)[0] ?? dayIndexes.sort((a, b) => a - b)[0]; // Sort and take the earliest day if no days are after the current day

                        nextDueDate = new Date(task.dueDate);

                        const daysToAdd = nextDayIndex > currentDayIndex
                            ? nextDayIndex - currentDayIndex
                            : 7 - currentDayIndex + nextDayIndex; // Calculate days to add to reach the next day

                        nextDueDate.setDate(nextDueDate.getDate() + daysToAdd);
                    } else if (task.repeatType === RepeatType.Monthly && task.dates) {
                        const currentDay = new Date(task.dueDate).getDate();
                        const nextDate = task.dates.find(date => date > currentDay) ?? task.dates[0];
                        nextDueDate = new Date(task.dueDate);
                        if (nextDate <= currentDay) {
                            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
                        }
                        nextDueDate.setDate(nextDate);
                    }

                    if (nextDueDate) {
                        const newTaskData = {
                            ...task.toObject(),
                            _id: undefined, // Generate a new ID
                            dueDate: nextDueDate,
                            completionDate: null,
                            status: Status.Pending,
                            comments: [], // Reset comments
                            createdAt: undefined,
                            updatedAt: undefined,
                        };
                        const newTask = new Task(newTaskData);
                        console.log(newTask, 'new created task!');
                        const savedNewTask = await newTask.save();

                        // Notification logic for the new task
                        const taskCreator = await User.findById(task.user);
                        const assignedUser = await User.findById(task.assignedUser);
                        const taskCategory = await Category.findById(task.category);

                        if (!taskCreator || !assignedUser || !taskCategory) {
                            console.error("Creator, assignee, or category not found for new task. Skipping notifications.");
                        } else {
                            if (assignedUser.notifications.email) { // Check if email notifications are enabled
                                const emailOptions: SendEmailOptions = {
                                    to: taskCreator.email,
                                    subject: "Task Status Updates",
                                    text: `Task '${task.title}' has been updated.`,
                                    html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
<div style="background-color: #f0f4f8; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; text-align: center;">
            <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
        </div>
      <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 40px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
<h1 style="margin: 0; font-size: 20px;">Task Status ${status}</h1>
</div>
                        <div style="padding: 20px;">
                            <p><strong>Dear ${taskCreator.firstName},</strong></p>
                            <p>${userName} has updated the task status to ${status} for a task assigned by you.</p>
                            <p>Update Remarks - ${comment}</p>
                            <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                            <p>Task Details:</p>
                            <p><strong>Title:</strong> ${task.title}</p>
                            <p><strong>Description:</strong> ${task.description}</p>
                            <p><strong>Due Date:</strong> ${formatDate(nextDueDate)}</p>
                            <p><strong>Assigned To:</strong> ${assignedUser.firstName}</p>
                            <p><strong>Category:</strong> ${taskCategory.name}</p>
                            <p><strong>Priority:</strong> ${task.priority}</p>
                            </div>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://zapllo.com/dashboard/tasks" style="background-color: #0C874B; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Task App</a>
                        </div>
                            <p style="margin-top: 20px; text-align: center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                     </div>
                </div>
            </div>
        </body>
            `,
                                };


                                backgroundTasks.push(sendEmail(emailOptions));
                            }
                            // Send webhook notification for the new task
                            backgroundTasks.push(
                                sendWebhookNotification(
                                    "task_notification_nu",
                                    savedNewTask,
                                    taskCreator,
                                    assignedUser,
                                    savedNewTask.status,
                                    taskCreator.firstName,
                                    "",
                                    taskCategory
                                )
                            );

                        }
                    }
                }

                await Promise.all(backgroundTasks);
            } catch (error) {
                console.error("Error in background processing:", error);
            }
        });

        return response;
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
    }
}


// Helper function to format date
const formatDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    // Options for formatting
    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: '2-digit' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    const formattedDate = new Intl.DateTimeFormat('en-GB', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(date);

    // Convert AM/PM to uppercase
    const timeParts = formattedTime.match(/(\d{1,2}:\d{2})\s*(AM|PM)/);
    const formattedTimeUppercase = timeParts ? `${timeParts[1]} ${timeParts[2].toUpperCase()}` : formattedTime;

    return `${formattedDate} ${formattedTimeUppercase}`;
};
