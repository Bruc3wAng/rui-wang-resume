// Shared lighting and shell dimensions for the live Earth and its offline poster.
export const earthPosterRevision = "570d31df4af6";

export const earthMaterial = {
  light: [-.72, .68, 1.35],
  cloudRadius: 1.003,
  atmosphereRadius: 1.018,
  ambient: .09,
  exposure: 1.12,
} as const;

export const earthVertex = `#version 300 es
precision highp float;
in vec3 position;in vec3 normal;in float material;in float market;
uniform vec2 resolution;uniform vec2 orientation;uniform float activeMarket;
out vec3 point;out vec3 surface;flat out float kind;flat out float picked;
vec3 view(vec3 w){float a=orientation.y,b=orientation.x;vec3 p=vec3(cos(b)*w.x-sin(b)*w.z,w.y,sin(b)*w.x+cos(b)*w.z);return vec3(p.x,cos(a)*p.y-sin(a)*p.z,sin(a)*p.y+cos(a)*p.z);}
void main(){vec3 p=material>.5&&material<2.5?view(position):position;float depth=4.6-p.z;float scale=4.2/1.12;gl_Position=vec4(p.x*scale/(resolution.x/resolution.y),p.y*scale,1.020202*depth-.2020202,depth);point=p;surface=normal;kind=material;picked=abs(market-activeMarket)<.1?1.:0.;gl_PointSize=material>1.5&&material<2.5?(picked>.5?10.:5.):1.;}`;

export const earthFragment = `#version 300 es
precision highp float;
in vec3 point;in vec3 surface;flat in float kind;flat in float picked;out vec4 color;
uniform sampler2D earth;uniform sampler2D clouds;uniform vec2 orientation;
const float PI=3.14159265359;
const float CLOUD_RADIUS=${earthMaterial.cloudRadius};
vec3 world(vec3 n){float a=orientation.y,b=orientation.x;vec3 p=vec3(n.x,cos(a)*n.y+sin(a)*n.z,-sin(a)*n.y+cos(a)*n.z);return vec3(cos(b)*p.x+sin(b)*p.z,p.y,-sin(b)*p.x+cos(b)*p.z);}
vec2 uvAt(vec3 n){vec3 w=world(normalize(n));return vec2(atan(w.x,w.z)/(2.*PI)+.5,.5-asin(clamp(w.y,-1.,1.))/PI);}
float cloudAt(vec3 n){return smoothstep(.055,.88,texture(clouds,uvAt(n)).r);}
vec3 shellPoint(vec3 p,vec3 direction){float b=dot(p,direction);float d=-b+sqrt(max(0.,b*b+CLOUD_RADIUS*CLOUD_RADIUS-dot(p,p)));return p+direction*d;}
void main(){
 vec3 n=normalize(surface),v=normalize(vec3(0.,0.,4.6)-point),light=normalize(vec3(${earthMaterial.light.join(",")}));
 if(kind>2.5){float facing=max(0.,dot(n,v)),sun=smoothstep(-.3,.7,dot(n,light));float edge=pow(1.-facing,5.);color=vec4(mix(vec3(.28,.48,.65),vec3(.46,.73,.91),sun),edge*(.09+.25*sun));return;}
 if(kind>.5){if(kind>1.5){float d=length(gl_PointCoord-.5);if(d>.5)discard;float alpha=1.-smoothstep(.21,.5,d);color=vec4(mix(vec3(.63,.81,.87),vec3(1.,.89,.64),picked),alpha);}else{if(picked<.5)discard;color=vec4(.88,.82,.66,.56);}return;}
 vec3 natural=texture(earth,uvAt(n)).rgb;
 float water=1.-smoothstep(-.03,.075,max(natural.r,natural.g*.9)-natural.b);
 natural=mix(natural,vec3(.025,.105,.17)+natural*.55,water*.62);
 float sun=max(0.,dot(n,light));
 float shadow=cloudAt(shellPoint(n,light));
 vec3 ground=pow(natural,vec3(2.2))*(${earthMaterial.ambient}+1.03*sun*(1.-shadow*.42));
 vec3 halfVector=normalize(light+v);float fresnel=.025+.975*pow(1.-max(0.,dot(v,halfVector)),5.);
 float sheen=pow(max(0.,dot(n,halfVector)),85.)*sun*water*(1.-shadow*.75);
 ground+=vec3(.79,.87,.95)*sheen*fresnel*1.8;
 vec3 cloudPoint=shellPoint(n,v),cloudNormal=normalize(cloudPoint);float cloud=cloudAt(cloudPoint);
 float cloudSun=max(0.,dot(cloudNormal,light));vec3 cloudColor=vec3(.92,.95,.98)*(.18+cloudSun*.88);
 vec3 radiance=mix(ground,cloudColor,cloud*.88);
 float air=pow(1.-max(0.,dot(n,v)),3.5)*(.10+.33*sun);
 radiance=mix(radiance,vec3(.22,.42,.63),air);
 color=vec4(pow(max(radiance*${earthMaterial.exposure},vec3(0.)),vec3(1./2.2)),1.);
}`;

type Vector = readonly number[];
type Sampler = (normal: Vector) => number[];
const dot = (a: Vector, b: Vector) => a.reduce((sum, value, index) => sum + value * b[index], 0);
const normalize = (v: Vector) => { const length = Math.hypot(...v); return v.map(value => value / length); };
const mix = (a: Vector, b: Vector, t: number) => a.map((value, index) => value + (b[index] - value) * t);
const smoothstep = (a: number, b: number, value: number) => { const t = Math.max(0, Math.min(1, (value - a) / (b - a))); return t * t * (3 - 2 * t); };
const light = normalize(earthMaterial.light);

export function intersectShell(p: Vector, direction: Vector, radius: number) {
  const b = dot(p, direction);
  const distance = -b + Math.sqrt(Math.max(0, b * b + radius * radius - dot(p, p)));
  return p.map((value, index) => value + direction[index] * distance);
}

export function shadeEarth(p: Vector, surfaceAt: Sampler, cloudsAt: Sampler) {
  const n = normalize(p), v = normalize([-p[0], -p[1], 4.6 - p[2]]);
  let natural = surfaceAt(n);
  const water = 1 - smoothstep(-.03, .075, Math.max(natural[0], natural[1] * .9) - natural[2]);
  natural = mix(natural, natural.map((value, index) => [.025, .105, .17][index] + value * .55), water * .62);
  const cloudAt = (normal: Vector) => smoothstep(.055, .88, cloudsAt(normal)[0]);
  const sun = Math.max(0, dot(n, light));
  const shadow = cloudAt(intersectShell(n, light, earthMaterial.cloudRadius));
  const ground = natural.map(value => Math.pow(value, 2.2) * (earthMaterial.ambient + 1.03 * sun * (1 - shadow * .42)));
  const halfVector = normalize(light.map((value, index) => value + v[index]));
  const fresnel = .025 + .975 * Math.pow(1 - Math.max(0, dot(v, halfVector)), 5);
  const sheen = Math.pow(Math.max(0, dot(n, halfVector)), 85) * sun * water * (1 - shadow * .75);
  ground.forEach((_, index) => { ground[index] += [.79, .87, .95][index] * sheen * fresnel * 1.8; });
  const cloudPoint = intersectShell(n, v, earthMaterial.cloudRadius), cloud = cloudAt(cloudPoint);
  const cloudSun = Math.max(0, dot(normalize(cloudPoint), light));
  const cloudColor = [.92, .95, .98].map(value => value * (.18 + cloudSun * .88));
  const radiance = mix(ground, cloudColor, cloud * .88);
  const air = Math.pow(1 - Math.max(0, dot(n, v)), 3.5) * (.10 + .33 * sun);
  return mix(radiance, [.22, .42, .63], air).map(value => Math.pow(Math.max(0, value * earthMaterial.exposure), 1 / 2.2));
}

export function shadeAtmosphere(p: Vector) {
  const n = normalize(p), v = normalize([-p[0], -p[1], 4.6 - p[2]]);
  const facing = Math.max(0, dot(n, v)), sun = smoothstep(-.3, .7, dot(n, light));
  return [...mix([.28, .48, .65], [.46, .73, .91], sun), Math.pow(1 - facing, 5) * (.09 + .25 * sun)];
}
