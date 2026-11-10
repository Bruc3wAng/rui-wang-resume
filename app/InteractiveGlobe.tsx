"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { cases, selectedWork, type Language } from "../content/resume";
import { marketStudyPresentation } from "../content/market-studies";
import { responsibilityLabel } from "../content/work-folios";
import { allResearchLinks, globeMesh, networkMesh, projectPoint, researchMarkets, researchRouteShape, studyGlobeCoverage } from "./globe-geometry";
import { earthFragment, earthMaterial, earthPosterRevision, earthVertex } from "./earth-material";
import { caseWorkIndices, marketIndexScrollDelta, marketStudyIndex, preferredMarketStudyIndex, type MarketStudyOrigin } from "./globe-research";
import { studyFragment } from "./study-location";
import "./earth-controls.css";
import "./market-index.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export default function InteractiveGlobe({ language, paused, ready, onExplore }: { language: Language; paused: boolean; ready: boolean; onExplore: (index: number, origin: MarketStudyOrigin) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null), labels = useRef<HTMLDivElement>(null), motion = useRef(paused);
  const stage = useRef<HTMLDivElement>(null), caseIndex = useRef<HTMLDivElement>(null), marketHeading = useRef<HTMLHeadingElement>(null);
  const focus = useRef<((lon: number, lat: number) => void) | null>(null), active = useRef(8);
  const changeStyle = useRef<((network: boolean) => void) | null>(null), redraw = useRef<(() => void) | null>(null);
  const renderMask = useRef(allResearchLinks);
  const [renderer, setRenderer] = useState("loading"), [selected, setSelected] = useState("CN"), [style, setStyle] = useState("earth");
  const [view, setView] = useState("CN"), [study, setStudy] = useState(0);
  const [caseOnly, setCaseOnly] = useState(false);
  const loc = (zh: string, en: string) => language === "zh" ? zh : en;
  const selectedPlace = researchMarkets.find(p => p.code === selected);
  const marketName = selectedPlace?.[language] ?? loc("多国研究", "Multi-country studies");
  const related = marketStudyIndex(cases, selected);
  const currentStudy = related.find(item => item.index === study) ?? related[0];
  const workIndex = caseWorkIndices[currentStudy.index];
  const presentation = marketStudyPresentation[currentStudy.index];
  const coverage = studyGlobeCoverage(currentStudy.item.markets);
  const hasCoverage = coverage.mask !== 0;
  const showingCoverage = style === "network" && renderer === "webgl" && caseOnly && hasCoverage;
  const mask = showingCoverage ? coverage.mask : allResearchLinks;
  useEffect(() => { motion.current = paused; redraw.current?.(); }, [paused]);
  useEffect(() => { renderMask.current = mask; redraw.current?.(); }, [mask]);
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
    const vs = shader(gl.VERTEX_SHADER, earthVertex), fs = shader(gl.FRAGMENT_SHADER, earthFragment);
    if (!vs || !fs) { if (vs) gl.deleteShader(vs); if (fs) gl.deleteShader(fs); queueMicrotask(() => setRenderer("fallback")); return; }
    const program = gl.createProgram()!; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); queueMicrotask(() => setRenderer("fallback")); return; }
    gl.useProgram(program);
    const globe = globeMesh(), atmosphere = globeMesh(3, earthMaterial.atmosphereRadius), network = networkMesh(cases.slice(0, 2).map(item => item.markets)), geometry = new Float32Array(globe.length + atmosphere.length + network.data.length);
    geometry.set(globe); geometry.set(atmosphere, globe.length); geometry.set(network.data, globe.length + atmosphere.length);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
    for (const [name, size, offset] of [["position", 3, 0], ["normal", 3, 12], ["material", 1, 24], ["market", 1, 28]] as const) {
      const a = gl.getAttribLocation(program, name); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, size, gl.FLOAT, false, 32, offset);
    }
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
    const uo = gl.getUniformLocation(program, "orientation"), ur = gl.getUniformLocation(program, "resolution"), ua = gl.getUniformLocation(program, "activeMarket"), un = gl.getUniformLocation(program, "networkView"), uReveal = gl.getUniformLocation(program, "routeReveal"), uClock = gl.getUniformLocation(program, "clock"), uPixel = gl.getUniformLocation(program, "pixelRatio"), uMask = gl.getUniformLocation(program, "caseMarketMask");
    gl.uniform2f(gl.getUniformLocation(program, "routeShape"), researchRouteShape.baseRadius, researchRouteShape.lift);
    const texture = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([8, 30, 45]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program, "earth"), 0);
    const cloudTexture = gl.createTexture(); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, cloudTexture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.uniform1i(gl.getUniformLocation(program, "clouds"), 1);
    const nightTexture = gl.createTexture(); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, nightTexture); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.uniform1i(gl.getUniformLocation(program, "night"), 2);
    let frame = 0, alive = true, visible = true, loaded = false, surfaceReady = false, cloudsReady = false, painted = false, failed = false, pointer = -1, lastX = 0, lastY = 0;
    let networkBlend = 0, networkTarget = 0, routeReveal = 1, lastFrame = 0, flowClock = 0, resizePending = false;
    const current=[105,30], target=[105,30];
    const nodeLabels = labels.current?.querySelectorAll<HTMLElement>("[data-market]");
    function draw(now: number) {
      frame = 0; if (!alive || !visible || document.hidden || !loaded) return;
      resizePending = false;
      const delta = Math.min(.06, lastFrame ? Math.max(0, (now - lastFrame) / 1000) : .016); lastFrame = now;
      const speed = motion.current ? 1 : .13; current[0] += (target[0] - current[0]) * speed; current[1] += (target[1] - current[1]) * speed;
      networkBlend += (networkTarget - networkBlend) * (motion.current ? 1 : 1 - Math.exp(-delta * 8));
      routeReveal = motion.current ? 1 : Math.min(1, routeReveal + delta * 1.3);
      if (!motion.current && networkBlend > .01) flowClock += delta;
      gl!.viewport(0, 0, el!.width, el!.height); gl!.uniform2f(ur, el!.width, el!.height); gl!.uniform2f(uo, current[0] * Math.PI / 180, current[1] * Math.PI / 180); gl!.uniform1f(ua, active.current); gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      gl!.uniform1f(un, networkBlend); gl!.uniform1f(uReveal, routeReveal); gl!.uniform1f(uClock, flowClock); gl!.uniform1f(uPixel, Math.min(2, el!.width / Math.max(1, el!.clientWidth)));
      gl!.uniform1i(uMask, renderMask.current);
      gl!.drawArrays(gl!.TRIANGLES, 0, globe.length / 8);
      gl!.depthMask(false); gl!.drawArrays(gl!.TRIANGLES, globe.length / 8, atmosphere.length / 8);
      gl!.disable(gl!.CULL_FACE); gl!.drawArrays(gl!.TRIANGLES, (globe.length + atmosphere.length) / 8, network.triangles);
      gl!.drawArrays(gl!.POINTS, (globe.length + atmosphere.length) / 8 + network.triangles, network.points + network.particles); gl!.enable(gl!.CULL_FACE); gl!.depthMask(true);
      if (!painted) { if (gl!.getError() !== gl!.NO_ERROR) { fail(); return; } painted = true; setRenderer("webgl"); }
      nodeLabels?.forEach((label, i) => {
        const p = projectPoint(researchMarkets[i].lon, researchMarkets[i].lat, current[0], current[1], el!.width / el!.height);
        label.hidden = !p.visible; label.style.left = `${p.x * 100}%`; label.style.top = `${p.y * 100}%`;
      });
      el!.dataset.longitude = current[0].toFixed(2); el!.dataset.latitude = current[1].toFixed(2);
      el!.dataset.networkBlend = networkBlend.toFixed(3); el!.dataset.routeReveal = routeReveal.toFixed(3);
      el!.dataset.flowClock = flowClock.toFixed(3); el!.dataset.routes = String(network.edges.length);
      el!.dataset.lightPackets = String(network.particles);
      if (Math.abs(current[0] - target[0]) + Math.abs(current[1] - target[1]) > .04 || Math.abs(networkBlend - networkTarget) > .001 || routeReveal < 1 || (!motion.current && networkTarget > .01)) frame = requestAnimationFrame(draw);
    }
    function wake() { if (!frame && alive) { lastFrame = 0; frame = requestAnimationFrame(draw); } }
    redraw.current = wake;
    focus.current = (lon, lat) => { target[0] = current[0] + (((lon - current[0]) % 360 + 540) % 360) - 180; target[1] = lat; routeReveal = 0; wake(); };
    changeStyle.current = network => { networkTarget = network ? 1 : 0; routeReveal = 0; wake(); };
    function repaintResize() {
      if (!resizePending || !loaded || !visible || document.hidden) { wake(); return; }
      cancelAnimationFrame(frame); lastFrame = 0; draw(performance.now());
    }
    function resize() {
      const r = el!.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
      const dpr = Math.min(devicePixelRatio, 2, 1200 / Math.max(1, r.width, r.height));
      const width = Math.round(r.width * dpr), height = Math.round(r.height * dpr);
      if (el!.width !== width || el!.height !== height) {
        el!.width = width; el!.height = height; resizePending = true;
      }
      // Setting the backing size clears it. Repaint while visible, before the next frame.
      repaintResize();
    }
    function fail() { if (!alive) return; failed = true; loaded = false; cancelAnimationFrame(frame); frame = 0; focus.current = null; changeStyle.current = null; setView("CN"); setStyle("earth"); setRenderer("fallback"); }
    function prepared() { if (!alive || failed || !surfaceReady || !cloudsReady) return; loaded = true; resize(); }
    const image = new window.Image();
    image.onload = () => { if (!alive || failed) return; gl!.activeTexture(gl!.TEXTURE0); gl!.bindTexture(gl!.TEXTURE_2D, texture); gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, image); gl!.generateMipmap(gl!.TEXTURE_2D); gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR_MIPMAP_LINEAR); surfaceReady = true; prepared(); };
    image.onerror = fail; image.src = `${base}/images/earth-surface.jpg`;
    const cloudImage = new window.Image(); cloudImage.onload = () => { if (!alive || failed) return; gl!.activeTexture(gl!.TEXTURE1); gl!.bindTexture(gl!.TEXTURE_2D, cloudTexture); gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, cloudImage); gl!.generateMipmap(gl!.TEXTURE_2D); gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR_MIPMAP_LINEAR); cloudsReady = true; prepared(); }; cloudImage.onerror = fail; cloudImage.src = `${base}/images/earth-clouds.jpg`;
    const nightImage = new window.Image(); el.dataset.nightTexture = "loading";
    nightImage.onload = () => { if (!alive || failed) return; if (nightImage.width > gl!.getParameter(gl!.MAX_TEXTURE_SIZE)) { el!.dataset.nightTexture = "unavailable"; return; } gl!.activeTexture(gl!.TEXTURE2); gl!.bindTexture(gl!.TEXTURE_2D, nightTexture); gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, nightImage); gl!.generateMipmap(gl!.TEXTURE_2D); gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR_MIPMAP_LINEAR); el!.dataset.nightTexture = "ready"; wake(); };
    nightImage.onerror = () => { if (alive) el!.dataset.nightTexture = "unavailable"; }; nightImage.src = `${base}/images/earth-night-2016.jpg`;
    function down(e: globalThis.PointerEvent) { if (!loaded) return; pointer = e.pointerId; lastX = e.clientX; lastY = e.clientY; el!.setPointerCapture(pointer); el!.dataset.dragging = "true"; }
    function move(e: globalThis.PointerEvent) { if (e.pointerId !== pointer) return; target[0] -= (e.clientX - lastX) * .35; target[1] = Math.max(-65, Math.min(65, target[1] + (e.clientY - lastY) * .24)); lastX = e.clientX; lastY = e.clientY; setView("FREE"); wake(); }
    function up(e: globalThis.PointerEvent) { if (e.pointerId !== pointer) return; if (el!.hasPointerCapture(pointer)) el!.releasePointerCapture(pointer); pointer = -1; el!.dataset.dragging = "false"; }
    function key(e: globalThis.KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(e.key)) return; e.preventDefault();
      if (e.key === "Home") { active.current = 8; focus.current?.(105, 30); setSelected("CN"); setView("CN"); setStudy(0); }
      else { target[0] += (e.key === "ArrowRight" ? 12 : e.key === "ArrowLeft" ? -12 : 0); target[1] = Math.max(-65, Math.min(65, target[1] + (e.key === "ArrowUp" ? 8 : e.key === "ArrowDown" ? -8 : 0))); setView("FREE"); wake(); }
    }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(el);
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) repaintResize(); else { cancelAnimationFrame(frame); frame = 0; } }, { rootMargin: "100px" }); observer.observe(el);
    function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else repaintResize(); }
    function lost(e: Event) { e.preventDefault(); fail(); }
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up); el.addEventListener("keydown", key); el.addEventListener("webglcontextlost", lost); document.addEventListener("visibilitychange", visibility);
    return () => { alive = false; focus.current = null; changeStyle.current = null; redraw.current = null; image.onload = null; image.onerror = null; cloudImage.onload = null; cloudImage.onerror = null; nightImage.onload = null; nightImage.onerror = null; cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect(); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); el.removeEventListener("keydown", key); el.removeEventListener("webglcontextlost", lost); document.removeEventListener("visibilitychange", visibility); gl.deleteTexture(texture); gl.deleteTexture(cloudTexture); gl.deleteTexture(nightTexture); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, []);
  function choose(code: string, lon: number, lat: number) {
    const initialStudy = preferredMarketStudyIndex(cases, code);
    if (initialStudy === null) return;
    active.current = code === "CN" ? 8 : researchMarkets.findIndex(p => p.code === code);
    setSelected(code); setView(focus.current ? code : "CN");
    if (selected !== code) setStudy(initialStudy);
    focus.current?.(lon, lat);
  }
  function chooseMarket(code: string) {
    if (code === "CN") { choose("CN", 105, 30); return; }
    const place = researchMarkets.find(p => p.code === code);
    if (place) choose(place.code, place.lon, place.lat);
  }
  function exploreFromGlobe(code: string, lon: number, lat: number) {
    choose(code, lon, lat);
    requestAnimationFrame(() => {
      const index = caseIndex.current;
      if (!index || index.dataset.market !== code) return;
      const header = document.querySelector(".pf-header")?.getBoundingClientRect().bottom ?? 72;
      const delta = marketIndexScrollDelta(index.getBoundingClientRect(), header + 10, window.innerHeight - 14);
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: paused ? "instant" : "smooth" });
      marketHeading.current?.focus({ preventScroll: true });
    });
  }
  function backToGlobe() {
    stage.current?.scrollIntoView({ block: "start", behavior: paused ? "instant" : "smooth" });
    canvas.current?.focus({ preventScroll: true });
  }
  function chooseStyle(value: string) { setStyle(value); changeStyle.current?.(value === "network"); }
  function mapCurrentStudy() {
    setCaseOnly(true);
    chooseStyle("network");
    backToGlobe();
  }
  function keyboard(e: KeyboardEvent<HTMLDivElement>) { if (e.key === "Escape") { choose("CN", 105, 30); canvas.current?.focus(); } }
  function studyKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offset = ({ ArrowRight: 1, ArrowLeft: -1, ArrowDown: 2, ArrowUp: -2 } as Record<string, number | undefined>)[e.key];
    const next = e.key === "Home" ? 0 : e.key === "End" ? related.length - 1 : offset === undefined ? -1 : (index + offset + 2 * related.length) % related.length;
    if (next < 0) return; e.preventDefault(); setStudy(related[next].index); document.getElementById(`rg-study-tab-${related[next].index}`)?.focus();
  }
  return <div className="rg-globe" data-renderer={renderer} data-view={view} data-market-selection={selected} data-style={style} data-market-ready={ready} data-layer={showingCoverage ? "study" : "all"}>
    <div className="rg-globe-stage" id="rg-globe-stage" ref={stage} onKeyDown={keyboard}><div className="rg-globe-shadow"/><Image className="rg-earth-poster" src={`${base}/images/earth-china-poster.webp?v=${earthPosterRevision}`} width={768} height={768} alt={loc("中国视角的地球", "Earth centered on China")} aria-hidden={renderer === "webgl"} unoptimized priority draggable={false}/>
      <canvas ref={canvas} className="rg-globe-canvas" tabIndex={renderer === "webgl" ? 0 : -1} role="img" aria-hidden={renderer !== "webgl"} aria-label={loc("可旋转地球。拖动改变视角，方向键旋转，Home返回中国。", "Interactive globe. Drag or use arrow keys to rotate. Home centers China.")} onDragStart={e => e.preventDefault()}/>
      <div className="rg-globe-nodes" ref={labels}>{researchMarkets.map((p, i) => <button type="button" data-market={p.code} data-in-study={Boolean(coverage.mask & (1 << i))} key={p.code} hidden disabled={renderer !== "webgl"} aria-label={loc(`查看${p.zh}研究项目`, `View research in ${p.en}`)} aria-controls="rg-market-research" aria-pressed={selected === p.code} onClick={() => exploreFromGlobe(p.code, p.lon, p.lat)}><span>{p.code}</span></button>)}</div>
      <span className="rg-globe-note" role="status">{!ready ? "" : renderer === "fallback" ? loc("仍可在下方选择市场", "SELECT A MARKET BELOW") : renderer === "loading" ? loc("正在准备地球交互", "PREPARING INTERACTIVE VIEW") : loc("拖动旋转 · 点击标记查看案例", "DRAG TO ROTATE · SELECT A MARKET PIN")}</span>
    </div>
    <div className="rg-globe-toolbar"><div className="rg-globe-styles" role="group" aria-label={loc("地球显示方式", "Globe display style")}><button type="button" disabled={renderer !== "webgl"} aria-pressed={style === "earth"} onClick={() => chooseStyle("earth")}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="4" ry="8"/><path d="M4 12h16"/></svg>{loc("卫星", "Satellite")}</button><button type="button" disabled={renderer !== "webgl"} aria-pressed={style === "network"} onClick={() => chooseStyle("network")}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 2-5 10L6 6l12 2M6 6l7 12"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="13" cy="18" r="2"/></svg>{loc("研究网络", "Research network")}</button></div>
    <div className="rg-globe-views" role="group" aria-label={loc("地球主体视角", "Globe focal view")}>
      <button type="button" disabled={renderer !== "webgl"} aria-pressed={view === "CN"} aria-label={loc("中国视角", "China view")} onClick={() => choose("CN", 105, 30)}>{loc("中国", "China")}</button>
      <button type="button" disabled={renderer !== "webgl"} aria-pressed={view === "US"} aria-label={loc("美国视角", "U.S. view")} aria-controls="rg-market-research" onClick={() => choose("US",-98,37)}>{loc("美国", "U.S.")}</button>
    </div>
    <div className="rg-network-key" hidden={style !== "network"} aria-label={loc("研究连线图例", "Research link legend")}>
      <div className="rg-key-legend">
        {showingCoverage
          ? <span className="rg-key-markets"><i aria-hidden="true"/>{loc("本案例涉及市场", "Markets in this study")}</span>
          : <><span><i aria-hidden="true"/>{selectedPlace ? loc("当前市场连线", "Selected market links") : loc("北京起点", "Beijing hub")}</span><span><i aria-hidden="true"/>{loc("其他研究连线", "Other research links")}</span></>}
      </div>
      {hasCoverage && <button className="rg-case-layer" type="button" aria-pressed={showingCoverage} aria-controls="rg-globe-stage" onClick={() => setCaseOnly(value => !value)}>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 2.5H2.5V6m7.5-3.5h3.5V6M6 13.5H2.5V10m7.5 3.5h3.5V10"/><circle cx="8" cy="8" r="1.5"/></svg>
        {loc("仅看此案例", "Selected case only")}
      </button>}
    </div>
    {showingCoverage && <div className="rg-case-map-summary" role="status"><span>{loc("案例范围", "STUDY COVERAGE")}</span><strong>{currentStudy.item.title[language]}</strong></div>}
    </div>
    <section className="rg-market-research" id="rg-market-research" aria-labelledby="rg-market-heading" data-market={selected}>
      <div className="rg-market-index" ref={caseIndex} data-market={selected}>
        <header className="rg-market-head">
          <div className="rg-market-name">
            <div className="rg-market-kicker"><span>{loc("按市场找案例", "MARKET CASE INDEX")}</span>{selectedPlace && <span className="rg-market-code" aria-hidden="true">{selectedPlace.code}</span>}</div>
            <h3 id="rg-market-heading" ref={marketHeading} tabIndex={-1}>{marketName}</h3>
            <p role="status" className="rg-market-count">{related.length}{loc(" 项研究", related.length === 1 ? " study" : " studies")}</p>
          </div>
          <label className="rg-market-picker">
            <span aria-hidden="true">{loc("切换市场", "Change market")}<svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4"/></svg></span>
            <select id="rg-market-select" aria-label={loc("切换研究市场", "Change research market")} value={selected} aria-controls="rg-study-panel" onChange={e => chooseMarket(e.currentTarget.value)}>
              <option value="CN">{loc("多国研究", "Multi-country studies")}</option>
              {researchMarkets.map(place => <option value={place.code} key={place.code}>{place[language]}</option>)}
            </select>
          </label>
        </header>
        <div className="rg-study-tabs" role="tablist" aria-label={loc("选择该市场的研究", "Choose a study in this market")}>
          {related.map(({ item, index }, i) => {
            const card = marketStudyPresentation[index];
            return <button type="button" role="tab" key={index} id={`rg-study-tab-${index}`} aria-selected={currentStudy.index === index} aria-controls="rg-study-panel" tabIndex={currentStudy.index === index ? 0 : -1} onClick={() => setStudy(index)} onKeyDown={e => studyKey(e, i)}>
              <span className="rg-study-kind">{card.scope[language]}</span><strong>{card.shortTitle[language]}</strong><span className="rg-study-ownership">{responsibilityLabel(item.role[language])}</span>
            </button>;
          })}
        </div>
        {!ready && <nav className="rg-static-studies" aria-label={loc("研究案例", "Research cases")}>
          {related.map(({ item, index }) => {
            const linked = caseWorkIndices[index];
            return linked === null ? null : <a key={index} className="rg-static-study" href={studyFragment(selectedWork[linked].id)}><span>{item.title[language]}<small>{responsibilityLabel(item.role[language])}</small></span><span aria-hidden="true">↗</span></a>;
          })}
        </nav>}
      </div>
      <div className="rg-study-detail" id="rg-study-panel" role="tabpanel" aria-labelledby={`rg-study-tab-${currentStudy.index}`} tabIndex={0} data-study={currentStudy.index}>
        <h4>{currentStudy.item.title[language]}</h4><p className="rg-study-role">{currentStudy.item.role[language]}</p>
        <dl className="rg-study-proof">
          {hasCoverage && <div className="rg-study-markets"><dt>{loc("涉及市场", "Markets")}</dt><dd>{coverage.places.map(place => place[language]).join(loc("、", " · "))}</dd></div>}
          <div><dt>{loc("我的工作", "My contribution")}</dt><dd>{(presentation.contribution ?? currentStudy.item.approach)[language]}</dd></div>
          {presentation.ai && <div className="rg-study-ai"><dt>{loc("AI 用法", "How I used AI")}</dt><dd>{presentation.ai[language]}</dd></div>}
          <div><dt>{loc("研究交付", "Deliverables")}</dt><dd>{(presentation.delivery ?? currentStudy.item.value)[language]}</dd></div>
        </dl>
        <div className="rg-study-actions">
          {workIndex !== null && <a className="rg-study-explore" href={studyFragment(selectedWork[workIndex].id)} aria-controls={`pf-work-panel-${workIndex}`} onClick={e => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
            e.preventDefault(); onExplore(workIndex, { market: selected, studyIndex: currentStudy.index });
          }}>{loc("查看完整案例", "Read the full case")}<span aria-hidden="true">↗</span></a>}
          {renderer === "webgl" && hasCoverage && <button className="rg-back-to-globe" type="button" onClick={mapCurrentStudy} aria-controls="rg-globe-stage">{loc("在地图上查看", "View on globe")}<span aria-hidden="true">↑</span></button>}
        </div>
      </div>
    </section>
  </div>;
}
