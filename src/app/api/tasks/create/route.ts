import connectDB from "@/lib/db";
import Task from "@/models/taskModal";
import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helper/getDataFromToken";
import User from "@/models/userModel";
import { sendEmail, SendEmailOptions } from "@/lib/sendEmail";

connectDB();

const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const optionsDate: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "2-digit" };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedDate = new Intl.DateTimeFormat("en-GB", optionsDate).format(date);
  const formattedTime = new Intl.DateTimeFormat("en-GB", optionsTime).format(date);
  const timeParts = formattedTime.match(/(\d{1,2}:\d{2})\s*(AM|PM)/);
  const formattedTimeUppercase = timeParts ? `${timeParts[1]} ${timeParts[2].toUpperCase()}` : formattedTime;

  return `${formattedDate} ${formattedTimeUppercase}`;
};

const sendWebhookNotification = async (
  taskData: any,
  assignedUser: any, // Include the entire assignedUser object
  taskUserFirstName: string,
  categoryName: string
) => {
  const payload = {
    phoneNumber: assignedUser.whatsappNo, // Pass only the local phone number
    country: assignedUser.country, // Pass the country code (e.g., IN, US)
    templateName: "task_notification_nu",
    bodyVariables: [
      assignedUser.firstName,
      taskUserFirstName,
      categoryName,
      taskData.title,
      taskData.description,
      taskData.priority,
      formatDate(taskData.dueDate),
      "zapllo.com",
    ],
  };

  try {
    const response = await fetch("https://zapllo.com/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Send country and phoneNumber
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Webhook API error, response data: ${JSON.stringify(responseData)}`);
    }

    console.log("Webhook notification sent successfully:", payload);
  } catch (error) {
    console.error("Error sending webhook notification:", error);
  }
};


const sendNotifications = async (
  task: any,
  assignedUser: any,
  taskUser: any,
  category: any
) => {
  try {
    const promises = [];

    // Email Notification
    if (assignedUser.notifications.email) {
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
                          <p><strong>Assigned By:</strong> ${taskUser.firstName}</p>
                          <p><strong>Category:</strong> ${category.name}</p>
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
      promises.push(sendEmail(emailOptions));
    }

    // WhatsApp Notification
    if (assignedUser.notifications.whatsapp) {
      promises.push(
        sendWebhookNotification(
          task,
          assignedUser, // Pass the entire user object
          taskUser.firstName,
          category.name
        )
      );
    }

    await Promise.all(promises);
    console.log("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};


export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const authenticatedUser = await User.findById(userId);

    if (!authenticatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = await request.json();

    // Prepare task data
    const taskData = {
      ...data,
      repeat: data.repeat ?? false,
      repeatType: data.repeat ? data.repeatType : undefined,
      user: userId,
      organization: authenticatedUser.organization,
    };

    // Create and save the task
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();

    // Respond immediately to indicate success
    const taskUser = await User.findById(savedTask.user);
    const assignedUser = await User.findById(savedTask.assignedUser);
    const category = await Category.findById(savedTask.category);

    if (!taskUser || !assignedUser || !category) {
      return NextResponse.json({
        message: "Task created successfully",
        notifications: "Skipped due to missing user or category",
        task: savedTask,
      });
    }

    // Send notifications in the background
    sendNotifications(savedTask, assignedUser, taskUser, category);

    return NextResponse.json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
