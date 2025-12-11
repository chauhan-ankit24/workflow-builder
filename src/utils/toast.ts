import toast from "react-hot-toast";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
): void => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
    default:
      toast(message, { duration: 900 });
      break;
  }
};

export const showSuccessToast = (message: string): void => {
  showToast(message, "success");
};

export const showErrorToast = (message: string): void => {
  showToast(message, "error");
};

export const showInfoToast = (message: string): void => {
  showToast(message, "info");
};
