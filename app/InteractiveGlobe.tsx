"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { cases, type Language } from "../content/resume";
import { globeMesh, networkMesh, projectPoint, researchMarkets } from "./globe-geometry";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const vertex = `#version 300 es
precision highp float;
in vec3 position;in vec3 normal;in float material;in float market;
uniform vec2 resolution;uniform vec2 orientation;uniform float activeMarket;
out vec3 point;out vec3 surface;flat out float kind;flat out float picked;
vec3 view(vec3 w){float a=orientation.y,b=orientation.x;vec3 p=vec3(cos(b)*w.x-sin(b)*w.z,w.y,sin(b)*w.x+cos(b)*w.z);return vec3(p.x,cos(a)*p.y-sin(a)*p.z,sin(a)*p.y+cos(a)*p.z);}
void main(){vec3 p=material>.5?view(position):position;float depth=4.6-p.z;float scale=4.2/1.12;gl_Position=vec4(p.x*scale/(resolution.x/resolution.y),p.y*scale,1.020202*depth-.2020202,depth);point=p;surface=normal;kind=material;picked=abs(market-activeMarket)<.1?1.:0.;gl_PointSize=material>1.5?(picked>.5?10.:6.):1.;}`;
const fragment = `#version 300 es
precision highp float;
in vec3 point;in vec3 surface;flat in float kind;flat in float picked;out vec4 color;
uniform sampler2D earth;uniform sampler2D clouds;uniform vec2 orientation;const float PI=3.14159265359;
vec3 world(vec3 n){float a=orientation.y,b=orientation.x;vec3 p=vec3(n.x,cos(a)*n.y+sin(a)*n.z,-sin(a)*n.y+cos(a)*n.z);return vec3(cos(b)*p.x+sin(b)*p.z,p.y,-sin(b)*p.x+cos(b)*p.z);}
void main(){
 if(kind>.5){if(kind>1.5){float d=length(gl_PointCoord-.5);if(d>.5)discard;float alpha=1.-smoothstep(.25,.5,d);color=vec4(mix(vec3(.54,.82,.86),vec3(1.,.9,.65),picked),alpha);}else color=vec4(mix(vec3(.25,.65,.75),vec3(.98,.85,.58),picked),mix(.40,.92,picked));return;}
 vec3 n=normalize(surface),v=normalize(vec3(0.,0.,4.6)-point),light=normalize(vec3(-.65,.8,1.5));vec3 w=world(n);vec2 uv=vec2(atan(w.x,w.z)/(2.*PI)+.5,.5-asin(clamp(w.y,-1.,1.))/PI);
 vec3 natural=texture(earth,uv).rgb;float water=1.-smoothstep(-.03,.075,max(natural.r,natural.g*.9)-natural.b);natural=mix(natural,vec3(.025,.12,.19)+natural*.58,water*.65);float cloud=pow(texture(clouds,uv).r,1.5)*.68;natural=mix(natural,vec3(.94,.96,.98),cloud);float diffuse=max(0.,dot(n,light));
 vec3 c=pow(natural,vec3(2.2))*(.20+.95*diffuse);float spec=pow(max(0.,dot(reflect(-light,n),v)),100.);c+=vec3(.15,.22,.28)*spec*water;
 c=pow(max(c,vec3(0.)),vec3(1./2.2));float rim=pow(1.-max(0.,dot(n,v)),4.);c+=rim*vec3(.035,.14,.23);color=vec4(c,1.);
}`;

export default function InteractiveGlobe({ language, paused, onExplore }: { language: Language; paused: boolean; onExplore: (index: number) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null), labels = useRef<HTMLDivElement>(null), motion = useRef(paused);
  const focus = useRef<((lon: number, lat: number) => void) | null>(null), active = useRef(8);
  const [renderer, setRenderer] = useState("loading"), [selected, setSelected] = useState("CN");
  const loc = (zh: string, en: string) => language === "zh" ? zh : en;
  const selectedPlace = researchMarkets.find(p => p.code === selected);
  const related = cases.slice(0, 2).map((item, index) => ({ item, index: index === 0 ? 0 : 3 })).filter(({ item }) => !selectedPlace || item.markets.includes(selected));
  useEffect(() => { motion.current = paused; }, [paused]);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power", premultipliedAlpha: false });
    if (!gl) { queueMicrotask(() => setRenderer("fallback")); return; }
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, source); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    };
    const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) { if (vs) gl.deleteShader(vs); if (fs) gl.deleteShader(fs); queueMicrotask(() => setRenderer("fallback")); return; }
    const program = gl.createProgram()!; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); queueMicrotask(() => setRenderer("fallback")); return; }
    gl.useProgram(program);
    const globe = globeMesh(), network = networkMesh(), geometry = new Float32Array(globe.length + network.data.length);
    geometry.set(globe); geometry.set(network.data, globe.length);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
    for (const [name, size, offset] of [["position", 3, 0], ["normal", 3, 12], ["material", 1, 24], ["market", 1, 28]] as const) {
      const a = gl.getAttribLocation(program, name); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, size, gl.FLOAT, false, 32, offset);
    }
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    const uo = gl.getUniformLocation(program, "orientation"), ur = gl.getUniformLocation(program, "resolution"), ua = gl.getUniformLocation(program, "activeMarket");
    const texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([8, 30, 45]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "earth"), 0);
    const cloudTexture = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, cloudTexture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.uniform1i(gl.getUniformLocation(program, "clouds"), 1);
    let frame = 0, alive = true, visible = true, loaded = false, pointer = -1, lastX = 0, lastY = 0;
    const current=[105,30], target=[105,30];
    const nodeLabels = labels.current?.querySelectorAll<HTMLElement>("[data-market]");
    function draw() {
      frame = 0; if (!alive || !visible || document.hidden || !loaded) return;
      const speed = motion.current ? 1 : .13; current[0] += (target[0] - current[0]) * speed; current[1] += (target[1] - current[1]) * speed;
      gl!.viewport(0, 0, el!.width, el!.height); gl!.uniform2f(ur, el!.width, el!.height); gl!.uniform2f(uo, current[0] * Math.PI / 180, current[1] * Math.PI / 180); gl!.uniform1f(ua, active.current); gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, globe.length / 8);
      gl!.depthMask(false); gl!.drawArrays(gl!.LINES, globe.length / 8, network.lines); gl!.drawArrays(gl!.POINTS, globe.length / 8 + network.lines, network.points); gl!.depthMask(true);
      nodeLabels?.forEach((label, i) => {
        const p = projectPoint(researchMarkets[i].lon, researchMarkets[i].lat, current[0], current[1], el!.width / el!.height);
        label.hidden = !p.visible; label.style.left = `${p.x * 100}%`; label.style.top = `${p.y * 100}%`;
      });
      el!.dataset.longitude = current[0].toFixed(2); el!.dataset.latitude = current[1].toFixed(2);
      if (Math.abs(current[0] - target[0]) + Math.abs(current[1] - target[1]) > .04) frame = requestAnimationFrame(draw);
    }
    function wake() { if (!frame && alive) frame = requestAnimationFrame(draw); }
    focus.current = (lon, lat) => { target[0] = current[0] + (((lon - current[0]) % 360 + 540) % 360) - 180; target[1] = lat; wake(); };
    function resize() { const r = el!.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 1.25); el!.width = Math.round(r.width * dpr); el!.height = Math.round(r.height * dpr); wake(); }
    const image = new window.Image();
    image.onload = () => { if (!alive) return; gl!.activeTexture(gl!.TEXTURE0); gl!.bindTexture(gl!.TEXTURE_2D, texture); gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, image); loaded = true; setRenderer("webgl"); resize(); };
    image.onerror = () => { if (alive) setRenderer("fallback"); }; image.src = `${base}/images/earth-surface.jpg`;
    const cloudImage = new window.Image(); cloudImage.onload = () => { if (!alive) return; gl!.activeTexture(gl!.TEXTURE1); gl!.bindTexture(gl!.TEXTURE_2D, cloudTexture); gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, cloudImage); wake(); }; cloudImage.src = `${base}/images/earth-clouds.jpg`;
    function down(e: globalThis.PointerEvent) { if (!loaded) return; pointer = e.pointerId; lastX = e.clientX; lastY = e.clientY; el!.setPointerCapture(pointer); el!.dataset.dragging = "true"; }
    function move(e: globalThis.PointerEvent) { if (e.pointerId !== pointer) return; target[0] -= (e.clientX - lastX) * .35; target[1] = Math.max(-65, Math.min(65, target[1] + (e.clientY - lastY) * .24)); lastX = e.clientX; lastY = e.clientY; active.current = -1; setSelected("FREE"); wake(); }
    function up(e: globalThis.PointerEvent) { if (e.pointerId !== pointer) return; if (el!.hasPointerCapture(pointer)) el!.releasePointerCapture(pointer); pointer = -1; el!.dataset.dragging = "false"; }
    function key(e: globalThis.KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(e.key)) return; e.preventDefault();
      if (e.key === "Home") { active.current = 8; focus.current?.(105, 30); setSelected("CN"); }
      else { target[0] += (e.key === "ArrowRight" ? 12 : e.key === "ArrowLeft" ? -12 : 0); target[1] = Math.max(-65, Math.min(65, target[1] + (e.key === "ArrowUp" ? 8 : e.key === "ArrowDown" ? -8 : 0))); active.current = -1; setSelected("FREE"); wake(); }
    }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(el);
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; } }, { rootMargin: "100px" }); observer.observe(el);
    function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); }
    function lost(e: Event) { e.preventDefault(); loaded = false; cancelAnimationFrame(frame); setRenderer("fallback"); }
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); el.addEventListener("keydown", key); el.addEventListener("webglcontextlost", lost); document.addEventListener("visibilitychange", visibility);
    return () => { alive = false; focus.current = null; image.onload = null; image.onerror = null; cloudImage.onload = null; cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect(); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); el.removeEventListener("keydown", key); el.removeEventListener("webglcontextlost", lost); document.removeEventListener("visibilitychange", visibility); gl.deleteTexture(texture); gl.deleteTexture(cloudTexture); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, []);
  function choose(code: string, lon: number, lat: number) { active.current = code === "CN" ? 8 : researchMarkets.findIndex(p => p.code === code); setSelected(code); focus.current?.(lon, lat); }
  function keyboard(e: KeyboardEvent<HTMLDivElement>) { if (e.key === "Escape") { choose("CN", 105, 30); canvas.current?.focus(); } }
  return <div className="rg-globe" data-renderer={renderer} data-view={selected} onKeyDown={keyboard}>
    <div className="rg-globe-stage"><div className="rg-globe-shadow"/><div className="rg-earth-placeholder" aria-hidden="true"/>
      <canvas ref={canvas} className="rg-globe-canvas" tabIndex={renderer === "webgl" ? 0 : -1} role="img" aria-label={loc("可旋转地球。拖动改变视角，方向键旋转，Home返回中国。", "Interactive globe. Drag or use arrow keys to rotate. Home centers China.")} onDragStart={e => e.preventDefault()}/>
      <div className="rg-globe-nodes" ref={labels}>{researchMarkets.map(p => <button type="button" data-market={p.code} key={p.code} hidden disabled={renderer !== "webgl"} aria-label={loc(`选择${p.zh}研究市场`, `Select ${p.en} research market`)} aria-pressed={selected === p.code} onClick={() => choose(p.code, p.lon, p.lat)}><span>{p.code}</span></button>)}</div>
      <span className="rg-globe-note">{renderer === "fallback" ? loc("当前浏览器暂不支持地球旋转", "Globe rotation is unavailable in this browser") : loc("拖动旋转 · 选择市场", "DRAG TO ROTATE · SELECT A MARKET")}</span>
    </div>
    <div className="rg-globe-views" aria-label={loc("地球主体视角", "Globe focal view")}><button type="button" disabled={renderer !== "webgl"} aria-pressed={selected === "CN"} onClick={() => choose("CN", 105, 30)}>{loc("中国", "China")}<span>105°E</span></button><button type="button" disabled={renderer !== "webgl"} aria-pressed={selected === "US"} onClick={()=>choose("US",-98,37)}>{loc("美国", "United States")}<span>98°W</span></button><button type="button" className="rg-globe-reset" disabled={renderer !== "webgl"} onClick={() => choose("CN", 105, 30)} aria-label={loc("重置地球视角", "Reset globe view")}>↺</button></div>
    <div className="pf-market-controls" aria-label={loc("项目涉及的部分市场", "Selected research markets")}>{researchMarkets.map(p => <button type="button" key={p.code} disabled={renderer !== "webgl"} title={language === "zh" ? p.zh : p.en} aria-label={loc(`旋转至${p.zh}`, `Rotate to ${p.en}`)} aria-pressed={selected === p.code} onClick={() => choose(p.code, p.lon, p.lat)}><Image src={`${base}/images/flags/${p.flag}.svg`} alt="" width={28} height={21} unoptimized draggable={false}/><span>{p.code}</span></button>)}</div>
    <div className="rg-globe-caption" aria-live="polite"><p>{selectedPlace ? selectedPlace[language] : loc("北京 · 多国研究", "BEIJING · MULTI-COUNTRY RESEARCH")}</p><div className="rg-globe-links">{related.map(({ item, index }) => <button type="button" key={item.index} onClick={() => onExplore(index)}>{item.title[language]} ↗</button>)}</div></div>
  </div>;
}
