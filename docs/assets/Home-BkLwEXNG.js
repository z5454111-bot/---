import{d as w,l as b,c as m,a as s,t as d,F as k,r as T,g as $,f as x,w as H,v as I,p as A,q as M,e as R,b as u,h as V,s as C,o as p,n as B}from"./index-BqTE_FFu.js";import{u as K}from"./player-KuWV48w2.js";import{_ as N}from"./_plugin-vue_export-helper-DlAUqK2U.js";const h=()=>typeof window<"u"&&!!window.TavernHelper,P=async i=>{if(!h()){console.warn("不在酒馆环境中，跳过设置变量:",i);return}try{await window.TavernHelper.insertOrAssignVariables(i,{type:"chat"}),console.log("成功设置酒馆变量:",i)}catch(e){console.error("设置酒馆变量失败:",e)}},j=async(i,e)=>{if(!h()){if(console.warn("不在酒馆环境中，模拟回复"),e){const a="这是一个模拟的 AI 回复。";for(let n=1;n<=a.length;n++)await new Promise(r=>setTimeout(r,100)),e(a.substring(0,n));return a}return"这是一个模拟的 AI 回复。"}let o=null;e&&(o=window.TavernHelper.eventOn("js_stream_token_received_fully",n=>{e(n)}).stop);try{return await window.TavernHelper.generate({user_input:i,should_stream:!!e})}catch(a){throw console.error("AI 生成失败:",a),a}finally{o&&o()}},D={class:"home-container"},E={class:"chat-main"},F={class:"message system-message"},L={class:"message-content yaml-content"},O={class:"message-avatar"},q={class:"message-content"},z={key:0,class:"message ai-message"},G={class:"message-content streaming-content"},S={class:"chat-input-area"},U=["onKeydown","disabled"],Y=["disabled"],J={class:"sidebar right-sidebar"},Q={class:"sidebar-content"},W={class:"placeholder-text"},X=w({__name:"Home",setup(i){const e=K(),o=u(null),a=u([]),n=u(""),r=u(!1),v=u(""),_=V(()=>`---
角色信息:
  姓名: ${e.name}
  性别: ${e.gender==="boy"?"男":e.gender==="girl"?"女":"其他"}
  年龄: ${e.age}
  出身地: ${e.background}
  难度: ${e.difficulty}
  金钱: ${e.money}
属性:
  HP: ${e.stats.hp}
  攻击: ${e.stats.atk}
  防御: ${e.stats.def}
  特攻: ${e.stats.spa}
  特防: ${e.stats.spd}
  速度: ${e.stats.spe}
天赋:
  - ${e.talents.join(`
  - `)}
---`),g=async()=>{await C(),o.value&&(o.value.scrollTop=o.value.scrollHeight)},f=async()=>{const c=n.value.trim();if(!(!c||r.value)){a.value.push({role:"user",content:c}),n.value="",g(),r.value=!0,v.value="";try{const t=await j(c,l=>{v.value=l,g()});a.value.push({role:"ai",content:t})}catch(t){console.error("生成回复失败:",t),a.value.push({role:"system",content:"系统提示：生成回复失败，请检查连接。"})}finally{r.value=!1,v.value="",g()}}};return b(async()=>{if(h()){const c={player:{name:e.name,gender:e.gender,age:e.age,background:e.background,money:e.money,stats:e.stats,talents:e.talents}};await P(c)}}),(c,t)=>(p(),m("div",D,[t[5]||(t[5]=s("aside",{class:"sidebar left-sidebar"},[s("div",{class:"sidebar-header"},[s("h3",null,"同行宝可梦")]),s("div",{class:"sidebar-content"},[s("p",{class:"placeholder-text"},"暂无宝可梦")])],-1)),s("main",E,[t[3]||(t[3]=s("div",{class:"chat-header"},[s("h2",null,"宝可梦世界旅途")],-1)),s("div",{class:"chat-messages",ref_key:"chatMessagesRef",ref:o},[s("div",F,[s("div",L,[s("pre",null,[s("code",null,d(_.value),1)])])]),(p(!0),m(k,null,T(a.value,(l,y)=>(p(),m("div",{key:y,class:B(["message",l.role==="user"?"user-message":"ai-message"])},[s("div",O,d(l.role==="user"?"我":"AI"),1),s("div",q,d(l.content),1)],2))),128)),r.value?(p(),m("div",z,[t[2]||(t[2]=s("div",{class:"message-avatar"},"AI",-1)),s("div",G,[$(d(v.value),1),t[1]||(t[1]=s("span",{class:"cursor"},null,-1))])])):x("",!0)],512),s("div",S,[H(s("textarea",{"onUpdate:modelValue":t[0]||(t[0]=l=>n.value=l),class:"chat-input",placeholder:"输入你的行动或对话...",onKeydown:A(M(f,["prevent"]),["enter"]),disabled:r.value},null,40,U),[[I,n.value]]),s("button",{class:"send-btn",onClick:f,disabled:!n.value.trim()||r.value}," 发送 ",8,Y)])]),s("aside",J,[t[4]||(t[4]=s("div",{class:"sidebar-header"},[s("h3",null,"周围环境")],-1)),s("div",Q,[s("p",W,"当前位置："+d(R(e).background),1)])])]))}}),te=N(X,[["__scopeId","data-v-3cc8923c"]]);export{te as default};
