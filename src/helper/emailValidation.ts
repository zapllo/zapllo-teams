export const validateEmail = (email: string): string => {
    if (!email) {
        return "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return "Invalid email address";
    }
    return ""; // No errors
};
