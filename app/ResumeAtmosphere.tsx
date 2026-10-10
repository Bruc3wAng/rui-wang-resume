"use client";
import {useEffect,useRef,useState} from 'react';
import type {Language} from '../content/resume';
import {createResearchScene} from './research-scene';

const sections=['content','work','method','projects','capabilities','contact'];
const labels={zh:['研究视野','重点工作','AI 提效实践','个人作品','专业能力','联系我'],en:['Perspective','Selected work','AI practice','Creative practice','Capabilities','Contact']};
export default function ResumeAtmosphere({language,activeCase,activeWorkflow}:{language:Language;activeCase:number;activeWorkflow:number}){
 const canvas=useRef<HTMLCanvasElement>(null);const detail=useRef(0);const pausedRef=useRef(false);const redraw=useRef<()=>void>(()=>{});
 const [paused,setPaused]=useState(false);const [chapter,setChapter]=useState(0);
 useEffect(()=>{detail.current=Math.max(0,activeCase)+activeWorkflow*.8;redraw.current();},[activeCase,activeWorkflow]);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setPaused(m.matches);sync();m.addEventListener('change',sync);return()=>m.removeEventListener('change',sync);},[]);
 useEffect(()=>{pausedRef.current=paused;const shell=document.querySelector<HTMLElement>(".site-shell");if(shell)shell.dataset.motion=paused?"still":"flowing";redraw.current();},[paused]);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  const scene=createResearchScene(el),shell=document.querySelector<HTMLElement>('.site-shell')!;
  shell.dataset.scene=scene?'webgl':'static';shell.dataset.motion=pausedRef.current?'still':'flowing';
  let frame=0,last=0,time=0,target=0,current=0,chapterIndex=-1,pointer:[number,number]=[0,0],smoothPointer:[number,number]=[0,0],lastRipple=-1,rippleIndex=0,disposed=false,lastDraw=0,currentDetail=detail.current;let heroCenter:[number,number]=[.75,.55];
  const ripples=new Array<number>(48).fill(0);for(let i=0;i<12;i++)ripples[i*4+2]=-100;
  function resize(){const dpr=Math.min(devicePixelRatio,innerWidth<700?1:1.35);el!.width=Math.round(innerWidth*dpr);el!.height=Math.round(innerHeight*dpr);scroll();schedule();}
  function scroll(){
   const field=document.querySelector(".hero-market-field")?.getBoundingClientRect();if(field)heroCenter=[(field.left+field.width*.5)/innerWidth,1-(field.top+field.height*(innerWidth<700?.48:.43))/innerHeight];
   const anchors=sections.map(id=>{const e=document.getElementById(id);return e?e.getBoundingClientRect().top+scrollY:0;});
   const y=scrollY+80;let i=0;while(i<anchors.length-1&&y>=anchors[i+1])i++;
   const t=i<anchors.length-1?Math.min(1,Math.max(0,(y-anchors[i])/(anchors[i+1]-anchors[i]))):0;
   target=Math.min(5,i+t);if(i!==chapterIndex){chapterIndex=i;setChapter(i);shell.dataset.chapter=sections[i];}
   shell.style.setProperty('--journey-progress',String(Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))));
   // The same scroll position moves chapter typography and the scene. Body copy stays stable.
   document.querySelectorAll<HTMLElement>('.hero-name,.section-title,.work-heading h2,.method-heading h2,.projects-heading h2,.capability-heading h2').forEach(h=>{
    const r=h.getBoundingClientRect();const shift=pausedRef.current?0:Math.max(-10,Math.min(16,(r.top-innerHeight*.35)*.024));h.style.translate=`0 ${shift}px`;
   });schedule();
  }
  function move(e:PointerEvent){
   pointer=[e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2];
   shell.style.setProperty('--pointer-x',`${e.clientX}px`);shell.style.setProperty('--pointer-y',`${e.clientY}px`);shell.style.setProperty('--pointer-visible','1');
   if(!pausedRef.current&&time-lastRipple>.045){const j=rippleIndex++%12*4;ripples[j]=e.clientX/innerWidth;ripples[j+1]=1-e.clientY/innerHeight;ripples[j+2]=time;ripples[j+3]=e.pointerType==='touch'?.65:.48;lastRipple=time;}
   const hero=document.querySelector<HTMLElement>('.profile-card');if(hero&&!pausedRef.current)hero.style.transform=`perspective(900px) rotateY(${pointer[0]*5}deg) rotateX(${-pointer[1]*4}deg)`;schedule();
  }
  function draw(now:number){
   frame=0;if(disposed||document.hidden)return;
   if(now-lastDraw<(innerWidth<700?32:20)){schedule();return;}lastDraw=now;
   const dt=last?Math.min(.07,(now-last)/1000):0;last=now;if(!pausedRef.current)time+=dt;
   current=pausedRef.current?target:current+(target-current)*.11;
   smoothPointer=[smoothPointer[0]+(pointer[0]-smoothPointer[0])*.08,smoothPointer[1]+(pointer[1]-smoothPointer[1])*.08];
   currentDetail=pausedRef.current?detail.current:currentDetail+(detail.current-currentDetail)*.12;
   scene?.draw({time,chapter:current,heroCenter,pointer:pausedRef.current?[0,0]:smoothPointer,ripples,detail:currentDetail,reduced:pausedRef.current});
   if(scene&&(!pausedRef.current||Math.abs(current-target)>.001))schedule();
  }
  function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(draw);}
  const wake=()=>{last=0;schedule();};const leave=()=>shell.style.setProperty('--pointer-visible','0');
  const lost=()=>{disposed=true;cancelAnimationFrame(frame);shell.dataset.scene='static';el!.hidden=true;};el.addEventListener('webglcontextlost',lost);
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-revealed');}),{threshold:.12});
  document.querySelectorAll('.role-point,.earlier-role,.capability-card,.project-card').forEach(e=>observer.observe(e));
  addEventListener('scroll',scroll,{passive:true});addEventListener('resize',resize);addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',wake);document.addEventListener('pointerleave',leave);
  redraw.current=()=>{scroll();schedule();};resize();current=target;
  return()=>{disposed=true;cancelAnimationFrame(frame);scene?.dispose();observer.disconnect();removeEventListener('scroll',scroll);removeEventListener('resize',resize);removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',wake);document.removeEventListener('pointerleave',leave);el.removeEventListener('webglcontextlost',lost);};
 },[]);
 return <><div className="research-atmosphere" aria-hidden="true"><canvas ref={canvas}/><div className="atmosphere-shade"/></div><div className="research-cursor" aria-hidden="true"/><aside className="chapter-rail" aria-label={language==='zh'?'阅读进度':'Reading progress'}><span>0{chapter+1}</span><i/><a href={`#${sections[chapter]}`}>{labels[language][chapter]}</a></aside><button type="button" className="motion-control" onClick={()=>setPaused(v=>!v)} aria-pressed={paused}>{paused?'◌':'≈'} <span>{language==='zh'?(paused?'开启动效':'暂停动效'):(paused?'Enable motion':'Pause motion')}</span></button></>;
}
