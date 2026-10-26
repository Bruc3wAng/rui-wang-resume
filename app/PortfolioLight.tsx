"use client";

import { useEffect, useRef } from "react";

export default function PortfolioLight({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pause = useRef(paused);
  const redraw = useRef<(() => void) | null>(null);
  useEffect(() => { pause.current = paused; redraw.current?.(); }, [paused]);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    const vertex = `#version 300 es
      in vec2 a;out vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
    const fragment = `#version 300 es
      precision highp float;in vec2 uv;out vec4 color;
      uniform float t;uniform vec2 resolution;uniform vec2 pointer;uniform float scroll;
      void main(){
        vec2 q=uv; q.x*=resolution.x/resolution.y;
        vec2 c=vec2(resolution.x/resolution.y*.76,.5)+pointer*.035;
        float d=length((q-c)*vec2(1.,1.12));
        float glow=exp(-d*d*3.5);
        float lens=exp(-pow((d-.44)*55.,2.))*.15;
        float caustic=pow(max(0.,sin(q.x*5.+q.y*7.+t*.16+scroll*.5)),20.)*glow*.12;
        vec3 base=mix(vec3(.962,.962,.935),vec3(.86,.925,.90),glow*.7);
        base+=vec3(.08,.14,.12)*(lens+caustic);
        float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
        color=vec4(base+(grain-.5)*.014,1.);
      }`;
    function shader(type: number, source: string) {
      const s = gl!.createShader(type)!; gl!.shaderSource(s, source); gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) { gl!.deleteShader(s); return null; }
      return s;
    }
    const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return;
    const program = gl.createProgram()!; gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(program, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const ut = gl.getUniformLocation(program, "t"), ur = gl.getUniformLocation(program, "resolution"), up = gl.getUniformLocation(program, "pointer"), us = gl.getUniformLocation(program, "scroll");
    let frame = 0, last = 0, time = 0, alive = true, visible = true;
    const target = [0, 0], current = [0, 0];
    function resize() {
      cancelAnimationFrame(frame); frame = 0;
      const bounds = el!.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 1.35);
      el!.width = Math.round(bounds.width * dpr); el!.height = Math.round(bounds.height * dpr);
      gl!.viewport(0, 0, el!.width, el!.height); draw(performance.now());
    }
    function draw(now: number) {
      frame = 0; if (!alive || document.hidden || !visible) return;
      if (!pause.current && last && now - last < 32) { frame = requestAnimationFrame(draw); return; }
      if (!pause.current) time += last ? Math.min(.08, (now - last) / 1000) : 0;
      last = now;
      current[0] += (target[0] - current[0]) * .06; current[1] += (target[1] - current[1]) * .06;
      gl!.uniform1f(ut, time); gl!.uniform2f(ur, el!.width, el!.height);
      gl!.uniform2f(up, pause.current ? 0 : current[0], pause.current ? 0 : current[1]);
      gl!.uniform1f(us, scrollY / Math.max(1, innerHeight)); gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      if (!pause.current) frame = requestAnimationFrame(draw);
    }
    function wake() { if (!frame && alive) { last = 0; frame = requestAnimationFrame(draw); } }
    function move(e: PointerEvent) { const r = el!.getBoundingClientRect(); target[0] = (e.clientX - r.left) / r.width - .5; target[1] = .5 - (e.clientY - r.top) / r.height; wake(); }
    function lost(e: Event) { e.preventDefault(); alive = false; cancelAnimationFrame(frame); el!.style.opacity = "0"; }
    function visibilityChange() { cancelAnimationFrame(frame); frame = 0; last = 0; if (!document.hidden) wake(); }
    redraw.current = () => { cancelAnimationFrame(frame); frame = 0; wake(); };
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; last = 0; } }, { rootMargin: "100px" });
    visibility.observe(el); window.addEventListener("resize", resize); window.addEventListener("pointermove", move, { passive: true }); document.addEventListener("visibilitychange", visibilityChange); el.addEventListener("webglcontextlost", lost);
    resize();
    return () => { alive = false; redraw.current = null; cancelAnimationFrame(frame); visibility.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); document.removeEventListener("visibilitychange", visibilityChange); el.removeEventListener("webglcontextlost", lost); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, []);
  return <canvas className="pf-light" ref={canvas} aria-hidden="true" />;
}
