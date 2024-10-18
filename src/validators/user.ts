import { isFieldEmpty, isValidEmail } from "./utils"

export const checkEmail = (email: string): string => {
    if (isFieldEmpty(email)) {
        return "login.error.required"
    } else if (!isValidEmail(email)) {
        return "login.error.email"
    }
    return '';
}