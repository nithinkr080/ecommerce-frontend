import { notifications } from "@mantine/notifications";

class Toast {
  success(message) {
    notifications.show({
      title: message,
    });
  }
  error(message) {
    notifications.show({
      title: `Error: ${message}`,
      color: "red",
    });
  }
}

export default new Toast();
