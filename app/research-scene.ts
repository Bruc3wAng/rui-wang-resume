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
 vec3 ripple=wave(uv);float w=ripple.x;vec2 grad=ripple.yz;
 vec2 q=uv+grad*.00034;
 float mobile=1.-step(.85,aspect);
 float cx=mix(.75,.58,mobile);float cy=mix(.55,.40,mobile);
 cx+=sin(chapter*1.2)*.055;vec2 origin=mix(heroCenter,vec2(cx,cy),smoothstep(.1,1.,chapter));
 vec2 p=(q-origin)*vec2(aspect,1.);
 p-=pointer*vec2(.012,.009);
 float phase=fract(chapter);float radius=mix(.32,.17,mobile);
 float r=length(p),a=atan(p.y,p.x);
 float swell=sin(a*3.+time*.14+chapter)*.006+sin(a*7.-time*.11)*.003;
 float edge=radius+swell;
 vec3 cold=vec3(.14,.57,.57),warm=vec3(.62,.45,.25),violet=vec3(.35,.38,.64);
 vec3 tint=mix(cold,warm,smoothstep(.4,1.4,chapter));tint=mix(tint,violet,smoothstep(2.3,4.,chapter));
 vec3 col=vec3(.012,.034,.049);
 float mist=noise(q*3.+time*.015)*.6+noise(q*7.-time*.013)*.25;
 col+=tint*.08*mist;
 col+=tint*.10*exp(-r*r*2.5);
 float surface=1.-smoothstep(.12,1.,chapter);
 float shell=exp(-abs(r-edge)*170.);
 float ring=exp(-abs(r-radius*1.29)*600.);
 col+=(tint*shell*.27+vec3(.63,.89,.82)*shell*.11+ring*tint*.18)*surface;
 if(r<edge&&surface>.001){
  vec3 n=normalize(vec3(p/edge,sqrt(max(.001,1.-r*r/(edge*edge)))));
  float fres=pow(1.-n.z,3.5);
  vec3 light=normalize(vec3(-.6,.8,1.));
  float spec=pow(max(0.,dot(reflect(-light,n),vec3(0,0,1))),42.);
  float lat=asin(n.y)*7.,lon=atan(n.x,n.z)*10.+time*.07;
  float grid=pow(1.-abs(sin(lat)),34.)+pow(1.-abs(sin(lon)),42.);
  col+=tint*grid*.095*n.z*surface;
  float bands=sin(n.x*7.+n.y*4.+sin(n.y*9.+time*.1)+chapter*2.);
  col+=(tint*(.025+fres*.23)+vec3(.65,.80,.72)*spec*.45)*surface;
  col+=mix(tint,violet,sin(a*2.+chapter)*.5+.5)*pow(max(0.,bands),18.)*.065*surface;
 }
 col+=tint*max(0.,w)*.12;
 col+=(hash(gl_FragCoord.xy)-.5)*.009;
 col*=1.-.30*length(uv-.5);
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
 brightness=(.36+max(0.,p.z)*.72)*(1.+pull*1.1);id=seed.z;
}`;
const pointFragment=`#version 300 es
precision highp float;
in float brightness;in float id;out vec4 color;
uniform float chapter;
void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;vec3 c=mix(vec3(.43,.77,.71),vec3(.92,.76,.48),id*.65);c=mix(c,vec3(.64,.67,.94),smoothstep(2.5,4.,chapter)*.5);color=vec4(c,brightness*pow(1.-d*2.,.6));}`;

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
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.useProgram(points);gl.bindBuffer(gl.ARRAY_BUFFER,particle);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.uniform1f(u.time,input.time);gl.uniform1f(u.chapter,input.chapter);gl.uniform1f(u.detail,input.detail);gl.uniform1f(u.ratio,canvas.width/canvas.height);gl.uniform2fv(u.pointer,input.pointer);gl.uniform2fv(u.heroCenter,input.heroCenter);gl.drawArrays(gl.POINTS,0,count);
 },dispose(){gl.deleteBuffer(quad);gl.deleteBuffer(particle);gl.deleteProgram(bg);gl.deleteProgram(points);shaders.forEach(s=>gl.deleteShader(s));}};
 }catch(error){shaders.forEach(s=>gl.deleteShader(s));console.warn('Research scene uses the static fallback.',error);return null;}
}
