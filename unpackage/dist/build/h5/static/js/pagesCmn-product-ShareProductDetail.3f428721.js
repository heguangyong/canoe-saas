(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesCmn-product-ShareProductDetail"],{2382:function(e,t,i){var n=i("24fb");t=n(!1),t.push([e.i,'@charset "UTF-8";.page[data-v-6ee6e9c0]{z-index:0;height:100vh}uni-video[data-v-6ee6e9c0]{width:%?750?%}uni-image[data-v-6ee6e9c0]{width:%?750?%}.carousel[data-v-6ee6e9c0]{height:%?600?%;position:relative}.carousel uni-swiper[data-v-6ee6e9c0]{height:100%}.carousel .image-wrapper[data-v-6ee6e9c0]{width:100%;height:100%}.carousel .swiper-item[data-v-6ee6e9c0]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-align-content:center;align-content:center;overflow:hidden}.carousel .swiper-item uni-image[data-v-6ee6e9c0]{width:100%;height:100%}\n/* 底部分享 */.popup[data-v-6ee6e9c0]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;height:%?950?%;padding-bottom:62px;position:fixed;left:0;bottom:0;width:100%;z-index:95;border-top-left-radius:3%;border-top-right-radius:3%}.popup-close[data-v-6ee6e9c0]{position:absolute;top:%?30?%;left:%?30?%;font-size:%?39?%;text-align:center;font-weight:700;z-index:199}.popup-title[data-v-6ee6e9c0]{margin-top:%?15?%;line-height:%?60?%;font-size:%?28?%;padding:%?5?% 0;text-align:center;font-weight:700}.popup-content[data-v-6ee6e9c0]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;padding:5px;max-height:%?950?%}\n/* 起到固定的作用 ,从而解决原页面触摸穿透的问题*/.prevent[data-v-6ee6e9c0]{width:100%;height:100%;\n  /*自动回到顶部*/\n  /*position: fixed;*/top:0;left:0;overflow:hidden}\n/* 遮罩样式 */.shade[data-v-6ee6e9c0]{width:100%;height:100%;position:fixed;top:0;left:0;z-index:90}.ups-height[data-v-6ee6e9c0]{height:%?850?%;position:fixed;left:0;bottom:0;z-index:99}',""]),e.exports=t},5913:function(e,t,i){"use strict";i.r(t);var n=i("bb5b"),a=i.n(n);for(var r in n)"default"!==r&&function(e){i.d(t,e,(function(){return n[e]}))}(r);t["default"]=a.a},6779:function(e,t,i){"use strict";i.r(t);var n=i("7f8f"),a=i("5913");for(var r in a)"default"!==r&&function(e){i.d(t,e,(function(){return a[e]}))}(r);i("b70e");var o,s=i("f0c5"),c=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"6ee6e9c0",null,!1,n["a"],o);t["default"]=c.exports},"69e4":function(e,t,i){"use strict";i.r(t);var n=i("8f0e"),a=i.n(n);for(var r in n)"default"!==r&&function(e){i.d(t,e,(function(){return n[e]}))}(r);t["default"]=a.a},"6fb6":function(e,t,i){(function(n){var a;i("c975"),i("ac1f"),i("466d"),i("5319"),i("1276");var r=i("9523");!function(n,r){a=function(){return r(n)}.call(t,i,t,e),void 0===a||(e.exports=a)}(window,(function(e,t){if(!e.jWeixin){var i,a,o={config:"preVerifyJSAPI",onMenuShareTimeline:"menu:share:timeline",onMenuShareAppMessage:"menu:share:appmessage",onMenuShareQQ:"menu:share:qq",onMenuShareWeibo:"menu:share:weiboApp",onMenuShareQZone:"menu:share:QZone",previewImage:"imagePreview",getLocation:"geoLocation",openProductSpecificView:"openProductViewWithPid",addCard:"batchAddCard",openCard:"batchViewCard",chooseWXPay:"getBrandWCPayRequest",openEnterpriseRedPacket:"getRecevieBizHongBaoRequest",startSearchBeacons:"startMonitoringBeacons",stopSearchBeacons:"stopMonitoringBeacons",onSearchBeacons:"onBeaconsInRange",consumeAndShareCard:"consumedShareCard",openAddress:"editAddress"},s=function(){var e={};for(var t in o)e[o[t]]=t;return e}(),c=e.document,u=c.title,d=navigator.userAgent.toLowerCase(),l=navigator.platform.toLowerCase(),p=!(!l.match("mac")&&!l.match("win")),f=-1!=d.indexOf("wxdebugger"),m=-1!=d.indexOf("micromessenger"),h=-1!=d.indexOf("android"),v=-1!=d.indexOf("iphone")||-1!=d.indexOf("ipad"),g=(a=d.match(/micromessenger\/(\d+\.\d+\.\d+)/)||d.match(/micromessenger\/(\d+\.\d+)/))?a[1]:"",w={initStartTime:V(),initEndTime:0,preVerifyStartTime:0,preVerifyEndTime:0},b={version:1,appId:"",initTime:0,preVerifyTime:0,networkType:"",isPreVerifyOk:1,systemType:v?1:h?2:-1,clientVersion:g,url:encodeURIComponent(location.href)},x={},y={_completes:[]},_={state:0,data:{}};U((function(){w.initEndTime=V()}));var S=!1,k=[],C=(i={config:function(t){O("config",x=t);var i=!1!==x.check;U((function(){if(i)P(o.config,{verifyJsApiList:L(x.jsApiList),verifyOpenTagList:L(x.openTagList)},function(){y._complete=function(e){w.preVerifyEndTime=V(),_.state=1,_.data=e},y.success=function(e){b.isPreVerifyOk=0},y.fail=function(e){y._fail?y._fail(e):_.state=-1};var e=y._completes;return e.push((function(){!function(){if(!(p||f||x.debug||g<"6.0.2"||b.systemType<0)){var e=new Image;b.appId=x.appId,b.initTime=w.initEndTime-w.initStartTime,b.preVerifyTime=w.preVerifyEndTime-w.preVerifyStartTime,C.getNetworkType({isInnerInvoke:!0,success:function(t){b.networkType=t.networkType;var i="https://open.weixin.qq.com/sdk/report?v="+b.version+"&o="+b.isPreVerifyOk+"&s="+b.systemType+"&c="+b.clientVersion+"&a="+b.appId+"&n="+b.networkType+"&i="+b.initTime+"&p="+b.preVerifyTime+"&u="+b.url;e.src=i}})}}()})),y.complete=function(t){for(var i=0,n=e.length;i<n;++i)e[i]();y._completes=[]},y}()),w.preVerifyStartTime=V();else{_.state=1;for(var e=y._completes,t=0,n=e.length;t<n;++t)e[t]();y._completes=[]}})),C.invoke||(C.invoke=function(t,i,n){e.WeixinJSBridge&&WeixinJSBridge.invoke(t,A(i),n)},C.on=function(t,i){e.WeixinJSBridge&&WeixinJSBridge.on(t,i)})},ready:function(e){0!=_.state?e():(y._completes.push(e),!m&&x.debug&&e())},error:function(e){g<"6.0.2"||(-1==_.state?e(_.data):y._fail=e)},checkJsApi:function(e){P("checkJsApi",{jsApiList:L(e.jsApiList)},(e._complete=function(e){if(h){var t=e.checkResult;t&&(e.checkResult=JSON.parse(t))}e=function(e){var t=e.checkResult;for(var i in t){var n=s[i];n&&(t[n]=t[i],delete t[i])}return e}(e)},e))},onMenuShareTimeline:function(e){N(o.onMenuShareTimeline,{complete:function(){P("shareTimeline",{title:e.title||u,desc:e.title||u,img_url:e.imgUrl||"",link:e.link||location.href,type:e.type||"link",data_url:e.dataUrl||""},e)}},e)},onMenuShareAppMessage:function(e){N(o.onMenuShareAppMessage,{complete:function(t){"favorite"===t.scene?P("sendAppMessage",{title:e.title||u,desc:e.desc||"",link:e.link||location.href,img_url:e.imgUrl||"",type:e.type||"link",data_url:e.dataUrl||""}):P("sendAppMessage",{title:e.title||u,desc:e.desc||"",link:e.link||location.href,img_url:e.imgUrl||"",type:e.type||"link",data_url:e.dataUrl||""},e)}},e)},onMenuShareQQ:function(e){N(o.onMenuShareQQ,{complete:function(){P("shareQQ",{title:e.title||u,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},onMenuShareWeibo:function(e){N(o.onMenuShareWeibo,{complete:function(){P("shareWeiboApp",{title:e.title||u,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},onMenuShareQZone:function(e){N(o.onMenuShareQZone,{complete:function(){P("shareQZone",{title:e.title||u,desc:e.desc||"",img_url:e.imgUrl||"",link:e.link||location.href},e)}},e)},updateTimelineShareData:function(e){P("updateTimelineShareData",{title:e.title,link:e.link,imgUrl:e.imgUrl},e)},updateAppMessageShareData:function(e){P("updateAppMessageShareData",{title:e.title,desc:e.desc,link:e.link,imgUrl:e.imgUrl},e)},startRecord:function(e){P("startRecord",{},e)},stopRecord:function(e){P("stopRecord",{},e)},onVoiceRecordEnd:function(e){N("onVoiceRecordEnd",e)},playVoice:function(e){P("playVoice",{localId:e.localId},e)},pauseVoice:function(e){P("pauseVoice",{localId:e.localId},e)},stopVoice:function(e){P("stopVoice",{localId:e.localId},e)},onVoicePlayEnd:function(e){N("onVoicePlayEnd",e)},uploadVoice:function(e){P("uploadVoice",{localId:e.localId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},downloadVoice:function(e){P("downloadVoice",{serverId:e.serverId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},translateVoice:function(e){P("translateVoice",{localId:e.localId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},chooseImage:function(e){P("chooseImage",{scene:"1|2",count:e.count||9,sizeType:e.sizeType||["original","compressed"],sourceType:e.sourceType||["album","camera"]},(e._complete=function(e){if(h){var t=e.localIds;try{t&&(e.localIds=JSON.parse(t))}catch(e){}}},e))},getLocation:function(e){},previewImage:function(e){P(o.previewImage,{current:e.current,urls:e.urls},e)},uploadImage:function(e){P("uploadImage",{localId:e.localId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},downloadImage:function(e){P("downloadImage",{serverId:e.serverId,isShowProgressTips:0==e.isShowProgressTips?0:1},e)},getLocalImgData:function(e){!1===S?(S=!0,P("getLocalImgData",{localId:e.localId},(e._complete=function(e){if(S=!1,0<k.length){var t=k.shift();wx.getLocalImgData(t)}},e))):k.push(e)},getNetworkType:function(e){P("getNetworkType",{},(e._complete=function(e){e=function(e){var t=e.errMsg;e.errMsg="getNetworkType:ok";var i=e.subtype;if(delete e.subtype,i)e.networkType=i;else{var n=t.indexOf(":"),a=t.substring(n+1);switch(a){case"wifi":case"edge":case"wwan":e.networkType=a;break;default:e.errMsg="getNetworkType:fail"}}return e}(e)},e))},openLocation:function(e){P("openLocation",{latitude:e.latitude,longitude:e.longitude,name:e.name||"",address:e.address||"",scale:e.scale||28,infoUrl:e.infoUrl||""},e)}},r(i,"getLocation",(function(e){P(o.getLocation,{type:(e=e||{}).type||"wgs84"},(e._complete=function(e){delete e.type},e))})),r(i,"hideOptionMenu",(function(e){P("hideOptionMenu",{},e)})),r(i,"showOptionMenu",(function(e){P("showOptionMenu",{},e)})),r(i,"closeWindow",(function(e){P("closeWindow",{},e=e||{})})),r(i,"hideMenuItems",(function(e){P("hideMenuItems",{menuList:e.menuList},e)})),r(i,"showMenuItems",(function(e){P("showMenuItems",{menuList:e.menuList},e)})),r(i,"hideAllNonBaseMenuItem",(function(e){P("hideAllNonBaseMenuItem",{},e)})),r(i,"showAllNonBaseMenuItem",(function(e){P("showAllNonBaseMenuItem",{},e)})),r(i,"scanQRCode",(function(e){P("scanQRCode",{needResult:(e=e||{}).needResult||0,scanType:e.scanType||["qrCode","barCode"]},(e._complete=function(e){if(v){var t=e.resultStr;if(t){var i=JSON.parse(t);e.resultStr=i&&i.scan_code&&i.scan_code.scan_result}}},e))})),r(i,"openAddress",(function(e){P(o.openAddress,{},(e._complete=function(e){e=function(e){return e.postalCode=e.addressPostalCode,delete e.addressPostalCode,e.provinceName=e.proviceFirstStageName,delete e.proviceFirstStageName,e.cityName=e.addressCitySecondStageName,delete e.addressCitySecondStageName,e.countryName=e.addressCountiesThirdStageName,delete e.addressCountiesThirdStageName,e.detailInfo=e.addressDetailInfo,delete e.addressDetailInfo,e}(e)},e))})),r(i,"openProductSpecificView",(function(e){P(o.openProductSpecificView,{pid:e.productId,view_type:e.viewType||0,ext_info:e.extInfo},e)})),r(i,"addCard",(function(e){for(var t=e.cardList,i=[],n=0,a=t.length;n<a;++n){var r=t[n],s={card_id:r.cardId,card_ext:r.cardExt};i.push(s)}P(o.addCard,{card_list:i},(e._complete=function(e){var t=e.card_list;if(t){for(var i=0,n=(t=JSON.parse(t)).length;i<n;++i){var a=t[i];a.cardId=a.card_id,a.cardExt=a.card_ext,a.isSuccess=!!a.is_succ,delete a.card_id,delete a.card_ext,delete a.is_succ}e.cardList=t,delete e.card_list}},e))})),r(i,"chooseCard",(function(e){P("chooseCard",{app_id:x.appId,location_id:e.shopId||"",sign_type:e.signType||"SHA1",card_id:e.cardId||"",card_type:e.cardType||"",card_sign:e.cardSign,time_stamp:e.timestamp+"",nonce_str:e.nonceStr},(e._complete=function(e){e.cardList=e.choose_card_info,delete e.choose_card_info},e))})),r(i,"openCard",(function(e){for(var t=e.cardList,i=[],n=0,a=t.length;n<a;++n){var r=t[n],s={card_id:r.cardId,code:r.code};i.push(s)}P(o.openCard,{card_list:i},e)})),r(i,"consumeAndShareCard",(function(e){P(o.consumeAndShareCard,{consumedCardId:e.cardId,consumedCode:e.code},e)})),r(i,"chooseWXPay",(function(e){P(o.chooseWXPay,M(e),e)})),r(i,"openEnterpriseRedPacket",(function(e){P(o.openEnterpriseRedPacket,M(e),e)})),r(i,"startSearchBeacons",(function(e){P(o.startSearchBeacons,{ticket:e.ticket},e)})),r(i,"stopSearchBeacons",(function(e){P(o.stopSearchBeacons,{},e)})),r(i,"onSearchBeacons",(function(e){N(o.onSearchBeacons,e)})),r(i,"openEnterpriseChat",(function(e){P("openEnterpriseChat",{useridlist:e.userIds,chatname:e.groupName},e)})),r(i,"launchMiniProgram",(function(e){P("launchMiniProgram",{targetAppId:e.targetAppId,path:function(e){if("string"==typeof e&&0<e.length){var t=e.split("?")[0],i=e.split("?")[1];return t+=".html",void 0!==i?t+"?"+i:t}}(e.path),envVersion:e.envVersion},e)})),r(i,"openBusinessView",(function(e){P("openBusinessView",{businessType:e.businessType,queryString:e.queryString||"",envVersion:e.envVersion},(e._complete=function(e){if(h){var t=e.extraData;if(t)try{e.extraData=JSON.parse(t)}catch(t){e.extraData={}}}},e))})),r(i,"miniProgram",{navigateBack:function(e){e=e||{},U((function(){P("invokeMiniProgramAPI",{name:"navigateBack",arg:{delta:e.delta||1}},e)}))},navigateTo:function(e){U((function(){P("invokeMiniProgramAPI",{name:"navigateTo",arg:{url:e.url}},e)}))},redirectTo:function(e){U((function(){P("invokeMiniProgramAPI",{name:"redirectTo",arg:{url:e.url}},e)}))},switchTab:function(e){U((function(){P("invokeMiniProgramAPI",{name:"switchTab",arg:{url:e.url}},e)}))},reLaunch:function(e){U((function(){P("invokeMiniProgramAPI",{name:"reLaunch",arg:{url:e.url}},e)}))},postMessage:function(e){U((function(){P("invokeMiniProgramAPI",{name:"postMessage",arg:e.data||{}},e)}))},getEnv:function(t){U((function(){t({miniprogram:"miniprogram"===e.__wxjs_environment})}))}}),i),I=1,T={};return c.addEventListener("error",(function(e){if(!h){var t=e.target,i=t.tagName,n=t.src;if(("IMG"==i||"VIDEO"==i||"AUDIO"==i||"SOURCE"==i)&&-1!=n.indexOf("wxlocalresource://")){e.preventDefault(),e.stopPropagation();var a=t["wx-id"];if(a||(a=I++,t["wx-id"]=a),T[a])return;T[a]=!0,wx.ready((function(){wx.getLocalImgData({localId:n,success:function(e){t.src=e.localData}})}))}}}),!0),c.addEventListener("load",(function(e){if(!h){var t=e.target,i=t.tagName;if(t.src,"IMG"==i||"VIDEO"==i||"AUDIO"==i||"SOURCE"==i){var n=t["wx-id"];n&&(T[n]=!1)}}}),!0),t&&(e.wx=e.jWeixin=C),C}function P(t,i,n){e.WeixinJSBridge?WeixinJSBridge.invoke(t,A(i),(function(e){B(t,e,n)})):O(t,n)}function N(t,i,n){e.WeixinJSBridge?WeixinJSBridge.on(t,(function(e){n&&n.trigger&&n.trigger(e),B(t,e,i)})):O(t,n||i)}function A(e){return(e=e||{}).appId=x.appId,e.verifyAppId=x.appId,e.verifySignType="sha1",e.verifyTimestamp=x.timestamp+"",e.verifyNonceStr=x.nonceStr,e.verifySignature=x.signature,e}function M(e){return{timeStamp:e.timestamp+"",nonceStr:e.nonceStr,package:e.package,paySign:e.paySign,signType:e.signType||"SHA1"}}function B(e,t,i){"openEnterpriseChat"!=e&&"openBusinessView"!==e||(t.errCode=t.err_code),delete t.err_code,delete t.err_desc,delete t.err_detail;var n=t.errMsg;n||(n=t.err_msg,delete t.err_msg,n=function(e,t){var i=e,n=s[i];n&&(i=n);var a="ok";if(t){var r=t.indexOf(":");"confirm"==(a=t.substring(r+1))&&(a="ok"),"failed"==a&&(a="fail"),-1!=a.indexOf("failed_")&&(a=a.substring(7)),-1!=a.indexOf("fail_")&&(a=a.substring(5)),"access denied"!=(a=(a=a.replace(/_/g," ")).toLowerCase())&&"no permission to execute"!=a||(a="permission denied"),"config"==i&&"function not exist"==a&&(a="ok"),""==a&&(a="fail")}return i+":"+a}(e,n),t.errMsg=n),(i=i||{})._complete&&(i._complete(t),delete i._complete),n=t.errMsg||"",x.debug&&!i.isInnerInvoke&&alert(JSON.stringify(t));var a=n.indexOf(":");switch(n.substring(a+1)){case"ok":i.success&&i.success(t);break;case"cancel":i.cancel&&i.cancel(t);break;default:i.fail&&i.fail(t)}i.complete&&i.complete(t)}function L(e){if(e){for(var t=0,i=e.length;t<i;++t){var n=e[t],a=o[n];a&&(e[t]=a)}return e}}function O(e,t){if(!(!x.debug||t&&t.isInnerInvoke)){var i=s[e];i&&(e=i),t&&t._complete&&delete t._complete,n("log",'"'+e+'",',t||""," at node_modules/_jweixin-module@1.6.0@jweixin-module/lib/index.js:1")}}function V(){return(new Date).getTime()}function U(t){m&&(e.WeixinJSBridge?t():c.addEventListener&&c.addEventListener("WeixinJSBridgeReady",t,!1))}}))}).call(this,i("0de9")["log"])},"7f8f":function(e,t,i){"use strict";i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return r})),i.d(t,"a",(function(){return n}));var n={uniPopup:i("6ac9").default},a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{class:1==e.isUps?"prevent":""},[i("v-uni-view",{staticClass:"page bg-white"},[i("v-uni-view",{staticClass:"carousel"},[i("v-uni-swiper",{attrs:{"indicator-dots":!0,circular:"true",duration:"400"}},e._l(e.product.carouse,(function(t,n){return i("v-uni-swiper-item",{key:n,staticClass:"swiper-item",attrs:{"data-src":t},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImage.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"image-wrapper"},[i("v-uni-image",{attrs:{src:t,mode:"aspectFill"}})],1)],1)})),1)],1),e.product.detail.content?i("v-uni-textarea",{staticClass:"text-box font40 bg-white width100 padding-sm solid text-cut",staticStyle:{height:"150rpx"},attrs:{readonly:!0,disabled:!0,"scroll-y":"true",maxlength:"200"},model:{value:e.product.detail.content,callback:function(t){e.$set(e.product.detail,"content",t)},expression:"product.detail.content"}}):e._e(),i("v-uni-view",{staticClass:"cu-list menu-avatar"},[i("v-uni-view",{staticClass:"cu-item",staticStyle:{height:"110rpx","background-color":"gainsboro"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.goQrcode(e.product._id)}}},[i("v-uni-view",{staticClass:"cu-avatar round "},[i("v-uni-image",{staticClass:"cu-avatar round ",attrs:{src:e.product.avatar,mode:"aspectFill"}})],1),i("v-uni-view",{staticClass:"content flex-sub"},[i("v-uni-view",{staticClass:"text-grey"},[e._v(e._s(e.product.title))]),i("v-uni-view",{staticClass:"text-gray text-sm flex justify-between"},[e._v("价格："+e._s(e.priceAndUnitName))])],1),i("v-uni-view",{staticClass:"action"},[i("v-uni-text",{staticClass:"cuIcon-qr_code",staticStyle:{"font-size":"36px"}})],1)],1)],1),e.product.detail.videos.length>0?i("v-uni-view",[i("v-uni-video",{attrs:{src:e.product.detail.videos[0],objectFit:"contain",controls:!0,"show-mute-btn":!0,muted:!0}})],1):e._e(),e._l(e.product.detail.images,(function(t,n){return i("v-uni-image",{key:n,staticStyle:{"vertical-align":"middle"},attrs:{src:t,"data-src":t,mode:"widthFix"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImage.apply(void 0,arguments)}}})})),i("v-uni-view",{staticClass:"cu-tabbar-height"}),i("v-uni-view",{staticClass:"cu-tabbar-height"}),i("v-uni-view",{staticClass:"cu-bar bg-white tabbar border  foot"},[i("v-uni-view",{staticClass:"cu-bar bg-white tabbar border  foot"},[i("v-uni-view",{staticClass:"bg-grey submit text-lg"},[e._v("购买详询，请点击产品二维码进入小程序")])],1)],1)],2),e.isUps?i("v-uni-view",{staticClass:"shade"}):e._e(),i("uni-popup",{ref:"showPopupWishProduct",attrs:{type:"bottom"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.change.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"popup bg-white"},[i("v-uni-text",{staticClass:"cuIcon-close popup-close",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.cancel("PopupWishProduct")}}}),i("v-uni-text",{staticClass:"popup-title"},[e._v("加入购物袋")]),i("v-uni-view",{staticClass:"popup-content"},[i("v-uni-scroll-view",{staticClass:"ups-height",attrs:{"scroll-y":"true"}},[i("v-uni-view",{staticClass:"cu-card article",staticStyle:{width:"100%"}},[i("v-uni-view",{staticClass:"cu-item shadow",staticStyle:{margin:"10rpx",padding:"20rpx 0"}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-image",{staticClass:"bg-gray",attrs:{src:e.product.cover,mode:"aspectFill"}}),i("v-uni-view",{staticClass:"desc"},[i("v-uni-view",{staticClass:"text-content"},[e._v(e._s(e.product.title)),i("v-uni-text",{staticClass:"text-cut text-sm"},[e._v(e._s(e.product.detail.content))])],1),i("v-uni-view",{staticClass:"flex margin-top-sm \ufeffjustify-between"},[i("v-uni-view",{staticClass:"cu-capsule radius "},[i("v-uni-text",{staticClass:"text-red"},[e._v(e._s(e.priceAndUnitName))])],1),i("v-uni-view",[i("ups-stepper",{attrs:{label:e.product._id,max:100,val:e.product.num,step:1,min:1},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.stepper.apply(void 0,arguments)}}})],1)],1)],1)],1)],1)],1),i("v-uni-view",[i("v-uni-view",{staticClass:"cu-bar solid-bottom margin-top-xxs radius"}),i("v-uni-view",{staticClass:"cu-bar btn-group  foot bg-white"},[i("v-uni-button",{staticClass:"cu-btn   round line-grey",attrs:{disabled:e.isLoad},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.submitOrder.apply(void 0,arguments)}}},[e._v("确定")])],1)],1)],1)],1)],1)],1),i("uni-popup",{ref:"showPopupBuyProduct",attrs:{type:"bottom"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.change.apply(void 0,arguments)}}},[i("v-uni-view",{staticClass:"popup bg-white"},[i("v-uni-text",{staticClass:"cuIcon-close popup-close",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.cancel("PopupBuyProduct")}}}),i("v-uni-text",{staticClass:"popup-title"},[e._v("购买")]),i("v-uni-view",{staticClass:"popup-content"},[i("v-uni-scroll-view",{staticClass:"ups-height",attrs:{"scroll-y":"true"}},[i("v-uni-view",{staticClass:"cu-card article",staticStyle:{width:"100%"}},[i("v-uni-view",{staticClass:"cu-item shadow",staticStyle:{margin:"10rpx",padding:"20rpx 0"}},[i("v-uni-view",{staticClass:"content"},[i("v-uni-image",{staticClass:"bg-gray",attrs:{src:e.product.cover,mode:"aspectFill"}}),i("v-uni-view",{staticClass:"desc"},[i("v-uni-view",{staticClass:"text-content"},[e._v(e._s(e.product.title)),i("v-uni-text",{staticClass:"text-cut text-sm"},[e._v(e._s(e.product.detail.content))])],1),i("v-uni-view",{staticClass:"flex margin-top-sm \ufeffjustify-between"},[i("v-uni-view",{staticClass:"cu-capsule radius "},[i("v-uni-text",{staticClass:"text-red"},[e._v(e._s(e.priceAndUnitName))])],1),i("v-uni-view",[i("ups-stepper",{attrs:{label:e.product._id,max:100,val:e.product.num,step:1,min:1},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.stepper.apply(void 0,arguments)}}})],1)],1)],1)],1)],1)],1),i("v-uni-view",[i("v-uni-view",{staticClass:"cu-bar solid-bottom margin-top-xxs radius"}),i("v-uni-view",{staticClass:"cu-bar btn-group  foot bg-white"},[i("v-uni-button",{staticClass:"cu-btn   round line-grey",attrs:{disabled:e.isLoad},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.placeOrder.apply(void 0,arguments)}}},[e._v("确定")])],1)],1)],1)],1)],1)],1)],1)},r=[]},"8f0e":function(e,t,i){"use strict";i("a9e3"),i("b680"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={data:function(){return{stepperNum:0,stepperCacheNum:0}},name:"feng-stepper",props:{val:{type:[String,Number],default:0},min:{type:[String,Number],default:0},max:{type:[String,Number],default:0},step:{type:Number,default:1},label:{type:String,default:""},disabled:{type:Boolean,default:!1},active:{type:String,default:"#FFF"},unactive:{type:String,default:"#ddd"}},created:function(){this.stepperNum=this.val,this.stepperCacheNum=this.val},watch:{val:function(e){this.stepperNum=this.val}},methods:{less:function(){this.stepperNum<=this.min?this.stepperNum=this.min:this.stepperNum-=Math.ceil(10*this.step)/10,this.stepperCacheNum=Number(this.stepperNum.toFixed(1)),this.emit(this.stepperCacheNum,this.label,"less")},add:function(){this.stepperNum>=this.max?this.stepperNum=this.max:this.stepperNum+=Math.ceil(10*this.step)/10,this.stepperCacheNum=Number(this.stepperNum.toFixed(1)),this.emit(this.stepperCacheNum,this.label,"add")},emit:function(e,t,i){Number(e.toFixed(1))>this.max&&(e=this.max,this.stepperCacheNum=this.max),Number(e.toFixed(1))<this.min&&(e=this.min,this.stepperCacheNum=this.min),this.$emit("change",{val:e,label:t,type:i})},iptVal:function(e){Number(e.detail.value)>this.max?this.stepperNum=this.max:this.stepperNum}}};t.default=n},9226:function(e,t,i){"use strict";var n=i("d824"),a=i.n(n);a.a},9523:function(e,t){function i(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}e.exports=i},aa9a:function(e,t,i){"use strict";i.r(t);var n=i("ab30"),a=i("69e4");for(var r in a)"default"!==r&&function(e){i.d(t,e,(function(){return a[e]}))}(r);i("9226");var o,s=i("f0c5"),c=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"5b422df3",null,!1,n["a"],o);t["default"]=c.exports},ab30:function(e,t,i){"use strict";var n;i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return r})),i.d(t,"a",(function(){return n}));var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{staticStyle:{display:"inline-block"}},[i("v-uni-view",{staticClass:"feng-stepper"},[e.stepperCacheNum>0?i("v-uni-view",{staticClass:"step-cr",style:e.stepperCacheNum<=e.min?"color:"+e.unactive+";":"color:"+e.active+";",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.less.apply(void 0,arguments)}}},[e._v("-")]):e._e(),e.stepperCacheNum>0?i("v-uni-input",{attrs:{type:"number",value:e.stepperCacheNum,disabled:!0},on:{input:function(t){arguments[0]=t=e.$handleEvent(t),e.iptVal.apply(void 0,arguments)}}}):e._e(),i("v-uni-view",{staticClass:"step-cr",style:e.stepperCacheNum>=e.max?"color:"+e.unactive+";":"color:"+e.active+";",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.add.apply(void 0,arguments)}}},[e._v("+")])],1)],1)},r=[]},b70e:function(e,t,i){"use strict";var n=i("f887"),a=i.n(n);a.a},bb5b:function(e,t,i){"use strict";(function(e){var n=i("4ea4");i("4160"),i("b680"),i("acd8"),i("ac1f"),i("1276"),i("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,i("96cf");var a=n(i("1da1")),r=n(i("5530")),o=i("2f62"),s=n(i("6ac9")),c=n(i("aa9a")),u=n(i("d3b3")),d=n(i("6fb6")),l={components:{"uni-popup":s.default,"ups-stepper":c.default},data:function(){return{isLoad:!1,isUps:!1,product:{_id:"",qrcode:"",detail:{content:"",images:[],imgList:[],videos:[]},num:1},priceAndUnitName:"",authBizInfo:{}}},onLoad:function(e){var t=this;if(e.id)t.product._id=e.id,t.getDetail();else if(e.scene){t.paramsStr+="scene="+e.scene;var i={},n=decodeURIComponent(e.scene).split("&");n.forEach((function(e){var n=e.split("=");i[n[0]]=n[1],"qrcode"==n[0]&&(t.product.qrcode=n[1])})),t.getDetailByQrcode()}t.authBizInfo={_id:t.product.card_id,name:t.product.name,avatar:t.product.avatar},t.needWxAuth(t.authBizInfo)},onReady:function(){wx.setNavigationBarTitle({title:"产品详情"})},onShareAppMessage:function(e){if("button"===e.from){var t=e.target.dataset.product;return{title:t.title,imageUrl:t.cover||"",path:"/pagesCmn/product/ShareProductDetail?id="+t._id,success:function(e){uni.showToast({icon:"success",title:"分享成功"})}}}},computed:(0,r.default)({},(0,o.mapState)(["needAuthFlag","user","cardAccount"])),methods:(0,r.default)((0,r.default)({},(0,o.mapMutations)(["needWxAuth","wxAuth","updateUser","updateUserAuth"])),{},{ShareProductDetail:function(){uni.showShareMenu({withShareTicket:!0})},getDetail:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function i(){var n,a,r;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return n=t,a=null,i.next=4,u.default.callFunction({name:"web",data:{$url:"getProductDetail",id:n.product._id}});case 4:return a=i.sent,n.product=JSON.parse(a.result.data),i.next=8,u.default.callFunction({name:"web",data:{$url:"signWeixin",url:"http://cb.upservce.com/#/pagesCmn/product/ShareProductDetail?id="+n.product._id,needRefreshSignature:!1}});case 8:a=i.sent,r=JSON.parse(a.result.data),e("log","sign",a.result.data," at pagesCmn/product/ShareProductDetail.vue:295"),d.default.config({debug:!0,appId:"wxc42ba3b82548c8b6",nonceStr:r.nonceStr,timestamp:r.timestamp,signature:r.signature,jsApiList:["updateAppMessageShareData","updateTimelineShareData"]}),d.default.error((function(t){e("log","jweixin.error",t," at pagesCmn/product/ShareProductDetail.vue:309"),u.default.callFunction({name:"web",data:{$url:"signWeixin",url:"http://cb.upservce.com/#/pagesCmn/product/ShareProductDetail?id="+n.product._id,needRefreshSignature:!0}})})),d.default.ready((function(){d.default.updateAppMessageShareData({title:n.product.title,desc:n.product.detail.content,link:"/pagesCmn/product/ShareProductDetail?id="+n.product._id,imgUrl:n.product.cover,success:function(){e("log","success"," at pagesCmn/product/ShareProductDetail.vue:329")}})})),n.product.num=1,n.priceAndUnitName="¥ "+parseFloat(n.product.price).toFixed(2)+n.product.unit_name,n.authBizInfo={_id:n.product.card_id,name:n.product.name,avatar:n.product.avatar},n.needWxAuth(n.authBizInfo);case 18:case"end":return i.stop()}}),i)})))()},getDetailByQrcode:function(){var e=this;return(0,a.default)(regeneratorRuntime.mark((function t(){var i,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return i=e,n={},t.next=4,u.default.callFunction({name:"web",data:{$url:"getProductDetailByQrcode",qrcode:i.product.qrcode}});case 4:n=t.sent,i.product=JSON.parse(n.result.data),i.product.num=1,i.priceAndUnitName="¥ "+parseFloat(i.product.price).toFixed(2)+i.product.unit_name,i.authBizInfo={_id:i.product.card_id,name:i.product.name,avatar:i.product.avatar},i.needWxAuth(i.authBizInfo);case 10:case"end":return t.stop()}}),t)})))()},previewImage:function(t){var i=this;e("log",t," at pagesCmn/product/ShareProductDetail.vue:377");var n="",a=[];for(var r in n=t.currentTarget.dataset.src,i.product.carouse)a.push(i.product.carouse[r]);for(var o=0;o<i.product.detail.images.length;o++)a.push(i.product.detail.images[o]);wx.previewImage({current:n,urls:a})},goWebLogin:function(){uni.navigateTo({url:"/pages/my/WebLogin"})},startTalk:function(){var e=this;return(0,a.default)(regeneratorRuntime.mark((function t(){var i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(i=e,!i.needAuthFlag){t.next=5;break}return i.wxAuth(i.authBizInfo),setTimeout((function(){i.startTalk()}),2e3),t.abrupt("return");case 5:i.updateUserAuth(i.authBizInfo),uni.navigateTo({url:"/pagesSys/site/WebService"});case 7:case"end":return t.stop()}}),t)})))()},goMy:function(){var e=this;if(e.needAuthFlag)return e.wxAuth(e.authBizInfo),void setTimeout((function(){e.goMy()}),2e3);e.updateUserAuth(e.authBizInfo),setTimeout((function(){uni.reLaunch({url:"/pages/my/home"})}),1e3)},goWishOrderList:function(){var e=this;if(e.needAuthFlag)return e.wxAuth(e.authBizInfo),void setTimeout((function(){e.goWishOrderList()}),2e3);e.updateUserAuth(e.authBizInfo),setTimeout((function(){uni.navigateTo({url:"/pagesSys/my/WishOrderList"})}),1e3)},showWishProduct:function(){var e=this;if(e.needAuthFlag)return e.wxAuth(e.authBizInfo),void setTimeout((function(){e.showWishProduct()}),2e3);e.updateUserAuth(e.authBizInfo),e.$nextTick((function(){e.isUps=!0,e.$refs["showPopupWishProduct"].open()}))},showBuyProduct:function(){var e=this;if(e.needAuthFlag)return e.wxAuth(e.authBizInfo),void setTimeout((function(){e.showBuyProduct()}),2e3);e.updateUserAuth(e.authBizInfo),e.$nextTick((function(){e.isUps=!0,e.$refs["showPopupBuyProduct"].open()}))},cancel:function(e){this.$refs["show"+e].close()},change:function(e){e.show?this.isUps=!0:this.isUps=!1},stepper:function(t){e("log",t," at pagesCmn/product/ShareProductDetail.vue:502"),t.val>0&&(this.product.num=t.val)},submitOrder:function(){var e=this;return(0,a.default)(regeneratorRuntime.mark((function t(){var i,n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return i=e,n=[{id:i.product._id,num:i.product.num,cover:i.product.carouse[0],title:i.product.title,content:i.product.detail.content,price:i.product.price,unit_name:i.product.unit_name,new_price:i.product.price,discount:10}],a={},a.seller_avatar=i.product.avatar,a.seller_name=i.product.name,a.user_id=i.user._id,a.avatar=i.user.userInfo.avatarUrl,a.name=i.user.userInfo.nickName,a.items=n,a.order_state="wish",i.isLoad=!0,t.next=13,wx.cloud.callFunction({name:"cmn",data:{$url:"addWishOrder",order:a}});case 13:i.isLoad=!1,uni.showToast({icon:"success",title:"加入购物袋成功"}),i.$refs["showPopupWishProduct"].close(),setTimeout((function(){uni.navigateTo({url:"/pagesSys/my/WishOrderList"})}),1e3);case 17:case"end":return t.stop()}}),t)})))()},placeOrder:function(){var t=this;return(0,a.default)(regeneratorRuntime.mark((function i(){var n,a,r,o;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return n=t,n.isLoad=!0,a=[{id:n.product._id,num:n.product.num,cover:n.product.carouse[0],title:n.product.title,content:n.product.detail.content,price:n.product.price,unit_name:n.product.unit_name,new_price:n.product.price,discount:10}],r={},r.seller_avatar=n.product.avatar,r.seller_name=n.product.name,r.user_id=n.user._id,r.avatar=n.user.userInfo.avatarUrl,r.name=n.user.userInfo.nickName,r.items=a,r.order_state="wish",i.next=13,wx.cloud.callFunction({name:"cmn",data:{$url:"addWishOrder",order:r}});case 13:o=i.sent,n.isLoad=!1,e("log","addWishOrder res",o," at pagesCmn/product/ShareProductDetail.vue:582"),uni.showToast({icon:"success",title:"生成订单成功"}),n.$refs["showPopupBuyProduct"].close(),setTimeout((function(){uni.navigateTo({url:"/pagesSys/my/NeedConfirmOrder?orderIds="+o.result._id})}),1e3);case 19:case"end":return i.stop()}}),i)})))()},goQrcode:function(t){e("log","goQrcode",t," at pagesCmn/product/ShareProductDetail.vue:596"),uni.navigateTo({url:"/pagesCmn/product/ProductQrcode?id="+t})}})};t.default=l}).call(this,i("0de9")["log"])},d7ea:function(e,t,i){var n=i("24fb");t=n(!1),t.push([e.i,".feng-stepper[data-v-5b422df3]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;-webkit-align-items:center;align-items:center;background-color:#eee;border-radius:%?25?%}.feng-stepper .step-cr[data-v-5b422df3]{display:inline-block;font-size:%?32?%;line-height:%?44?%;border-radius:50%;height:%?50?%;width:%?50?%;background-color:#d3d3d3;text-align:center}.feng-stepper uni-input[data-v-5b422df3]{width:%?50?%;text-align:center;height:%?50?%}",""]),e.exports=t},d824:function(e,t,i){var n=i("d7ea");"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var a=i("4f06").default;a("d81bf4ba",n,!0,{sourceMap:!1,shadowMode:!1})},f887:function(e,t,i){var n=i("2382");"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var a=i("4f06").default;a("74666c7b",n,!0,{sourceMap:!1,shadowMode:!1})}}]);