"use strict";(()=>{var e={};e.id=322,e.ids=[322],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},57147:e=>{e.exports=require("fs")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},4074:e=>{e.exports=require("perf_hooks")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},65805:(e,o,t)=>{t.r(o),t.d(o,{originalPathname:()=>m,patchFetch:()=>h,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l});var r={};t.r(r),t.d(r,{POST:()=>i});var s=t(34371),a=t(51947),n=t(56662),p=t(23542);async function i(e){try{let e=await fetch("https://api.boardroom.info/v1/protocols?key=a9e2a08afc04b15bd17e20f05373b9e5",{method:"GET",headers:{Accept:"application/json"}}),o=await e.json();o=o.data;let t=[];for(let e=0;e<o.length;e++)o[e]&&void 0!==o[e].icons&&t.push({id:(0,p.o)(o[e].cname),name:(0,p.o)(o[e].name),icon:(0,p.o)(o[e].icons[0].url)});let r=`
		  INSERT INTO protocols (id, name, icon)
		  VALUES
		    ${t.map(({id:e,name:o,icon:t})=>`('${e}', '${o}', '${t}')`).join(",\n    ")}
		  ON CONFLICT (id) DO UPDATE
		  SET name = EXCLUDED.name, icon = EXCLUDED.icon;
		`;return await p.i.unsafe(r),Response.json({code:201,status:"success"})}catch(e){return console.log(e),Response.json({code:403,status:"error"})}}let u=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/v4/data/protocols/snapshot/route",pathname:"/api/v4/data/protocols/snapshot",filename:"route",bundlePath:"app/api/v4/data/protocols/snapshot/route"},resolvedPagePath:"C:\\Users\\17gua\\Desktop\\cryptos\\tribuni\\next-app\\app\\api\\v4\\data\\protocols\\snapshot\\route.jsx",nextConfigOutput:"",userland:r}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:d}=u,m="/api/v4/data/protocols/snapshot/route";function h(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}},23542:(e,o,t)=>{t.d(o,{o:()=>s,i:()=>r});let r=(0,t(71468).Z)({host:process.env.DB_HOST,port:process.env.DB_PORT,database:process.env.DB_NAME,username:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:!1,max:20,max_lifetime:null,idle_timeout:60,connect_timeout:30});function s(e){return null==e?null:e.replace(/'/g,"''")}},34371:(e,o,t)=>{e.exports=t(30517)}};var o=require("../../../../../../webpack-runtime.js");o.C(e);var t=e=>o(o.s=e),r=o.X(0,[558,468],()=>t(65805));module.exports=r})();