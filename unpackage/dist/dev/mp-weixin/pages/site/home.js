(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/site/home"],{798:function(e,t,n){"use strict";n.r(t);var r=n(799),u=n(801);for(var a in u)"default"!==a&&function(e){n.d(t,e,(function(){return u[e]}))}(a);n(803);var i,c=n(15),o=Object(c["default"])(u["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],i);o.options.__file="pages/site/home.vue",t["default"]=o.exports},799:function(e,t,n){"use strict";n.r(t);var r=n(800);n.d(t,"render",(function(){return r["render"]})),n.d(t,"staticRenderFns",(function(){return r["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return r["recyclableRender"]})),n.d(t,"components",(function(){return r["components"]}))},800:function(e,t,n){"use strict";var r;n.r(t),n.d(t,"render",(function(){return u})),n.d(t,"staticRenderFns",(function(){return i})),n.d(t,"recyclableRender",(function(){return a})),n.d(t,"components",(function(){return r}));var u=function(){var e=this,t=e.$createElement;e._self._c},a=!1,i=[];u._withStripped=!0},801:function(e,t,n){"use strict";n.r(t);var r=n(802),u=n.n(r);for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);t["default"]=u.a},802:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=a(n(9)),u=n(12);function a(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n,r,u,a,i){try{var c=e[a](i),o=c.value}catch(s){return void n(s)}c.done?t(o):Promise.resolve(o).then(r,u)}function c(e){return function(){var t=this,n=arguments;return new Promise((function(r,u){var a=e.apply(t,n);function c(e){i(a,r,u,c,o,"next",e)}function o(e){i(a,r,u,c,o,"throw",e)}c(void 0)}))}}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var l=function(){n.e("components/ups-card/index").then(function(){return resolve(n(831))}.bind(null,n)).catch(n.oe)},f={name:"site",components:{"ups-card":l},data:function(){return{card:{name:"",remark:""},accountSum:{newMsgNum:0,wishOrderNum:0,totalOrderNum:0},bizCard:{site_bg:"",site:[{title:"最新产品",name:"product",color:"white",cuIcon:"shop",isOpen:!0,auth:!0},{title:"线上活动",name:"activity",color:"white",cuIcon:"activity",isOpen:!0,auth:!0}]}}},onShareAppMessage:function(e){return e.from,{title:"这是"+this.card.name+"的名片，请惠存。",imageUrl:this.card.cover||"",path:"/pagesSys/card/ShareCardDetail?id="+this.card._id,success:function(e){}}},onReady:function(){this.getDetail()},onShow:function(){var e=this;e.needWxAuth(),e.needAuthFlag||(e.getAccountSum(),e.getSiteElements())},computed:s({},(0,u.mapState)(["needAuthFlag","user"])),methods:s(s({},(0,u.mapMutations)(["needWxAuth","wxAuth","updateUser"])),{},{getDetail:function(){var e=this;return c(r.default.mark((function t(){var n,u;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e,!n.user._id){t.next=10;break}return u={},t.next=5,wx.cloud.callFunction({name:"sys",data:{$url:"getCardDetailByUserId",userId:n.user._id}});case 5:u=t.sent,n.card=u.result.data,n.cardId=n.card._id,n.accounts=[],n.user.userInfo.accounts.forEach((function(e){e.is_forbidden||n.accounts.push(e)}));case 10:case"end":return t.stop()}}),t)})))()},goMsgList:function(){var t=this;t.needAuthFlag?t.wxAuth(t.authBizInfo):e.navigateTo({url:"/pagesSys/my/MsgList"})},getAccountSum:function(){var e=this;return c(r.default.mark((function t(){var n,u;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e,u=null,!n.needAuthFlag){t.next=5;break}return n.wxAuth(n.authBizInfo),t.abrupt("return");case 5:return t.next=7,wx.cloud.callFunction({name:"cmn",data:{$url:"getSum",userId:n.user._id,sourceId:n.user.userInfo.cardId,targetId:n.user.userInfo.bizCardId}});case 7:u=t.sent,0==u.result.code&&(n.accountSum=u.result.data);case 9:case"end":return t.stop()}}),t)})))()},goWishOrderList:function(){var t=this;t.needAuthFlag?t.wxAuth(t.authBizInfo):e.navigateTo({url:"/pagesSys/my/WishOrderList"})},goTotalOrderList:function(){var t=this;t.needAuthFlag?t.wxAuth(t.authBizInfo):e.navigateTo({url:"/pagesSys/my/TotalOrderList"})},getSiteElements:function(){var e=this;return c(r.default.mark((function t(){var n,u;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=e,u=null,t.next=4,wx.cloud.callFunction({name:"sys",data:{$url:"getCardDetailById",id:n.user.userInfo.bizCardId}});case 4:u=t.sent,n.bizCard=u.result.data;case 6:case"end":return t.stop()}}),t)})))()},goItem:function(t){var n=this;console.log("item auth",t.currentTarget.dataset.item,"needWxAuth",this.needWxAuth(this.bizCard));var r=t.currentTarget.dataset.item;r.auth&&n.needAuthFlag?n.wxAuth(n.bizCard):r.isOpen?e.navigateTo({url:"/pagesSys/site/"+r.name}):e.showToast({icon:"none",title:"此功能暂未开通"})},goWebLogin:function(){e.navigateTo({url:"/pages/my/WebLogin"})}})};t.default=f}).call(this,n(1)["default"])},803:function(e,t,n){"use strict";n.r(t);var r=n(804),u=n.n(r);for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);t["default"]=u.a},804:function(e,t,n){}}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/site/home.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/site/home-create-component',
    {
        'pages/site/home-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(798))
        })
    },
    [['pages/site/home-create-component']]
]);
