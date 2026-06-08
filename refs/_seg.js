globalThis.segment=async function(sheet,outDir,opts){
  const img=await readImage(sheet);const W=img.width,H=img.height;const c=createCanvas(W,H),ctx=c.getContext('2d');ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,W,H).data;
  let rs=[],gs=[],bs=[];for(let x=0;x<W;x+=7){for(const y of[2,H-3]){const i=(y*W+x)*4;rs.push(data[i]);gs.push(data[i+1]);bs.push(data[i+2]);}}
  const med=a=>{a.sort((p,q)=>p-q);return a[a.length>>1];};const nR=med(rs),nG=med(gs),nB=med(bs);const nLum=0.299*nR+0.587*nG+0.114*nB;
  const lumA=new Float32Array(W*H),warmA=new Float32Array(W*H),mask=new Uint8Array(W*H);
  for(let p=0,i=0;p<W*H;p++,i+=4){const r=data[i],g=data[i+1],b=data[i+2];const lum=0.299*r+0.587*g+0.114*b;const warm=r-b;lumA[p]=lum;warmA[p]=warm;const over=lum-nLum;if((warm>(opts.warmT??6)&&over>(opts.over??14))||lum>(opts.brightL??110))mask[p]=1;}
  const R=opts.dilate??5;const dil=m=>{const t=new Uint8Array(W*H);for(let y=0;y<H;y++){const row=y*W;for(let x=0;x<W;x++){let v=0;for(let k=-R;k<=R;k++){const xx=x+k;if(xx>=0&&xx<W&&m[row+xx]){v=1;break;}}t[row+x]=v;}}const o=new Uint8Array(W*H);for(let x=0;x<W;x++){for(let y=0;y<H;y++){let v=0;for(let k=-R;k<=R;k++){const yy=y+k;if(yy>=0&&yy<H&&t[yy*W+x]){v=1;break;}}o[y*W+x]=v;}}return o;};
  const E=opts.erode??0;const ero=m=>{if(!E)return m;const t=new Uint8Array(W*H);for(let y=0;y<H;y++){const row=y*W;for(let x=0;x<W;x++){let v=1;for(let k=-E;k<=E;k++){const xx=x+k;if(xx<0||xx>=W||!m[row+xx]){v=0;break;}}t[row+x]=v;}}const o=new Uint8Array(W*H);for(let x=0;x<W;x++){for(let y=0;y<H;y++){let v=1;for(let k=-E;k<=E;k++){const yy=y+k;if(yy<0||yy>=H||!t[yy*W+x]){v=0;break;}}o[y*W+x]=v;}}return o;};
  const dmask=dil(ero(mask));const lab=new Int32Array(W*H);let cur=0;const stack=new Int32Array(W*H);const comps=[];
  for(let p=0;p<W*H;p++){if(dmask[p]&&!lab[p]){cur++;let sp=0;stack[sp++]=p;lab[p]=cur;let minx=W,miny=H,maxx=0,maxy=0,area=0,maxL=0,fill=0;
    while(sp){const q=stack[--sp];const x=q%W,y=(q/W)|0;area++;if(mask[q])fill++;if(x<minx)minx=x;if(x>maxx)maxx=x;if(y<miny)miny=y;if(y>maxy)maxy=y;if(lumA[q]>maxL)maxL=lumA[q];
      if(x>0&&dmask[q-1]&&!lab[q-1]){lab[q-1]=cur;stack[sp++]=q-1;}if(x<W-1&&dmask[q+1]&&!lab[q+1]){lab[q+1]=cur;stack[sp++]=q+1;}if(y>0&&dmask[q-W]&&!lab[q-W]){lab[q-W]=cur;stack[sp++]=q-W;}if(y<H-1&&dmask[q+W]&&!lab[q+W]){lab[q+W]=cur;stack[sp++]=q+W;}}
    const w=maxx-minx+1,h=maxy-miny+1;comps.push({id:cur,minx,miny,maxx,maxy,w,h,area,maxL,fillR:fill/(w*h),minDim:Math.min(w,h)});}}
  const o=opts;let keep=comps.filter(k=>k.area>(o.minArea??1600)&&k.minDim>=(o.minDim??36)&&(o.noFill?true:k.fillR>=(o.fillR??0.30))&&k.maxL>(o.minMaxL??150)&&k.miny>H*(o.top??0.04)&&k.miny<H*(o.bot??0.90)&&(o.maxAreaR?k.area<W*H*o.maxAreaR:true)&&k.w<W*0.93&&k.h<H*0.93);
  keep.sort((a,b)=>(Math.abs(a.miny-b.miny)>40?a.miny-b.miny:a.minx-b.minx));
  const results=[];
  for(let idx=0;idx<keep.length;idx++){const k=keep[idx];const pad=6;const x0=Math.max(0,k.minx-pad),y0=Math.max(0,k.miny-pad),x1=Math.min(W-1,k.maxx+pad),y1=Math.min(H-1,k.maxy+pad);const cw=x1-x0+1,ch=y1-y0+1;
    const oc=createCanvas(cw,ch),octx=oc.getContext('2d');const od=octx.createImageData(cw,ch);const oo=od.data;
    for(let yy=0;yy<ch;yy++)for(let xx=0;xx<cw;xx++){const sp=(y0+yy)*W+(x0+xx);const di=(yy*cw+xx)*4;const si=sp*4;let a=0;if(lab[sp]===k.id){const over=lumA[sp]-nLum;const w=warmA[sp];const score=Math.max(over/40,w/30);a=Math.max(0,Math.min(1,score))*255;}oo[di]=data[si];oo[di+1]=data[si+1];oo[di+2]=data[si+2];oo[di+3]=a;}
    octx.putImageData(od,0,0);const name=outDir+'/p'+String(idx+1).padStart(2,'0')+'.png';await saveFile(name,oc);results.push({name,cw,ch,idx:idx+1});}
  return {kept:keep.length,results};
};
globalThis.contact=async function(res,path,cols){cols=cols||6;const cell=200,gap=8;const rows=Math.ceil(res.results.length/cols);const cv=createCanvas(cols*(cell+gap)+gap,rows*(cell+gap)+gap);const cx=cv.getContext('2d');cx.fillStyle='#0b1620';cx.fillRect(0,0,cv.width,cv.height);for(let i=0;i<res.results.length;i++){const r=res.results[i];const im=await readImage(r.name);const col=i%cols,row=(i/cols)|0;const bx=gap+col*(cell+gap),by=gap+row*(cell+gap);const s=Math.min((cell-26)/im.width,(cell-26)/im.height,1);const dw=im.width*s,dh=im.height*s;cx.drawImage(im,bx+(cell-dw)/2,by+(cell-dh)/2,dw,dh);cx.fillStyle='#34d399';cx.font='13px sans-serif';cx.fillText('#'+r.idx+' '+im.width+'x'+im.height,bx+4,by+cell-4);}await saveFile(path,cv);};
