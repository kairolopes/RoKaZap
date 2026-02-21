import axios from "axios";

const baseURL = process.env.ZAPI_BASE_URL;
const instanceToken = process.env.ZAPI_INSTANCE_TOKEN;

if (!baseURL || !instanceToken) {
  // No throw here to allow building without env vars; runtime calls will fail fast
}

export interface SendMessagePayload {
  phone: string;
  message: string;
}

export async function sendTextMessage(payload: SendMessagePayload) {
  if (!baseURL || !instanceToken) {
    throw new Error("Z-API configuration is missing");
  }

  await axios.post(
    `${baseURL}/instances/${instanceToken}/token/send-text`,
    {
      phone: payload.phone,
      message: payload.message,
    }
  );
}

