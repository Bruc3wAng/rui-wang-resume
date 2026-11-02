export const researchMarkets = [
  { code: "US", flag: "us", zh: "美国", en: "United States", lon: -98, lat: 37 },
  { code: "UK", flag: "gb", zh: "英国", en: "United Kingdom", lon: -2, lat: 53 },
  { code: "DE", flag: "de", zh: "德国", en: "Germany", lon: 10, lat: 51 },
  { code: "JP", flag: "jp", zh: "日本", en: "Japan", lon: 138, lat: 37 },
  { code: "ID", flag: "id", zh: "印度尼西亚", en: "Indonesia", lon: 118, lat: -3 },
  { code: "BR", flag: "br", zh: "巴西", en: "Brazil", lon: -51, lat: -14 },
  { code: "SA", flag: "sa", zh: "沙特阿拉伯", en: "Saudi Arabia", lon: 45, lat: 24 },
  { code: "KR", flag: "kr", zh: "韩国", en: "South Korea", lon: 128, lat: 36 },
];
const radians = Math.PI / 180;
export function worldPoint(lon: number, lat: number) {
  const a = lon * radians, b = lat * radians;
  return [Math.sin(a) * Math.cos(b), Math.sin(b), Math.cos(a) * Math.cos(b)];
}
export function projectPoint(lon: number, lat: number, centerLon: number, centerLat: number, aspect: number) {
  const [x, y, z] = worldPoint(lon, lat), a = centerLat * radians, b = centerLon * radians;
  const qx = Math.cos(b) * x - Math.sin(b) * z, qz = Math.sin(b) * x + Math.cos(b) * z;
  const vy = Math.cos(a) * y - Math.sin(a) * qz, vz = Math.sin(a) * y + Math.cos(a) * qz;
  const depth = 4.6 - vz * 1.015, scale = 4.2 / 1.12;
  return { x: .5 + qx * 1.015 * scale / aspect / depth / 2, y: .5 - vy * 1.015 * scale / depth / 2, visible: vz > .27 };
}
export function globeMesh() {
  const data: number[] = [], columns = 96, rows = 64;
  function point(u: number, v: number) { const t = v * Math.PI, a = u * Math.PI * 2; return [Math.sin(t) * Math.cos(a), Math.cos(t), Math.sin(t) * Math.sin(a)]; }
  for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
    const p = [point(x / columns, y / rows), point((x + 1) / columns, y / rows), point(x / columns, (y + 1) / rows), point((x + 1) / columns, (y + 1) / rows)];
    for (const i of [0, 1, 2, 2, 1, 3]) data.push(...p[i], ...p[i], 0, -1);
  }
  return new Float32Array(data);
}
export function networkMesh() {
  const data: number[] = [], hub = worldPoint(116.4, 39.9), segments = 48;
  researchMarkets.forEach((place, market) => {
    const end = worldPoint(place.lon, place.lat), angle = Math.acos(Math.min(1, Math.max(-1, hub.reduce((sum, v, i) => sum + v * end[i], 0))));
    function arc(t: number) { const r = 1.015 + .10 * Math.sin(Math.PI * t), divisor = Math.sin(angle); return hub.map((v, i) => r * (v * Math.sin((1 - t) * angle) + end[i] * Math.sin(t * angle)) / divisor); }
    for (let i = 0; i < segments; i++) for (const t of [i / segments, (i + 1) / segments]) data.push(...arc(t), 0, 0, 0, 1, market);
  });
  const lines = data.length / 8;
  [...researchMarkets.map(p => worldPoint(p.lon, p.lat)), hub].forEach((p, market) => data.push(...p.map(v => v * 1.015), 0, 0, 0, 2, market));
  return { data: new Float32Array(data), lines, points: researchMarkets.length + 1 };
}
