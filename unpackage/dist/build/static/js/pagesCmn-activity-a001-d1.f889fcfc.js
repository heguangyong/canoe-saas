(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesCmn-activity-a001-d1"],{"5f05":function(t,i,a){"use strict";var e;a.d(i,"b",(function(){return n})),a.d(i,"c",(function(){return s})),a.d(i,"a",(function(){return e}));var n=function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("v-uni-view",[a("v-uni-view",{staticClass:"margin-left cu-bar \ufefftabbar"},[a("v-uni-view",[a("v-uni-image",{staticStyle:{width:"400rpx",height:"60rpx"},attrs:{src:t.activity.actions[0].img1}})],1),a("v-uni-view",{staticClass:"action"},[a("v-uni-view",{staticClass:"cuIcon-cu-image"}),a("v-uni-view",{staticClass:"text-gray"})],1),a("v-uni-view",{staticClass:"action"},[a("v-uni-view",{staticClass:"cuIcon-cu-image",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.goHome.apply(void 0,arguments)}}},[a("v-uni-image",{staticStyle:{width:"50rpx",height:"50rpx"},attrs:{src:t.activity.home_icon}})],1),a("v-uni-view",{},[t._v("首页")])],1)],1),a("v-uni-view",{staticClass:"margin-left",staticStyle:{"margin-top":"-30rpx"}},[a("v-uni-view",{staticClass:"text-bold text-lg"},[t._v("精益求精 睿智精选")]),a("v-uni-view",{staticClass:"text-bold"},[t._v('"十分精选"定制产品交流会')])],1),a("v-uni-view",{staticClass:"padding-xs text-center margin-top solid-top"},[a("v-uni-view",{staticClass:"text-lg padding-xs"},[a("texxt",{staticClass:"margin-top text-bold text-lg "},[t._v("☆  活动简介  ☆")])],1)],1),a("v-uni-view",{staticClass:"margin-left margin-right padding"},[a("v-uni-text",{staticClass:"text-box  padding-sm text-df",attrs:{"scroll-y":"true"}},[t._v(t._s(t.activity.content))])],1),a("v-uni-view",{staticClass:"margin-left-xxl margin-right-xxl flex align-center"},[a("v-uni-image",{staticClass:"padding-xxl margin-left-xxl margin-right-xxl",staticStyle:{width:"100%"},attrs:{src:t.activity.logo,mode:"aspectFill"}})],1),a("v-uni-view",{staticClass:"cu-tabbar-height"}),a("v-uni-view",{staticClass:"cu-tabbar-height"})],1)},s=[]},"833e":function(t,i,a){"use strict";a.r(i);var e=a("5f05"),n=a("ed95");for(var s in n)"default"!==s&&function(t){a.d(i,t,(function(){return n[t]}))}(s);var c,r=a("f0c5"),u=Object(r["a"])(n["default"],e["b"],e["c"],!1,null,"2a5d212f",null,!1,e["a"],c);i["default"]=u.exports},b0e7:function(t,i,a){"use strict";var e=a("4ea4");Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,a("96cf");var n=e(a("1da1")),s=e(a("5530")),c=a("2f62"),r=e(a("d3b3")),u={data:function(){return{activity:{_id:"",qrcode:"",content:"",actions:[{img1:""}],home_icon:"",logo:""}}},onLoad:function(t){var i=this;i.activity._id=t.id,i.getDetail()},onShareAppMessage:function(t){if("button"===t.from){var i=t.target.dataset.activity;return{title:i.title,imageUrl:i.cover||"",path:"/pagesCmn/activity/ShareActivityDetail?id="+i._id,success:function(t){uni.showToast({icon:"success",title:"分享成功"})}}}},computed:(0,s.default)({},(0,c.mapState)(["user"])),methods:{getDetail:function(){var t=this;return(0,n.default)(regeneratorRuntime.mark((function i(){var a,e,n,s;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return a=t,e=null,i.next=4,r.default.callFunction({name:"web",data:{$url:"getActivityDetail",id:a.activity._id}});case 4:e=i.sent,a.activity=JSON.parse(e.result.data),n=a.activity.sign_up.date+" "+a.activity.sign_up.time,s=a.activity.sign_in.date+" "+a.activity.sign_in.time,a.activity.sign_up=n,a.activity.sign_in=s;case 10:case"end":return i.stop()}}),i)})))()},goHome:function(){uni.navigateBack()}}};i.default=u},ed95:function(t,i,a){"use strict";a.r(i);var e=a("b0e7"),n=a.n(e);for(var s in e)"default"!==s&&function(t){a.d(i,t,(function(){return e[t]}))}(s);i["default"]=n.a}}]);