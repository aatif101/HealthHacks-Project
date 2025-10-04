// Simple distance-based clustering + fan-out on a small ring
// Types are omitted (JS) so it can be imported from .js components.

const toRad = d => (d * Math.PI) / 180;
const toDeg = r => (r * 180) / Math.PI;

export function haversineDistanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// great-circle destination from (lat, lon), bearingDeg, distanceKm
export function destinationPoint(lat, lon, bearingDeg, distanceKm) {
  const R = 6371;
  const br = toRad(bearingDeg);
  const dR = distanceKm / R;
  const φ1 = toRad(lat);
  const λ1 = toRad(lon);

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(dR) +
      Math.cos(φ1) * Math.sin(dR) * Math.cos(br)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(br) * Math.sin(dR) * Math.cos(φ1),
      Math.cos(dR) - Math.sin(φ1) * Math.sin(φ2)
    );

  return { lat: toDeg(φ2), lng: ((toDeg(λ2) + 540) % 360) - 180 };
}

export function clusterByDistance(pts, thresholdKm = 25) {
  const clusters = [];
  const used = new Array(pts.length).fill(false);

  for (let i = 0; i < pts.length; i++) {
    if (used[i]) continue;
    const cluster = [pts[i]];
    used[i] = true;
    for (let j = i + 1; j < pts.length; j++) {
      if (used[j]) continue;
      if (haversineDistanceKm(pts[i], pts[j]) <= thresholdKm) {
        cluster.push(pts[j]);
        used[j] = true;
      }
    }
    clusters.push(cluster);
  }
  return clusters;
}

export function spreadCluster(cluster, ringKm = 12) {
  if (cluster.length === 1) return cluster;
  const center = cluster[0]; // stable center; could average if desired
  const n = cluster.length;

  return cluster.map((p, idx) => {
    const bearing = (idx * 360) / n;
    const off = destinationPoint(center.lat, center.lng, bearing, ringKm);
    return {
      ...p,
      lat: off.lat,
      lng: off.lng,
      __origLat: p.lat,
      __origLng: p.lng,
      __clusterIndex: idx,
      __clusterSize: n,
    };
  });
}

export function spreadPoints(pts, thresholdKm = 25, ringKm = 12) {
  const clusters = clusterByDistance(pts, thresholdKm);
  return clusters.flatMap(c => spreadCluster(c, ringKm));
}
