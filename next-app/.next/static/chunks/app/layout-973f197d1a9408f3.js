(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{4252:function(e,t,n){Promise.resolve().then(n.t.bind(n,1434,23)),Promise.resolve().then(n.bind(n,7043)),Promise.resolve().then(n.bind(n,8177)),Promise.resolve().then(n.bind(n,9686)),Promise.resolve().then(n.t.bind(n,2300,23)),Promise.resolve().then(n.bind(n,6349))},7043:function(e,t,n){"use strict";n.r(t),n.d(t,{Render:function(){return o}});var r=n(5862),s=n(6357),a=n(7058);n(7783);var i=n(5296),c=n(8187);let o=e=>{let{children:t}=e,{expanded:n,setExpanded:o}=(0,s.o)();return(0,r.jsx)(a.Fragment,{children:(0,r.jsx)("div",{className:(0,i.Z)("contents",c.k2,!0===n?"hidden":""),children:t})})}},9686:function(e,t,n){"use strict";n.d(t,{UserConnector:function(){return d}});var r=n(5862),s=n(6357),a=n(7516),i=n(7058),c=n(8187),o=n(5296),l=n(2789);n(4231);let u=()=>{let e=(0,a.useSearchParams)(),t=(0,a.useRouter)(),n=(0,a.usePathname)(),{user:u,setUser:d,refreshUser:h,setPageLoading:f}=(0,s.o)(),m=async()=>{let t=e.get("username"),n=e.get("chatid");if(t&&n&&t!==u.id&&n!==u.chatid)try{let e=await fetch("/api/v4/data/user",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t,chatid:n})}),r=await e.json();d(r.user)}catch(e){console.log(e)}};return(0,i.useEffect)(()=>{m()},[e,h]),(0,r.jsx)(i.Fragment,{children:null!==u.id&&(0,r.jsx)("div",{className:(0,o.W)("h-20 pb-4 w-full bg-[#F9F9F9] fixed bottom-0 grid grid-cols-4 items-center place-content-center",c.d),children:[{key:"home",icon:l.Nm,path:"/protocols"},{key:"bookmarks",icon:l.zj,path:"/bookmarks"},{key:"social",icon:l.vn,path:"/directory"},{key:"settings",icon:l.t$,path:"/settings"}].map((e,s)=>(0,r.jsx)("div",{className:"col-span-1 items-center flex flex-col place-content-center w-full h-full",children:(0,r.jsxs)("button",{onClick:()=>{f(!0),t.push("".concat(e.path,"?username=").concat(u.id,"&chatid=").concat(u.chatid))},href:"".concat(e.path,"?username=").concat(u.id,"&chatid=").concat(u.chatid),className:"w-fit h-fit flex flex-col items-center",children:[(0,r.jsx)(e.icon,{classes:(0,o.W)("h-5 w-6",n===e.path?"fill-isBlueLight":"fill-isLabelLightSecondary")}),(0,r.jsx)("div",{className:(0,o.W)("text-xs capitalize font-500",n===e.path?"text-isBlueLight":"text-isLabelLightSecondary"),children:e.key})]})},e.key))})})},d=()=>(0,r.jsx)(i.Suspense,{fallback:(0,r.jsx)("div",{children:"Loading..."}),children:(0,r.jsx)(u,{})})},8177:function(e,t,n){"use strict";n.d(t,{BotConnector:function(){return a}});var r=n(6357),s=n(7058);let a=()=>{let{tele:e,setTele:t}=(0,r.o)(),n=()=>{try{if(window.Telegram&&window.Telegram.WebApp){let e=window.Telegram.WebApp;e.ready(),t(e)}else console.error("Telegram.WebApp is not available.")}catch(e){console.error("Error starting the bot:",e)}};(0,s.useEffect)(()=>{n()},[])}},1148:function(e,t,n){"use strict";n.d(t,{PageLoader:function(){return o}});var r=n(5862),s=n(7058),a=n(6357),i=n(4332),c=n(5296);let o=e=>{let{children:t}=e,{pageLoading:n,setPageLoading:o}=(0,a.o)();return((0,s.useEffect)(()=>{o(!1)},[n]),!1===n)?(0,r.jsx)(s.Fragment,{children:t}):(0,r.jsx)("div",{className:"flex flex-col items-center w-full p-4 place-content-center",children:(0,r.jsx)(i.$,{classes:(0,c.Z)("w-5 h-5 border-isBlueLight")})})}},4332:function(e,t,n){"use strict";n.d(t,{$:function(){return a}});var r=n(5862),s=n(5296);let a=e=>{let{classes:t}=e;return(0,r.jsx)("div",{className:(0,s.Z)("inline-block border-[3.5px] rounded-full animate-spin  border-t-transparent drop-shadow-sm",t),role:"status","aria-label":"loading",children:(0,r.jsx)("span",{className:"sr-only",children:"Loading..."})})}},7783:function(e,t,n){"use strict";n.d(t,{$:function(){return r.$}});var r=n(4332);n(1148)},7516:function(e,t,n){"use strict";var r=n(3568);n.o(r,"useParams")&&n.d(t,{useParams:function(){return r.useParams}}),n.o(r,"usePathname")&&n.d(t,{usePathname:function(){return r.usePathname}}),n.o(r,"useRouter")&&n.d(t,{useRouter:function(){return r.useRouter}}),n.o(r,"useSearchParams")&&n.d(t,{useSearchParams:function(){return r.useSearchParams}})},1434:function(){},2300:function(e){e.exports={style:{fontFamily:"'__Inter_aaf875', '__Inter_Fallback_aaf875'",fontStyle:"normal"},className:"__className_aaf875"}}},function(e){e.O(0,[331,464,349,482,158,660,744],function(){return e(e.s=4252)}),_N_E=e.O()}]);