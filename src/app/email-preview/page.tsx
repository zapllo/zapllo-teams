const RegularizationApprovalEmailPreview = () => {
    // Mock data for the preview
    const user = {
        firstName: "John Doe",
        email: "john.doe@example.com",
    };
    const approverName = "Jane Manager";
    const regularizationEntry = {
        createdAt: "2024-11-20",
        loginTime: "09:00 AM",
        logoutTime: "06:00 PM",
        notes: "All good. Approved.",
    };

    const formatDate = (date: string | Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        };
        const parsedDate = typeof date === "string" ? new Date(date) : date;
        return new Intl.DateTimeFormat("en-GB", options).format(parsedDate);
    };

    const emailHTML = `
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background-color: #f0f4f8; padding: 20px; ">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <div style="padding: 20px; text-align: center; ">
                <img src="https://res.cloudinary.com/dndzbt8al/image/upload/v1724000375/orjojzjia7vfiycfzfly.png" alt="Zapllo Logo" style="max-width: 150px; height: auto;">
            </div>
          <div style="background: linear-gradient(90deg, #7451F8, #F57E57); color: #ffffff; padding: 20px 10px; font-size: 16px; font-weight: bold; text-align: center; border-radius: 12px; margin: 20px auto; max-width: 80%;">
    <h1 style="margin: 0; font-size: 20px;">Regularization Request - Approved</h1>
</div>
                     <div style="padding: 20px; color:#000000;">
                        <p>Dear ${user.firstName},</p>
                        <p>Your regularization application has been <strong>Approved</strong> by ${approverName}, given below are the details:</p>
                             <div style="border-radius:8px; margin-top:4px; color:#000000; padding:10px; background-color:#ECF1F6">
                        <p><strong>Date:</strong> ${formatDate(regularizationEntry.createdAt)}</p>
                        <p><strong>Login Time:</strong> ${regularizationEntry.loginTime}</p>
                        <p><strong>Logout Time:</strong> ${regularizationEntry.logoutTime}</p>
                        <p><strong>Manager Remarks:</strong> ${regularizationEntry.notes || "Approved"}</p>
                        </div>
                        <div style="text-align: center; margin-top: 40px;">
                            <a href="https://zapllo.com/attendance/my-attendance" style="background-color: #017a5b; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Open Payroll App</a>
                        </div>
                        <p style="margin-top: 20px; text-align:center; font-size: 12px; color: #888888;">This is an automated notification. Please do not reply.</p>
                    </div>
                </div>
            </div>
        </body>`;

    return <div dangerouslySetInnerHTML={{ __html: emailHTML }} />;
};

export default RegularizationApprovalEmailPreview;
