import mqtt from "mqtt";

// Connect to EMQX broker over secure WebSocket
const client = mqtt.connect("wss://qd199cd1.ala.asia-southeast1.emqxsl.com:8084/mqtt", {
  username: "WebMonitor",
  password: "WebMonitor",
});

// Define the data structure you expect from the ESP32
export interface VehicleData {
  rpm?: number;
  speed?: number;
  throttle?: number;
  gear?: number;
  brake?: number;
}

// Store latest data received from MQTT
let latestData: VehicleData = {};

// List of frontend callbacks to notify when new data arrives
const dataCallbacks: ((data: VehicleData) => void)[] = [];

// Connection events
client.on("connect", () => {
  console.log("📡 MQTT Connected!");

  // Subscribe to single topic for all vehicle data
  client.subscribe("esp32mqtt/vehicle", (err) => {
    if (!err) {
      console.log("📡 Subscribed to esp32mqtt/vehicle");
    } else {
      console.error("❌ Subscribe error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  if (topic !== "esp32mqtt/vehicle") return;

  try {
    // Parse JSON message from ESP32
    const data = JSON.parse(message.toString()) as VehicleData;

    // Merge with latest data (in case some fields are missing)
    latestData = { ...latestData, ...data };

    // Notify all subscribers (e.g., UI components)
    dataCallbacks.forEach((callback) => callback(latestData));

    // Debug log
    console.log("📨 Received Vehicle Data:", latestData);
  } catch (err) {
    console.error("❌ Failed to parse MQTT JSON:", err);
    console.log("Raw message:", message.toString());
  }
});

client.on("error", (err) => {
  console.error("❌ MQTT Connection error:", err);
});

// Export helper functions for React components
export function getLatestData() {
  return latestData;
}

export function subscribeToData(callback: (data: VehicleData) => void) {
  dataCallbacks.push(callback);

  // Return unsubscribe function for cleanup
  return () => {
    const index = dataCallbacks.indexOf(callback);
    if (index > -1) {
      dataCallbacks.splice(index, 1);
    }
  };
}
