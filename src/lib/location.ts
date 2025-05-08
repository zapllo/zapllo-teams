/**
 * Wraps the callback-style Geolocation API in a promise so it can be awaited.
 * Always either resolves with { lat, lng } or throws an Error whose `code`
 * matches the standard GeolocationPositionError codes (1, 2, 3).
 *
 * @param timeout  – milliseconds until we give up (default 15 000 ms)
 */
export async function getBrowserLocation(
  timeout: number = 15_000
): Promise<{ lat: number; lng: number }> {
  // SSR / Edge guard – never call the browser API on the server
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation API not available in this context");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout,
    });
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}
