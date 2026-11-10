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

export const allResearchLinks = -1;
export const terrainZoomLevels = [1, 1.25, 1.5] as const;

export function stepTerrainZoom(step: number, direction: -1 | 1) {
  return Math.max(0, Math.min(terrainZoomLevels.length - 1, step + direction));
}

// These bit positions are the same market indices packed into the geometry.
// The Beijing base is deliberately outside this set: it is not a study market.
export function studyGlobeCoverage(markets: readonly string[]) {
  const included = new Set(markets);
  let mask = 0;
  const places = researchMarkets.filter((place, i) => {
    if (!included.has(place.code)) return false;
    mask |= 1 << i;
    return true;
  });
  return { mask, places };
}

const radians = Math.PI / 180;
export const researchRouteShape = {
  baseRadius: 1.012, lift: .069, bend: .104, halfWidth: .0105,
  flowRate: .12, phases: [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6],
} as const;
// Same camera and projection as the WebGL view; used to bake its first-paint image.
export function spherePoint(clipX: number, clipY: number, radius = 1) {
  const scale = 4.2 / 1.12, dx = clipX / scale, dy = clipY / scale;
  const a = dx * dx + dy * dy + 1, discriminant = 4.6 * 4.6 - a * (4.6 * 4.6 - radius * radius);
  if (discriminant < 0) return null;
  const distance = (4.6 - Math.sqrt(discriminant)) / a;
  return [distance * dx, distance * dy, 4.6 - distance];
}
export function worldFromView(n: number[], lon: number, lat: number) {
  const a = lat * radians, b = lon * radians;
  const y = Math.cos(a) * n[1] + Math.sin(a) * n[2], z = -Math.sin(a) * n[1] + Math.cos(a) * n[2];
  return [Math.cos(b) * n[0] + Math.sin(b) * z, y, -Math.sin(b) * n[0] + Math.cos(b) * z];
}
export function worldPoint(lon: number, lat: number) {
  const a = lon * radians, b = lat * radians;
  return [Math.sin(a) * Math.cos(b), Math.sin(b), Math.cos(a) * Math.cos(b)];
}
export function projectPoint(lon: number, lat: number, centerLon: number, centerLat: number, aspect: number, zoom = 1) {
  const [x, y, z] = worldPoint(lon, lat), a = centerLat * radians, b = centerLon * radians;
  const qx = Math.cos(b) * x - Math.sin(b) * z, qz = Math.sin(b) * x + Math.cos(b) * z;
  const vy = Math.cos(a) * y - Math.sin(a) * qz, vz = Math.sin(a) * y + Math.cos(a) * qz;
  const depth = 4.6 - vz * 1.018, scale = 4.2 / 1.12 * zoom;
  const xView = .5 + qx * 1.018 * scale / aspect / depth / 2, yView = .5 - vy * 1.018 * scale / depth / 2;
  // Omit labels cropped by the close view; the market picker remains available.
  const inside = zoom <= 1 || (xView >= .12 && xView <= .88 && yView >= .12 && yView <= .88);
  return { x: xView, y: yView, visible: vz > .27 && inside };
}
export function globeMesh(material = 0, radius = 1) {
  const data: number[] = [], columns = 128, rows = 96;
  function point(u: number, v: number) { const t = v * Math.PI, a = u * Math.PI * 2; return [Math.sin(t) * Math.cos(a), Math.cos(t), Math.sin(t) * Math.sin(a)]; }
  for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
    const p = [point(x / columns, y / rows), point((x + 1) / columns, y / rows), point(x / columns, (y + 1) / rows), point((x + 1) / columns, (y + 1) / rows)];
    for (const i of [0, 1, 2, 2, 1, 3]) data.push(...p[i].map(value => value * radius), ...p[i], material, -1);
  }
  return new Float32Array(data);
}
// An illustrative comparison network, not traffic, sample counts or electricity data.
// Extra edges can only join markets that coexist in a supplied, verified study.
export function networkMesh(groups: readonly (readonly string[])[] = []) {
  const data: number[] = [], hub = worldPoint(116.4, 39.9), segments = 48;
  const places = [...researchMarkets.map(p => worldPoint(p.lon, p.lat)), hub];
  const edges: [number, number][] = researchMarkets.map((_, index) => [8, index]);
  const seen = new Set<string>();
  for (const group of groups) {
    const members = researchMarkets.flatMap((p, i) => group.includes(p.code) ? [i] : []);
    members.forEach((a, index) => members.slice(index + 1).forEach(b => {
      const key = `${a}:${b}`;
      if (!seen.has(key)) { seen.add(key); edges.push([a, b]); }
    }));
  }
  for (const [a, b] of edges) {
    const start = places[a], end = places[b], code = a * 16 + b;
    const angle = Math.acos(Math.min(1, Math.max(-1, start.reduce((sum, v, i) => sum + v * end[i], 0))));
    const normal = [start[1] * end[2] - start[2] * end[1], start[2] * end[0] - start[0] * end[2], start[0] * end[1] - start[1] * end[0]];
    const length = Math.hypot(...normal), side = normal.map(v => v / length);
    function vertex(t: number, direction: number) {
      const rise = Math.sin(Math.PI * t), r = researchRouteShape.baseRadius + researchRouteShape.lift * rise;
      const offset = rise * researchRouteShape.bend * Math.min(1, angle * 1.6) + researchRouteShape.halfWidth * direction;
      const point = start.map((v, i) => r * (v * Math.sin((1 - t) * angle) + end[i] * Math.sin(t * angle)) / Math.sin(angle) + side[i] * offset);
      data.push(...point, t, direction, 0, 1, code);
    }
    for (let i = 0; i < segments; i++) {
      const t = i / segments, next = (i + 1) / segments;
      vertex(t, -1); vertex(t, 1); vertex(next, -1);
      vertex(next, -1); vertex(t, 1); vertex(next, 1);
    }
  }
  const triangles = data.length / 8;
  places.forEach((p, market) => data.push(...p.map(v => v * 1.018), 0, 0, 0, 2, market * 16 + market));
  // Light packets trace the same curves on the GPU; no per-frame mesh uploads.
  edges.forEach(([a, b]) => {
    for (const phase of researchRouteShape.phases) data.push(...places[a], ...places[b], 4 + phase, a * 16 + b);
  });
  return { data: new Float32Array(data), triangles, points: places.length, particles: edges.length * researchRouteShape.phases.length, edges, segments };
}
