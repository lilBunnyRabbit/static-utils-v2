(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[394],{2115:function(t,e,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/image-crop",function(){return i(5469)}])},559:function(t,e,i){"use strict";i.d(e,{v:function(){return a}});let r=t=>!!t&&"image"===t.type.split("/")[0];async function n(t){if(!r(t))throw Error("File not image.");return await new Promise((e,i)=>{let r=new Image;r.onload=()=>e(r),r.onerror=i,r.src=URL.createObjectURL(t)})}class a{static async fromFile(t){let e=await n(t);return new a(t,e)}static async fromList(t){if(!t)return[];let e=(FileList,Array.from(t));return await Promise.all(e.map(async t=>{let e=null;if(t instanceof File)e=t;else{if(!t||"file"!==t.kind)return;e=t.getAsFile()}return e?await a.fromFile(e).catch(t=>console.error(t)):null}).filter(Boolean))}static async fromClipboardEvent(t){var e;return await a.fromList(null===(e=t.clipboardData)||void 0===e?void 0:e.items)}static async fromChangeEvent(t){return await a.fromList(t.target.files)}static fromUpload(t){return async e=>a.fromChangeEvent(e).then(t).catch(t=>console.error(t))}constructor(t,e){this.file=t,this.image=e}}},8766:function(t,e,i){"use strict";i.d(e,{Y:function(){return l}});var r=i(5893);let n=t=>e=>{let i=e.target;if("max"in i&&void 0!==i.max){let t="string"==typeof i.max?Number.parseFloat(i.max):i.max;i.valueAsNumber>t&&(e.target.value=String(t))}if("min"in i&&void 0!==i.min){let t="string"==typeof i.min?Number.parseFloat(i.min):i.min;i.valueAsNumber<t&&(e.target.value=String(t))}return t&&t(e)};var a=i(7294);let l=a.forwardRef((t,e)=>{let{label:i,state:a,onInput:l,...s}=t;return(0,r.jsxs)("div",{className:"flex flex-col gap-2",children:[i&&(0,r.jsx)("label",{children:i}),(0,r.jsx)("input",{type:"number",ref:e,...a&&{value:void 0===a[0]||isNaN(a[0])?"":a[0],onChange:t=>a[1](isNaN(t.target.valueAsNumber)?void 0:t.target.valueAsNumber)},onInput:n(l),...s})]})});l.displayName="NumberInput"},8465:function(t,e,i){"use strict";i.d(e,{O:function(){return a}});var r=i(559),n=i(7294);function a(t){n.useEffect(()=>{let e=!0,i=async i=>{e&&(e=!1,await r.v.fromClipboardEvent(i).then(t).catch(t=>{console.error(t)}),e=!0)};return document.addEventListener("paste",i),()=>{document.removeEventListener("paste",i)}},[t])}},3005:function(t,e,i){"use strict";i.d(e,{C:function(){return n}});var r=i(5893);i(7294);let n=t=>{let{children:e,id:i,className:n}=t;return(0,r.jsxs)("div",{id:i,className:function(){for(var t=arguments.length,e=Array(t),i=0;i<t;i++)e[i]=arguments[i];return e.filter(Boolean).join(" ")}("relative grid grid-cols-[256px,1fr] h-screen w-screen overflow-hidden",n),children:[(0,r.jsx)("div",{className:"relative p-4 bg-zinc-700 overflow-hidden",children:e[0]}),(0,r.jsx)("div",{className:"relative p-4 bg-zinc-900 overflow-hidden",children:e[1]})]})}},5469:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return h}});var r=i(5893),n=i(559),a=i(8766),l=i(8465),s=i(3005),o=i(7294);let c=new class{bind(t){return this.canvas=t,this.ctx={original:t.original.getContext("2d",{willReadFrequently:!0}),crop:t.crop.getContext("2d",{willReadFrequently:!0})},this}render(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!this.canvas||!this.ctx)return;let{image:i}=t;this.canvas.original.width=i.width,this.canvas.original.height=i.height,this.ctx.original.clearRect(0,0,this.canvas.original.width,this.canvas.original.height),this.ctx.original.drawImage(i,0,0);let r=this.getCropLimits(this.ctx.original,255*(e.alphaLimit||0)/100);return this.ctx.original.fillStyle=e.color||"#ff0000",!function(t,e){let{top:i,left:r,right:n,bottom:a}=e;t.beginPath(),t.moveTo(0,0),t.lineTo(t.canvas.width,0),t.lineTo(t.canvas.width,t.canvas.height),t.lineTo(0,t.canvas.height),t.lineTo(0,0),t.closePath(),t.moveTo(r,i),t.lineTo(r,a),t.lineTo(n,a),t.lineTo(n,i),t.lineTo(r,i),t.closePath(),t.fill()}(this.ctx.original,r),this.canvas.crop.width=r.right-r.left,this.canvas.crop.height=r.bottom-r.top,this.ctx.crop.clearRect(0,0,this.canvas.crop.width,this.canvas.crop.height),this.ctx.crop.drawImage(i,r.left,r.top,this.canvas.crop.width,this.canvas.crop.height,0,0,this.canvas.crop.width,this.canvas.crop.height),{original:{width:this.canvas.original.width,height:this.canvas.original.height},crop:{width:this.canvas.crop.width,height:this.canvas.crop.height}}}getCropLimits(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=t.canvas,r=t.getImageData(0,0,i.width,i.height).data,n=(t,n)=>r[(n*i.width+t)*4+3]<=e,a=(()=>{for(let t=0;t<i.height;t++)for(let e=0;e<i.width;e++)if(!n(e,t))return t;return 0})(),l=(t=>{for(let e=i.width-1;e>=0;e--)for(let r=t;r<i.height;r++)if(!n(e,r))return e===i.width?i.width:e+1;return i.width})(a),s=(t=>{for(let e=i.height-1;e>=0;e--)for(let r=0;r<t;r++)if(!n(r,e))return e===i.height?i.height:e+1;return i.height})(l),o=((t,e)=>{for(let r=0;r<i.width;r++)for(let i=t;i<e;i++)if(!n(r,i))return r;return 0})(a,s);return{top:a,bottom:s,left:o,right:l}}constructor(){this.canvas=null,this.ctx=null}};function h(){let[t,e]=o.useState(),[i,h]=o.useState(0),[u,f]=o.useState("#ff0000"),[d,g]=o.useState(),v=o.useRef(null),m=o.useRef(null);return(0,l.O)(t=>e(t[0])),o.useEffect(()=>{c.bind({original:v.current,crop:m.current})},[]),o.useEffect(()=>{if(!t)return;let e=c.render(t,{alphaLimit:i,color:u});g(e)},[t,i,u]),(0,r.jsxs)(s.C,{children:[(0,r.jsxs)("div",{className:"relative w-full h-full flex flex-col justify-between",children:[(0,r.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,r.jsx)(a.Y,{className:"w-full text-black pl-2",label:"Alpha",min:0,max:100,state:[i,h]}),(0,r.jsx)("input",{type:"color",value:u,onChange:t=>f(t.target.value)}),d&&(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{children:["ORIGINAL: ",d.original.width,"x",d.original.height]}),(0,r.jsxs)("div",{children:["CROP: ",d.crop.width,"x",d.crop.height]})]})]}),(0,r.jsx)("input",{type:"file",accept:"image/*",onChange:n.v.fromUpload(t=>e(t[0]))})]}),(0,r.jsxs)("div",{className:"relative w-full h-full grid grid-cols-[1fr,1fr] gap-4 justify-center place-items-center",children:[(0,r.jsx)("canvas",{ref:v,className:"border border-red-400 object-contain max-w-full max-h-full"}),(0,r.jsx)("canvas",{ref:m,className:"border border-red-400 object-contain max-w-full max-h-full"})]})]})}}},function(t){t.O(0,[774,888,179],function(){return t(t.s=2115)}),_N_E=t.O()}]);