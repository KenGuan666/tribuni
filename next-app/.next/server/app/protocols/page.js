(()=>{var e={};e.id=296,e.ids=[296],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},50852:e=>{"use strict";e.exports=require("async_hooks")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},95687:e=>{"use strict";e.exports=require("https")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},4074:e=>{"use strict";e.exports=require("perf_hooks")},85477:e=>{"use strict";e.exports=require("punycode")},63477:e=>{"use strict";e.exports=require("querystring")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},29007:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>d,originalPathname:()=>u,pages:()=>p,routeModule:()=>x,tree:()=>c}),r(26870),r(46572),r(97857);var s=r(56126),a=r(51947),i=r(98952),n=r.n(i),o=r(16971),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(t,l);let c=["",{children:["protocols",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,26870)),"C:\\Users\\17gua\\Desktop\\cryptos\\tribuni\\next-app\\app\\protocols\\page.jsx"]}]},{metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,48287))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,46572)),"C:\\Users\\17gua\\Desktop\\cryptos\\tribuni\\next-app\\app\\layout.jsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,97857,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,48287))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],p=["C:\\Users\\17gua\\Desktop\\cryptos\\tribuni\\next-app\\app\\protocols\\page.jsx"],u="/protocols/page",d={require:r,loadChunk:()=>Promise.resolve()},x=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/protocols/page",pathname:"/protocols",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},63243:(e,t,r)=>{Promise.resolve().then(r.bind(r,45540)),Promise.resolve().then(r.bind(r,1214))},45540:(e,t,r)=>{"use strict";r.d(t,{RenderList:()=>g});var s=r(46496),a=r(47364),i=r.n(a),n=r(88925),o=r(50686),l=r(42270),c=r(77115),p=r(46858),u=r(21529),d=r(48189),x=r(85384);let m=({arr:e,showIndex:t,search:r,setPageLoading:a})=>{let{user:c}=(0,u.o)();return s.jsx("div",{className:(0,o.Z)("w-full overflow-y-scroll hide-scrollbar grow mt-2 !mb-0 flex flex-col",l.k2,l.d),children:e.map((l,p)=>{let u=0===p||e[p-1].name[0].toLowerCase()!==e[p].name[0].toLowerCase()?e[p].name[0]:null,d=l.id,m=l.name;return(0,s.jsxs)("div",{id:d,className:"contents",children:[!0===t&&null!==u&&(0,s.jsxs)(i().Fragment,{children:[s.jsx("div",{className:(0,o.Z)("px-3 pt-4 pb-1 text-base uppercase text-isLabelLightSecondary font-400",""!==r?"hidden":""),children:r?.length>0?r[0]:u}),s.jsx(x.Hr,{classes:(0,o.Z)("!px-3")})]}),(0,s.jsxs)(n.default,{onClick:()=>{a(!0)},href:`/proposals?protocol=${d}&username=${c.id}&chatid=${c.chatid}`,className:"flex flex-row items-center justify-between w-full hover:bg-isSeparatorLight",children:[s.jsx("div",{className:(0,o.Z)("grow py-3 leading-none px-3 text-base"),children:(function(e){return e.charAt(0).toUpperCase()+e.slice(1)})(m).trim()}),"0"!==l.active&&s.jsx(x.Vp,{text:`${l.active} active`,bg:(0,o.Z)("bg-isBlueLight")}),"0"!==l.new&&s.jsx(x.Vp,{text:`${l.new} new`,bg:(0,o.Z)("bg-isGreenLight")})]}),s.jsx(x.Hr,{classes:(0,o.Z)("!px-3")})]},d)})})},g=({protocols:e,total:t,lastUpdated:r})=>{let{user:n,protocolFilter:g,setProtocolFilter:h}=(0,u.o)(),[f,v]=(0,a.useState)(""),[w,b]=(0,a.useState)(!1),y=e.filter(e=>{let t=e.name.toLowerCase().startsWith(f.toLowerCase());return"subscribed"===g?t&&n.subscriptions.includes(e.id):"active"===g?t&&"0"!==e.active:t}),[L,j]=(0,a.useState)(!1);return!0===L?s.jsx(d.$,{classes:(0,o.Z)("w-5 h-5 border-isBlueLight")}):(0,s.jsxs)(i().Fragment,{children:[s.jsx(x.Dx,{text:"Protocols"}),s.jsx("div",{className:(0,o.Z)("flex flex-row items-center w-full px-4 shrink-0 pt-3",l.k2,l.d),children:(0,s.jsxs)("div",{className:"flex flex-row items-center w-full py-1 px-2 space-x-1 rounded-xl place-content-center bg-isFillLightTertiary",children:[s.jsx(c.Yt,{classes:(0,o.Z)("w-7 h-7 fill-isLabelLightSecondary shrink-0")}),s.jsx("input",{id:"search",placeholder:"Search",onFocus:()=>b(!0),onBlur:async()=>{await (0,l.gw)(10),b(!1)},onChange:e=>{v(e.target.value)},value:f,type:"text",className:(0,o.Z)("grow bg-transparent outline-none text-lg focus:outline-none font-400 placeholder:text-isLabelLightSecondary text-isLabelLightPrimary leading-none",l.k2)}),""!==f&&s.jsx("button",{onClick:async()=>{v("");let e=document.getElementById("search");await (0,l.gw)(20),e&&e.focus()},children:s.jsx(p.$,{classes:(0,o.Z)("w-[1.2rem] h-[1.2rem] fill-isLabelLightSecondary shrink-0")})})]})}),s.jsx(x.mQ,{list:["all","subscribed","active"],setter:h,active:g,classes:(0,o.Z)("pt-8")}),("all"===g||"active"===g||"subscribed"===g)&&s.jsx(m,{arr:y,showIndex:!0,search:f,setPageLoading:j})]})}},46858:(e,t,r)=>{"use strict";r.d(t,{$:()=>a});var s=r(46496);let a=({classes:e})=>s.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",className:e,children:s.jsx("g",{id:"cancel_24px",children:s.jsx("path",{id:"icon/navigation/cancel_24px",fillRule:"evenodd",clipRule:"evenodd",d:"M2 12C2 6.47 6.46997 2 12 2C17.53 2 22 6.47 22 12C22 17.53 17.53 22 12 22C6.46997 22 2 17.53 2 12ZM14.89 16.3C15.2799 16.69 15.9099 16.69 16.2999 16.3C16.6799 15.91 16.6799 15.27 16.2999 14.89L13.4099 12L16.2999 9.11002C16.6899 8.72 16.6899 8.09 16.2999 7.70001C15.9099 7.31 15.2799 7.31 14.89 7.70001L12 10.59L9.10999 7.70001C8.71997 7.31 8.08997 7.31 7.69995 7.70001C7.5127 7.88684 7.40747 8.14047 7.40747 8.405C7.40747 8.66953 7.5127 8.92316 7.69995 9.11002L10.59 12L7.69995 14.89C7.5127 15.0768 7.40747 15.3305 7.40747 15.595C7.40747 15.8595 7.5127 16.1132 7.69995 16.3C8.08997 16.69 8.71997 16.69 9.10999 16.3L12 13.41L14.89 16.3Z"})})})},85384:(e,t,r)=>{"use strict";r.d(t,{Hr:()=>o,mQ:()=>l,Vp:()=>c,Dx:()=>n});var s=r(46496),a=r(50686),i=r(42270);let n=({text:e})=>s.jsx("div",{className:(0,a.Z)("w-full text-4xl text-isLabelLightPrimary font-700 pl-4 pt-3",i.k2,i.d),children:e}),o=({classes:e})=>s.jsx("div",{className:(0,a.Z)("w-full",i.d,e),children:s.jsx("hr",{className:(0,a.Z)("w-full rounded-full bg-isSeparatorLight")})}),l=({list:e,setter:t,active:r,classes:n})=>s.jsx("div",{className:(0,a.Z)("w-full max-w-md px-4",n),children:s.jsx("div",{className:(0,a.Z)("w-full p-[0.16rem] rounded-xl bg-isFillLightTertiary text-sm  grid grid-cols-3 gap-[0.16rem] text-isLabelLightPrimary font-500",i.d),children:e.map((e,n)=>s.jsx("button",{onClick:()=>{t(e)},className:(0,a.Z)("w-full text-center capitalize rounded-lg py-1",i.k2,r===e?"bg-isWhite":""),children:e},n))})}),c=({text:e,bg:t})=>s.jsx("div",{className:(0,a.Z)("px-[0.4rem] mr-2 text-sm py-[0.125rem] rounded-md text-isWhite font-400 tabular-nums",t),children:e})},26870:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>g,getData:()=>m,revalidate:()=>x});var s=r(43859);r(72003);var a=r(23215);let i=(0,a.createProxy)(String.raw`C:\Users\17gua\Desktop\cryptos\tribuni\next-app\app\protocols\RenderList.jsx`),{__esModule:n,$$typeof:o}=i;i.default;let l=(0,a.createProxy)(String.raw`C:\Users\17gua\Desktop\cryptos\tribuni\next-app\app\protocols\RenderList.jsx#RenderList`);var c=r(23542),p=r(78278),u=r(10028),d=r(9725);let x=3600,m=async()=>{let e=`
    SELECT
        p.id AS id,
        p.name AS name,
        p.icon AS icon,
        COUNT(pr.protocol) AS total,
        SUM(CASE WHEN pr.endtime > EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN pr.starttime < EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) AND EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - pr.starttime <= 48 * 3600 THEN 1 ELSE 0 END) AS new
    FROM
        protocols p
    LEFT JOIN
        proposals pr ON p.id = pr.protocol
    GROUP BY
        p.id, p.name, p.icon;
`,t=await c.i.unsafe(e);(t=t.map(({name:e,count:t,...r})=>({name:e.trim(),count:parseInt(t),...r}))).sort((e,t)=>e.name.localeCompare(t.name));let r=t.reduce((e,t)=>e+parseInt(t.total||0,10),0);return{protocols:t,total:r}};async function g(){let{protocols:e,total:t}=await m();return s.jsx(d.w,{children:s.jsx("div",{className:(0,p.Z)("flex flex-col items-center w-full grow overflow-hidden pb-24",u.d),children:s.jsx(l,{protocols:e,total:t,lastUpdated:new Date().toUTCString()})})})}},10028:(e,t,r)=>{"use strict";r.d(t,{AL:()=>i,d:()=>a});var s=r(78278);(0,s.W)("duration-200 transition-all ease-in-out");let a=(0,s.W)("max-w-xl"),i={id:null,chatid:null,premium:0,email:null,subscriptions:[],duration:86400,pause_alerts:!1,telegram_alerts:!0,email_alerts:!1,last_telegram_alert:0,last_email_alert:0};(0,s.W)("w-full p-1 bg-isWhite text-isLabelLightPrimary rounded-xl min-w-[22rem] shadow-sm border-isSeparatorLight")},23542:(e,t,r)=>{"use strict";r.d(t,{o:()=>a,i:()=>s});let s=(0,r(71468).Z)({host:process.env.DB_HOST,port:process.env.DB_PORT,database:process.env.DB_NAME,username:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:!1,max:20,max_lifetime:null,idle_timeout:60,connect_timeout:30});function a(e){return null==e?null:e.replace(/'/g,"''")}},9725:(e,t,r)=>{"use strict";r.d(t,{w:()=>p,$:()=>i});var s=r(43859),a=r(78278);let i=({classes:e})=>s.jsx("div",{className:(0,a.Z)("inline-block border-[3.5px] rounded-full animate-spin  border-t-transparent drop-shadow-sm",e),role:"status","aria-label":"loading",children:s.jsx("span",{className:"sr-only",children:"Loading..."})});var n=r(23215);let o=(0,n.createProxy)(String.raw`C:\Users\17gua\Desktop\cryptos\tribuni\next-app\components\loaders\PageLoader.jsx`),{__esModule:l,$$typeof:c}=o;o.default;let p=(0,n.createProxy)(String.raw`C:\Users\17gua\Desktop\cryptos\tribuni\next-app\components\loaders\PageLoader.jsx#PageLoader`)},48287:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var s=r(73324);let a=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,s.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[558,358,468,776,324,410],()=>r(29007));module.exports=s})();