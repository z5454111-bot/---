import{d as _,l as y,c as m,a as e,t as r,F as b,r as $,g as k,f as x,w,v as T,p as H,q as M,e as C,b as i,h as I,s as V,o as v,n as B}from"./index-DraqLax7.js";import{u as R}from"./player-BR5zGuKo.js";import{s as S,a as K}from"./tavern-B18KaySO.js";import{_ as N}from"./plugin-vue_export-helper-DlAUqK2U.js";const P={class:"home-container"},j={class:"chat-main"},A={class:"message system-message"},D={class:"message-content yaml-content"},F={class:"message-avatar"},q={class:"message-content"},z={key:0,class:"message ai-message"},E={class:"message-content streaming-content"},G={class:"chat-input-area"},L=["onKeydown","disabled"],U=["disabled"],Y={class:"sidebar right-sidebar"},J={class:"sidebar-content"},O={class:"placeholder-text"},Q=_({__name:"Home",setup(W){const s=R(),c=i(null),d=i([]),l=i(""),n=i(!1),u=i(""),g=I(()=>`---
角色信息:
  姓名: ${s.name}
  性别: ${s.gender==="boy"?"男":s.gender==="girl"?"女":"其他"}
  年龄: ${s.age}
  出身地: ${s.background}
  难度: ${s.difficulty}
  金钱: ${s.money}
属性:
  HP: ${s.stats.hp}
  攻击: ${s.stats.atk}
  防御: ${s.stats.def}
  特攻: ${s.stats.spa}
  特防: ${s.stats.spd}
  速度: ${s.stats.spe}
天赋:
  - ${s.talents.join(`
  - `)}
---`),p=async()=>{await V(),c.value&&(c.value.scrollTop=c.value.scrollHeight)},h=async()=>{const o=l.value.trim();if(!(!o||n.value)){d.value.push({role:"user",content:o}),l.value="",p(),n.value=!0,u.value="";try{const a=await K(o,t=>{u.value=t,p()});d.value.push({role:"ai",content:a})}catch(a){console.error("生成回复失败:",a),d.value.push({role:"system",content:"系统提示：生成回复失败，请检查连接。"})}finally{n.value=!1,u.value="",p()}}};return y(()=>{setTimeout(async()=>{const o={玩家姓名:s.name,玩家性别:s.gender==="boy"?"男":s.gender==="girl"?"女":"其他",玩家年龄:s.age,玩家出身地:s.background,玩家难度:s.difficulty,玩家金钱:s.money,玩家HP:s.stats.hp,玩家攻击:s.stats.atk,玩家防御:s.stats.def,玩家特攻:s.stats.spa,玩家特防:s.stats.spd,玩家速度:s.stats.spe,玩家天赋:s.talents.join("、")};await S(o)},500)}),(o,a)=>(v(),m("div",P,[a[5]||(a[5]=e("aside",{class:"sidebar left-sidebar"},[e("div",{class:"sidebar-header"},[e("h3",null,"同行宝可梦")]),e("div",{class:"sidebar-content"},[e("p",{class:"placeholder-text"},"暂无宝可梦")])],-1)),e("main",j,[a[3]||(a[3]=e("div",{class:"chat-header"},[e("h2",null,"宝可梦世界旅途")],-1)),e("div",{class:"chat-messages",ref_key:"chatMessagesRef",ref:c},[e("div",A,[e("div",D,[e("pre",null,[e("code",null,r(g.value),1)])])]),(v(!0),m(b,null,$(d.value,(t,f)=>(v(),m("div",{key:f,class:B(["message",t.role==="user"?"user-message":"ai-message"])},[e("div",F,r(t.role==="user"?"我":"AI"),1),e("div",q,r(t.content),1)],2))),128)),n.value?(v(),m("div",z,[a[2]||(a[2]=e("div",{class:"message-avatar"},"AI",-1)),e("div",E,[k(r(u.value),1),a[1]||(a[1]=e("span",{class:"cursor"},null,-1))])])):x("",!0)],512),e("div",G,[w(e("textarea",{"onUpdate:modelValue":a[0]||(a[0]=t=>l.value=t),class:"chat-input",placeholder:"输入你的行动或对话...",onKeydown:H(M(h,["prevent"]),["enter"]),disabled:n.value},null,40,L),[[T,l.value]]),e("button",{class:"send-btn",onClick:h,disabled:!l.value.trim()||n.value}," 发送 ",8,U)])]),e("aside",Y,[a[4]||(a[4]=e("div",{class:"sidebar-header"},[e("h3",null,"周围环境")],-1)),e("div",J,[e("p",O,"当前位置："+r(C(s).background),1)])])]))}}),as=N(Q,[["__scopeId","data-v-ceefe8c7"]]);export{as as default};
