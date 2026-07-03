export async function searchPlaces(
  query,
  countryOnly = false,
  countryCode = "",
) {
  let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;

  if (countryOnly) url += `&feautureType=country`;
  if (countryCode) url += `&countrycodes=${countryCode}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("search failed :(");

  const data = await res.json();
  return data;
}
