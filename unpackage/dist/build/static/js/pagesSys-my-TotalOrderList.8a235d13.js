(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesSys-my-TotalOrderList"],{"3e45":function(t,e,n){var i=n("af52");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=n("4f06").default;a("de955124",i,!0,{sourceMap:!1,shadowMode:!1})},5789:function(t,e,n){"use strict";(function(t){var i=n("4ea4");n("4160"),n("159b"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("2909"));n("96cf");var r=i(n("1da1")),s=i(n("5530")),o=n("2f62"),u=i(n("e3fb")),c={data:function(){return{orderStates:["needPay","canceled","needSend","shipped","finished"],orderList:[],page:1,tabCur:0,tabs:["全部","待付款","待收货","退款/售后"],bizCard:{},currentOrder:{bill_num:""}}},onShow:function(){this.tabCur=0,this.page=1,this.getList()},onPullDownRefresh:function(){this.page=1,this.getList(),uni.stopPullDownRefresh()},onReachBottom:function(){this.page++,this.getList()},computed:(0,s.default)((0,s.default)({},(0,o.mapState)(["user"])),{},{formatDateTime:function(){return function(t){var e=t;return e?u.default.formatTime(e,"yyyy-MM-dd HH:mm"):""}},showOrderState:function(){return function(t){var e=t;return"needPay"==e?"待付款":"needSend"==e?"待商家发货":"shipped"==e?"商家已发货":"finished"==e?"已完成":"canceled"==e?"已取消":void 0}}}),methods:{tabSelect:function(t){var e=this;e.tabCur=t.currentTarget.dataset.id,e.page=1,e.orderList=[],0===e.tabCur?(e.orderStates=["needPay","canceled","needSend","shipped","finished"],e.getList()):1===e.tabCur?(e.orderStates=["needPay"],e.getList()):2===e.tabCur?(e.orderStates=["needSend","shipped"],e.getList()):3===e.tabCur&&(e.orderStates=["finished"],e.getList())},getList:function(){var t=this;return(0,r.default)(regeneratorRuntime.mark((function e(){var n,i,r,s,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=t,1==n.page&&(n.orderList=[]),i=null,e.next=5,wx.cloud.callFunction({name:"cmn",data:{$url:"getOrderListByUserIdAndState",userId:n.user._id,orderStates:n.orderStates,page:n.page}});case 5:i=e.sent,u.default.isEmpty(i.result.data)||(r=n.orderList).push.apply(r,(0,a.default)(i.result.data)),s=0,o=0,n.orderList.forEach((function(t){"needPay"==t.order_state?s++:"needSend"==t.order_state&&o++})),s>0&&(n.tabs[1]="待付款 "+s),o>0&&(n.tabs[2]="待收货 "+o),n.$forceUpdate();case 13:case"end":return e.stop()}}),e)})))()},goDetail:function(e,n){t("log","goDetail",e,n," at pagesSys/my/TotalOrderList.vue:227"),"needPay"==e?uni.navigateTo({url:"/pagesSys/my/NeedPayOrder?id="+n}):"canceled"==e?uni.navigateTo({url:"/pagesSys/my/CanceledOrder?id="+n}):"needSend"==e?uni.navigateTo({url:"/pagesSys/my/WaitSendOrder?id="+n}):"shipped"==e?uni.navigateTo({url:"/pagesSys/my/ShippedOrder?id="+n}):"finished"==e&&uni.navigateTo({url:"/pagesSys/my/FinishedOrder?id="+n})},doCancel:function(t){var e=this;return(0,r.default)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return e,t.order_state="canceled",n.next=4,wx.cloud.callFunction({name:"cmn",data:{$url:"updateOrder",order:t}});case 4:uni.showToast({icon:"success",title:"订单已取消"}),setTimeout((function(){uni.navigateTo({url:"/pagesSys/my/CanceledOrder?id="+t._id})}),1e3);case 6:case"end":return n.stop()}}),n)})))()},showPayOrder:function(t){var e=this;return(0,r.default)(regeneratorRuntime.mark((function n(){var i,a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return i=e,i.currentOrder=t,n.next=4,wx.cloud.callFunction({name:"sys",data:{$url:"getCardDetailById",id:i.user.userInfo.bizCardId}});case 4:a=n.sent,i.bizCard=a.result.data,i.$nextTick((function(){i.isUps=!0,i.$refs["showPopupPayOrder"].open()}));case 7:case"end":return n.stop()}}),n)})))()},cancel:function(t){this.$refs["show"+t].close()},change:function(t){t.show?this.isUps=!0:this.isUps=!1},inputBillNum:function(e){var n=this;t("log","inputBillNum",e," at pagesSys/my/TotalOrderList.vue:303"),n.currentOrder.bill_num=e.detail.value,n.$forceUpdate()},payOrder:function(t){var e=this;return(0,r.default)(regeneratorRuntime.mark((function n(){var i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return i=e,i.currentOrder.order_state="needSend",i.currentOrder.pay_type=t,n.next=5,wx.cloud.callFunction({name:"cmn",data:{$url:"payOrder",order:i.currentOrder}});case 5:uni.showToast({icon:"success",title:"付款成功"}),i.$refs["showPopupPayOrder"].close(),setTimeout((function(){uni.navigateTo({url:"/pagesSys/my/WaitSendOrder?id="+i.currentOrder._id})}),1e3);case 8:case"end":return n.stop()}}),n)})))()},confirmReceiveOrder:function(t){var e=this;return(0,r.default)(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return e,t.order_state="finished",n.next=4,wx.cloud.callFunction({name:"cmn",data:{$url:"updateOrder",order:t}});case 4:uni.showToast({icon:"success",title:"确认已收货"});case 5:case"end":return n.stop()}}),n)})))()}}};e.default=c}).call(this,n("0de9")["log"])},af52:function(t,e,n){var i=n("24fb");e=i(!1),e.push([t.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* 底部分享 */.popup[data-v-2ea7bd4a]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;height:%?920?%;padding-bottom:62px;position:fixed;left:0;bottom:0;width:100%;z-index:95;border-top-left-radius:3%;border-top-right-radius:3%}.popup-close[data-v-2ea7bd4a]{position:absolute;top:%?30?%;left:%?30?%;font-size:%?39?%;text-align:center;font-weight:700;z-index:199}.popup-title[data-v-2ea7bd4a]{margin-top:%?15?%;line-height:%?60?%;font-size:%?28?%;padding:%?5?% 0;text-align:center;font-weight:700}.popup-content[data-v-2ea7bd4a]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;\n-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;padding:5px;max-height:%?950?%}\n/* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/.prevent[data-v-2ea7bd4a]{width:100%;height:100%;\n\t/*自动回到顶部*/\n\t/*position: fixed;*/top:0;left:0;overflow:hidden}\n/* 遮罩样式 */.shade[data-v-2ea7bd4a]{width:100%;height:100%;position:fixed;top:0;left:0;z-index:90}.ups-height[data-v-2ea7bd4a]{height:%?850?%;position:fixed;left:0;bottom:0;z-index:99}.content-box[data-v-2ea7bd4a]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;\n-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:100%}.qrcode-image[data-v-2ea7bd4a]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;\n-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;width:%?390?%;height:%?500?%;overflow:hidden;border-radius:%?50?%}.content-text[data-v-2ea7bd4a]{font-size:%?26?%;color:#333;padding-top:5px;padding-bottom:10px}",""]),t.exports=e},af5b:function(t,e,n){"use strict";var i=n("3e45"),a=n.n(i);a.a},b2ad:function(t,e,n){"use strict";n.r(e);var i=n("5789"),a=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,(function(){return i[t]}))}(r);e["default"]=a.a},e3fb:function(t,e,n){function i(t){return""===t||("null"===t||("undefined"===t||(!t&&0!==t&&""!==t||(!(!Array.prototype.isPrototypeOf(t)||0!==t.length)||!(!Object.prototype.isPrototypeOf(t)||0!==Object.keys(t).length)))))}function a(t,e){if(t){switch(e||(e="yyyy-MM-dd"),typeof t){case"string":t=new Date(t.replace(/-/,"/"));break;case"number":t=new Date(t);break}if(!(!t instanceof Date)){var n={yyyy:t.getFullYear(),M:t.getMonth()+1,d:t.getDate(),H:t.getHours(),m:t.getMinutes(),s:t.getSeconds(),MM:(""+(t.getMonth()+101)).substr(1),dd:(""+(t.getDate()+100)).substr(1),HH:(""+(t.getHours()+100)).substr(1),mm:(""+(t.getMinutes()+100)).substr(1),ss:(""+(t.getSeconds()+100)).substr(1)};return e.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,(function(){return n[arguments[0]]}))}}}function r(){return this.dateFormat(new Date,"yyyyMMdd")}function s(t,e){if(t){switch(e||(e="yyyy-MM-dd"),typeof t){case"string":t=new Date(t);break;case"number":t=new Date(t);break}if(!(!t instanceof Date)){var n={yyyy:t.getFullYear(),M:t.getMonth()+1,d:t.getDate(),H:t.getHours(),m:t.getMinutes(),s:t.getSeconds(),MM:(""+(t.getMonth()+101)).substr(1),dd:(""+(t.getDate()+100)).substr(1),HH:(""+(t.getHours()+100)).substr(1),mm:(""+(t.getMinutes()+100)).substr(1),ss:(""+(t.getSeconds()+100)).substr(1)};return e.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,(function(){return n[arguments[0]]}))}}}function o(t,e){var n=!1,i=Date.parse(t),a=Date.parse(e),r=new Date(a).setHours(0,0,0,0);return i<r&&(n=!0),n}function u(t,e){var n=!1,i=Date.parse(t),a=Date.parse(e);return i<a&&(n=!0),n}function c(t){if(t){var e=Date.parse(t),n=Date.parse(new Date),i=Math.abs(n-e);if(i>6048e5){var a=new Date(e),r=a.getFullYear(),s=a.getMonth()+1,o=a.getDate(),u=(new Date).getFullYear();return u==r?s+"月"+o+"日":r+"年"+s+"月"+o+"日"}if(i<6048e5&&i>864e5){var c=Math.floor(i/864e5);return c+"天前"}if(i<864e5&&i>36e5){c=Math.floor(i/36e5);return c+"小时前"}if(i<36e5&&i>=0)return"刚刚"}}function l(t){var e=/^[1][3,4,5,7,8,9][0-9]{9}$/;return!(!e.test(t)||11!=t.length)}function d(){var t=new Date,e="user/"+t.getFullYear()+(""+(t.getMonth()+101)).substr(1)+"/";return e}function f(t){var e="",n=6e4,i=60*n,a=24*i,r=30*a,s=(new Date).getTime(),o=s-t;if(!(o<0)){var u=o/r,c=o/(7*a),l=o/a,d=o/i,f=o/n;return e=u>=1?parseInt(u)+"月前":c>=1?parseInt(c)+"周前":l>=1?parseInt(l)+"天前":d>=1?parseInt(d)+"小时前":f>=1?parseInt(f)+"分钟前":"刚刚",e}}n("b64b"),n("e25e"),n("ac1f"),n("5319"),t.exports={isEmpty:i,dateFormat:a,today:r,formatTime:s,isDayBefore:o,isTimeBefore:u,formatCreateTime:c,isPhoneAvailable:l,cloudUploadPath:d,getDateDiff:f}},e918:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return i}));var i={uniPopup:n("6ac9").default},a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{class:1==t.isUps?"prevent":""},[n("cu-custom",{attrs:{isBack:!0}},[n("template",{attrs:{slot:"backText"},slot:"backText"},[t._v("返回")]),n("template",{attrs:{slot:"content"},slot:"content"},[t._v("我的订单")]),n("template",{attrs:{slot:"right"},slot:"right"},[n("v-uni-view",{staticClass:"action"},[n("v-uni-view",{staticClass:"cu-load load-cuIcon",class:t.isLoad?"loading":"over"})],1)],1)],2),n("v-uni-scroll-view",{staticClass:"nav",attrs:{"scroll-x":!0}},[n("v-uni-view",{staticClass:"flex text-center"},t._l(t.tabs,(function(e,i){return n("v-uni-view",{key:i,staticClass:"cu-item flex-sub",class:i==t.tabCur?"cur":"",attrs:{"data-id":i},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.tabSelect.apply(void 0,arguments)}}},[t._v(t._s(t.tabs[i]))])})),1)],1),t._l(t.orderList,(function(e,i){return n("v-uni-scroll-view",{key:i,attrs:{"scroll-y":!0}},[n("v-uni-view",{staticClass:"margin-top-sm cu-card article solid-bottom",staticStyle:{width:"100%"}},[n("v-uni-view",{staticClass:"margin-left-xs margin-right-xs cu-form-group solid-bottom radius",on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.goDetail(e.order_state,e._id)}}},[n("v-uni-view",{staticClass:"title"},[t._v(t._s("订单编号："+e.order_num))]),n("v-uni-view",{staticClass:"text-left text-red"},[t._v(t._s(t.showOrderState(e.order_state)))])],1),t._l(e.items,(function(i,a){return[n("v-uni-view",{key:a+"_0",staticClass:"cu-item shadow flex solid-bottom",staticStyle:{margin:"0 10rpx 0 10rpx",padding:"20rpx 0"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.goDetail(e.order_state,e._id)}}},[n("v-uni-view",{staticClass:"content"},[n("v-uni-image",{staticClass:"bg-gray",staticStyle:{width:"30%"},attrs:{src:i.cover,mode:"aspectFill"}}),n("v-uni-view",{staticClass:"desc",staticStyle:{width:"70%"}},[n("v-uni-view",{staticClass:"text-content"},[n("v-uni-text",{attrs:{clas:"text-bold"}},[t._v(t._s(i.title))]),n("v-uni-text",{staticClass:"text-cut text-sm"},[t._v(t._s(i.content))])],1),n("v-uni-view",{staticClass:"flex margin-top-sm  \ufeffjustify-between"},[n("v-uni-view",{staticClass:"cu-capsule radius "},[n("v-uni-text",{staticClass:"text-gray"},[t._v(t._s("¥ "+parseFloat(i.price).toFixed(2)+i.unit_name))])],1),n("v-uni-view",{staticClass:"text-gray"},[t._v(t._s("x"+i.num))])],1)],1)],1),"waitReturnPay"==i.item_state?n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-view",{staticClass:"title"}),n("v-uni-view",{staticClass:"text-left text-grey"},[t._v("待商家处理")])],1):t._e(),"disagreeReturnPay"==i.item_state?n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-view",{staticClass:"title"}),n("v-uni-view",{staticClass:"text-left text-grey"},[t._v("商家拒绝退款")])],1):t._e(),"finishReturnPay"==i.item_state?n("v-uni-view",{staticClass:"cu-form-group"},[n("v-uni-view",{staticClass:"title"}),n("v-uni-view",{staticClass:"text-left text-grey"},[t._v("退款成功")])],1):t._e()],1)]})),n("v-uni-view",{staticClass:"margin-left-xs margin-right-xs cu-form-group  radius"},[n("v-uni-view",{staticClass:"title"}),n("v-uni-view",{staticClass:"text-left"},[t._v("共"+t._s(e.order_total_item_num)+"件商品，合计"),n("v-uni-text",{staticClass:"margin-left-sm text-lg text-bold"},[t._v(t._s("¥ "+parseFloat(e.need_price).toFixed(2)))])],1)],1),n("v-uni-view",{staticClass:"margin-left-xs margin-right-xs cu-form-group solid-bottom radius"},[n("v-uni-view",{staticClass:"title",staticStyle:{"font-size":"28upx"}},[t._v(t._s(t.formatDateTime(e.create_at)))]),"needPay"==e.order_state?n("v-uni-view",{staticClass:"text-left flex align-center",staticStyle:{height:"50rpx"}},[n("v-uni-button",{staticClass:"line-green",staticStyle:{"font-size":"28upx"},attrs:{disabled:t.isLoad},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.doCancel(e)}}},[t._v("取消订单")]),n("v-uni-button",{staticClass:"margin-left-sm bg-green",staticStyle:{"font-size":"28upx"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.showPayOrder(e)}}},[t._v("付款")])],1):t._e(),"shipped"==e.order_state?n("v-uni-view",{staticClass:"text-left flex align-center",staticStyle:{height:"50rpx"}},[n("v-uni-button",{staticClass:"line-green",staticStyle:{"font-size":"28upx"},attrs:{disabled:t.isLoad},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.confirmReceiveOrder(e)}}},[t._v("确认收货")])],1):t._e()],1)],2)],1)})),n("v-uni-view",{staticClass:"cu-tabbar-height"}),t.isUps?n("v-uni-view",{staticClass:"shade"}):t._e(),n("uni-popup",{ref:"showPopupPayOrder",attrs:{type:"bottom"},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.change.apply(void 0,arguments)}}},[n("v-uni-view",{staticClass:"popup bg-white"},[n("v-uni-text",{staticClass:"cuIcon-close popup-close",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.cancel("PopupPayOrder")}}}),n("v-uni-text",{staticClass:"popup-title"},[t._v("付款")]),n("v-uni-view",{staticClass:"popup-content"},[n("v-uni-scroll-view",{staticClass:"ups-height",attrs:{"scroll-y":"true"}},t._l(t.bizCard.pay_info,(function(e,i){return e.is_open?n("v-uni-view",{key:i,staticClass:"content-box solid-bottom margin-bottom-xl"},[n("v-uni-image",{staticClass:"qrcode-image",attrs:{src:e.qrcode,mode:"aspectFit"}}),n("v-uni-view",{staticClass:"content-text"},[t._v(t._s("合计 ¥ "+parseFloat(t.currentOrder.need_price).toFixed(2)))]),n("v-uni-view",{staticClass:"content-text"},[t._v(t._s("请粘贴支付单据中的"+e.bill_num_name+":")),n("v-uni-input",{staticClass:"margin-top-lg text-bold justify-center solid-bottom bg-gray",staticStyle:{"margin-left":"-20rpx"},on:{blur:function(e){arguments[0]=e=t.$handleEvent(e),t.inputBillNum.apply(void 0,arguments)}},model:{value:t.currentOrder.bill_num,callback:function(e){t.$set(t.currentOrder,"bill_num",e)},expression:"currentOrder.bill_num"}})],1),n("v-uni-button",{staticClass:"cu-btn  round line-red",attrs:{disabled:t.isLoad},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.payOrder(e.title)}}},[t._v(t._s("点此确认已"+e.title))])],1):t._e()})),1)],1)],1)],1)],2)},r=[]},eda1:function(t,e,n){"use strict";n.r(e);var i=n("e918"),a=n("b2ad");for(var r in a)"default"!==r&&function(t){n.d(e,t,(function(){return a[t]}))}(r);n("af5b");var s,o=n("f0c5"),u=Object(o["a"])(a["default"],i["b"],i["c"],!1,null,"2ea7bd4a",null,!1,i["a"],s);e["default"]=u.exports}}]);