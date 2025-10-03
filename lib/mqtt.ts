import mqtt from "mqtt";

const client = mqtt.connect("mqtt://36fb9291221e425d953221c0e7547685.s1.eu.hivemq.cloud"); // change if using cloud broker

let latestData: {
  rpm?: number;
  speed?: number;
  throttle?: number;
  gear?: number;
} = {};

client.on("connect", () => {
  console.log("MQTT connected");
  client.subscribe("vehicle/data");
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    latestData = { ...latestData, ...data }; // merge new fields
  } catch (err) {
    console.error("MQTT message error:", err);
  }
});

export function getLatestData() {
  return latestData;
}
