// Data formatiing, ID generation etc...

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const BAND_COUNT = 4;

// picks one of the trip-card gradient bands deterministically, so a trip always gets the same one
export function bandIndex(seed) {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % BAND_COUNT;
  return hash;
}
