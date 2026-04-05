import{d as g,l as f,c as u,a as t,f as _,b as d,h,o as i,u as b}from"./index-DJxd5Wv9.js";import{u as k}from"./player-BYME4yqF.js";import{g as E}from"./tavern-CBk0wHIo.js";import{_ as S}from"./_plugin-vue_export-helper-DlAUqK2U.js";const T={class:"story-screen"},x={class:"story-container"},I=["innerHTML"],C={key:0,class:"loading-indicator"},L={key:0,class:"footer"},M=g({__name:"Story",setup($){const p=b(),s=k(),a=d(""),n=d(!0),m=h(()=>a.value.replace(/\n/g,"<br>"));f(async()=>{const r=E(),l=`请根据以下玩家设定，生成一段宝可梦世界的开局剧情。
要求：
1. 剧情要符合宝可梦世界的设定。
2. 描述玩家在出身地准备出发的情景。
3. 结尾要引出玩家即将获得第一只宝可梦或者踏上旅途。
4. 不要输出任何多余的解释，直接开始剧情描写。

\`\`\`yaml
玩家设定:
  姓名: "{{getvar::player_name}}"
  性别: "{{getvar::player_gender}}"
  年龄: "{{getvar::player_age}}"
  出身地: "{{getvar::player_background}}"
  难度: "{{getvar::player_difficulty}}"
  天赋: "{{getvar::player_talents}}"
\`\`\`
`;if(r)try{const e=r.eventOn(r.iframe_events.STREAM_TOKEN_RECEIVED_FULLY,o=>{a.value=o}),c=await r.generate({user_input:l,should_silence:!0,should_stream:!0,injects:[{role:"system",content:"现在开始宝可梦角色扮演游戏。请根据玩家的设定，生成一段开局剧情。不要输出任何多余的解释，直接开始剧情描写。",position:"in_chat",depth:0,should_scan:!0}]});e.stop(),a.value=c}catch(e){console.error("生成剧情失败:",e),a.value="生成剧情失败，请检查网络或 API 设置。"}finally{n.value=!1}else{let e=`清晨的阳光透过窗户洒在你的脸上，你揉了揉惺忪的睡眼，从床上坐了起来。
今天是你在${s.background}出发的日子。
作为一名${s.age}岁的${s.gender==="boy"?"少年":s.gender==="girl"?"少女":"训练家"}，你一直梦想着成为宝可梦大师。
你穿好衣服，背上行囊，走下楼梯。妈妈已经在厨房里为你准备好了丰盛的早餐。
“${s.name}，快来吃早餐吧，吃饱了才有力气踏上旅途哦。”妈妈微笑着对你说。
你狼吞虎咽地吃完早餐，向妈妈道别后，推开了家门。
深吸一口气，你感受着清新的空气，心中充满了期待。
你的宝可梦之旅，即将开始！`,c="",o=0;const y=setInterval(()=>{o<e.length?(c+=e[o],a.value=c,o++):(clearInterval(y),n.value=!1)},50)}});const v=()=>{p.push("/home")};return(r,l)=>(i(),u("div",T,[t("div",x,[t("div",{class:"story-content",innerHTML:m.value},null,8,I),n.value?(i(),u("div",C,[...l[0]||(l[0]=[t("span",{class:"dot"},null,-1),t("span",{class:"dot"},null,-1),t("span",{class:"dot"},null,-1)])])):_("",!0)]),n.value?_("",!0):(i(),u("div",L,[t("button",{class:"action-btn",onClick:v},"开始旅途")]))]))}}),R=S(M,[["__scopeId","data-v-17eae470"]]);export{R as default};
