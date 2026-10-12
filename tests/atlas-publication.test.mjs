import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('content/overseas-public.json',root),'utf8'));
test('published atlas contains licensed aggregates and no private working fields',()=>{
 assert.equal(data.metrics.length,30);assert.equal(new Set(data.observations.map(r=>`${r.country}/${r.metric}/${r.year}`)).size,data.observations.length);
 for(const m of data.metrics){assert.equal(m.license,'CC BY 4.0');for(const k of ['url','methodUrl','licenceUrl'])assert.match(m[k],/^https:\/\//);assert.ok(m.originalSource);}
 for(const r of data.observations){if(r.quality!=='published')assert.equal(r.value,null);assert.ok(data.countries.some(c=>c.iso3===r.country));assert.ok(data.metrics.some(m=>m.id===r.metric));}
 assert.doesNotMatch(JSON.stringify(data),/\/Users\/|rawValue|rawFile|reviewReason|ByteDance|Ipsos|client_id|api_key/);
});
test('both deployments export bilingual atlas pages with complete defaults and references',async()=>{
 for(const [build,base] of [['out','/rui-wang-resume'],['dist/client','']])for(const locale of ['','en/']){
 const html=await readFile(new URL(`${build}/${locale}overseas/index.html`,root),'utf8');
 assert.match(html,/340,003,797/);assert.match(html,/Global Development Atlas|全球发展数据查询/);assert.match(html,/License|CC BY 4\.0/);assert.ok(html.includes(`${base}/images/rui-wang-chibi.png`));assert.doesNotMatch(html,/href=""/);assert.match(html,/<title>2020: [\d,]+<\/title>/);
 }
});
