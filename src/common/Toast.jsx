import { notifications } from "@mantine/notifications";

class Toast {
  success(message) {
    notifications.show({
      title: message,
    });
  }
  error(message) {
    message = message ?? "Someting went wrong";
    notifications.show({
      title: `Error: ${message}`,
      color: "red",
    });
  }
}

export default new Toast();
