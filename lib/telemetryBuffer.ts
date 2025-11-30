export type TelemetryKey =
  | "rpm"
  | "speed"
  | "throttle"
  | "gear"
  | "brake"
  | "engineCoolantTemp"
  | "airIntakeTemp"
  | "odoMeter"
  | "steeringAngle"
  ;

type Entry = { t: number; value: number };

const MAX_DURATION = 600 * 1000; // keep 10 minutes (ms)
const SAMPLING_INTERVAL_MS = 1000;

const buffer: Record<TelemetryKey, Entry[]> = {
  rpm: [],
  speed: [],
  throttle: [],
  gear: [],
  brake: [],
  engineCoolantTemp: [],
  airIntakeTemp: [],
  odoMeter: [],
  steeringAngle: [],
};

const lastSavedTime: Record<TelemetryKey, number> = {
  rpm: 0,
  speed: 0,
  throttle: 0,
  gear: 0,
  brake: 0,
  engineCoolantTemp: 0,
  airIntakeTemp: 0,
  odoMeter: 0,
  steeringAngle: 0,
};

export function pushTelemetry(key: TelemetryKey, value: number) {
  const now = Date.now();

  if (now - lastSavedTime[key] < SAMPLING_INTERVAL_MS) {
    return; // Skip saving this frame
  }

  buffer[key].push({ t: now, value });
  lastSavedTime[key] = now; 

  buffer[key] = buffer[key].filter((e) => now - e.t <= MAX_DURATION);
}

export function getTelemetryRange(key: TelemetryKey, seconds: number) {
  const now = Date.now();
  const cutoff = now - seconds * 1000;

  return buffer[key].filter((e) => e.t >= cutoff);
}

export function isTelemetryKey(key: string): key is TelemetryKey {
    return [
        "rpm",
        "speed",
        "throttle",
        "gear",
        "brake",
        "engineCoolantTemp",
        "airIntakeTemp",
        "odoMeter",
        "diffWheelSpeed",
    ].includes(key);
}
