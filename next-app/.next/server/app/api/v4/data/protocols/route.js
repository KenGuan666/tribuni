"use strict";(()=>{var e={};e.id=857,e.ids=[857],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6113:e=>{e.exports=require("crypto")},57147:e=>{e.exports=require("fs")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},4074:e=>{e.exports=require("perf_hooks")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},42308:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>E,patchFetch:()=>m,requestAsyncStorage:()=>c,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>l});var o={};r.r(o),r.d(o,{POST:()=>i});var s=r(34371),p=r(51947),a=r(56662),n=r(23542);async function i(e){try{let e=`
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
`,t=await n.i.unsafe(e);(t=t.map(({name:e,count:t,...r})=>({name:e.trim(),count:parseInt(t),...r}))).sort((e,t)=>e.name.localeCompare(t.name));let r=t.reduce((e,t)=>e+parseInt(t.total||0,10),0);return Response.json({code:201,status:"success",protocols:t,total:r})}catch(e){return console.log(e),Response.json({code:403,status:"error",protocols:null,total:0})}}let u=new s.AppRouteRouteModule({definition:{kind:p.x.APP_ROUTE,page:"/api/v4/data/protocols/route",pathname:"/api/v4/data/protocols",filename:"route",bundlePath:"app/api/v4/data/protocols/route"},resolvedPagePath:"C:\\Users\\17gua\\Desktop\\cryptos\\tribuni\\next-app\\app\\api\\v4\\data\\protocols\\route.jsx",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:l,serverHooks:d}=u,E="/api/v4/data/protocols/route";function m(){return(0,a.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:l})}},23542:(e,t,r)=>{r.d(t,{o:()=>s,i:()=>o});let o=(0,r(71468).Z)({host:process.env.DB_HOST,port:process.env.DB_PORT,database:process.env.DB_NAME,username:process.env.DB_USERNAME,password:process.env.DB_PASSWORD,ssl:!1,max:20,max_lifetime:null,idle_timeout:60,connect_timeout:30});function s(e){return null==e?null:e.replace(/'/g,"''")}},34371:(e,t,r)=>{e.exports=r(30517)}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[558,468],()=>r(42308));module.exports=o})();