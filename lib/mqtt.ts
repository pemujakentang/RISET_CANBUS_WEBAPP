import mqtt from "mqtt";

// MQTT broker connection using the credentials from dashboard
const client = mqtt.connect("wss://qd199cd1.ala.asia-southeast1.emqxsl.com:8084/mqtt", {
    username: "WebMonitor",
    password: "WebMonitor"
});

const latestData: {
  rpm?: number;
  speed?: number;
  throttle?: number;
  gear?: number;
  brakePressure?: number;
  waterTemp?: number;
  oilTemp?: number;
} = {};

// Callbacks for real-time data updates
const dataCallbacks: ((data: typeof latestData) => void)[] = [];

client.on("connect", () => {
  console.log("📡 MQTT Connected!");
  
  // Subscribe to ESP32 topics
  client.subscribe("esp32mqtt/vehicle/rpm", (err) => {
    if (!err) {
      console.log("📡 Subscribed to esp32mqtt/vehicle/rpm");
    } else {
      console.error("Subscribe error:", err);
    }
  });
  
  // Subscribe to other vehicle topics for future use
  client.subscribe("esp32mqtt/vehicle/speed", (err) => {
    if (!err) console.log("📡 Subscribed to esp32mqtt/vehicle/speed");
  });
  
  client.subscribe("esp32mqtt/vehicle/throttle", (err) => {
    if (!err) console.log("📡 Subscribed to esp32mqtt/vehicle/throttle");
  });
});

client.on("message", (topic, message) => {
  try {
    const value = parseFloat(message.toString());
    
    // Update the appropriate field based on topic
    switch (topic) {
      case "esp32mqtt/vehicle/rpm":
        latestData.rpm = value;
        break;
      case "esp32mqtt/vehicle/speed":
        latestData.speed = value;
        break;
      case "esp32mqtt/vehicle/throttle":
        latestData.throttle = value;
        break;
      default:
        console.log(`Unknown topic: ${topic}`);
    }
    
    // Notify all subscribers about data update
    dataCallbacks.forEach(callback => callback(latestData));
    
  } catch (err) {
    console.error("MQTT message error:", err);
  }
});

client.on("error", (err) => {
  console.error("MQTT Connection error:", err);
});

export function getLatestData() {
  return latestData;
}

export function subscribeToData(callback: (data: typeof latestData) => void) {
  dataCallbacks.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = dataCallbacks.indexOf(callback);
    if (index > -1) {
      dataCallbacks.splice(index, 1);
    }
  };
}
