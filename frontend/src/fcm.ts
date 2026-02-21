import { api } from "./api";
import { getFcmToken, listenForegroundMessages } from "./firebase";

export async function initFcm() {
  const existing = localStorage.getItem("fcmToken");
  if (!existing) {
    const token = await getFcmToken();
    if (token) {
      localStorage.setItem("fcmToken", token);
      await api.post("/devices/register", { token });
    }
  }

  listenForegroundMessages(() => undefined);
}

