"use strict";(()=>{var e={};e.id=110,e.ids=[110],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},50852:e=>{e.exports=require("async_hooks")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},4074:e=>{e.exports=require("perf_hooks")},85477:e=>{e.exports=require("punycode")},63477:e=>{e.exports=require("querystring")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},76224:e=>{e.exports=require("tty")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},55338:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>x,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var o={};t.r(o),t.d(o,{POST:()=>c,generateMarkdown:()=>l});var s=t(34371),a=t(51947),n=t(56662),p=t(23542),i=t(86876),u=t(63418);function l({subscriptions:e}){let r="",t=!0,o="",s={};for(let a of e){let{protocol:e,title:n,endtime:p,url:u}=a,l=u&&"undefined"!==u?`👉 [Vote Now](${u})`:"";if(e!==o&&(t||(r+="\n"),r+=`*Protocol:* ${e}`,t=!1,s[o=e]=0),s[o]++,r+=`
${s[o]}. _${n}_ 
🔴 _Ends in ${(0,i.D)(parseInt(p))}_ | ${l}
`,s[o]>=10)break}return r}async function c(e){try{let r=await e.json(),t=(0,u.E)();if(r.test&&r.username&&r.chatid){console.log("test alert");let e=r.username,o=r.chatid;{let r=`
          SELECT p.id,
                 pr.name AS protocol,
                 p.title,
                 p.endTime,
                 p.url
          FROM proposals p
          JOIN protocols pr ON p.protocol = pr.id
          WHERE p.protocol IN (SELECT unnest(subscriptions) FROM telegram_users WHERE id = '${e}')
            AND p.endTime > EXTRACT(epoch FROM NOW())::INT
          ORDER BY pr.name ASC;
        `,s=await p.i.unsafe(r),a=l({subscriptions:s});if(0!==s.length)return await t.sendMessage(o,`${a}`,{parse_mode:"Markdown"}),Response.json({code:201,status:"success",message:"Test alert sent successfully"});return Response.json({code:404,status:"error",message:"No subscriptions found for the test user"})}}let o=`
		SELECT *
		FROM telegram_users
		WHERE pause_alerts = FALSE
			AND telegram_alerts = TRUE
			AND last_telegram_alert + duration < ${Math.floor(Date.now()/1e3)}
		LIMIT 10;
`,s=await p.i.unsafe(o);return 0!==s.length&&s.map(async(e,r)=>{let o=`
    				SELECT p.id,
           pr.name AS protocol,
           p.title,
           p.endTime,
           p.url
    FROM proposals p
    JOIN protocols pr ON p.protocol = pr.id
    WHERE p.protocol IN (SELECT unnest(subscriptions) FROM telegram_users WHERE id = '${e.id}')
      AND p.endTime > EXTRACT(epoch FROM NOW())::INT
    ORDER BY pr.name ASC;
    			`,s=await p.i.unsafe(o),a=l({subscriptions:s});if(0!==s.length)try{await t.sendMessage(e.chatid,`${a}`,{parse_mode:"Markdown"}),await p.i.unsafe(`
              UPDATE telegram_users
              SET last_telegram_alert = ${Math.floor(Date.now()/1e3)}
              WHERE id = '${e.id}';
            `)}catch(e){console.log(e)}}),Response.json({code:201,status:"success"})}catch(e){return console.log(e),Response.json({code:403,status:"error"})}}let d=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/v4/alerts/telegram/route",pathname:"/api/v4/alerts/telegram",filename:"route",bundlePath:"app/api/v4/alerts/telegram/route"},resolvedPagePath:"C:\\Users\\17gua\\Desktop\\cryptos\\tribuni\\next-app\\app\\api\\v4\\alerts\\telegram\\route.jsx",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:h}=d,x="/api/v4/alerts/telegram/route";function f(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}},63418:(e,r,t)=>{t.d(r,{K:()=>u,E:()=>s});var o=t(22358);let s=()=>new o(process.env.BOT_API_KEY,{polling:!1});var a=t(23215);let n=(0,a.createProxy)(String.raw`C:\Users\17gua\Desktop\cryptos\tribuni\next-app\components\bot\BotConnector.jsx`),{__esModule:p,$$typeof:i}=n;n.default;let u=(0,a.createProxy)(String.raw`C:\Users\17gua\Desktop\cryptos\tribuni\next-app\components\bot\BotConnector.jsx#BotConnector`)},23542:(e,r,t)=>{t.d(r,{o:()=>s,i:()=>o});let o=(0,t(71468).Z)({host:process.env.DB_HOST,port:process.env.DB_PORT,database:process.env.DB_NAME,username:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:!1,max:20,max_lifetime:null,idle_timeout:60,connect_timeout:30});function s(e){return null==e?null:e.replace(/'/g,"''")}},86876:(e,r,t)=>{t.d(r,{D:()=>o});function o(e){let r=new Date,t=new Date(1e3*e)-r,o=Math.abs(Math.floor(t/1e3)),s=Math.abs(Math.floor(o/60)),a=Math.abs(Math.floor(s/60)),n=Math.abs(Math.floor(a/24)),p=Math.abs(Math.floor(n/7)),i=Math.abs(Math.floor(n/30)),u=Math.abs(Math.floor(n/365));return t<0?u>0?`${u}y ago`:i>0?`${i}mo ago`:p>0?`${p}w ago`:n>0?`${n}d ago`:a>0?`${a}h ago`:s>0?`${s}min ago`:`${o}s ago`:u>0?`${u}y`:i>0?`${i}mo`:p>0?`${p}w`:n>0?`${n}d`:a>0?`${a}h`:s>0?`${s}min`:`${o}s`}},23215:(e,r,t)=>{Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createProxy",{enumerable:!0,get:function(){return o}});let o=t(47978).createClientModuleProxy},47978:(e,r,t)=>{e.exports=t(56126).vendored["react-rsc"].ReactServerDOMWebpackServerEdge},34371:(e,r,t)=>{e.exports=t(30517)}};var r=require("../../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[558,358,468],()=>t(55338));module.exports=o})();