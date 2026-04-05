import{d as f,l as g,c as u,a as t,f as d,b as _,h,o as i,u as b}from"./index-Pr4WjJj1.js";import{u as k}from"./player-ByLaukEp.js";import{g as E}from"./tavern-BB2ffIF6.js";import{_ as S}from"./_plugin-vue_export-helper-DlAUqK2U.js";const T={class:"story-screen"},x={class:"story-container"},I=["innerHTML"],C={key:0,class:"loading-indicator"},L={key:0,class:"footer"},M=f({__name:"Story",setup($){const p=b(),s=k(),r=_(""),n=_(!0),v=h(()=>r.value.replace(/\n/g,"<br>"));g(async()=>{const a=E(),l=`
请根据以下玩家设定，生成一段宝可梦世界的开局剧情。
玩家姓名：{{getvar::player_name}}
性别：{{getvar::player_gender}}
年龄：{{getvar::player_age}}
出身地：{{getvar::player_background}}
难度：{{getvar::player_difficulty}}

要求：
1. 剧情要符合宝可梦世界的设定。
2. 描述玩家在出身地准备出发的情景。
3. 结尾要引出玩家即将获得第一只宝可梦或者踏上旅途。
4. 不要输出任何多余的解释，直接开始剧情描写。
`;if(a)try{const e=a.eventOn(a.iframe_events.STREAM_TOKEN_RECEIVED_FULLY,o=>{r.value=o}),c=await a.generate({user_input:l,should_silence:!0,should_stream:!0,injects:[{role:"system",content:"现在开始宝可梦角色扮演游戏。请根据玩家的设定，生成一段开局剧情。不要输出任何多余的解释，直接开始剧情描写。",position:"in_chat",depth:0,should_scan:!0}]});e.stop(),r.value=c}catch(e){console.error("生成剧情失败:",e),r.value="生成剧情失败，请检查网络或 API 设置。"}finally{n.value=!1}else{let e=`清晨的阳光透过窗户洒在你的脸上，你揉了揉惺忪的睡眼，从床上坐了起来。
今天是你在${s.background}出发的日子。
作为一名${s.age}岁的${s.gender==="boy"?"少年":s.gender==="girl"?"少女":"训练家"}，你一直梦想着成为宝可梦大师。
你穿好衣服，背上行囊，走下楼梯。妈妈已经在厨房里为你准备好了丰盛的早餐。
“${s.name}，快来吃早餐吧，吃饱了才有力气踏上旅途哦。”妈妈微笑着对你说。
你狼吞虎咽地吃完早餐，向妈妈道别后，推开了家门。
深吸一口气，你感受着清新的空气，心中充满了期待。
你的宝可梦之旅，即将开始！`,c="",o=0;const y=setInterval(()=>{o<e.length?(c+=e[o],r.value=c,o++):(clearInterval(y),n.value=!1)},50)}});const m=()=>{p.push("/home")};return(a,l)=>(i(),u("div",T,[t("div",x,[t("div",{class:"story-content",innerHTML:v.value},null,8,I),n.value?(i(),u("div",C,[...l[0]||(l[0]=[t("span",{class:"dot"},null,-1),t("span",{class:"dot"},null,-1),t("span",{class:"dot"},null,-1)])])):d("",!0)]),n.value?d("",!0):(i(),u("div",L,[t("button",{class:"action-btn",onClick:m},"开始旅途")]))]))}}),V=S(M,[["__scopeId","data-v-83ac4d6a"]]);export{V as default};
