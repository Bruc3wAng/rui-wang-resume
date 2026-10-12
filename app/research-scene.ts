export type SceneInput = { chapter: number; heroCenter: [number, number]; pointer: [number, number]; ripples: number[]; time: number; detail: number; reduced: boolean };

const vertex = `#version 300 es
precision highp float;
layout(location=0) in vec2 position;
out vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `#version 300 es
precision highp float;
in vec2 uv;out vec4 color;
uniform vec2 resolution,pointer,heroCenter;
uniform float time,chapter,detail;
uniform vec4 ripples[12];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
vec3 wave(vec2 p){vec3 v=vec3(0);float aspect=resolution.x/resolution.y;for(int i=0;i<12;i++){vec4 r=ripples[i];float age=time-r.z;if(age<0.||age>3.)continue;vec2 delta=(p-r.xy)*vec2(aspect,1.);float d=length(delta);float front=d-age*.24;float envelope=exp(-front*front*100.-age*1.55)*r.w;float sn=sin(front*90.);float derivative=(90.*cos(front*90.)-200.*front*sn)*envelope;v+=vec3(sn*envelope,normalize(delta+vec2(.00001))*vec2(aspect,1.)*derivative);}return v;}
void main(){
 float aspect=resolution.x/resolution.y;
 vec3 ripple=wave(uv);vec2 q=uv+ripple.yz*.00020;
 float mobile=1.-step(.85,aspect);
 vec2 origin=mix(heroCenter,vec2(.80,.53),smoothstep(.1,1.,chapter));
 vec2 p=(q-origin)*vec2(aspect,1.);p-=pointer*vec2(.009,.007);
 float surface=1.-smoothstep(.12,.94,chapter);
 vec3 paper=vec3(.905,.91,.875),blue=vec3(.184,.275,.612),green=vec3(0.,.616,.612);
 vec3 col=paper;
 // Broad daylight washes carry colour through the reading surface.
 col=mix(col,vec3(.72,.84,.89),.68*exp(-dot(p,p)*2.));
 col=mix(col,vec3(.70,.88,.78),.40*exp(-dot(p-vec2(.26,-.22),p-vec2(.26,-.22))*9.));
 float scale=mix(.225,.135,mobile);
 vec2 v=p/scale;float rot=.32+sin(time*.15)*.12+pointer.x*.08;
 v=mat2(cos(rot),-sin(rot),sin(rot),cos(rot))*v;
 // A refractive ribbon, rather than the previous particle globe, opens the story.
 float a=atan(v.y,v.x);float ringRadius=1.+.075*sin(a*3.+time*.25);
 float r=length(v*vec2(.92,1.10));float width=.155+.06*sin(a*2.-time*.18);
 float d=abs(r-ringRadius);float body=1.-smoothstep(width-.025,width+.025,d);
 float lip=exp(-abs(d-width)*90.);float innerGlow=exp(-abs(r-(ringRadius-width*.85))*100.);
 float hue=.5+.5*sin(a+time*.19+.8);
 vec3 tint=mix(blue,green,smoothstep(.22,.85,hue));
 float curve=clamp((r-ringRadius)/width,-1.,1.);
 vec3 glass=mix(tint,vec3(.92,.97,1.),pow(.5+.5*curve,2.)*.72);
 glass=mix(glass,vec3(1.),pow(max(0.,sin(a*2.-time*.17+.7)),20.)*.82);
 float shade=exp(-pow((r-ringRadius)/.32,2.));
 col=mix(col,vec3(.52,.64,.76),shade*.08*surface);
 col=mix(col,glass,body*.87*surface);
 col=mix(col,vec3(1.,.995,.96),lip*.83*surface);
 col=mix(col,tint,innerGlow*.50*surface);
 float orbit=exp(-abs(length(v*vec2(.85,1.2))-1.55)*350.);
 col=mix(col,blue,orbit*.12*surface);
 float waveLight=clamp(ripple.x*.10,-.08,.08);col+=vec3(-.35,-.15,.1)*waveLight;
 col+=(hash(gl_FragCoord.xy)-.5)*.004;
 color=vec4(col,1.);

}`;
const pointVertex = `#version 300 es
precision highp float;
layout(location=0) in vec3 seed;
uniform float time,chapter,detail,ratio;
uniform vec2 pointer,heroCenter;
out float brightness;out float id;
vec3 sphere(vec3 v){float theta=v.x*6.283185;float y=v.y*2.-1.;float r=sqrt(max(0.,1.-y*y));return vec3(r*cos(theta),y,r*sin(theta));}
vec3 form(vec3 v,float ch){
 vec3 g=sphere(v);float a=v.x*6.283185;
 vec3 orbit=vec3(cos(a+v.y*2.)*(.45+v.y*.65),sin(a*2.+v.y*4.)*.45,sin(a+v.y*2.)*(.45+v.y*.65));
 vec3 signal=vec3((v.x-.5)*2.2,sin(v.x*9.+v.y*4.+detail*.6)*.24+(v.y-.5)*.72,(v.z-.5)*1.2);
 float h=a*3.+v.y*2.+detail*.28;vec3 helix=vec3(cos(h)*(.36+v.z*.18),(v.x-.5)*(2.+sin(detail)*.2),sin(h)*(.36+v.z*.18));
 vec3 grid=vec3((floor(v.x*14.)/13.-.5)*1.65,(floor(v.y*14.)/13.-.5)*1.65,(v.z-.5)*1.65);
 if(ch<1.)return mix(g,orbit,smoothstep(0.,1.,ch));
 if(ch<2.)return mix(orbit,signal,smoothstep(1.,2.,ch));
 if(ch<3.)return mix(signal,helix,smoothstep(2.,3.,ch));
 if(ch<4.)return mix(helix,grid,smoothstep(3.,4.,ch));
 return mix(grid,g,smoothstep(4.,5.,ch));
}
void main(){
 vec3 p=form(seed,chapter);
 float rot=time*.045+chapter*.6+pointer.x*.14;
 p.xz=mat2(cos(rot),-sin(rot),sin(rot),cos(rot))*p.xz;
 float tilt=.16+pointer.y*.1;p.yz=mat2(cos(tilt),-sin(tilt),sin(tilt),cos(tilt))*p.yz;
 float mobile=1.-step(.85,ratio);float s=mix(.29,.16,mobile);float zoom=2.8/(2.8-p.z*.45);
 vec2 center=mix(heroCenter,vec2(mix(.80,.65,mobile)+sin(chapter*1.2)*.055,mix(.55,.40,mobile)),smoothstep(.1,1.,chapter));
 vec2 xy=p.xy*s*zoom/vec2(ratio,1.)+center;
 vec2 d=xy-(pointer*.5+.5);float pull=exp(-dot(d,d)*55.);
 xy+=normalize(d+vec2(.0001))*pull*.026;
 gl_Position=vec4(xy*2.-1.,0.,1.);
 gl_PointSize=(1.1+seed.z*1.3)*zoom;
 brightness=(.22+max(0.,p.z)*.42)*(1.+pull*.8)*smoothstep(.08,.85,chapter);id=seed.z;
}`;
const pointFragment=`#version 300 es
precision highp float;
in float brightness;in float id;out vec4 color;
uniform float chapter;
void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 c=mix(vec3(.11,.31,.61),vec3(0.,.616,.612),id*.65);c=mix(c,vec3(.22,.42,.55),smoothstep(2.5,4.,chapter)*.5);color=vec4(c,brightness*pow(1.-d*2.,.6));}`;

export function createResearchScene(canvas: HTMLCanvasElement) {
 const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!gl) return null;
 const shaders: WebGLShader[]=[];
 function shader(type:number,source:string){const s=gl!.createShader(type)!;gl!.shaderSource(s,source);gl!.compileShader(s);if(!gl!.getShaderParameter(s,gl!.COMPILE_STATUS))throw Error(gl!.getShaderInfoLog(s)||'shader');shaders.push(s);return s;}
 function program(v:string,f:string){const p=gl!.createProgram()!;gl!.attachShader(p,shader(gl!.VERTEX_SHADER,v));gl!.attachShader(p,shader(gl!.FRAGMENT_SHADER,f));gl!.linkProgram(p);if(!gl!.getProgramParameter(p,gl!.LINK_STATUS))throw Error(gl!.getProgramInfoLog(p)||'link');return p;}
 try{
 const bg=program(vertex,fragment),points=program(pointVertex,pointFragment);
 const quad=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const count=3200,data=new Float32Array(count*3);let rand=2743;const random=()=>{rand=(rand*1664525+1013904223)>>>0;return rand/4294967296;};
 for(let i=0;i<count;i++){data[i*3]=random();data[i*3+1]=random();data[i*3+2]=random();}
 const particle=gl.createBuffer()!;gl.bindBuffer(gl.ARRAY_BUFFER,particle);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
 const locations=(p:WebGLProgram,names:string[])=>Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(p,n)]));
 const b=locations(bg,['resolution','pointer','heroCenter','time','chapter','detail','ripples[0]']),u=locations(points,['time','chapter','detail','ratio','pointer','heroCenter']);
 return {draw(input:SceneInput){
 gl.viewport(0,0,canvas.width,canvas.height);gl.disable(gl.BLEND);gl.useProgram(bg);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.uniform2f(b.resolution,canvas.width,canvas.height);gl.uniform2fv(b.pointer,input.pointer);gl.uniform2fv(b.heroCenter,input.heroCenter);gl.uniform1f(b.time,input.time);gl.uniform1f(b.chapter,input.chapter);gl.uniform1f(b.detail,input.detail);gl.uniform4fv(b['ripples[0]'],input.ripples);gl.drawArrays(gl.TRIANGLES,0,6);
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(points);gl.bindBuffer(gl.ARRAY_BUFFER,particle);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.uniform1f(u.time,input.time);gl.uniform1f(u.chapter,input.chapter);gl.uniform1f(u.detail,input.detail);gl.uniform1f(u.ratio,canvas.width/canvas.height);gl.uniform2fv(u.pointer,input.pointer);gl.uniform2fv(u.heroCenter,input.heroCenter);gl.drawArrays(gl.POINTS,0,count);
 },dispose(){gl.deleteBuffer(quad);gl.deleteBuffer(particle);gl.deleteProgram(bg);gl.deleteProgram(points);shaders.forEach(s=>gl.deleteShader(s));}};
 }catch(error){shaders.forEach(s=>gl.deleteShader(s));console.warn('Research scene uses the static fallback.',error);return null;}
}
