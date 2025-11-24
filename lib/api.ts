// Original (before modification):
// export async function getOdometerHistory(...) {
//   // ... fetch logic ...
//   return await res.json(); // returns the whole object: { vehicleId, range, count, data: [...] }
// }

export async function getOdometerHistory(
  vehicleId: string,
  range: string = "1h"
) {
  const res = await fetch(
    `http://localhost:4000/api/telemetry/odometer?vehicleId=${vehicleId}&range=${range}`
  );
  if (!res.ok) throw new Error("Failed to fetch odometer history");
  // 1. Get the full response object
  const fullResponse = await res.json();

  // 2. Return *only* the data array
  // console.log("Odometer history response:", fullResponse);
  return fullResponse.data;
}
