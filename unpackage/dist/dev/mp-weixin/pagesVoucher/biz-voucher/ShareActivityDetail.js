(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pagesVoucher/biz-voucher/ShareActivityDetail"],{774:function(e,t,n){"use strict";(function(e){n(5);r(n(4));var t=r(n(775));function r(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=n,e(t.default)}).call(this,n(1)["createPage"])},775:function(e,t,n){"use strict";n.r(t);var r=n(776),a=n(778);for(var i in a)"default"!==i&&function(e){n.d(t,e,(function(){return a[e]}))}(i);n(780);var c,u=n(15),o=Object(u["default"])(a["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],c);o.options.__file="pagesVoucher/biz-voucher/ShareActivityDetail.vue",t["default"]=o.exports},776:function(e,t,n){"use strict";n.r(t);var r=n(777);n.d(t,"render",(function(){return r["render"]})),n.d(t,"staticRenderFns",(function(){return r["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return r["recyclableRender"]})),n.d(t,"components",(function(){return r["components"]}))},777:function(e,t,n){"use strict";var r;n.r(t),n.d(t,"render",(function(){return a})),n.d(t,"staticRenderFns",(function(){return c})),n.d(t,"recyclableRender",(function(){return i})),n.d(t,"components",(function(){return r}));var a=function(){var e=this,t=e.$createElement;e._self._c},i=!1,c=[];a._withStripped=!0},778:function(e,t,n){"use strict";n.r(t);var r=n(779),a=n.n(r);for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);t["default"]=a.a},779:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=i(n(9)),a=n(12);function i(e){return e&&e.__esModule?e:{default:e}}function c(e,t,n,r,a,i,c){try{var u=e[i](c),o=u.value}catch(s){return void n(s)}u.done?t(o):Promise.resolve(o).then(r,a)}function u(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var i=e.apply(t,n);function u(e){c(i,r,a,u,o,"next",e)}function o(e){c(i,r,a,u,o,"throw",e)}u(void 0)}))}}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var l={components:{},data:function(){return{isLoad:!1,loading:!1,isUps:!1,title:"",voucher:{activity_id:"",activity_name:"",num_send:0,num_send_used:0,num_total:0,num_used:0},activity:{name:"",avatar:"",card_id:"",card_name:"",type_code:"",type_name:"",entry_id:"",entry_name:"",price:0,use_condition:"",num_send:0,num_send_used:0,num_total:100,num_limit:1,num_used:1,num_progress:"0%",rule:{forbidden_region:!1,verified_reward:!1,forbidden_reward:!1,forbidden_share:!1},valid_date:""},CustomBar:this.CustomBar,existEntryFlag:!1,searchList:[{}],page:1,loadingType:0,search_str:""}},onLoad:function(e){var t=this;e.id&&t.getDetail(e.id),e.templateId&&t.getTemplate(e.templateId),t.$forceUpdate(),setTimeout((function(){t.loading=!0}),500)},computed:s({},(0,a.mapState)(["user"])),methods:{getTemplate:function(e){var t=this;return u(r.default.mark((function n(){var a,i,c;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=t,a.isLoad=!0,!e){n.next=8;break}return n.next=5,wx.cloud.callFunction({name:"vou",data:{$url:"getTemplateDetail",id:e||"0"}});case 5:i=n.sent,console.log("getDetail",i),0==i.result.code&&(c=i.result.data,a.title=c.title,a.activity.type_code=c.type_code,a.activity.type_name=c.type_name,a.activity.bg_color=c.bg_color,a.activity.icon=c.icon,a.activity.isOwner=a.user._id==a.activity.user_id,a.$forceUpdate());case 8:case"end":return n.stop()}}),n)})))()},getDetail:function(e){var t=this;return u(r.default.mark((function n(){var a,i,c;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=t,a.isLoad=!0,!e){n.next=10;break}return n.next=5,wx.cloud.callFunction({name:"vou",data:{$url:"getActivityDetail",id:e||"0"}});case 5:i=n.sent,console.log("getDetail",i),0==i.result.code&&(a.activity=i.result.data,a.getTemplate(a.activity.template_id),c=a.activity.num_send_used/a.activity.num_send*1e4,a.activity.num_progress=new Number(c).toFixed(4)/100+"%"),n.next=11;break;case 10:a.activity.user_id=a.user._id||"0";case 11:a.isLoad=!1;case 12:case"end":return n.stop()}}),n)})))()},getMyVoucher:function(){var t=this;return u(r.default.mark((function n(){var a,i,c;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return a=t,a.isLoad=!0,i={activity_id:a.activity._id,activity_name:a.activity.name,entry_id:a.activity.entry_id,entry_name:a.activity.entry_name,bg_color:a.activity.bg_color,icon:a.activity.icon,valid_date:a.activity.valid_date,card_id:a.activity.card_id,card_name:a.activity.card_name,card_avatar:a.activity.avatar,user_id:a.user._id,user_name:a.user.name,user_avatar:a.user.avatar,managed_user_id:a.activity.user_id,managed_user_name:a.activity.user_name,managed_user_avatar:a.activity.user_avatar,managed_status:"RECEIVED",managed_status_name:"已领取",num_total:parseInt(a.activity.num_send),num_used:0,price:parseFloat(a.activity.price),status:"TO_BE_USE",type_code:a.activity.type_code,type_name:a.activity.type_name,cover:a.activity.cover},n.next=5,wx.cloud.callFunction({name:"vou",data:{$url:"saveVoucher",voucher:i}});case 5:if(c=n.sent,console.log("getMyVoucher",i,c),0!=c.result.code){n.next=13;break}return a.activity.receive_success=!0,a.activity.num_send="0",a.activity.num_send_used=0,n.next=13,wx.cloud.callFunction({name:"vou",data:{$url:"saveActivity",activity:a.activity}});case 13:a.isLoad=!1,a.$forceUpdate(),e.showToast({icon:"success",title:"领券成功"}),setTimeout((function(){e.navigateTo({url:"/pagesVoucher/vou-customers/CustomerVoucherList"})}),1e3);case 17:case"end":return n.stop()}}),n)})))()},goHome:function(){e.reLaunch({url:"/pages/my/home"})}}};t.default=l}).call(this,n(1)["default"])},780:function(e,t,n){"use strict";n.r(t);var r=n(781),a=n.n(r);for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);t["default"]=a.a},781:function(e,t,n){}},[[774,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesVoucher/biz-voucher/ShareActivityDetail.js.map