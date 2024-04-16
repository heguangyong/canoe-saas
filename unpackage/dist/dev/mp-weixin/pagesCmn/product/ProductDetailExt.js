(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pagesCmn/product/ProductDetailExt"],{654:function(e,t,n){"use strict";(function(e){n(5);r(n(4));var t=r(n(655));function r(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=n,e(t.default)}).call(this,n(1)["createPage"])},655:function(e,t,n){"use strict";n.r(t);var r=n(656),o=n(658);for(var u in o)"default"!==u&&function(e){n.d(t,e,(function(){return o[e]}))}(u);n(660);var a,i=n(15),c=Object(i["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],a);c.options.__file="pagesCmn/product/ProductDetailExt.vue",t["default"]=c.exports},656:function(e,t,n){"use strict";n.r(t);var r=n(657);n.d(t,"render",(function(){return r["render"]})),n.d(t,"staticRenderFns",(function(){return r["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return r["recyclableRender"]})),n.d(t,"components",(function(){return r["components"]}))},657:function(e,t,n){"use strict";var r;n.r(t),n.d(t,"render",(function(){return o})),n.d(t,"staticRenderFns",(function(){return a})),n.d(t,"recyclableRender",(function(){return u})),n.d(t,"components",(function(){return r}));try{r={uniPopup:function(){return n.e("components/uni-popup/uni-popup").then(n.bind(null,810))}}}catch(i){if(-1===i.message.indexOf("Cannot find module")||-1===i.message.indexOf(".vue"))throw i;console.error(i.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var o=function(){var e=this,t=e.$createElement;e._self._c},u=!1,a=[];o._withStripped=!0},658:function(e,t,n){"use strict";n.r(t);var r=n(659),o=n.n(r);for(var u in r)"default"!==u&&function(e){n.d(t,e,(function(){return r[e]}))}(u);t["default"]=o.a},659:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=u(n(9)),o=n(12);function u(e){return e&&e.__esModule?e:{default:e}}function a(e,t,n,r,o,u,a){try{var i=e[u](a),c=i.value}catch(s){return void n(s)}i.done?t(c):Promise.resolve(c).then(r,o)}function i(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var u=e.apply(t,n);function i(e){a(u,r,o,i,c,"next",e)}function c(e){a(u,r,o,i,c,"throw",e)}i(void 0)}))}}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var p=function(){n.e("components/uni-popup/uni-popup").then(function(){return resolve(n(810))}.bind(null,n)).catch(n.oe)},l=function(){n.e("components/ups-stepper/index").then(function(){return resolve(n(853))}.bind(null,n)).catch(n.oe)},f={components:{"uni-popup":p,"ups-stepper":l},data:function(){return{isLoad:!1,isUps:!1,product:{_id:"",qrcode:"",detail:{content:"",images:[],imgList:[],videos:[]},num:1},priceAndUnitName:"",authBizInfo:{}}},onLoad:function(e){var t=this;if(e.id)t.product._id=e.id,t.getDetail();else if(e.scene){t.paramsStr+="scene="+e.scene;var n={},r=decodeURIComponent(e.scene).split("&");r.forEach((function(e){var r=e.split("=");n[r[0]]=r[1],"qrcode"==r[0]&&(t.product.qrcode=r[1])})),t.getDetailByQrcode()}t.authBizInfo={_id:t.product.card_id,name:t.product.name,avatar:t.product.avatar},t.needWxAuth(t.authBizInfo)},onReady:function(){wx.setNavigationBarTitle({title:"产品详情"})},onShareAppMessage:function(e){if("button"===e.from){var t=e.target.dataset.product;return{title:t.title,imageUrl:t.cover||"",path:"/pagesCmn/product/ShareProductDetail?id="+t._id}}},computed:s({},(0,o.mapState)(["needAuthFlag","user","cardAccount"])),methods:s(s({},(0,o.mapMutations)(["needWxAuth","wxAuth","updateUser","updateUserAuth"])),{},{ShareProductDetail:function(){e.showShareMenu({withShareTicket:!0})},getDetail:function(){var e=this;return i(r.default.mark((function t(){var n,o;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=e,o=null,t.next=4,wx.cloud.callFunction({name:"cmn",data:{$url:"getProductDetail",id:n.product._id}});case 4:o=t.sent,n.product=o.result.data,n.product.num=1,n.priceAndUnitName="¥ "+parseFloat(n.product.price).toFixed(2)+n.product.unit_name,n.authBizInfo={_id:n.product.card_id,name:n.product.name,avatar:n.product.avatar},n.needWxAuth(n.authBizInfo);case 10:case"end":return t.stop()}}),t)})))()},getDetailByQrcode:function(){var e=this;return i(r.default.mark((function t(){var n,o;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=e,o={},t.next=4,wx.cloud.callFunction({name:"cmn",data:{$url:"getProductDetailByQrcode",qrcode:n.product.qrcode}});case 4:o=t.sent,n.product=o.result.data,n.product.num=1,n.priceAndUnitName="¥ "+parseFloat(n.product.price).toFixed(2)+n.product.unit_name,n.authBizInfo={_id:n.product.card_id,name:n.product.name,avatar:n.product.avatar},n.needWxAuth(n.authBizInfo);case 10:case"end":return t.stop()}}),t)})))()},previewImage:function(e){var t=this;console.log(e);var n="",r=[];for(var o in n=e.currentTarget.dataset.src,t.product.carouse)r.push(t.product.carouse[o]);for(var u=0;u<t.product.detail.images.length;u++)r.push(t.product.detail.images[u]);wx.previewImage({current:n,urls:r})},goWebLogin:function(){e.navigateTo({url:"/pages/my/WebLogin"})},startTalk:function(){var t=this;return i(r.default.mark((function n(){var o;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(o=t,!o.needAuthFlag){n.next=5;break}return o.wxAuth(o.authBizInfo),setTimeout((function(){o.startTalk()}),2e3),n.abrupt("return");case 5:o.updateUserAuth(o.authBizInfo),setTimeout((function(){e.navigateTo({url:"/pagesSys/site/service"})}),1e3);case 7:case"end":return n.stop()}}),n)})))()},goMy:function(){var t=this;if(t.needAuthFlag)return t.wxAuth(t.authBizInfo),void setTimeout((function(){t.goMy()}),2e3);t.updateUserAuth(t.authBizInfo),setTimeout((function(){e.reLaunch({url:"/pages/my/home"})}),1e3)},goWishOrderList:function(){var t=this;if(t.needAuthFlag)return t.wxAuth(t.authBizInfo),void setTimeout((function(){t.goWishOrderList()}),2e3);t.updateUserAuth(t.authBizInfo),setTimeout((function(){e.navigateTo({url:"/pagesSys/my/WishOrderList"})}),1e3)},showWishProduct:function(){var e=this;if(e.needAuthFlag)return e.wxAuth(e.authBizInfo),void setTimeout((function(){e.showWishProduct()}),2e3);e.updateUserAuth(e.authBizInfo),e.$nextTick((function(){e.isUps=!0,e.$refs["showPopupWishProduct"].open()}))},showBuyProduct:function(){var e=this;if(e.needAuthFlag)return e.wxAuth(e.authBizInfo),void setTimeout((function(){e.showBuyProduct()}),2e3);e.updateUserAuth(e.authBizInfo),e.$nextTick((function(){e.isUps=!0,e.$refs["showPopupBuyProduct"].open()}))},cancel:function(e){this.$refs["show"+e].close()},change:function(e){e.show?this.isUps=!0:this.isUps=!1},stepper:function(e){console.log(e),e.val>0&&(this.product.num=e.val)},submitOrder:function(){var t=this;return i(r.default.mark((function n(){var o,u,a;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return o=t,u=[{id:o.product._id,num:o.product.num,cover:o.product.carouse[0],title:o.product.title,content:o.product.detail.content,price:o.product.price,unit_name:o.product.unit_name,new_price:o.product.price,discount:10}],a={},a.seller_avatar=o.product.avatar,a.seller_name=o.product.name,a.user_id=o.user._id,a.avatar=o.user.userInfo.avatarUrl,a.name=o.user.userInfo.nickName,a.items=u,a.order_state="wish",o.isLoad=!0,n.next=13,wx.cloud.callFunction({name:"cmn",data:{$url:"addWishOrder",order:a}});case 13:o.isLoad=!1,e.showToast({icon:"success",title:"加入购物袋成功"}),o.$refs["showPopupWishProduct"].close(),setTimeout((function(){e.navigateTo({url:"/pagesSys/my/WishOrderList"})}),1e3);case 17:case"end":return n.stop()}}),n)})))()},placeOrder:function(){var t=this;return i(r.default.mark((function n(){var o,u,a,i;return r.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return o=t,o.isLoad=!0,u=[{id:o.product._id,num:o.product.num,cover:o.product.carouse[0],title:o.product.title,content:o.product.detail.content,price:o.product.price,unit_name:o.product.unit_name,new_price:o.product.price,discount:10}],a={},a.seller_avatar=o.product.avatar,a.seller_name=o.product.name,a.user_id=o.user._id,a.avatar=o.user.userInfo.avatarUrl,a.name=o.user.userInfo.nickName,a.items=u,a.order_state="wish",n.next=13,wx.cloud.callFunction({name:"cmn",data:{$url:"addWishOrder",order:a}});case 13:i=n.sent,o.isLoad=!1,console.log("addWishOrder res",i),e.showToast({icon:"success",title:"生成订单成功"}),o.$refs["showPopupBuyProduct"].close(),setTimeout((function(){e.navigateTo({url:"/pagesSys/my/NeedConfirmOrder?orderIds="+i.result._id})}),1e3);case 19:case"end":return n.stop()}}),n)})))()},goQrcode:function(t){console.log("goQrcode",t),e.navigateTo({url:"/pagesCmn/product/ProductQrcode?id="+t})}})};t.default=f}).call(this,n(1)["default"])},660:function(e,t,n){"use strict";n.r(t);var r=n(661),o=n.n(r);for(var u in r)"default"!==u&&function(e){n.d(t,e,(function(){return r[e]}))}(u);t["default"]=o.a},661:function(e,t,n){}},[[654,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pagesCmn/product/ProductDetailExt.js.map