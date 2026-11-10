import { selectedWork } from "../content/resume.ts";
import { folioDescriptionsFor, responsibilityLabel } from "../content/work-folios.ts";
import { workStudyCopyFor } from "../app/work-study-copy.ts";

const headings = {
  "content-tracking": { zh: ["内容体验与", "满意度追踪"], en: ["Content experience", "and satisfaction tracking"] },
  "brand-tracking": { zh: ["品牌表现追踪"], en: ["Brand performance", "tracking"] },
  "us-content": { zh: ["海外内容消费研究"], en: ["Content consumption", "research"] },
  "search-tracking": { zh: ["搜索行为与", "用户心智研究"], en: ["Search behavior", "and perceptions"] },
  qualitative: { zh: ["用户需求与", "决策研究"], en: ["User needs and", "decision research"] },
};

export const researchCaseCards = Object.fromEntries(selectedWork.flatMap(study => ["zh","en"].map(language => {
  const heading = headings[study.id]?.[language];
  if (!heading || heading.join(language === "en" ? " " : "") !== study.title[language]) throw Error(`Research cover title drift: ${study.id}/${language}`);
  const story = workStudyCopyFor(study.id);
  const output = story.outputs[story.output];
  if (!output || !folioDescriptionsFor(study.id)[story.output]) throw Error(`Research cover has no verified output: ${study.id}`);
  return [`${study.id}-${language}`, {
    language, heading, id: study.id,
    owner: language === "en" ? "Rui Wang" : "王睿",
    series: (language === "en" ? "RESEARCH CASE" : "研究案例") + " / " + study.index,
    scope: study.scope[language],
    role: responsibilityLabel(study.role[language]),
    output: output[language],
  }];
})));

const pale = "#e9eee7", teal = "#9dd2c4", gold = "#ebc392", blue = "#96b9d1";
const rule = "#668992", strong = "#143141";
const field = { x: 728, y: 60, w: 412, h: 510 };

function stroke(ctx, points, color, weight=2) {
  ctx.beginPath();
  points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  ctx.strokeStyle=color;ctx.lineWidth=weight;ctx.stroke();
}
function rounded(ctx,x,y,w,h,r,fill,border,weight=2) {
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(border){ctx.strokeStyle=border;ctx.lineWidth=weight;ctx.stroke();}
}
function dot(ctx,x,y,r,fill,border) {
  ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);
  if(fill){ctx.fillStyle=fill;ctx.fill();}
  if(border){ctx.strokeStyle=border;ctx.lineWidth=2;ctx.stroke();}
}
function curved(ctx, start, a, b, end, color, weight) {
  ctx.beginPath();ctx.moveTo(...start);ctx.bezierCurveTo(...a,...b,...end);
  ctx.strokeStyle=color;ctx.lineWidth=weight;ctx.stroke();
}
function rules(ctx,x,y,width,count,spacing,color,weight=2) {
  for(let i=0;i<count;i++)stroke(ctx,[[x,y+i*spacing],[x+width,y+i*spacing]],color,weight);
}

function content(ctx) {
  const origin = 61, inputY = [148,255,362], pivot = [224,255];
  for(const [i,y] of inputY.entries()){
    const color = [blue,teal,gold][i];
    curved(ctx,[origin+22,y],[143,y],[144,255],pivot,color,2.6);
    rounded(ctx,origin-13,y-12,36,24,2,strong,color,2);
    stroke(ctx,[[origin-4,y],[origin+14,y]],color,2);
  }
  dot(ctx,...pivot,19,strong,teal);dot(ctx,...pivot,6,teal);
  stroke(ctx,[[243,255],[273,255]],teal,3);
  rounded(ctx,273,174,85,162,5,"#c6e0d326",pale);
  rounded(ctx,289,191,53,19,1,teal);
  rules(ctx,289,233,53,4,21,pale);
  stroke(ctx,[[273,149],[358,149]],rule,1.5);
  stroke(ctx,[[273,361],[358,361]],rule,1.5);
}

function brand(ctx) {
  const pages = [
    {x:68,y:119,fill:"#254250",border:rule},
    {x:92,y:143,fill:"#305361",border:blue},
    {x:116,y:167,fill:"#d2dfd8",border:pale},
  ];
  for(const [i,p] of pages.entries()){
    rounded(ctx,p.x,p.y,220,231,5,p.fill,p.border,1.8);
    rounded(ctx,p.x+21,p.y+23,75,14,1,i===2?"#277368":"#7ba4a8");
    rules(ctx,p.x+22,p.y+78,176,4,31,i===2?"#568278":"#8cb4bd",i===2?2.6:1.4);
    for(const dy of [78,109,140,171])dot(ctx,p.x+155,p.y+dy,4,i===2?"#286657":blue);
  }
  stroke(ctx,[[52,427],[352,427]],rule,1.5);
  for(const [i,x] of [75,202,327].entries())dot(ctx,x,427,4,i===2?gold:blue);
}

function audience(ctx) {
  const l=153,r=259,y=254,rad=111;
  dot(ctx,l,y,rad,"#8ab4d039",blue);dot(ctx,r,y,rad,"#71bfab36",teal);
  ctx.save();ctx.beginPath();ctx.arc(l,y,rad,0,Math.PI*2);ctx.clip();
  dot(ctx,r,y,rad,"#d9ad78ae");ctx.restore();
  dot(ctx,l,y,rad,null,blue);dot(ctx,r,y,rad,null,teal);
  stroke(ctx,[[83,254],[329,254]],"#c9d9d14a",1.4);
  dot(ctx,99,254,6,blue);dot(ctx,206,254,9,gold);dot(ctx,313,254,6,teal);
  stroke(ctx,[[206,151],[206,127]],gold,2.4);
  stroke(ctx,[[206,357],[206,381]],gold,2.4);
}

function search(ctx) {
  rounded(ctx,64,124,284,82,41,"#c0d5dd1d",pale,2.6);
  dot(ctx,114,161,15,null,teal);stroke(ctx,[[125,172],[139,186]],teal,3);
  stroke(ctx,[[160,165],[293,165]],blue,3);
  stroke(ctx,[[206,206],[206,253]],blue,2.8);dot(ctx,206,254,6,blue);
  curved(ctx,[206,254],[160,254],[120,276],[120,321],teal,2.8);
  curved(ctx,[206,254],[252,254],[292,276],[292,321],gold,2.8);
  rounded(ctx,66,321,109,69,4,"#69b5ab36",teal,2);
  rounded(ctx,238,321,109,69,4,"#ddb08032",gold,2);
  rules(ctx,87,344,65,2,19,teal,2.5);rules(ctx,259,344,65,2,19,gold,2.5);
}

function qualitative(ctx) {
  const talk = [59,131], grid = [233,131];
  rounded(ctx,...talk,120,103,7,"#9ccfc435",teal,2.3);
  stroke(ctx,[[83,234],[83,254],[111,234]],teal,2.4);
  rules(ctx,83,160,72,3,21,teal,2.8);
  rounded(ctx,...grid,120,103,6,"#abc2d21c",blue,2.3);
  for(const y of [155,182,209])for(const x of [251,282,313])rounded(ctx,x,y,20,12,1,null,blue,1.7);
  curved(ctx,[120,260],[120,307],[168,303],[206,339],teal,2.7);
  curved(ctx,[292,251],[292,299],[244,303],[206,339],blue,2.7);
  rounded(ctx,152,339,108,52,4,"#dac295",gold,2.4);
  stroke(ctx,[[177,364],[235,364]],strong,3);
}

const compositions = { "content-tracking":content,"brand-tracking":brand,"us-content":audience,"search-tracking":search,qualitative };

export function drawResearchCaseArt(ctx,id) {
  const art=compositions[id];
  if (!art) throw Error(`Missing research-case artwork: ${id}`);
  ctx.save();
  ctx.translate(field.x,field.y);
  const light=ctx.createRadialGradient(186,205,35,206,255,330);
  light.addColorStop(0,"#294e59");light.addColorStop(1,"#102634");
  ctx.fillStyle=light;ctx.fillRect(0,0,field.w,field.h);
  ctx.lineJoin="round";ctx.lineCap="round";
  for(let x=24;x<field.w-20;x+=28)for(let y=27;y<field.h-25;y+=28)dot(ctx,x,y,1.05,"#b9cfc736");
  for(const [x,y,dx,dy] of [[28,32,1,1],[384,32,-1,1],[28,478,1,-1],[384,478,-1,-1]]) {
    stroke(ctx,[[x+15*dx,y],[x,y],[x,y+15*dy]],"#8cb1b1",1.3);
  }
  art(ctx);
  ctx.restore();
}
