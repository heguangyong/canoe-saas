(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesSys-my-NeedConfirmOrder"],{"0c3a":function(e,t,i){"use strict";(function(e){var r=i("4ea4");i("4160"),i("a9e3"),i("b680"),i("d3b7"),i("acd8"),i("ac1f"),i("1276"),i("159b"),i("ddb0"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,i("96cf");var a=r(i("1da1")),n=r(i("5530")),s=i("2f62"),o=r(i("e3fb")),u=r(i("6ac9")),c=r(i("aa9a")),l={components:{"ups-stepper":c.default,"uni-popup":u.default},data:function(){return{isLoad:!1,isUps:!1,orderIds:[],orderList:[],totalItemNum:0,totalPrice:"",recipient:{name:"",phone:"",address:"",remark:""},confirmOrder:{recipient:{name:"",phone:"",address:"",remark:""}}}},onLoad:function(t){t.orderIds&&(this.orderIds=t.orderIds.split(","),e("log","orderIds",this.orderIds," at pagesSys/my/NeedConfirmOrder.vue:129"))},onShow:function(){this.getDetail()},computed:(0,n.default)({},(0,s.mapState)(["user"])),methods:(0,n.default)((0,n.default)({},(0,s.mapMutations)(["updateUser"])),{},{getDetail:function(){var e=this;return(0,a.default)(regeneratorRuntime.mark((function t(){var i,r,a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return i=e,r=null,t.next=4,wx.cloud.callFunction({name:"cmn",data:{$url:"getNeedConfirmOrderListByUserId",userId:i.user._id,orderIds:i.orderIds,page:i.page}});case 4:if(r=t.sent,i.orderList=r.result.data||[],a=0,i.totalItemNum=0,i.orderList.forEach((function(e){e.items.forEach((function(e){i.totalItemNum+=e.num,a+=e.price*e.num}))})),i.confirmOrder.price_items=a,i.totalPrice="¥ "+parseFloat(a).toFixed(2),!i.user.userInfo.recipients){t.next=21;break}i.recipient=i.user.userInfo.recipients[0],t.t0=regeneratorRuntime.keys(i.user.userInfo.recipients);case 14:if((t.t1=t.t0()).done){t.next=21;break}if(n=t.t1.value,!i.user.userInfo.recipients[n].as_default){t.next=19;break}return i.recipient=i.user.userInfo.recipients[n],t.abrupt("break",21);case 19:t.next=14;break;case 21:case"end":return t.stop()}}),t)})))()},goItemDetail:function(e){uni.navigateTo({url:"/pagesCmn/product/ProductDetailExt?id="+e})},goAddAddress:function(){uni.navigateTo({url:"/pagesSys/my/AddressList"})},showRemark:function(){var e=this;e.$nextTick((function(){e.isUps=!0,e.$refs["showPopupRemark"].open()}))},cancel:function(e){this.$refs["show"+e].close()},change:function(e){e.show?this.isUps=!0:this.isUps=!1},saveRemark:function(){var e=this;return(0,a.default)(regeneratorRuntime.mark((function t(){var i,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:i=e,t.t0=regeneratorRuntime.keys(i.user.userInfo.recipients);case 2:if((t.t1=t.t0()).done){t.next=9;break}if(r=t.t1.value,!(i.user.userInfo.recipients[r].key=i.recipient.key)){t.next=7;break}return i.user.userInfo.recipients[r].remark=i.recipient.remark,t.abrupt("break",9);case 7:t.next=2;break;case 9:return i.updateUser(i.user),t.next=12,wx.cloud.callFunction({name:"sys",data:{$url:"updateUserInfo",id:i.user._id,userInfo:i.user.userInfo}});case 12:i.$forceUpdate(),i.$refs["showPopupRemark"].close();case 14:case"end":return t.stop()}}),t)})))()},placeOrder:function(){var e=this;return(0,a.default)(regeneratorRuntime.mark((function t(){var i,r,a,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return i=e,r=[],i.isLoad=!0,i.orderList.forEach((function(e){e.items.forEach((function(e){e.new_price=e.price,e.discount=10,r.push(e)}))})),i.confirmOrder.seller_avatar=i.user.userInfo.bizCardAvatar,i.confirmOrder.seller_name=i.user.userInfo.bizCardName,i.confirmOrder.seller_id=i.user.userInfo.bizCardId,i.confirmOrder.user_id=i.user._id,i.confirmOrder.avatar=i.user.userInfo.avatarUrl,i.confirmOrder.name=i.user.userInfo.nickName,i.confirmOrder.items=r,i.confirmOrder.recipient=i.recipient,i.confirmOrder.order_state="needPay",i.confirmOrder.order_total_item_num=i.totalItemNum,i.confirmOrder.price_shipping=0,i.confirmOrder.order_price=Number(i.confirmOrder.price_items+i.confirmOrder.price_shipping),i.confirmOrder.free_price=0,i.confirmOrder.need_price=i.confirmOrder.order_price,t.next=20,wx.cloud.callFunction({name:"cmn",data:{$url:"confirmOrder",order:i.confirmOrder}});case 20:if(a=t.sent,n=a.result._id,o.default.isEmpty(n)){t.next=27;break}return t.next=25,wx.cloud.callFunction({name:"cmn",data:{$url:"removeWishOrder",orderIds:i.orderIds}});case 25:uni.showToast({icon:"success",title:"下单成功"}),setTimeout((function(){uni.redirectTo({url:"/pagesSys/my/NeedPayOrder?id="+n})}),1e3);case 27:i.isLoad=!1;case 28:case"end":return t.stop()}}),t)})))()}})};t.default=l}).call(this,i("0de9")["log"])},"1fb1":function(e,t,i){var r=i("24fb");t=r(!1),t.push([e.i,".page[data-v-c09f29fa]{z-index:0;height:100vh}\n/* 底部分享 */.popup[data-v-c09f29fa]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;height:%?420?%;padding-bottom:62px;position:fixed;left:0;bottom:0;width:100%;z-index:95;border-top-left-radius:3%;border-top-right-radius:3%}.popup-close[data-v-c09f29fa]{position:absolute;top:%?30?%;left:%?30?%;font-size:%?39?%;text-align:center;font-weight:700;z-index:199}.popup-title[data-v-c09f29fa]{margin-top:%?15?%;line-height:%?60?%;font-size:%?28?%;padding:%?5?% 0;text-align:center;font-weight:700}.popup-content[data-v-c09f29fa]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;\n-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;padding:5px;max-height:%?950?%}\n/* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/.prevent[data-v-c09f29fa]{width:100%;height:100%;\n\t/*自动回到顶部*/\n\t/*position: fixed;*/top:0;left:0;overflow:hidden}\n/* 遮罩样式 */.shade[data-v-c09f29fa]{width:100%;height:100%;position:fixed;top:0;left:0;z-index:90}.ups-height[data-v-c09f29fa]{height:%?350?%;position:fixed;left:0;bottom:0;z-index:99}",""]),e.exports=t},2204:function(e,t,i){var r=i("1fb1");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=i("4f06").default;a("3b0586dc",r,!0,{sourceMap:!1,shadowMode:!1})},"42c5":function(e,t,i){"use strict";i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return n})),i.d(t,"a",(function(){return r}));var r={uniPopup:i("6ac9").default},a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{class:1==e.isUps?"prevent":""},[i("cu-custom",{attrs:{isBack:!0}},[i("template",{attrs:{slot:"backText"},slot:"backText"},[e._v("返回")]),i("template",{attrs:{slot:"content"},slot:"content"},[e._v("确认订单")]),i("template",{attrs:{slot:"right"},slot:"right"},[i("v-uni-view",{staticClass:"action"},[i("v-uni-view",{staticClass:"cu-load load-cuIcon",class:e.isLoad?"loading":"over"})],1)],1)],2),i("v-uni-view",{staticClass:"page"},[i("v-uni-view",{staticClass:"cu-list menu-avatar no-padding",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.goAddAddress.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"cu-item  card-radius margin-top-xxs margin-left-xs margin-right-xs margin-bottom-xs shadow bg-white.light"},[i("v-uni-view",{staticClass:"cu-avatar round"},[i("v-uni-view",{staticClass:"text-sm text-cut"},[e._v(e._s(e.recipient.key))])],1),i("v-uni-view",{staticClass:"content"},[i("v-uni-view",{staticClass:"text-grey"},[e._v(e._s(e.recipient.name)),i("v-uni-text",{staticClass:"margin-left-sm text-abc"},[e._v(e._s(e.recipient.phone))])],1),i("v-uni-view",{staticClass:"text-gray text-sm text-cut"},[e._v(e._s(e.recipient.address))])],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{staticClass:"cuIcon-right text-grey",staticStyle:{"font-size":"38rpx"}})],1)],1)],1),e._l(e.orderList,(function(t,r){return i("v-uni-view",{key:r,staticClass:"cu-card article",staticStyle:{width:"100%"}},[e._l(t.items,(function(t,r){return[i("v-uni-view",{key:r+"_0",staticClass:"cu-item shadow flex solid-bottom",staticStyle:{margin:"0 10rpx 0 10rpx",padding:"20rpx 0"}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-image",{staticClass:"bg-gray",staticStyle:{width:"30%"},attrs:{src:t.cover,mode:"aspectFill"},on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.goItemDetail(t.id)}}}),i("v-uni-view",{staticClass:"desc",staticStyle:{width:"70%"}},[i("v-uni-view",{staticClass:"text-content",on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.goItemDetail(t.id)}}},[i("v-uni-text",{attrs:{clas:"text-bold"}},[e._v(e._s(t.title))]),i("v-uni-text",{staticClass:"text-cut text-sm"},[e._v(e._s(t.content))])],1),i("v-uni-view",{staticClass:"flex margin-top-sm  \ufeffjustify-between"},[i("v-uni-view",{staticClass:"cu-capsule radius "},[i("v-uni-text",{staticClass:"text-gray"},[e._v(e._s("¥ "+parseFloat(t.price).toFixed(2)+t.unit_name))])],1),i("v-uni-view",{staticClass:"text-gray"},[e._v(e._s("x"+t.num))])],1)],1)],1)],1)]}))],2)})),i("v-uni-view",{staticClass:"margin-xs"},[i("v-uni-view",{staticClass:"cu-form-group",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.showRemark.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"title"},[e._v("备注")]),i("v-uni-input",{staticClass:"text-left",attrs:{placeholder:"选填，建议先和商家沟通后再填写"},model:{value:e.recipient.remark,callback:function(t){e.$set(e.recipient,"remark",t)},expression:"recipient.remark"}}),i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{staticClass:"cuIcon-comment text-grey",staticStyle:{"font-size":"38rpx"}})],1)],1)],1),i("v-uni-view",{staticClass:"cu-tabbar-height"}),i("v-uni-view",{staticClass:"cu-tabbar-height"}),e.isUps?e._e():i("v-uni-view",{staticClass:"cu-bar bg-white tabbar border  foot"},[i("v-uni-view",{staticStyle:{width:"75%"}},[i("v-uni-text",{staticClass:"margin-left-sm margin-right-sm"},[e._v("共"+e._s(e.totalItemNum)+"件，合计")]),i("v-uni-text",{staticClass:"text-red text-bold text-xl"},[e._v(e._s(e.totalPrice))])],1),i("v-uni-view",{staticClass:"bg-green submit text-lg",class:e.isLoad?"bg-gray":"",staticStyle:{width:"25%"},attrs:{disabled:e.isLoad},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.placeOrder.apply(void 0,arguments)}}},[e._v("下单")])],1)],2),e.isUps?i("v-uni-view",{staticClass:"shade"}):e._e(),i("uni-popup",{ref:"showPopupRemark",attrs:{type:"bottom"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.change.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"popup bg-white"},[i("v-uni-text",{staticClass:"cuIcon-close popup-close",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.cancel("PopupRemark")}}}),i("v-uni-text",{staticClass:"popup-title"},[e._v("添加备注")]),i("v-uni-view",{staticClass:"popup-content"},[i("v-uni-scroll-view",{staticClass:"ups-height",attrs:{"scroll-y":"true"}},[i("v-uni-view",[i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-textarea",{staticClass:"text-box font40 bg-white width100 padding-sm solid",staticStyle:{height:"200rpx"},attrs:{"scroll-y":"true",maxlength:"1200",placeholder:"请输入"},model:{value:e.recipient.remark,callback:function(t){e.$set(e.recipient,"remark",t)},expression:"recipient.remark"}})],1),i("v-uni-view",{staticClass:"cu-bar solid-bottom margin-top-xxs radius"}),i("v-uni-view",{staticClass:"cu-bar btn-group  foot bg-white"},[i("v-uni-button",{staticClass:"cu-btn   round line-grey",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.saveRemark.apply(void 0,arguments)}}},[e._v("确定")])],1)],1)],1)],1)],1)],1)],1)},n=[]},5040:function(e,t,i){"use strict";i.r(t);var r=i("0c3a"),a=i.n(r);for(var n in r)"default"!==n&&function(e){i.d(t,e,(function(){return r[e]}))}(n);t["default"]=a.a},"5e44":function(e,t,i){"use strict";i.r(t);var r=i("42c5"),a=i("5040");for(var n in a)"default"!==n&&function(e){i.d(t,e,(function(){return a[e]}))}(n);i("8e56");var s,o=i("f0c5"),u=Object(o["a"])(a["default"],r["b"],r["c"],!1,null,"c09f29fa",null,!1,r["a"],s);t["default"]=u.exports},"69e4":function(e,t,i){"use strict";i.r(t);var r=i("8f0e"),a=i.n(r);for(var n in r)"default"!==n&&function(e){i.d(t,e,(function(){return r[e]}))}(n);t["default"]=a.a},"8e56":function(e,t,i){"use strict";var r=i("2204"),a=i.n(r);a.a},"8f0e":function(e,t,i){"use strict";i("a9e3"),i("b680"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r={data:function(){return{stepperNum:0,stepperCacheNum:0}},name:"feng-stepper",props:{val:{type:[String,Number],default:0},min:{type:[String,Number],default:0},max:{type:[String,Number],default:0},step:{type:Number,default:1},label:{type:String,default:""},disabled:{type:Boolean,default:!1},active:{type:String,default:"#FFF"},unactive:{type:String,default:"#ddd"}},created:function(){this.stepperNum=this.val,this.stepperCacheNum=this.val},watch:{val:function(e){this.stepperNum=this.val}},methods:{less:function(){this.stepperNum<=this.min?this.stepperNum=this.min:this.stepperNum-=Math.ceil(10*this.step)/10,this.stepperCacheNum=Number(this.stepperNum.toFixed(1)),this.emit(this.stepperCacheNum,this.label,"less")},add:function(){this.stepperNum>=this.max?this.stepperNum=this.max:this.stepperNum+=Math.ceil(10*this.step)/10,this.stepperCacheNum=Number(this.stepperNum.toFixed(1)),this.emit(this.stepperCacheNum,this.label,"add")},emit:function(e,t,i){Number(e.toFixed(1))>this.max&&(e=this.max,this.stepperCacheNum=this.max),Number(e.toFixed(1))<this.min&&(e=this.min,this.stepperCacheNum=this.min),this.$emit("change",{val:e,label:t,type:i})},iptVal:function(e){Number(e.detail.value)>this.max?this.stepperNum=this.max:this.stepperNum}}};t.default=r},9226:function(e,t,i){"use strict";var r=i("d824"),a=i.n(r);a.a},aa9a:function(e,t,i){"use strict";i.r(t);var r=i("ab30"),a=i("69e4");for(var n in a)"default"!==n&&function(e){i.d(t,e,(function(){return a[e]}))}(n);i("9226");var s,o=i("f0c5"),u=Object(o["a"])(a["default"],r["b"],r["c"],!1,null,"5b422df3",null,!1,r["a"],s);t["default"]=u.exports},ab30:function(e,t,i){"use strict";var r;i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return n})),i.d(t,"a",(function(){return r}));var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{staticStyle:{display:"inline-block"}},[i("v-uni-view",{staticClass:"feng-stepper"},[e.stepperCacheNum>0?i("v-uni-view",{staticClass:"step-cr",style:e.stepperCacheNum<=e.min?"color:"+e.unactive+";":"color:"+e.active+";",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.less.apply(void 0,arguments)}}},[e._v("-")]):e._e(),e.stepperCacheNum>0?i("v-uni-input",{attrs:{type:"number",value:e.stepperCacheNum,disabled:!0},on:{input:function(t){arguments[0]=t=e.$handleEvent(t),e.iptVal.apply(void 0,arguments)}}}):e._e(),i("v-uni-view",{staticClass:"step-cr",style:e.stepperCacheNum>=e.max?"color:"+e.unactive+";":"color:"+e.active+";",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.add.apply(void 0,arguments)}}},[e._v("+")])],1)],1)},n=[]},d7ea:function(e,t,i){var r=i("24fb");t=r(!1),t.push([e.i,".feng-stepper[data-v-5b422df3]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#eee;border-radius:%?25?%}.feng-stepper .step-cr[data-v-5b422df3]{display:inline-block;font-size:%?32?%;line-height:%?44?%;border-radius:50%;height:%?50?%;width:%?50?%;background-color:#d3d3d3;text-align:center}.feng-stepper uni-input[data-v-5b422df3]{width:%?50?%;text-align:center;height:%?50?%}",""]),e.exports=t},d824:function(e,t,i){var r=i("d7ea");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=i("4f06").default;a("d81bf4ba",r,!0,{sourceMap:!1,shadowMode:!1})},e3fb:function(e,t,i){function r(e){return""===e||("null"===e||("undefined"===e||(!e&&0!==e&&""!==e||(!(!Array.prototype.isPrototypeOf(e)||0!==e.length)||!(!Object.prototype.isPrototypeOf(e)||0!==Object.keys(e).length)))))}function a(e,t){if(e){switch(t||(t="yyyy-MM-dd"),typeof e){case"string":e=new Date(e.replace(/-/,"/"));break;case"number":e=new Date(e);break}if(!(!e instanceof Date)){var i={yyyy:e.getFullYear(),M:e.getMonth()+1,d:e.getDate(),H:e.getHours(),m:e.getMinutes(),s:e.getSeconds(),MM:(""+(e.getMonth()+101)).substr(1),dd:(""+(e.getDate()+100)).substr(1),HH:(""+(e.getHours()+100)).substr(1),mm:(""+(e.getMinutes()+100)).substr(1),ss:(""+(e.getSeconds()+100)).substr(1)};return t.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,(function(){return i[arguments[0]]}))}}}function n(){return this.dateFormat(new Date,"yyyyMMdd")}function s(e,t){if(e){switch(t||(t="yyyy-MM-dd"),typeof e){case"string":e=new Date(e);break;case"number":e=new Date(e);break}if(!(!e instanceof Date)){var i={yyyy:e.getFullYear(),M:e.getMonth()+1,d:e.getDate(),H:e.getHours(),m:e.getMinutes(),s:e.getSeconds(),MM:(""+(e.getMonth()+101)).substr(1),dd:(""+(e.getDate()+100)).substr(1),HH:(""+(e.getHours()+100)).substr(1),mm:(""+(e.getMinutes()+100)).substr(1),ss:(""+(e.getSeconds()+100)).substr(1)};return t.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,(function(){return i[arguments[0]]}))}}}function o(e,t){var i=!1,r=Date.parse(e),a=Date.parse(t),n=new Date(a).setHours(0,0,0,0);return r<n&&(i=!0),i}function u(e,t){var i=!1,r=Date.parse(e),a=Date.parse(t);return r<a&&(i=!0),i}function c(e){if(e){var t=Date.parse(e),i=Date.parse(new Date),r=Math.abs(i-t);if(r>6048e5){var a=new Date(t),n=a.getFullYear(),s=a.getMonth()+1,o=a.getDate(),u=(new Date).getFullYear();return u==n?s+"月"+o+"日":n+"年"+s+"月"+o+"日"}if(r<6048e5&&r>864e5){var c=Math.floor(r/864e5);return c+"天前"}if(r<864e5&&r>36e5){c=Math.floor(r/36e5);return c+"小时前"}if(r<36e5&&r>=0)return"刚刚"}}function l(e){var t=/^[1][3,4,5,7,8,9][0-9]{9}$/;return!(!t.test(e)||11!=e.length)}function d(){var e=new Date,t="user/"+e.getFullYear()+(""+(e.getMonth()+101)).substr(1)+"/";return t}function p(e){var t="",i=6e4,r=60*i,a=24*r,n=30*a,s=(new Date).getTime(),o=s-e;if(!(o<0)){var u=o/n,c=o/(7*a),l=o/a,d=o/r,p=o/i;return t=u>=1?parseInt(u)+"月前":c>=1?parseInt(c)+"周前":l>=1?parseInt(l)+"天前":d>=1?parseInt(d)+"小时前":p>=1?parseInt(p)+"分钟前":"刚刚",t}}i("b64b"),i("e25e"),i("ac1f"),i("5319"),e.exports={isEmpty:r,dateFormat:a,today:n,formatTime:s,isDayBefore:o,isTimeBefore:u,formatCreateTime:c,isPhoneAvailable:l,cloudUploadPath:d,getDateDiff:p}}}]);