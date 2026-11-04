// Shared lighting and shell dimensions for the live Earth and its offline poster.
export const earthPosterRevision = "11de34fdae30";

export const earthMaterial = {
  light: [-1.05, .58, 1.04],
  cloudRadius: 1.003,
  atmosphereRadius: 1.018,
  ambient: .045,
  exposure: 1.16,
} as const;

export const earthVertex = `#version 300 es
precision highp float;
in vec3 position;in vec3 normal;in float material;in float market;
uniform vec2 resolution;uniform vec2 orientation;uniform float activeMarket;uniform float clock;uniform float pixelRatio;
out vec3 point;out vec3 surface;out float pathPosition;out float edgeDistance;flat out float kind;flat out float picked;
vec3 view(vec3 w){float a=orientation.y,b=orientation.x;vec3 p=vec3(cos(b)*w.x-sin(b)*w.z,w.y,sin(b)*w.x+cos(b)*w.z);return vec3(p.x,cos(a)*p.y-sin(a)*p.z,sin(a)*p.y+cos(a)*p.z);}
void main(){
 vec3 p=position;pathPosition=normal.x;edgeDistance=normal.y;
 if(material>3.5){float t=fract(clock*.14+market*.013+material-4.);float a=acos(clamp(dot(position,normal),-1.,1.));p=(position*sin((1.-t)*a)+normal*sin(t*a))/sin(a)*(1.015+.041*sin(3.14159265*t));pathPosition=t;}
 if((material>.5&&material<2.5)||material>3.5)p=view(p);
 float depth=4.6-p.z,scale=4.2/1.12;
 gl_Position=vec4(p.x*scale/(resolution.x/resolution.y),p.y*scale,1.020202*depth-.2020202,depth);
 point=p;surface=normal;kind=material;
 picked=abs(floor(market/16.)-activeMarket)<.1||abs(mod(market,16.)-activeMarket)<.1?1.:0.;
 gl_PointSize=material>3.5?(picked>.5?8.:5.)*pixelRatio:material>1.5&&material<2.5?(picked>.5?20.:13.)*pixelRatio:1.;
}`;

export const earthFragment = `#version 300 es
precision highp float;
in vec3 point;in vec3 surface;in float pathPosition;in float edgeDistance;flat in float kind;flat in float picked;out vec4 color;
uniform sampler2D earth;uniform sampler2D clouds;uniform sampler2D night;uniform vec2 orientation;uniform float networkView;uniform float routeReveal;
const float PI=3.14159265359;
const float CLOUD_RADIUS=${earthMaterial.cloudRadius};
vec3 world(vec3 n){float a=orientation.y,b=orientation.x;vec3 p=vec3(n.x,cos(a)*n.y+sin(a)*n.z,-sin(a)*n.y+cos(a)*n.z);return vec3(cos(b)*p.x+sin(b)*p.z,p.y,-sin(b)*p.x+cos(b)*p.z);}
vec2 uvAt(vec3 n){vec3 w=world(normalize(n));return vec2(atan(w.x,w.z)/(2.*PI)+.5,.5-asin(clamp(w.y,-1.,1.))/PI);}
float cloudAt(vec3 n){return smoothstep(.055,.88,texture(clouds,uvAt(n)).r);}
vec3 cityLights(vec3 sampleColor){float mask=smoothstep(.025,.13,sampleColor.r-.8*sampleColor.b)*smoothstep(.08,.35,sampleColor.r);return sampleColor*mask;}
vec3 gradeSurface(vec3 natural,float water){float luma=dot(natural,vec3(.28,.58,.14));vec3 land=mix(vec3(.27,.39,.43),vec3(.81,.80,.70),smoothstep(.03,.53,luma));vec3 ocean=vec3(.018,.091,.153)+natural*.22;return mix(land,ocean,water);}
vec3 shellPoint(vec3 p,vec3 direction){float b=dot(p,direction);float d=-b+sqrt(max(0.,b*b+CLOUD_RADIUS*CLOUD_RADIUS-dot(p,p)));return p+direction*d;}
void main(){
 if((kind>.5&&kind<2.5)||kind>3.5){
  if(kind>1.5){if(kind>3.5&&networkView<.01)discard;float d=length(gl_PointCoord-.5);if(d>.5)discard;float core=1.-smoothstep(.05,.17,d);float halo=pow(1.-smoothstep(.02,.5,d),2.);vec3 ink=mix(vec3(.44,.85,1.),vec3(1.,.84,.54),picked);float alpha=max(core,halo*.85);if(kind>3.5)alpha*=networkView*.95;color=vec4(mix(ink,vec3(1.),core*.85),alpha);}
  else{if(picked<.5&&networkView<.01)discard;float reveal=1.-smoothstep(routeReveal,routeReveal+.045,pathPosition);float edge=1.-smoothstep(.18,1.,abs(edgeDistance));float alpha=mix(.30,.85,picked)*mix(1.,reveal,picked)*edge;vec3 ink=mix(vec3(.30,.66,.91),vec3(1.,.83,.53),picked);color=vec4(ink,alpha*mix(.30,1.,networkView));}return;
 }
 vec3 n=normalize(surface),v=normalize(vec3(0.,0.,4.6)-point),light=normalize(vec3(${earthMaterial.light.join(",")}));
 if(kind>2.5){float facing=max(0.,dot(n,v)),sun=smoothstep(-.3,.7,dot(n,light));float edge=pow(1.-facing,5.);color=vec4(mix(vec3(.28,.48,.65),vec3(.46,.73,.91),sun),edge*(.09+.25*sun));return;}
 vec3 natural=texture(earth,uvAt(n)).rgb;
 float water=1.-smoothstep(-.03,.075,max(natural.r,natural.g*.9)-natural.b);
 natural=gradeSurface(natural,water);
 float incidence=dot(n,light),sun=max(0.,incidence);
 float shadow=cloudAt(shellPoint(n,light));
 vec3 ground=pow(natural,vec3(2.2))*(${earthMaterial.ambient}+1.03*sun*(1.-shadow*.42));
 vec3 halfVector=normalize(light+v);float fresnel=.025+.975*pow(1.-max(0.,dot(v,halfVector)),5.);
 float sheen=pow(max(0.,dot(n,halfVector)),85.)*sun*water*(1.-shadow*.75);
 ground+=vec3(.79,.87,.95)*sheen*fresnel*1.8;
 vec3 cloudPoint=shellPoint(n,v),cloudNormal=normalize(cloudPoint);float cloud=cloudAt(cloudPoint);
 float cloudSun=max(0.,dot(cloudNormal,light));vec3 cloudColor=pow(vec3(.92,.95,.98),vec3(2.2))*(.035+cloudSun*.92);
 vec3 radiance=mix(ground,cloudColor,cloud*.56);
 vec3 lights=cityLights(texture(night,uvAt(n)).rgb);float nightMask=1.-smoothstep(-.13,.20,incidence);
 radiance+=pow(lights,vec3(2.2))*nightMask*(1.-cloud*.72)*1.9;
 float air=pow(1.-max(0.,dot(n,v)),3.5)*(.035+.37*sun);
 radiance=mix(radiance,vec3(.22,.42,.63),air);
 vec3 satellite=pow(max(radiance*${earthMaterial.exposure},vec3(0.)),vec3(1./2.2));
 vec3 w=world(n);vec2 geo=vec2(atan(w.x,w.z),asin(clamp(w.y,-1.,1.)));
 vec2 gridDistance=abs(sin(geo*12.));vec2 gridWidth=max(fwidth(geo*12.),vec2(.001));
 float grid=1.-min(smoothstep(vec2(0.),gridWidth*1.2,gridDistance).x,smoothstep(vec2(0.),gridWidth*1.2,gridDistance).y);
 float facing=max(0.,dot(n,v));vec3 network=mix(vec3(.025,.065,.115),vec3(.13,.25,.34),1.-water);
 network*=.75+.25*facing;network+=vec3(.25,.52,.72)*grid*.20;
 vec2 cells=geo*vec2(108.,86.);vec2 cell=floor(cells);float seed=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
 float dots=(1.-smoothstep(.045,.18,length(fract(cells)-.5)))*step(.36,seed)*(1.-water);
 network+=vec3(.28,.64,.86)*dots*(.13+.31*seed);
 network+=mix(vec3(.37,.70,.95),vec3(.96,.82,.57),.35)*dot(lights,vec3(.35,.45,.2))*.88;
 network+=vec3(.10,.31,.48)*pow(1.-facing,3.);
 color=vec4(mix(satellite,network,networkView),1.);
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

export function nightEmission(sampleColor: Vector) {
  const mask = smoothstep(.025, .13, sampleColor[0] - .8 * sampleColor[2]) * smoothstep(.08, .35, sampleColor[0]);
  return sampleColor.map(value => value * mask);
}

export function shadeEarth(p: Vector, surfaceAt: Sampler, cloudsAt: Sampler, nightAt: Sampler = () => [0, 0, 0]) {
  const n = normalize(p), v = normalize([-p[0], -p[1], 4.6 - p[2]]);
  let natural = surfaceAt(n);
  const water = 1 - smoothstep(-.03, .075, Math.max(natural[0], natural[1] * .9) - natural[2]);
  const luma = dot(natural, [.28, .58, .14]);
  const land = mix([.27, .39, .43], [.81, .80, .70], smoothstep(.03, .53, luma));
  const ocean = natural.map((value, index) => [.018, .091, .153][index] + value * .22);
  natural = mix(land, ocean, water);
  const cloudAt = (normal: Vector) => smoothstep(.055, .88, cloudsAt(normal)[0]);
  const incidence = dot(n, light), sun = Math.max(0, incidence);
  const shadow = cloudAt(intersectShell(n, light, earthMaterial.cloudRadius));
  const ground = natural.map(value => Math.pow(value, 2.2) * (earthMaterial.ambient + 1.03 * sun * (1 - shadow * .42)));
  const halfVector = normalize(light.map((value, index) => value + v[index]));
  const fresnel = .025 + .975 * Math.pow(1 - Math.max(0, dot(v, halfVector)), 5);
  const sheen = Math.pow(Math.max(0, dot(n, halfVector)), 85) * sun * water * (1 - shadow * .75);
  ground.forEach((_, index) => { ground[index] += [.79, .87, .95][index] * sheen * fresnel * 1.8; });
  const cloudPoint = intersectShell(n, v, earthMaterial.cloudRadius), cloud = cloudAt(cloudPoint);
  const cloudSun = Math.max(0, dot(normalize(cloudPoint), light));
  const cloudColor = [.92, .95, .98].map(value => Math.pow(value, 2.2) * (.035 + cloudSun * .92));
  const radiance = mix(ground, cloudColor, cloud * .56);
  const lights = nightEmission(nightAt(n)), nightMask = 1 - smoothstep(-.13, .20, incidence);
  radiance.forEach((_, index) => { radiance[index] += Math.pow(lights[index], 2.2) * nightMask * (1 - cloud * .72) * 1.9; });
  const air = Math.pow(1 - Math.max(0, dot(n, v)), 3.5) * (.035 + .37 * sun);
  return mix(radiance, [.22, .42, .63], air).map(value => Math.pow(Math.max(0, value * earthMaterial.exposure), 1 / 2.2));
}

export function shadeAtmosphere(p: Vector) {
  const n = normalize(p), v = normalize([-p[0], -p[1], 4.6 - p[2]]);
  const facing = Math.max(0, dot(n, v)), sun = smoothstep(-.3, .7, dot(n, light));
  return [...mix([.28, .48, .65], [.46, .73, .91], sun), Math.pow(1 - facing, 5) * (.09 + .25 * sun)];
}
