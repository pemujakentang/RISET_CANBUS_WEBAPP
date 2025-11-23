export type TelemetryKey =
  | "rpm"
  | "speed"
  | "throttle"
  | "gear"
  | "brake"
  | "engineCoolantTemp"
  | "airIntakeTemp"
  | "odoMeter";

type Entry = { t: number; value: number };

const MAX_DURATION = 600 * 1000; // keep 10 minutes (ms)

const buffer: Record<TelemetryKey, Entry[]> = {
  rpm: [],
  speed: [],
  throttle: [],
  gear: [],
  brake: [],
  engineCoolantTemp: [],
  airIntakeTemp: [],
  odoMeter: [],
};

export function pushTelemetry(key: TelemetryKey, value: number) {
  const now = Date.now();
  buffer[key].push({ t: now, value });

  // prune older than 10 mins
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
    ].includes(key);
}
