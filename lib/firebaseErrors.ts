import { AuthErrorCodes } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const firebaseAuthErrorMap: Record<string, string> = {
  [AuthErrorCodes.INVALID_EMAIL]: "Enter a valid email address.",
  [AuthErrorCodes.USER_DELETED]: "Invalid email or password.",
  [AuthErrorCodes.INVALID_PASSWORD]: "Invalid email or password.",
  [AuthErrorCodes.USER_DISABLED]: "This account has been disabled.",
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]:
    "Too many attempts. Try again later.",
  [AuthErrorCodes.EMAIL_EXISTS]: "An account with this email already exists.",
  [AuthErrorCodes.WEAK_PASSWORD]: "Password should be at least 6 characters.",
  "auth/invalid-credential": "Invalid email or password.",
};

export function getFirebaseAuthMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return (
      firebaseAuthErrorMap[error.code] ??
      "An unexpected authentication error occurred."
    );
  }

  return "An unexpected error occurred.";
}
