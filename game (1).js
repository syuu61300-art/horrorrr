const $=i=>document.getElementById(i),R=Math.random;
const DEF={sens:1,fov:75,blur:1,bri:1,vol:.7,res:1,fps:0,showfps:true},S={...DEF};
try{Object.assign(S,JSON.parse(localStorage.getItem('yk1')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('yk1',JSON.stringify(S))}catch(e){}};
/* ===== renderer / post-process ===== */
const cv=$('c'),rd=new THREE.WebGLRenderer({canvas:cv,antialias:false,powerPreference:'high-performance'});
rd.shadowMap.enabled=true;rd.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x04060a,.06);scene.background=new THREE.Color(0x04060a);
const cam=new THREE.PerspectiveCamera(S.fov,1,.05,120);cam.rotation.order='YXZ';scene.add(cam);
const rt=new(rd.capabilities.isWebGL2?THREE.WebGLMultisampleRenderTarget:THREE.WebGLRenderTarget)(8,8);
const U={t:{value:rt.texture},v:{value:new THREE.Vector2()},b:{value:1},tm:{value:0},dg:{value:0},gr:{value:.055},bl:{value:1},ca:{value:1},asp:{value:1.78}};
const pc=new THREE.OrthographicCamera(-1,1,1,-1,0,1),pq=new THREE.Scene();
const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:U,depthTest:false,
vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=vec4(position,1.);}',
fragmentShader:`uniform sampler2D t;uniform vec2 v;uniform float b,tm,dg,gr,bl,ca,asp;varying vec2 u;
float r(vec2 s){return fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
void main(){vec2 q=u-.5;vec3 c=vec3(0.);
for(int i=0;i<12;i++){c+=texture2D(t,u+v*(float(i)/11.-.5)).rgb;}c/=12.;
float cs=dot(q,q)*.008*ca;
c.r=mix(c.r,texture2D(t,u+q*cs).r,.8);c.b=mix(c.b,texture2D(t,u-q*cs).b,.8);
if(bl>0.){vec3 g=vec3(0.);for(int i=0;i<8;i++){float a=float(i)*.7854;vec2 o=vec2(cos(a),sin(a)*asp)*.008;g+=max(texture2D(t,u+o).rgb-.55,0.)+max(texture2D(t,u+o*2.6).rgb-.55,0.);}c+=g*.075*bl;}
c=aces(c*b*1.25);c=pow(c,vec3(.4545));
float l=dot(c,vec3(.299,.587,.114));
c=mix(c*vec3(.84,.98,1.12),c*vec3(1.1,1.0,.88),smoothstep(.12,.65,l));
float d=length(q*vec2(1.,.82))*(1.+dg*.6);
c*=1.-smoothstep(.3,.95,d)*.92;
c=mix(c,c*vec3(1.8,.42,.42),dg*.6);
c+=(r(u*vec2(1.,asp)+tm)-.5)*gr;
gl_FragColor=vec4(c,1.);}`}));
quad.frustumCulled=false;pq.add(quad);
let W=innerWidth,H_=innerHeight,ROT=false;
function fit(){layoutRot();W=ROT?innerHeight:innerWidth;H_=ROT?innerWidth:innerHeight;const pr=Math.min(devicePixelRatio||1,2)*S.res;rd.setPixelRatio(pr);rd.setSize(W,H_);rt.setSize(Math.max(1,W*pr|0),Math.max(1,H_*pr|0));cam.aspect=W/H_;cam.fov=S.fov;cam.updateProjectionMatrix()}
addEventListener('resize',fit);

/* ===== house v2 (22m x 14m / 11 rooms) : original textures ===== */
const CH=2.6,WT=.2,WL=[],AB=[],SH=[],NK=6,rnd=(a,b)=>a+R()*(b-a),lin=h=>new THREE.Color(h).convertSRGBToLinear();
const mat=o=>new THREE.MeshPhongMaterial(Object.assign({shininess:6,specular:0x181818},o));
const CNV=(f,w=512)=>{const c=document.createElement('canvas');c.width=c.height=w;f(c.getContext('2d'),w);return c};
const TEX=(c,col=1)=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(col)t.encoding=THREE.sRGBEncoding;return t};
const grayC=c=>{const w=c.width,d=c.getContext('2d').getImageData(0,0,w,w),o=document.createElement('canvas');o.width=o.height=w;const y=o.getContext('2d'),e=y.createImageData(w,w);
 for(let i=0;i<d.data.length;i+=4){e.data[i]=e.data[i+1]=e.data[i+2]=d.data[i]*.3+d.data[i+1]*.59+d.data[i+2]*.11;e.data[i+3]=255}y.putImageData(e,0,0);return o};
const stain=(x,w,n,col,a,y0=0,y1=1)=>{for(let i=0;i<n;i++){const X=R()*w,Y=rnd(y0,y1)*w,r=rnd(20,100),g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,`rgba(${col},${rnd(a*.4,a)})`);g.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g;x.fillRect(X-r,Y-r,2*r,2*r)}};
const speck=(x,w,n,a,l=18)=>{for(let i=0;i<n;i++){x.fillStyle=`rgba(0,0,0,${R()*a})`;x.fillRect(R()*w,R()*w,rnd(1,3),rnd(1,l))}};
const M=(c,o,bs)=>mat(Object.assign({map:TEX(c)},bs?{bumpMap:TEX(grayC(c),0),bumpScale:bs}:{},o));
const uvs=(g,a,b)=>{const u=g.attributes.uv;for(let i=0;i<u.count;i++)u.setXY(i,u.getX(i)*a,u.getY(i)*b)};
/* --- wallpapers (7 originals) --- */
const WP={lat:['#6f7d68','#34432f'],str:['#6a7a96','#27324d'],dam:['#6b2a2e','#2f1013'],pla:['#a38d6b','#5e4a30'],bei:['#a39378','#5e4f38'],til:['#b4c0c4','#4a5d64'],wod:['#5b4128','#241608']};
const wallC=k=>CNV((x,w)=>{const[a,b]=WP[k];x.fillStyle=a;x.fillRect(0,0,w,w);x.strokeStyle=b+'99';x.fillStyle=b+'66';x.lineWidth=3;
 if(k=='lat')for(let j=0;j<8;j++)for(let i=0;i<8;i++){const cx=i*64+(j%2?48:16),cy=j*64+32;x.beginPath();x.moveTo(cx,cy-26);x.lineTo(cx+20,cy);x.lineTo(cx,cy+26);x.lineTo(cx-20,cy);x.closePath();x.stroke();x.beginPath();x.arc(cx,cy,3,0,7);x.fill()}
 else if(k=='str'){for(let i=0;i<w;i+=64){x.fillStyle=b+'55';x.fillRect(i,0,32,w);x.fillStyle='#e8d8a8aa';x.fillRect(i+32,0,3,w)}for(let n=0;n<30;n++){const X=R()*w,Y=R()*w*.75;x.fillStyle='#f0e2a8bb';x.fillRect(X-1,Y-6,2,12);x.fillRect(X-6,Y-1,12,2)}}
 else if(k=='dam'){x.fillStyle=b+'99';for(let j=0;j<4;j++)for(let i=0;i<4;i++){const cx=i*128+(j%2?96:32),cy=j*128+64;x.beginPath();x.ellipse(cx,cy,13,38,0,0,7);x.fill();for(const s of[-1,1]){x.beginPath();x.ellipse(cx+s*26,cy+10,9,26,s*.6,0,7);x.fill()}x.beginPath();x.arc(cx,cy+46,8,0,7);x.fill()}}
 else if(k=='pla'){for(let n=0;n<40;n++){x.strokeStyle=`rgba(255,240,210,${R()*.07})`;x.lineWidth=rnd(6,18);x.beginPath();x.arc(R()*w,R()*w,rnd(40,160),R()*6,R()*6+2);x.stroke()}speck(x,w,1500,.22,4)}
 else if(k=='bei'){for(let i=0;i<w;i+=64){x.fillStyle='rgba(0,0,0,.07)';x.fillRect(i,0,32,w);x.fillStyle='rgba(60,40,20,.14)';x.fillRect(i+32,0,5,w)}}
 else if(k=='til'){for(let j=0;j<8;j++)for(let i=0;i<8;i++){x.fillStyle=`rgba(${R()<.5?'255,255,255':'0,30,40'},${R()*.08})`;x.fillRect(i*64,j*64,64,64);const g=x.createLinearGradient(i*64,j*64,i*64+64,j*64+64);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(.4,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(i*64,j*64,64,64)}x.fillStyle=b+'cc';for(let i=0;i<w;i+=64){x.fillRect(i,0,3,w);x.fillRect(0,i,w,3)}stain(x,w,8,'20,40,20',.5,.6,1)}
 else{for(let i=0;i<w;i+=64){x.fillStyle=`hsl(28,${28+R()*12}%,${15+R()*10}%)`;x.fillRect(i,0,64,w);x.fillStyle='rgba(0,0,0,.6)';x.fillRect(i,0,3,w);for(let n=0;n<14;n++){x.fillStyle=`rgba(0,0,0,${R()*.25})`;x.fillRect(i+R()*60,0,1.5,w)}}x.fillStyle='rgba(0,0,0,.35)';for(let n=0;n<4;n++){x.beginPath();x.ellipse(R()*w,R()*w,5,12,0,0,7);x.fill()}}
 const d=k=='til'||k=='wod'?0:k=='pla'?.05:.22;
 if(d){x.fillStyle='#2e1e12';x.fillRect(0,w*(1-d),w,w*d);if(d>.1){x.fillStyle='#5a3b22';x.fillRect(0,w*(1-d)-6,w,10);x.strokeStyle='#1a0f08';x.lineWidth=4;for(let i=0;i<w;i+=128)x.strokeRect(i+10,w*(1-d)+16,108,w*d-30)}}
 for(let i=0;i<7;i++){const X=R()*w,g=x.createLinearGradient(0,0,0,w*rnd(.3,.8));g.addColorStop(0,'rgba(55,38,10,.4)');g.addColorStop(1,'rgba(55,38,10,0)');x.fillStyle=g;x.fillRect(X,0,rnd(6,26),w)}
 stain(x,w,10,'80,58,24',.3);stain(x,w,5,'18,26,14',.4,.7,1);speck(x,w,500,.2);
 const ao=x.createLinearGradient(0,0,0,w);ao.addColorStop(0,'rgba(0,0,0,.6)');ao.addColorStop(.1,'rgba(0,0,0,0)');ao.addColorStop(.9,'rgba(0,0,0,0)');ao.addColorStop(1,'rgba(0,0,0,.5)');x.fillStyle=ao;x.fillRect(0,0,w,w)});
/* --- floors (8 originals) + ceiling --- */
const FL={
brd:()=>CNV((x,w)=>{for(let y=0;y<w;y+=64){const o=R()*w;for(let s=0;s<2;s++){x.fillStyle=`hsl(${rnd(22,32)},${rnd(28,42)}%,${rnd(15,26)}%)`;x.fillRect(s?o:0,y,s?w-o:o,64);x.fillStyle='rgba(0,0,0,.65)';x.fillRect(s?o:0,y,3,64)}x.fillStyle='rgba(0,0,0,.7)';x.fillRect(0,y,w,3)}
 for(let n=0;n<70;n++){x.fillStyle=`rgba(${R()<.5?'0,0,0':'255,230,190'},${R()*.12})`;x.fillRect(R()*w,R()*w,rnd(20,90),1.5)}x.fillStyle='rgba(30,22,16,.8)';for(let n=0;n<26;n++)x.fillRect(R()*w,Math.floor(R()*8)*64+10,3,3);stain(x,w,6,'0,0,0',.35)}),
car:()=>CNV((x,w)=>{x.fillStyle='#46525f';x.fillRect(0,0,w,w);for(let n=0;n<7000;n++){x.fillStyle=`rgba(${R()<.5?'255,255,255':'0,0,0'},${R()*.12})`;x.fillRect(R()*w,R()*w,2,2)}stain(x,w,10,'0,0,0',.3)}),
par:()=>CNV((x,w)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let b=0;b<4;b++){x.fillStyle=`hsl(${rnd(24,34)},${rnd(30,44)}%,${rnd(17,28)}%)`;(i+j)%2?x.fillRect(i*128,j*128+b*32,128,31):x.fillRect(i*128+b*32,j*128,31,128)}x.fillStyle='rgba(0,0,0,.4)';for(let i=0;i<w;i+=32){x.fillRect(i,0,1,w);x.fillRect(0,i,w,1)}stain(x,w,8,'0,0,0',.3);speck(x,w,200,.2)}),
tat:()=>CNV((x,w)=>{for(let m=0;m<2;m++){x.fillStyle=m?'#7c8050':'#868a58';x.fillRect(m*256,0,256,w);for(let y=0;y<w;y+=3){x.fillStyle=`rgba(${R()<.5?'0,0,0':'255,255,200'},${.03+R()*.07})`;x.fillRect(m*256,y,256,1+(R()<.3?1:0))}x.fillStyle='#1b2012';x.fillRect(m*256,0,10,w)}x.fillRect(0,0,w,8);x.fillStyle='#3a4a28';x.fillRect(10,0,2,w);x.fillRect(266,0,2,w);stain(x,w,10,'40,30,10',.3)}),
tlf:()=>CNV((x,w)=>{for(let j=0;j<8;j++)for(let i=0;i<8;i++){x.fillStyle=`hsl(195,${rnd(8,16)}%,${rnd(55,68)}%)`;x.fillRect(i*64,j*64,64,64)}x.fillStyle='#2a3338';for(let i=0;i<w;i+=64){x.fillRect(i,0,4,w);x.fillRect(0,i,w,4)}stain(x,w,12,'20,30,18',.5);stain(x,w,6,'90,20,20',.25);speck(x,w,200,.2)}),
chk:()=>CNV((x,w)=>{for(let j=0;j<4;j++)for(let i=0;i<4;i++){x.fillStyle=(i+j)%2?'#2b2b2e':'#d4ccb8';x.fillRect(i*128,j*128,128,128)}x.fillStyle='rgba(0,0,0,.5)';for(let i=0;i<w;i+=128){x.fillRect(i,0,2,w);x.fillRect(0,i,w,2)}stain(x,w,18,'30,20,10',.4);speck(x,w,300,.25)}),
stn:()=>CNV((x,w)=>{x.fillStyle='#1c1c1e';x.fillRect(0,0,w,w);for(let y=0,r=0;y<w&&r<5;r++){const h=r==4?w-y:rnd(90,120);for(let X=0;X<w;){const ww=Math.min(rnd(90,190),w-X);x.fillStyle=`hsl(${rnd(200,230)},${rnd(4,10)}%,${rnd(26,38)}%)`;x.fillRect(X+3,y+3,ww-6,h-6);X+=ww}y+=h}speck(x,w,500,.3);stain(x,w,12,'0,0,0',.4)}),
rug:()=>CNV((x,w)=>{x.fillStyle='#5e1c22';x.fillRect(0,0,w,w);x.strokeStyle='#d8c08a';x.lineWidth=10;x.strokeRect(24,24,w-48,w-48);x.strokeStyle='#2c0e12';x.lineWidth=14;x.strokeRect(54,54,w-108,w-108);x.strokeStyle='#c8a860aa';x.lineWidth=3;for(let i=0;i<5;i++)x.strokeRect(100+i*14,100+i*14,w-200-i*28,w-200-i*28);
 x.fillStyle='#d8c08a';for(let a=0;a<8;a++){x.save();x.translate(w/2,w/2);x.rotate(a*Math.PI/4);x.beginPath();x.ellipse(0,-70,14,46,0,0,7);x.fill();x.restore()}x.beginPath();x.arc(w/2,w/2,26,0,7);x.fill();
 for(let n=0;n<9000;n++){x.fillStyle=`rgba(${R()<.5?'255,255,255':'0,0,0'},${R()*.1})`;x.fillRect(R()*w,R()*w,2,2)}stain(x,w,6,'0,0,0',.3);x.fillStyle='#d8c08a';for(let i=0;i<w;i+=8){x.fillRect(i,0,3,14);x.fillRect(i,w-14,3,14)}}),
cel:()=>CNV((x,w)=>{for(let y=0;y<w;y+=64){x.fillStyle=`hsl(${rnd(30,40)},${rnd(20,30)}%,${rnd(22,30)}%)`;x.fillRect(0,y,w,64);x.fillStyle='rgba(0,0,0,.6)';x.fillRect(0,y,w,3)}stain(x,w,20,'60,40,12',.5);speck(x,w,300,.2)})};
const FM={brd:M(FL.brd(),{shininess:38,specular:0x2a2a2a},1),car:M(FL.car(),{shininess:2}),par:M(FL.par(),{shininess:45,specular:0x303030},.8),tat:M(FL.tat(),{shininess:3,specular:0x050505},1.2),
 tlf:M(FL.tlf(),{shininess:90,specular:0x666666},.8),chk:M(FL.chk(),{shininess:60,specular:0x444444}),stn:M(FL.stn(),{shininess:25,specular:0x222222},1.4),rug:M(FL.rug(),{shininess:2}),cel:M(FL.cel(),{shininess:3})};
function patch(x1,z1,x2,z2,m,y,tile){const g=new THREE.PlaneGeometry(x2-x1,z2-z1);uvs(g,(x2-x1)/tile,(z2-z1)/tile);const o=new THREE.Mesh(g,m);o.rotation.x=(y==CH?1:-1)*Math.PI/2;o.position.set((x1+x2)/2,y,(z1+z2)/2);o.receiveShadow=true;scene.add(o)}
patch(0,0,22,14,FM.brd,0,2);patch(5.5,0,10.5,5,FM.car,.01,2);patch(10.5,0,15.5,5,FM.par,.01,2);patch(15.5,0,22,5,FM.tat,.01,1.8);patch(0,7,3.5,14,FM.tlf,.01,2);patch(3.5,7,9.5,14,FM.chk,.01,2);patch(16.5,7,22,14,FM.stn,.01,2);patch(12.8,9.4,15.8,12.4,FM.rug,.02,3);patch(0,0,22,14,FM.cel,CH,2);
/* --- walls: each side gets the wallpaper of its own room --- */
const WM={},trim=mat({color:lin(0x3a2e24),shininess:10});
const wm=k=>WM[k]||(WM[k]=M(wallC(k),{shininess:k=='til'?70:4,specular:k=='til'?0x555555:0x080808},k=='pla'?1.1:.6));
const zone=(x,z)=>z<5?(x<5.5?'lat':x<10.5?'str':x<15.5?'dam':'pla'):z<7?'bei':x<3.5?'til':x<9.5?'pla':x<16.5?'bei':x<19?(z<10?'til':'wod'):'pla';
const BX=[3.5,5.5,9.5,10.5,15.5,16.5,19],BZ=[5,7,10,10.5];
[[0,0,22,0,1],[0,14,22,14,1],[0,0,0,14,1],[22,0,22,14,1],
 [0,5,2.2,5],[3.5,5,7.3,5],[8.6,5,12.3,5],[13.6,5,18,5],[19.3,5,22,5],[5.5,0,5.5,5],[10.5,0,10.5,5],[15.5,0,15.5,5],
 [0,7,1.2,7],[2.5,7,5,7],[6.4,7,11.4,7],[13.6,7,17.2,7],[18.5,7,19,7],
 [3.5,7,3.5,14],[9.5,7,9.5,10],[9.5,11.3,9.5,14],[16.5,7,16.5,14],[19,7,19,11],[19,12.3,19,14],[16.5,10,19,10],[0,10.5,1.2,10.5],[2.5,10.5,3.5,10.5]].forEach(a=>{
 const vx=a[0]==a[2],lo=vx?Math.min(a[1],a[3]):Math.min(a[0],a[2]),hi=vx?Math.max(a[1],a[3]):Math.max(a[0],a[2]),fix=vx?a[0]:a[1];
 const cuts=[lo,...(vx?BZ:BX).filter(c=>c>lo+.3&&c<hi-.3),hi];
 for(let i=0;i<cuts.length-1;i++){let s=cuts[i],e=cuts[i+1];if(a[4]){if(i==0)s-=WT/2;if(i==cuts.length-2)e+=WT/2}
  const len=e-s,mid=(s+e)/2,cx=vx?fix:mid,cz=vx?mid:fix,A=vx?wm(zone(fix+.3,mid)):wm(zone(mid,fix+.3)),B=vx?wm(zone(fix-.3,mid)):wm(zone(mid,fix-.3)),g=new THREE.BoxGeometry(vx?WT:len,CH,vx?len:WT);
  uvs(g,len/CH,1);const m=new THREE.Mesh(g,vx?[A,B,trim,trim,trim,trim]:[trim,trim,trim,trim,A,B]);m.position.set(cx,CH/2,cz);m.castShadow=m.receiveShadow=true;scene.add(m);SH.push(m);
  const hx=(vx?WT:len)/2,hz=(vx?len:WT)/2;WL.push([cx-hx,cz-hz,cx+hx,cz+hz])}});
/* --- door frames + open door leaves --- */
const frm=mat({color:lin(0x2c1d12),shininess:30,specular:0x222222});
const put=(geo,mt,x,y,z,sol)=>{const m=new THREE.Mesh(geo,mt);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;scene.add(m);SH.push(m);if(sol){const q=geo.parameters;WL.push([x-q.width/2,z-q.depth/2,x+q.width/2,z+q.depth/2])}return m};
[[2.85,5,1.3],[7.95,5,1.3],[12.95,5,1.3],[18.65,5,1.3],[1.85,7,1.3],[5.7,7,1.4],[12.5,7,2.2],[17.85,7,1.3],[1.85,10.5,1.3],[9.5,10.65,1.3,1],[19,11.65,1.3,1]].forEach(a=>{
 const c=a[0],f=a[1],w=a[2],v=a[3],h=w/2,B=(x,y,z)=>new THREE.BoxGeometry(x,y,z);
 if(v){put(B(.34,2.1,.1),frm,c,1.05,f-h,1);put(B(.34,2.1,.1),frm,c,1.05,f+h,1);put(B(.34,.5,w+.2),frm,c,2.35,f)}
 else{put(B(.1,2.1,.34),frm,c-h,1.05,f,1);put(B(.1,2.1,.34),frm,c+h,1.05,f,1);put(B(w+.2,.5,.34),frm,c,2.35,f)}});
const leaf=mat({color:lin(0x4a3322),shininess:25,specular:0x222222});
[[2.27,4.42,-1],[7.37,4.42,-1],[12.37,4.42,-1],[18.07,4.42,-1],[1.27,7.55,1],[17.27,7.55,1],[1.27,11.05,1]].forEach(a=>{put(new THREE.BoxGeometry(.04,2.0,.85),leaf,a[0],1.0,a[1],1);put(new THREE.SphereGeometry(.035,8,8),trim,a[0]+.04,1.0,a[1]+a[2]*.4)});
/* --- windows with night sky + curtains --- */
const skyM=new THREE.MeshBasicMaterial({map:TEX(CNV((x,w)=>{const g=x.createLinearGradient(0,0,0,w);g.addColorStop(0,'#0a1224');g.addColorStop(1,'#1d3a4a');x.fillStyle=g;x.fillRect(0,0,w,w);for(let n=0;n<60;n++){x.fillStyle=`rgba(255,255,255,${R()*.8})`;x.fillRect(R()*w,R()*w*.6,1.5,1.5)}
 const m=x.createRadialGradient(170,70,3,170,70,60);m.addColorStop(0,'rgba(255,255,235,1)');m.addColorStop(.18,'rgba(235,240,255,.95)');m.addColorStop(.22,'rgba(150,180,220,.3)');m.addColorStop(1,'rgba(150,180,220,0)');x.fillStyle=m;x.fillRect(0,0,w,w);x.fillStyle='#02060a';for(let i=0;i<w;i+=26){x.beginPath();x.moveTo(i,w);x.lineTo(i+13,w-rnd(40,110));x.lineTo(i+26,w);x.fill()}},256)),fog:false});
const curM=mat({map:TEX(CNV((x,w)=>{x.fillStyle='#5a1e24';x.fillRect(0,0,w,w);for(let i=0;i<w;i+=16){const g=x.createLinearGradient(i,0,i+16,0);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(.5,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(0,0,0,.45)');x.fillStyle=g;x.fillRect(i,0,16,w)}stain(x,w,10,'0,0,0',.4);speck(x,w,200,.3)},256)),side:THREE.DoubleSide,shininess:2});
const wnd=(x,z,r)=>{const g=new THREE.Group(),add=(geo,mt,px,py,pz)=>{const m=new THREE.Mesh(geo,mt);m.position.set(px,py,pz);g.add(m);return m};
 add(new THREE.PlaneGeometry(1.2,1.1),skyM,0,0,0);
 [[1.34,.07,0,.58],[1.34,.07,0,-.58],[.07,1.2,.64,0],[.07,1.2,-.64,0],[1.2,.04,0,0],[.04,1.1,0,0]].forEach(s=>add(new THREE.BoxGeometry(s[0],s[1],.06),frm,s[2],s[3],.02));
 add(new THREE.BoxGeometry(1.5,.05,.18),frm,0,-.64,.06);
 [-1,1].forEach(s=>{const c=add(new THREE.PlaneGeometry(.55,1.5),curM,s*.82,.05,.1);c.rotation.y=s*.12});
 g.position.set(x,1.5,z);g.rotation.y=r;scene.add(g)};
[[2,.11,0],[8,.11,0],[13,.11,0],[18.5,.11,0],[21.89,2.5,-Math.PI/2],[6.5,13.89,Math.PI],[12.5,13.89,Math.PI],[.11,6,Math.PI/2],[.11,12.4,Math.PI/2]].forEach(a=>wnd(...a));

/* ===== furniture / decor / lights / items / ghost ===== */
const NMc=CNV((x,w)=>{x.fillStyle='#d6d2cc';x.fillRect(0,0,w,w);for(let i=0;i<w;i+=2){x.fillStyle=`rgba(0,0,0,${R()*.05})`;x.fillRect(i,0,1,w)}speck(x,w,200,.1,40)},256);
const NM=TEX(NMc),NMB=TEX(grayC(NMc),0);
function box(x,z,w,h,d,c,y0=0,sol=1,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(Object.assign({color:lin(c),map:NM,bumpMap:NMB,bumpScale:.15,shininess:22,specular:0x222222},o)));m.position.set(x,y0+h/2,z);m.castShadow=m.receiveShadow=true;SH.push(m);scene.add(m);if(sol)AB.push([x-w/2,z-d/2,x+w/2,z+d/2]);return m}
const bookM=mat({map:TEX(CNV((x,w)=>{x.fillStyle='#1c120a';x.fillRect(0,0,w,w);for(let r=0;r<5;r++){let X=6;while(X<w-10){const bw=rnd(10,22),bh=rnd(34,48);x.fillStyle=`hsl(${rnd(0,360)},${rnd(25,55)}%,${rnd(16,34)}%)`;x.fillRect(X,r*50+(48-bh)+6,bw,bh);x.fillStyle='rgba(220,190,120,.5)';x.fillRect(X+2,r*50+14+(48-bh),bw-4,3);X+=bw+1}x.fillStyle='#3a2616';x.fillRect(0,r*50+52,w,5)}speck(x,w,200,.3)},256)),shininess:8});
function fbox(x,z,w,h,d,c,face){const base=mat({color:lin(c),map:NM,shininess:20}),m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[0,1,2,3,4,5].map(i=>i==face?bookM:base));m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;SH.push(m);scene.add(m);AB.push([x-w/2,z-d/2,x+w/2,z+d/2])}
[/* 寝室 */[2,1.3,1.6,.45,2,0x4a3322],[2,1.3,1.5,.2,1.9,0x8a8a98,.45,0],[2,.6,.6,.1,.35,0xc8c8d0,.65,0],[2,.26,1.7,.9,.08,0x3a2616,0,0],[2,1.75,1.5,.1,1,0x5a2428,.65,0],[5,1.5,.8,2.2,1.9,0x3a2616],[3.3,.4,.5,.55,.5,0x4a3322],
 /* 子供部屋 */[6.5,1.2,1,.4,1.8,0x5a6a8a],[6.5,1.6,.9,.1,.9,0xd8c8a0,.4,0],[9.9,1.2,.7,.75,1.4,0x6a4a2a],[8.2,.5,.9,.5,.5,0x8a3a3a],[7.4,3.4,.18,.18,.18,0xc03030,0,0],[7.7,3.55,.18,.18,.18,0x2860c0,0,0],[7.5,3.7,.18,.18,.18,0xe0c030,0,0],
 /* 書斎 */[13,.8,1.6,.75,.8,0x3a2418],[13,1.8,.5,.9,.5,0x2a1810],[12.3,.8,.3,.05,.22,0x2a4a2a,.75,0],[12.35,.8,.3,.05,.22,0x4a2a2a,.8,0],
 /* 和室 */[18.5,2.4,1.2,.35,1.2,0x4a2c16],[18.5,.4,1.3,1.3,.6,0x1e120a],[18.5,.7,1,.05,.02,0xc9a227,.8,0],[21.65,3,.5,2,2.4,0x6a5a3a],[17.25,2.4,.5,.07,.5,0x5a2a40,0,0],[19.75,2.4,.5,.07,.5,0x2a405a,0,0],
 /* 洗面所・浴室 */[3,8,.5,.85,.5,0xdddddd],[3.39,8,.04,.8,.6,0x8a9aa0,1.1,0,{shininess:140,specular:0xaaaaaa}],[.5,8.5,.6,.9,.6,0xe8e8e8],[.6,12.9,.8,.55,1.8,0xd8d8d8],[.6,12.9,.6,.02,1.55,0x203a30,.45,0,{shininess:120,specular:0x88aaaa}],
 /* キッチン */[6.5,13.65,3.2,.9,.5,0x6a4a2a],[6.5,13.65,3.3,.04,.55,0xcfc8b8,.9,0],[4.1,13.45,.7,1.8,.7,0xaaaab0],[5.4,13.65,.7,.05,.45,0x111111,.94,0],[5.3,13.72,.8,.7,.35,0x4a2c16,1.5,0],[7.7,13.72,.8,.7,.35,0x4a2c16,1.5,0],[6.5,10.6,1.6,.75,1,0x5a3a20],[5.3,10.6,.45,.9,.45,0x3a2412],[7.7,10.6,.45,.9,.45,0x3a2412],
 /* リビング */[14.5,13.25,2.2,.45,.8,0x5a2a2a],[14.5,13.7,2.2,.9,.25,0x5a2a2a],[14,13.1,.5,.2,.5,0x8a3a3a,.45,0],[15,13.1,.5,.2,.5,0x3a4a6a,.45,0],[14.5,11,1.1,.4,.6,0x3a2412],[15,7.35,1.5,.45,.4,0x1c1c1c],[15,7.3,1.1,.65,.1,0x0a0a0a,.45,0],
 /* トイレ・納戸・玄関 */[17.75,9.4,.45,.45,.6,0xe8e8e8],[17.6,10.9,.8,.6,.8,0x7a5a3a],[18.4,10.7,.5,.4,.5,0x6a4a2a],[21.65,9,.5,1.1,1.6,0x4a2c16]].forEach(a=>box(...a));
fbox(10.9,2.5,.4,2,3,0x2e1c10,0);fbox(15.1,2.5,.4,2,3,0x2e1c10,1);fbox(16.15,9,.4,1.8,2,0x2e1c10,1);fbox(17.75,13.65,2,1.8,.5,0x2e1c10,5);
const ball=(x,y,z,r,c)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mat({color:lin(c),map:NM,shininess:4}));m.position.set(x,y,z);m.castShadow=true;SH.push(m);scene.add(m)};
ball(6.5,.55,.5,.12,0x8a5a30);ball(6.5,.74,.5,.09,0x8a5a30);ball(6.43,.82,.5,.035,0x8a5a30);ball(6.57,.82,.5,.035,0x8a5a30);
/* decals / paintings */
const dcl=(x,y,z,fl,rot,w,h,f,s=256)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat({map:TEX(CNV(f,s)),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,shininess:30,specular:0x331111}));m.position.set(x,y,z);fl?m.rotation.set(-Math.PI/2,0,rot):m.rotation.set(0,rot,0);m.receiveShadow=true;scene.add(m)};
const blood=(x,w)=>{for(let i=0;i<16;i++){const X=w/2+rnd(-70,70),Y=w/2+rnd(-70,70),r=rnd(6,40),g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,'rgba(95,6,8,.95)');g.addColorStop(.8,'rgba(70,4,6,.85)');g.addColorStop(1,'rgba(60,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(X,Y,r,0,7);x.fill()}x.strokeStyle='rgba(80,5,7,.85)';x.lineCap='round';for(let i=0;i<5;i++){x.lineWidth=rnd(4,12);x.beginPath();x.moveTo(w/2,w/2);x.quadraticCurveTo(w/2+rnd(-60,60),w/2+rnd(40,90),w/2+rnd(-90,90),w-rnd(10,50));x.stroke()}};
const scrawl=t=>(x,w)=>{x.font='bold 74px "Yu Mincho","Hiragino Mincho ProN",serif';x.fillStyle='#7d0b0f';x.textAlign='center';x.fillText(t,w/2,w/2);x.strokeStyle='#7d0b0f';x.lineWidth=3;x.lineCap='round';for(let i=0;i<9;i++){const X=w/2+rnd(-95,95);x.beginPath();x.moveTo(X,w/2+8);x.lineTo(X,w/2+rnd(14,70));x.stroke()}};
const hand=(x,w)=>{x.fillStyle='rgba(110,8,10,.9)';x.beginPath();x.ellipse(128,160,38,46,0,0,7);x.fill();[[-34,90,-.5,17,46],[-12,70,-.12,13,52],[12,68,.1,13,56],[34,80,.4,12,46],[58,130,1.1,12,34]].forEach(f=>{x.beginPath();x.ellipse(128+f[0],f[1]+30,f[3],f[4],f[2],0,7);x.fill()});for(let i=0;i<7;i++)x.fillRect(128+rnd(-40,40),200,3,rnd(10,50))};
const ofuda=(x,w)=>{x.fillStyle='#e6d8b4';x.fillRect(60,10,136,236);x.strokeStyle='#8a1010';x.lineWidth=4;x.strokeRect(70,20,116,216);x.fillStyle='#9a1212';x.font='bold 64px serif';x.textAlign='center';x.fillText('封',128,96);x.fillText('魔',128,170);x.font='24px serif';x.fillText('急急如律令',128,220);stain(x,w,6,'80,60,20',.4)};
const kid=(x,w)=>{x.fillStyle='#e8e2cc';x.fillRect(0,0,w,w);const L=(c,lw)=>{x.strokeStyle=c;x.lineWidth=lw;x.lineCap='round'};L('#c03030',5);x.beginPath();x.arc(60,100,14,0,7);x.moveTo(60,114);x.lineTo(60,170);x.moveTo(60,130);x.lineTo(38,150);x.moveTo(60,130);x.lineTo(82,150);x.moveTo(60,170);x.lineTo(44,215);x.moveTo(60,170);x.lineTo(76,215);x.stroke();
 L('#2860c0',5);x.beginPath();x.arc(120,130,11,0,7);x.moveTo(120,141);x.lineTo(120,180);x.moveTo(120,180);x.lineTo(108,215);x.moveTo(120,180);x.lineTo(132,215);x.moveTo(120,150);x.lineTo(98,162);x.moveTo(120,150);x.lineTo(140,162);x.stroke();
 L('#111',8);x.beginPath();x.arc(200,70,22,0,7);x.moveTo(200,92);x.lineTo(200,190);x.moveTo(200,120);x.lineTo(160,170);x.moveTo(200,120);x.lineTo(240,170);x.stroke();x.fillStyle='#e8e2cc';x.beginPath();x.arc(192,66,4,0,7);x.arc(208,66,4,0,7);x.fill();x.fillStyle='#8a1010';x.font='20px serif';x.fillText('ずっといっしょ',50,246)};
[[7,6,.3],[3.2,6.2,1.1],[2,7.9,.6],[1.8,9.4,2],[4.6,9.4,.4],[13.6,6.1,.9],[20.4,10.6,1.3],[15,12.9,.2],[6.6,12.2,2.5]].forEach(a=>dcl(a[0],.03,a[1],1,a[2],1.5,1.5,blood));
dcl(9,1.45,6.89,0,Math.PI,1.6,1.6,scrawl('うしろ'));dcl(15.5,1.5,5.11,0,0,1.6,1.6,scrawl('たすけて'));dcl(21.89,1.8,11.5,0,-Math.PI/2,1.6,1.6,scrawl('でられない'));dcl(.11,1.7,3.6,0,Math.PI/2,1.6,1.6,scrawl('みてる'));
dcl(.11,1.25,10.4,0,Math.PI/2,.7,.7,hand);dcl(.11,1.1,8.6,0,Math.PI/2,.6,.6,hand);dcl(8.1,1.2,6.89,0,Math.PI,.6,.6,hand);
[[16.6,.11],[17.3,.11],[20.4,.11]].forEach(a=>dcl(a[0],1.75,a[1],0,0,.32,.6,ofuda));dcl(10.39,1.45,1.2,0,-Math.PI/2,.62,.62,kid);
const gold=mat({color:lin(0x8a6a2a),shininess:60,specular:0x886622});
const frame=(x,y,z,ry,w,h,f)=>{const g=new THREE.Group(),p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat({map:TEX(CNV(f,256)),shininess:30}));p.position.z=.03;g.add(new THREE.Mesh(new THREE.BoxGeometry(w+.1,h+.1,.05),gold),p);g.position.set(x,y,z);g.rotation.y=ry;scene.add(g)};
const portrait=(x,w)=>{const g=x.createLinearGradient(0,0,0,w);g.addColorStop(0,'#2a1f18');g.addColorStop(1,'#0c0806');x.fillStyle=g;x.fillRect(0,0,w,w);x.fillStyle='#16100c';x.beginPath();x.ellipse(128,110,60,78,0,0,7);x.fill();x.fillStyle='#d4c8b6';x.beginPath();x.ellipse(128,122,40,54,0,0,7);x.fill();x.fillStyle='#0a0606';x.beginPath();x.ellipse(110,114,7,10,0,0,7);x.ellipse(146,114,7,10,0,0,7);x.fill();x.fillRect(120,150,16,3);x.fillStyle='#4a0f14';x.fillRect(70,190,116,66);x.fillStyle='#0a0606';x.beginPath();x.ellipse(128,80,46,26,0,Math.PI,0);x.fill();stain(x,w,6,'0,0,0',.5)};
const pond=(x,w)=>{const g=x.createLinearGradient(0,0,0,w);g.addColorStop(0,'#2c3a52');g.addColorStop(.55,'#5a6a7a');g.addColorStop(.56,'#0e1418');g.addColorStop(1,'#04080a');x.fillStyle=g;x.fillRect(0,0,w,w);x.fillStyle='#050a08';for(let i=0;i<10;i++){x.beginPath();x.moveTo(i*28,142);x.lineTo(i*28+12,142-rnd(40,90));x.lineTo(i*28+24,142);x.fill()}x.fillStyle='rgba(255,255,240,.35)';x.beginPath();x.arc(190,60,14,0,7);x.fill();speck(x,w,200,.3)};
frame(14.3,1.6,6.89,Math.PI,.6,.8,portrait);frame(3.8,1.6,6.89,Math.PI,.7,.5,pond);frame(10.4,1.6,7.11,0,.7,.5,pond);frame(13,1.75,.11,0,.5,.7,portrait);
const tvM=new THREE.MeshBasicMaterial({color:0x2a4a7a}),tv=new THREE.Mesh(new THREE.PlaneGeometry(1,.55),tvM);tv.position.set(15,.78,7.365);scene.add(tv);
/* lights */
scene.add(new THREE.AmbientLight(0x56607e,.5));scene.add(new THREE.HemisphereLight(0x3a4a68,0x1a1410,.3));
const pl=(c,i,d,x,y,z)=>{const l=new THREE.PointLight(c,i,d,1.6);l.position.set(x,y,z);scene.add(l);return l};
const bulb=(x,y,z)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(.07,8,8),new THREE.MeshBasicMaterial({color:0xffc080}));s.position.set(x,y,z);scene.add(s)};
const LB=pl(0xffb070,.9,5.5,3.3,.95,.4),LC=pl(0xffa860,1.2,7.5,6,2.2,6),LC2=pl(0xffa860,1.2,7.5,16,2.2,6),LT=pl(0x6aa0ff,.9,5.5,15,1,8.1),LD=pl(0xff2222,.8,4,20.5,1.6,13.2);
bulb(3.3,.75,.4);bulb(6,2.35,6);bulb(16,2.35,6);
const SPI=4,spot=new THREE.SpotLight(0xfff0d8,0,16,Math.PI/6,.55,1.2);spot.position.set(.12,-.1,0);spot.target.position.set(0,0,-8);
spot.castShadow=true;spot.shadow.mapSize.set(1024,1024);spot.shadow.camera.near=.15;spot.shadow.camera.far=16;spot.shadow.bias=-.0005;spot.shadow.normalBias=.02;spot.shadow.radius=3;cam.add(spot,spot.target);
const shaftG=new THREE.ConeGeometry(2.4,9,28,1,true);shaftG.translate(0,-4.5,0);shaftG.rotateX(Math.PI/2);
const shaft=new THREE.Mesh(shaftG,new THREE.MeshBasicMaterial({map:TEX(CNV((x,w)=>{const g=x.createLinearGradient(0,0,0,w);g.addColorStop(0,'#000');g.addColorStop(.12,'#777');g.addColorStop(.55,'#2c2c2c');g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,w,w)},64),0),color:0xfff0d0,transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));
shaft.position.set(.12,-.1,0);shaft.visible=false;shaft.frustumCulled=false;cam.add(shaft);
const DN=320,dustG=new THREE.BufferGeometry(),dp=new Float32Array(DN*3);for(let i=0;i<DN;i++){dp[i*3]=R()*22;dp[i*3+1]=rnd(.3,2.4);dp[i*3+2]=R()*14}dustG.setAttribute('position',new THREE.BufferAttribute(dp,3));
const dust=new THREE.Points(dustG,new THREE.PointsMaterial({size:.03,color:0xc8b898,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending}));dust.frustumCulled=false;scene.add(dust);
function fx(dt){const on=lon&&HV.l&&p.bat>0;shaft.visible=on&&U.ca.value>0;if(shaft.visible)shaft.material.opacity=.1*Math.min(1,spot.intensity/SPI);
 if(dust.visible){const a=dustG.attributes.position,A=a.array;for(let i=0;i<A.length;i+=3){A[i]+=Math.sin(T*.4+i)*.0015;A[i+1]+=Math.cos(T*.3+i*1.7)*.0012;A[i+2]+=Math.sin(T*.35+i*.7)*.0015}a.needsUpdate=true}}
function applyQ(){const q=+S.q;SH.forEach(m=>m.castShadow=q>0);dust.visible=q>0;U.bl.value=[0,.6,1][q]||0;U.ca.value=q>1?1:0}
/* 玄関ドア */
const lockM=new THREE.MeshBasicMaterial({color:0x661515});
const dr=new THREE.Mesh(new THREE.BoxGeometry(1.5,2.2,.1),mat({map:TEX(CNV((x,w)=>{x.fillStyle='#5a3418';x.fillRect(0,0,w,w);x.strokeStyle='#26140a';x.lineWidth=6;x.strokeRect(24,24,208,100);x.strokeRect(24,140,208,100);speck(x,w,200,.3);stain(x,w,6,'0,0,0',.4)},256)),color:0xffe0c0,shininess:20}));dr.position.set(20.5,1.1,13.93);dr.castShadow=dr.receiveShadow=true;scene.add(dr);
const dl=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),lockM);dl.position.set(19.6,1.1,13.85);scene.add(dl);
/* items */
const glT=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),q=x.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,'rgba(255,255,255,.9)');q.addColorStop(.3,'rgba(255,255,255,.25)');q.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=q;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const items=[];
function mk(kind,x,y,z,col,fn){const m=new THREE.Group(),mt=mat({color:col,emissive:col,emissiveIntensity:.5,shininess:80}),C=THREE.CylinderGeometry,
 B=(g,px,py,pz,rx)=>{const o=new THREE.Mesh(g,mt);o.position.set(px,py,pz);o.rotation.x=rx||0;m.add(o)};
 if(kind=='l'){B(new C(.03,.025,.22,10),0,0,0,Math.PI/2);B(new C(.055,.03,.07,10),0,0,-.14,Math.PI/2)}
 else if(kind=='b'){B(new C(.03,.03,.11,10),0,0,0);B(new C(.012,.012,.02,6),0,.065,0)}
 else{B(new THREE.TorusGeometry(.07,.02,8,16),0,.12,0);B(new THREE.BoxGeometry(.03,.22,.03),0,0,0);B(new THREE.BoxGeometry(.08,.03,.03),.04,-.08,0)}
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glT,color:col,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));sp.scale.set(.7,.7,1);m.add(sp);
 m.scale.setScalar(1.5);m.position.set(x,y,z);scene.add(m);items.push({m,y,fn})}
mk('l',6.5,1.15,13.65,0xfff2c0,()=>{HV.l=1;lon=1;p.bat=60;msg('懐中電灯を手に入れた ― '+(TOUCH?'ライトボタン':'[E]')+'で点灯／消灯');pick()});
/* 鍵: 子供部屋 / 和室 / 浴室 / 書斎 / 納戸 / リビング */
[[9.9,1.1,1.2],[18.5,.8,2.4],[.6,.9,12.9],[12.6,1.1,.8],[17.6,.95,10.9],[14.5,.75,11]].forEach(q=>mk('k',q[0],q[1],q[2],0xe0b040,()=>{HV.k++;msg(HV.k>=NK?'鍵が全部揃った。玄関へ急げ！':`鍵を手に入れた (${HV.k}/${NK})`);if(HV.k>=NK){lockM.color.setHex(0x33ff66);LD.color.setHex(0x33ff88)}pick()}));
/* 電池 */
[[21.65,1.4,9],[8.2,.85,.5],[.5,1.35,8.5],[13.5,1.1,.8],[6.5,1.0,10.6]].forEach(q=>mk('b',q[0],q[1],q[2],0x66ffa0,()=>{p.bat=Math.min(100,p.bat+45);msg('電池を手に入れた (+45%)');pick()}));
/* ghost */
const gh=new THREE.Group(),gm=mat({color:0xdfe4ee,emissive:0x1a2030,transparent:true,opacity:.92,shininess:40}),hairM=mat({color:0x060606}),eyeM=new THREE.MeshBasicMaterial({color:0x080808}),bkM=new THREE.MeshBasicMaterial({color:0});
const ga=(geo,m,x,y,z,sc,rx)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(sc)o.scale.set(...sc);if(rx)o.rotation.x=rx;o.castShadow=true;SH.push(o);gh.add(o)};
ga(new THREE.ConeGeometry(.5,1.5,16),gm,0,.85,0);ga(new THREE.SphereGeometry(.22,16,12),gm,0,1.72,0);
ga(new THREE.SphereGeometry(.26,14,12),hairM,0,1.72,-.1,[1,1.1,1]);ga(new THREE.CylinderGeometry(.22,.12,.9,12),hairM,0,1.3,-.16);
ga(new THREE.SphereGeometry(.035,8,8),eyeM,-.075,1.74,.205);ga(new THREE.SphereGeometry(.035,8,8),eyeM,.075,1.74,.205);
ga(new THREE.SphereGeometry(.05,8,8),bkM,0,1.62,.2,[1,2,.5]);
[-.28,.28].forEach(x=>ga(new THREE.CylinderGeometry(.035,.03,.8,8),gm,x,1.15,.3,0,Math.PI/2.4));
scene.add(gh);
/* ghost navigation grid (0.25m / avoids walls AND furniture) */
const NC=.25,NX=88,NZ=56,NAV=new Uint8Array(NX*NZ),FREE=[],SOL=AB.concat(WL);
for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const x=(i+.5)*NC,z=(j+.5)*NC;if(!SOL.some(b=>Math.hypot(Math.max(b[0]-x,0,x-b[2]),Math.max(b[1]-z,0,z-b[3]))<.42)){NAV[j*NX+i]=1;FREE.push([i,j])}}
const ci=x=>Math.min(NX-1,Math.max(0,x/NC|0)),cj=z=>Math.min(NZ-1,Math.max(0,z/NC|0));
function snap(x,z){const i=ci(x),j=cj(z);if(NAV[j*NX+i])return[i,j];const c=[];for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){const u=i+a,v=j+b;if(u>=0&&v>=0&&u<NX&&v<NZ&&NAV[v*NX+u])c.push([u,v,a*a+b*b])}
 c.sort((m,n)=>m[2]-n[2]);return c.find(q=>los(x,z,(q[0]+.5)*NC,(q[1]+.5)*NC))||c[0]||null}
function nxt(sx,sz,tx,tz){const a=snap(sx,sz),b=snap(tx,tz);if(!a||!b)return null;const s=a[1]*NX+a[0],t=b[1]*NX+b[0],W_=c=>[(c%NX+.5)*NC,((c/NX|0)+.5)*NC];if(s==t)return[W_(t)];
 const P=new Int16Array(NX*NZ).fill(-1),q=[s];P[s]=s;
 for(let h=0;h<q.length;h++){const c=q[h];if(c==t)break;const x=c%NX,y=(c/NX)|0;
  for(const d of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=NX||ny>=NZ)continue;const k=ny*NX+nx;if(NAV[k]&&P[k]<0){P[k]=c;q.push(k)}}}
 if(P[t]<0)return null;const out=[];for(let k=t;k!=s;k=P[k])out.push(W_(k));return out.reverse()}

/* audio */
let AC,MG,NB;
function aInit(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=S.vol;MG.connect(AC.destination);
 NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R()*2-1;
 [55,58.5,82].forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=i==2?'triangle':'sine';o.frequency.value=f;g.gain.value=i==2?.025:.1;o.connect(g);g.connect(MG);o.start()})}catch(e){AC=null}}
function tone(f,f2,d,ty,v){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=ty;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(MG);o.start(t);o.stop(t+d)}
function nz(d,v,fc){if(!AC)return;const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain(),t=AC.currentTime;s.buffer=NB;f.type='lowpass';f.frequency.value=fc;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(MG);s.start(t);s.stop(t+d)}


/* ===== state / logic ===== */
const p={x:3,z:2.8,ey:1.6,cy:1.6,sl:0,sdr:[0,0],stm:100,tired:0,run:0,cr:0,cl:0,bt:0,ba:0,rl:0,stp:0,ck:6,bat:0};
const G={x:19,z:3.6,chase:0,tg:null,ry:0,al:0,hb:0,dT:0,aw:0,lk:null,pa:null,nt:0},HV={l:0,k:0},K={};
let yaw=Math.PI,pitch=0,st=0,fb=0,lon=0,el=0,T=0,mdx=0,mdy=0,bs=0,bx=1,by=0,mc=-9,mt,tries=0;
const hit=(x,z,r)=>{for(const L of[WL,AB])for(const b of L){const dx=Math.max(b[0]-x,0,x-b[2]),dz=Math.max(b[1]-z,0,z-b[3]);if(dx*dx+dz*dz<r*r)return 1}return 0};
const los=(ax,az,qx,qz)=>{const n=Math.ceil(Math.hypot(qx-ax,qz-az)/.15);for(let i=1;i<n;i++){const t=i/n,x=ax+(qx-ax)*t,z=az+(qz-az)*t;if(WL.some(b=>x>b[0]&&x<b[2]&&z>b[1]&&z<b[3]))return 0}return 1};
function msg(t,ms=3800){const e=$('msg');e.textContent=t;e.style.opacity=1;clearTimeout(mt);mt=setTimeout(()=>e.style.opacity=0,ms)}
function msgT(t){if(T-mc>4){mc=T;msg(t,2500)}}
function ui(){$('ob').textContent='目的: '+(!HV.l?'懐中電灯を探せ':HV.k<NK?`鍵を探せ (${HV.k}/${NK})`:'玄関の扉を開けて脱出しろ');
 $('inv').textContent=[HV.l?'［ライト］':'',HV.k?`［鍵 ${HV.k}/${NK}］`:''].join(' ')}
const pick=()=>{tone(660,1100,.35,'sine',.3);ui()};
const fmt=s=>Math.floor(s/60)+'分'+Math.floor(s%60)+'秒';
function reset(){Object.assign(p,{x:3,z:2.8,ey:1.6,cy:1.6,sl:0,stm:100,tired:0,rl:0,bat:0});yaw=Math.PI;pitch=0;HV.l=0;HV.k=0;lon=0;el=0;
 items.forEach(i=>{i.got=0;i.m.visible=true});Object.assign(G,{x:19,z:3.6,chase:0,tg:null,al:0,dT:0,aw:0,lk:null,pa:null,nt:0});lockM.color.setHex(0x661515);LD.color.setHex(0xff2222);ui()}
function endScr(t,d){$('et').textContent=t;$('ed').textContent=d;$('end').hidden=false}
function die(){st=3;document.exitPointerLock();tone(900,180,1.3,'sawtooth',.5);nz(1.3,.7,5000);setTimeout(()=>endScr('喰われた…','生存時間 '+fmt(el)),1100)}
function win(){st=4;document.exitPointerLock();[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,f,.8,'sine',.3),i*220));endScr('脱出成功','重い扉が開き、夜の空気が流れ込む。生還タイム '+fmt(el))}
function tryF(){if(Math.hypot(p.x-20.5,p.z-13)<2.3){if(HV.k>=NK)win();else msg(`鍵が足りない (${HV.k}/${NK})`)}}
const rndCell=()=>{if(R()<.1)return[p.x,p.z];const c=FREE[R()*FREE.length|0];return[(c[0]+.5)*NC,(c[1]+.5)*NC]};
function ghostAnim(){gh.position.set(G.x,.1+Math.sin(T*1.8)*.08,G.z);gh.rotation.set(0,G.ry,Math.sin(T*2.3)*.05);eyeM.color.setHex(G.chase>0?0xff2000:0x080808)}
const GR=.38;
function pushOut(o,r){for(let k=0;k<2;k++)for(const L of[WL,AB])for(const b of L){const cx=Math.max(b[0],Math.min(o.x,b[2])),cz=Math.max(b[1],Math.min(o.z,b[3])),dx=o.x-cx,dz=o.z-cz,dd=dx*dx+dz*dz;
 if(dd>=r*r)continue;
 if(dd>1e-9){const m=Math.sqrt(dd),f=(r-m)/m;o.x+=dx*f;o.z+=dz*f}
 else{const l=o.x-b[0],rr=b[2]-o.x,u=o.z-b[1],dn=b[3]-o.z,m=Math.min(l,rr,u,dn);if(m==l)o.x=b[0]-r;else if(m==rr)o.x=b[2]+r;else if(m==u)o.z=b[1]-r;else o.z=b[3]+r}}}
const clr=(ax,az,bx,bz)=>{const n=Math.ceil(Math.hypot(bx-ax,bz-az)/.15);for(let i=1;i<=n;i++){const t=i/n;if(hit(ax+(bx-ax)*t,az+(bz-az)*t,GR))return 0}return 1};
function ghostUp(dt){
 const dx=p.x-G.x,dz=p.z-G.z,d=Math.hypot(dx,dz),cosA=d>.01?(dx*Math.sin(G.ry)+dz*Math.cos(G.ry))/d:1,wall=los(G.x,G.z,p.x,p.z),lit=lon&&HV.l&&p.bat>0;
 /* 見える範囲: 暗いと狭い・しゃがむと更に狭い・背後は見えない / 聞こえる範囲: 走る・滑るだけ */
 const sR=(lit?9:4.5)*(p.cr?.55:1),hR=p.sl>0?6:p.run?7:(p.mv&&!p.cr)?2.2:0;
 const seen=wall&&d<sR&&(cosA>.42||d<1.6),heard=d<hR&&(wall||d<hR*.5);
 let s=0;if(seen)s=1.5*(1-d/sR)+.25;if(heard)s=Math.max(s,.9*(1-d/hR)+.2);
 G.aw=Math.max(0,Math.min(1,G.aw+(s>0?s:-.35)*dt));
 if(s>0)G.lk=[p.x,p.z];
 if(G.aw>=1){if(G.chase<=0&&!G.al){G.al=1;tone(110,55,.9,'sawtooth',.3)}G.chase=Math.max(G.chase,4.5)}
 G.chase=Math.max(0,G.chase-dt);if(G.chase<=0)G.al=0;
 G.nt-=dt;let tx=null,tz=0,spd=.55;
 const goto_=(X,Z)=>{if(clr(G.x,G.z,X,Z)){tx=X;tz=Z;G.pa=null;return}
  if(G.nt<=0||!G.pa||!G.pa.length){G.pa=nxt(G.x,G.z,X,Z);G.nt=.25}
  if(G.pa&&G.pa.length){let k=0;for(let i=Math.min(G.pa.length-1,36);i>=0;i--)if(clr(G.x,G.z,G.pa[i][0],G.pa[i][1])){k=i;break}
   tx=G.pa[k][0];tz=G.pa[k][1];if(Math.hypot(tx-G.x,tz-G.z)<.2)G.pa.splice(0,k+1)}};
 if(G.chase>0){spd=1.2;const q=seen&&clr(G.x,G.z,p.x,p.z)?[p.x,p.z]:G.lk;
  if(q){if(!seen&&Math.hypot(q[0]-G.x,q[1]-G.z)<.5)G.chase=Math.min(G.chase,1.2);else goto_(q[0],q[1])}}
 else{if(!G.tg||Math.hypot(G.tg[0]-G.x,G.tg[1]-G.z)<.6){G.tg=rndCell();G.pa=null}goto_(G.tg[0],G.tg[1]);if(tx==null)G.tg=null}
 if(tx!=null){const ex=tx-G.x,ez=tz-G.z,l=Math.hypot(ex,ez);if(l>.02){const m=Math.min(spd*dt,l);G.x+=ex/l*m;G.z+=ez/l*m;let da=Math.atan2(ex,ez)-G.ry;da=Math.atan2(Math.sin(da),Math.cos(da));G.ry+=da*Math.min(1,dt*7)}}
 pushOut(G,GR);
 G.dT=G.chase>0?Math.min(1,Math.max(0,(10-d)/7)):Math.min(.5,G.aw*.5);
 G.hb-=dt;if((G.chase>0||G.aw>.4)&&d<10&&G.hb<=0){G.hb=.35+d/10*.9;tone(60,38,.16,'sine',.7);setTimeout(()=>tone(55,35,.16,'sine',.5),170)}
 const f=d<6&&R()<.4*(1-d/7)?.1:1;spot.intensity=HV.l&&lon&&p.bat>0?SPI*f:0;
 ghostAnim();if(d<.8&&st==1)die()}
function update(dt){
 el+=dt;
 const sh=K.ShiftLeft||K.ShiftRight,ax=(K.KeyD?1:0)-(K.KeyA?1:0)+J.x,az=(K.KeyW?1:0)-(K.KeyS?1:0)-J.y,mv=ax||az,sn=Math.sin(yaw),cs=Math.cos(yaw);let dx=0,dz=0;
 if(mv){const l=Math.max(1,Math.hypot(ax,az));dx=(-sn*az+cs*ax)/l;dz=(-cs*az-sn*ax)/l}
 const cp=K.KeyC&&!p.cl;p.cl=!!K.KeyC;
 if(cp&&sh&&mv&&p.sl<=0&&p.stm>12){p.sl=.85;p.sdr=[dx/Math.hypot(dx,dz),dz/Math.hypot(dx,dz)];p.stm-=12;tone(140,50,.6,'sine',.2);nz(.7,.25,700)}
 const cr=!!K.KeyC&&p.sl<=0,run=!!(sh&&mv&&!cr&&p.sl<=0&&p.stm>0&&!p.tired);
 let spd=cr?1.1:run?4.2:2.1;
 if(p.sl>0){p.sl-=dt;spd=1.5+5.5*Math.max(p.sl,0)/.85;dx=p.sdr[0];dz=p.sdr[1]}
 if(run)p.stm-=22*dt;else if(p.sl<=0)p.stm+=(mv?9:18)*dt;
 p.stm=Math.max(0,Math.min(100,p.stm));if(p.stm<=0)p.tired=1;else if(p.stm>30)p.tired=0;
 p.run=run;p.cr=cr;
 const mvg=mv||p.sl>0;p.mv=!!mvg;
 if(mvg){const sx=dx*spd*dt,sz=dz*spd*dt;const n=Math.max(1,Math.ceil(Math.hypot(sx,sz)/.08));for(let i=0;i<n;i++){if(!hit(p.x+sx/n,p.z,.3))p.x+=sx/n;if(!hit(p.x,p.z+sz/n,.3))p.z+=sz/n}pushOut(p,.3);
  p.bt+=dt*spd*3;p.stp+=spd*dt;
  if(p.sl<=0&&p.stp>(run?1.8:1.4)){p.stp=0;const v=cr?.06:run?.4:.22;nz(.09,v,run?900:500);tone(80,45,.12,'sine',v)}}
 const k=Math.min(1,dt*8);p.ba+=((mvg&&p.sl<=0?1:0)-p.ba)*k;
 p.ey+=((p.sl>0?.6:cr?.95:1.6)-p.ey)*Math.min(1,dt*10);
 p.cy=p.ey+Math.sin(p.bt)*.03*p.ba*(run?1.7:1);p.rl+=((p.sl>0?.06:0)-p.rl)*k;
 if(lon&&HV.l&&p.bat>0){p.bat=Math.max(0,p.bat-.8*dt);if(!p.bat)msg('電池が切れた…')}
 ghostUp(dt);
 for(const it of items){if(it.got)continue;it.m.rotation.y+=dt*1.6;it.m.position.y=it.y+Math.sin(T*2.2)*.04;
  if(Math.hypot(p.x-it.m.position.x,p.z-it.m.position.z)<1.4){it.got=1;it.m.visible=false;it.fn()}}
 const nd=Math.hypot(p.x-20.5,p.z-13)<2.3,pr=$('pr');pr.style.opacity=nd?1:0;if(nd)pr.textContent=HV.k>=NK?(TOUCH?'「調べる」ボタンで扉を開ける':'[F] 扉を開ける'):`${TOUCH?'':'[F] '}鍵が足りない (${HV.k}/${NK})`;
 p.ck-=dt;if(p.ck<0){p.ck=9+R()*15;tone(260+R()*120,90,1.4,'sawtooth',.05)}
 $('stf').style.width=p.stm+'%';$('btf').style.width=p.bat+'%'}
function post(dt){
 const ang=Math.hypot(mdx,mdy)*.0022*S.sens/Math.max(dt,.004),t=Math.min(1,Math.max(0,(ang-3.5)/7.5)),tt=t*t;
 bs+=(tt-bs)*Math.min(1,dt*(tt>bs?30:12));
 if(mdx||mdy){const l=Math.hypot(mdx,mdy);bx=mdx/l;by=mdy/l}
 const L=.05*S.blur*bs;U.v.value.set(bx*L,-by*L*W/H_);mdx=mdy=0;
 U.tm.value=(T*37)%100;U.asp.value=W/H_;U.b.value=S.bri;
 U.dg.value+=((st==3?1:G.dT)*(1+Math.sin(T*9)*.12)-U.dg.value)*Math.min(1,dt*4)}

/* ===== loop ===== */
let last=performance.now(),fa=0,fc=0;
function loop(now){requestAnimationFrame(loop);
 if(S.fps&&now-last<1000/S.fps-1)return;
 const dt=Math.min((now-last)/1000,.05);last=now;T+=dt;
 fc++;fa+=dt;if(fa>=.5){$('fps').textContent=Math.round(fc/fa)+' FPS';fc=0;fa=0}
 const tsh=TOUCH&&st==1;if(tsh!==tcv){tcv=tsh;$('tc').hidden=!tsh}
 if(st==1)update(dt);
 if(st==3){let d=Math.atan2(-(G.x-p.x),-(G.z-p.z))-yaw;d=Math.atan2(Math.sin(d),Math.cos(d));yaw+=d*Math.min(1,dt*9);pitch+=(.1-pitch)*Math.min(1,dt*6);ghostAnim()}
 LB.intensity=.8+Math.sin(T*8)*.08+R()*.1;LC.intensity=1.1+Math.sin(T*6)*.1+R()*.15-(G.dT>.5&&R()<.3?.9:0);LC2.intensity=LC.intensity*.9;LT.intensity=.7+R()*.5;tvM.color.setRGB(.15+R()*.1,.28+R()*.12,.5+R()*.2);
 fx(dt);cam.position.set(p.x+(st==3?(R()-.5)*.05:0),p.cy,p.z);cam.rotation.set(pitch,yaw,p.rl);
 post(dt);
 rd.setRenderTarget(rt);rd.render(scene,cam);rd.setRenderTarget(null);rd.render(pq,pc)}


/* ===== touch / mobile ===== */
if(S.touch===undefined){S.touch=matchMedia('(pointer:coarse)').matches;try{if(S.touch&&!localStorage.getItem('yk1')){S.res=.75;S.q=1}}catch(e){}}
if(S.q===undefined)S.q=2;
if(S.rot===undefined)S.rot=true;
let TOUCH=!!S.touch,tcv=null;const J={x:0,y:0};
const key=(c,d)=>dispatchEvent(new KeyboardEvent(d?'keydown':'keyup',{code:c}));
const fs=()=>{try{const e=document.documentElement,q=(e.requestFullscreen||e.webkitRequestFullscreen||(()=>0)).call(e);q&&q.catch&&q.catch(()=>{});screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})}catch(e){}};
cv.addEventListener('mousedown',()=>{if(st==1&&!TOUCH&&document.pointerLockElement!=cv)lock()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&st==1)pause()});
(()=>{
 const joy=$('joy'),kn=$('knob'),lp=$('lookpad');let jid=null,lid=null,lx=0,ly=0;
 const cap=(el,e)=>{try{el.setPointerCapture(e.pointerId)}catch(_){}};
 const jm=e=>{const r=joy.getBoundingClientRect(),h=r.width/2,m=h*.8;let vx=e.clientX-(r.left+h),vy=e.clientY-(r.top+h);if(ROT){const t=vx;vx=vy;vy=-t}
  const l2=Math.hypot(vx,vy);if(l2>m){vx*=m/l2;vy*=m/l2}
  kn.style.transform=`translate(${vx}px,${vy}px)`;const x=vx/m,y=vy/m,d=Math.hypot(x,y)<.15;J.x=d?0:x;J.y=d?0:y};
 joy.onpointerdown=e=>{e.preventDefault();jid=e.pointerId;cap(joy,e);jm(e)};
 joy.onpointermove=e=>{if(e.pointerId==jid)jm(e)};
 joy.onpointerup=joy.onpointercancel=e=>{if(e.pointerId==jid){jid=null;J.x=J.y=0;kn.style.transform=''}};
 lp.onpointerdown=e=>{e.preventDefault();lid=e.pointerId;cap(lp,e);lx=e.clientX;ly=e.clientY};
 lp.onpointermove=e=>{if(e.pointerId!=lid||st!=1)return;let dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;if(ROT){const t=dx;dx=dy;dy=-t}const a=.0022*S.sens*2.2;
  yaw-=dx*a;pitch=Math.max(-1.45,Math.min(1.45,pitch-dy*a));mdx+=dx*2.2;mdy+=dy*2.2};
 lp.onpointerup=lp.onpointercancel=e=>{if(e.pointerId==lid)lid=null};
 let sp=0,tc=0;const tap=(id,f)=>{$(id).onpointerdown=e=>{e.preventDefault();f()}};
 tap('tb-f',()=>{key('KeyF',1);key('KeyF',0)});
 tap('tb-e',()=>{key('KeyE',1);key('KeyE',0)});
 tap('tb-d',()=>{sp=!sp;key('ShiftLeft',sp);$('tb-d').classList.toggle('on',sp)});
 tap('tb-c',()=>{tc=!tc;key('KeyC',tc);$('tb-c').classList.toggle('on',tc)});
 tap('tb-s',()=>{key('KeyC',0);setTimeout(()=>{key('ShiftLeft',1);key('KeyC',1)},50);setTimeout(()=>{key('KeyC',tc);key('ShiftLeft',sp)},300)});
 tap('tb-menu',()=>pause());
 $('tc').oncontextmenu=e=>e.preventDefault();
})();

/* 縦持ちのときは画面全体を90度回転して横画面でプレイできるようにする */
function layoutRot(){const w=$('wrap'),r=!!(TOUCH&&S.rot&&innerHeight>innerWidth*1.1);ROT=r;document.body.classList.toggle('rot',r);if(r){w.style.width=innerHeight+'px';w.style.height=innerWidth+'px'}else{w.style.width=w.style.height=''}}
addEventListener('orientationchange',()=>setTimeout(fit,300));

/* menu / settings / input */
const OPT=[['sens','マウス感度',.2,3,.05],['fov','視野角 (FOV)',60,110,1],['blur','モーションブラー',0,2,.05],['bri','明るさ',.5,2,.05],['vol','音量',0,1,.05],['res','描画解像度',.5,1,.05]];
$('set').innerHTML='<h2>設定</h2>'+OPT.map(o=>`<label><span>${o[1]}</span><input type=range id=s_${o[0]} min=${o[2]} max=${o[3]} step=${o[4]}><output id=o_${o[0]}></output></label>`).join('')+'<label><span>FPS上限</span><select id=s_fps>'+[[0,'無制限'],[30,'30'],[60,'60'],[90,'90'],[144,'144']].map(a=>`<option value=${a[0]}>${a[1]}`).join('')+'</select></label><label><span>画質</span><select id=s_q><option value=0>低<option value=1>中<option value=2>高</select></label><label><span>FPS表示</span><input type=checkbox id=s_showfps></label><label><span>タッチ操作</span><input type=checkbox id=s_touch></label><label><span>縦持ち時は横表示</span><input type=checkbox id=s_rot></label><button id=bkb>戻る</button>';
function apply(){if(MG)MG.gain.value=S.vol;$('fps').hidden=!S.showfps;applyQ();TOUCH=!!S.touch;document.body.classList.toggle('touch',TOUCH);fit()}
[...OPT.map(o=>o[0]),'fps','q','showfps','touch','rot'].forEach(k=>{const e=$('s_'+k),o=$('o_'+k),sync=()=>{if(o)o.textContent=S[k]};
 if(e.type=='checkbox')e.checked=!!S[k];else e.value=S[k];sync();
 e.oninput=e.onchange=()=>{S[k]=e.type=='checkbox'?e.checked:+e.value;sync();apply();save()}});
const back=()=>{$('set').hidden=true;$('mn').hidden=false};
$('bkb').onclick=back;$('stb').onclick=()=>{$('mn').hidden=true;$('set').hidden=false};
function pause(){if(st!=1)return;st=2;$('ttl').textContent='一時停止';$('go').textContent='再開';$('mn').hidden=false;$('set').hidden=true;$('ov').hidden=false}
function resume(){st=1;$('ov').hidden=true;if(!el)msg('…家の中は静まり返っている。 出口を探さなければ。',5000)}
const lock=()=>{try{const q=cv.requestPointerLock();q&&q.catch&&q.catch(()=>{})}catch(e){}};
const go=()=>{aInit();if(AC&&AC.state=='suspended')AC.resume();if(TOUCH){fs();resume()}else{lock();setTimeout(()=>{if(st!=1&&!document.pointerLockElement){fb=1;resume()}},1600)}};
$('go').onclick=go;
$('rt').onclick=()=>{reset();$('end').hidden=true;go()};
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement==cv){tries=0;fb=0;resume()}else if(st==1&&!fb)pause()});
document.addEventListener('pointerlockerror',()=>{if(tries++<1)setTimeout(lock,1300);else{fb=1;resume();msg('視点操作: 画面をドラッグ',5000)}});
addEventListener('mousemove',e=>{if(st==1&&(document.pointerLockElement==cv||(fb&&e.buttons&1))){if(Math.abs(e.movementX)>400||Math.abs(e.movementY)>400)return;const a=.0022*S.sens;yaw-=e.movementX*a;pitch=Math.max(-1.45,Math.min(1.45,pitch-e.movementY*a));mdx+=e.movementX;mdy+=e.movementY}});
addEventListener('keydown',e=>{
 if(e.code=='Escape'){if(!$('set').hidden)back();else if(st==1&&document.pointerLockElement!=cv)pause();return}
 K[e.code]=1;if(e.code=='KeyF'&&!e.repeat&&st==1)tryF();
 if(e.code=='KeyE'&&!e.repeat&&st==1){if(!HV.l)msg('ライトを持っていない');else{lon=!lon;nz(.05,.3,3000)}}});
addEventListener('keyup',e=>{K[e.code]=0});
addEventListener('blur',()=>{for(const k in K)K[k]=0});
apply();ui();requestAnimationFrame(loop);
