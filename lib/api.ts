export async function getOdometerHistory(
  vehicleId: string,
  range: string = "1h"
) {
  const res = await fetch(
    `http://localhost:4000/api/telemetry/odometer?vehicleId=${vehicleId}&range=${range}`
  );
  if (!res.ok) throw new Error("Failed to fetch odometer history");
  return await res.json();
}
