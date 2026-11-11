import axios from "axios";
import { Platform } from "react-native";

// UPDATE from actual computer's local IP address for physical phone testing
const LOCAL_IP = "192.168.1.92";
const PORT = "5000";

const getBaseUrl = () => {
  // If running on an Android Emulator, 10.0.2.2 points back to your machine
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${PORT}`;
  }
  // If testing via Expo Go on a physical phone or iOS simulator
  return `http://${LOCAL_IP}:${PORT}`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
