(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesMgt-BizAboutInput"],{1320:function(e,t,i){"use strict";(function(e){var a=i("4ea4");i("99af"),i("4160"),i("a9e3"),i("ac1f"),i("1276"),i("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(i("b85c")),o=a(i("5530")),s=i("2f62"),r=i("e3fb"),c={name:"imageUploadMovable",props:{imgList:{type:Array,required:!0,default:function(){return[]}},imgSize:{type:Number,default:function(){return 80}},maxNum:{type:Number,default:9}},data:function(){return{scopeImgList:this.imgList,areaBoxInfo:{},x:0,y:0,idx:0,moveSrc:"",areaBoxTop:0,hoverImgIdx:"",inBoxXY:{}}},watch:(0,o.default)((0,o.default)({},(0,s.mapState)(["user","cloudPath"])),{},{imgList:function(){var e=this;e.scopeImgList=e.imgList,this.getDomInfo("areaBox",(function(t){e.areaBoxInfo=t,e.scopeImgList.forEach((function(i,a){e.getDomInfo("img"+a,(function(e){i.x=e.left-t.left})),e.getDomInfo("img"+a,(function(e){i.y=e.top-t.top}))}))}))}}),mounted:function(){var e=this;this.getDomInfo("areaBox",(function(t){e.areaBoxInfo=t,e.scopeImgList.forEach((function(i,a){e.getDomInfo("img"+a,(function(e){i.x=e.left-t.left})),e.getDomInfo("img"+a,(function(e){i.y=e.top-t.top}))}))}))},methods:{chooseFile:function(){var t=this,i=this.maxNum-this.scopeImgList.length;i<0&&(i=0),wx.chooseImage({count:i,sizeType:["compressed"],sourceType:["album","camera"],success:function(e){var i,a=(0,n.default)(e.tempFilePaths);try{for(a.s();!(i=a.n()).done;){var o=i.value,s=o.split("."),c=s[s.length-1];wx.cloud.uploadFile({cloudPath:(0,r.cloudUploadPath)()+"".concat(Date.now(),"-").concat(Math.floor(1e7*Math.random(0,1)),".")+c,filePath:o}).then((function(e){uni.hideLoading(),e.fileID&&(t.$emit("upload",e.fileID),wx.cloud.callFunction({name:"sys",data:{$url:"cloudImgSecCheck",fileID:e.fileID}}).then((function(e){0==e.result.code||uni.showToast({icon:"none",title:"图片含有违规内容，请重新选择!"})})))}))}}catch(u){a.e(u)}finally{a.f()}},fail:function(t){e("log",t," at components/ups-movable/index.vue:152")}})},viewFile:function(e){wx.previewImage({urls:this.scopeImgList[e.currentTarget.dataset.index],current:e.currentTarget.dataset.url})},deleteFile:function(e){var t=this;uni.showModal({title:"删除",content:"确定要删除?",cancelText:"取消",confirmText:"确定",success:function(i){i.confirm&&t.$emit("remove",e)}})},moveHandle:function(){},onChange:function(e){},tstr:function(e,t){var i=this.areaBoxInfo.top,a=this.areaBoxInfo.left;this.x=this.scopeImgList[e].x,this.y=this.scopeImgList[e].y,this.moveSrc=this.scopeImgList[e].url,this.idx=e;var n=t.changedTouches[0].clientX-a,o=t.changedTouches[0].clientY-i;this.inBoxXY={x:n-this.scopeImgList[e].x,y:o-this.scopeImgList[e].y}},tsmo:function(e){var t=this,i=this.areaBoxInfo.top,a=this.areaBoxInfo.left,n=this.imgSize,o=e.changedTouches[0].clientX-a,s=e.changedTouches[0].clientY-i;this.x=o-this.inBoxXY.x,this.y=s-this.inBoxXY.y,this.scopeImgList.forEach((function(e,i){o>e.x&&o<e.x+n&&s>e.y&&s<e.y+n&&(t.hoverImgIdx="img"+i)}))},toend:function(t){var i=this,a=this.areaBoxInfo.top,n=this.areaBoxInfo.left,o=this.imgSize,s=t.changedTouches[0].clientX-n,r=t.changedTouches[0].clientY-a;for(var c in this.scopeImgList){var u=this.scopeImgList[c];if(s>u.x&&s<u.x+o&&r>u.y&&r<u.y+o){i.scopeImgList[i.idx].url=i.scopeImgList[c].url,i.scopeImgList[c].url=i.moveSrc;break}}this.moveSrc="",this.hoverImgIdx="",e("log","change",this.imgList,this.scopeImgList,i.scopeImgList," at components/ups-movable/index.vue:241"),this.$emit("moveEndList",this.imgList)},getDomInfo:function(e,t){var i=uni.createSelectorQuery().in(this);i.select("#"+e).boundingClientRect().exec((function(e){t(e[0])}))}}};t.default=c}).call(this,i("0de9")["log"])},"178a":function(e,t,i){"use strict";var a=i("7bab"),n=i.n(a);n.a},"193c":function(e,t,i){"use strict";i.r(t);var a=i("7226"),n=i.n(a);for(var o in a)"default"!==o&&function(e){i.d(t,e,(function(){return a[e]}))}(o);t["default"]=n.a},"2a94":function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,".solids[data-v-36839de3]{border:%?1?% dashed #aaa}.iconfont[data-v-36839de3]{font-size:%?100?%}",""]),e.exports=t},"2f3f":function(e,t,i){"use strict";i.r(t);var a=i("1320"),n=i.n(a);for(var o in a)"default"!==o&&function(e){i.d(t,e,(function(){return a[e]}))}(o);t["default"]=n.a},"35ca":function(e,t,i){"use strict";i.r(t);var a=i("b119"),n=i("2f3f");for(var o in n)"default"!==o&&function(e){i.d(t,e,(function(){return n[e]}))}(o);i("604f");var s,r=i("f0c5"),c=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"78270430",null,!1,a["a"],s);t["default"]=c.exports},"3a66":function(e,t,i){"use strict";var a=i("d183"),n=i.n(a);n.a},"3c7a":function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,".movarea[data-v-78270430]{width:100%;height:75px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row}.imgBox[data-v-78270430]{width:100%;height:75px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;flex-wrap:wrap}.imgBox .imgItem[data-v-78270430]{position:relative}.imgBox .imgItem uni-image[data-v-78270430]{width:75px;height:75px;-webkit-transition:all .5s;transition:all .5s;vertical-align:top}.imgBox .imgItem .closeBtn[data-v-78270430]{background-color:red;color:#fff;border-radius:50%;text-align:center;position:absolute;top:0;right:0;width:16px;height:16px;line-height:16px;z-index:3;-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.moveV[data-v-78270430]{opacity:.8;z-index:999}.moveV uni-image[data-v-78270430]{width:75px;height:75px}.select[data-v-78270430]{-webkit-transform:scale(1.3);transform:scale(1.3)}",""]),e.exports=t},"3eb2":function(e,t,i){"use strict";i.r(t);var a=i("c3ed"),n=i.n(a);for(var o in a)"default"!==o&&function(e){i.d(t,e,(function(){return a[e]}))}(o);t["default"]=n.a},"476e":function(e,t,i){"use strict";i.r(t);var a=i("88aa"),n=i("3eb2");for(var o in n)"default"!==o&&function(e){i.d(t,e,(function(){return n[e]}))}(o);i("3a66");var s,r=i("f0c5"),c=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"29cb287b",null,!1,a["a"],s);t["default"]=c.exports},"5f42":function(e,t,i){"use strict";var a=i("e46b"),n=i.n(a);n.a},"604f":function(e,t,i){"use strict";var a=i("f083"),n=i.n(a);n.a},6415:function(e,t,i){"use strict";var a;i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return a}));var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",[i("cu-custom",{attrs:{isBack:!0}},[i("template",{attrs:{slot:"backText"},slot:"backText"},[e._v("返回")]),i("template",{attrs:{slot:"content"},slot:"content"},[e._v("企业介绍")])],2),i("v-uni-scroll-view",[i("v-uni-form",[i("v-uni-view",{staticClass:"padding"},[i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("公司名称")]),i("v-uni-text",{staticClass:"cuIcon-titles text-xs text-orange"}),i("v-uni-input",{attrs:{placeholder:"请输入公司名称"},model:{value:e.card.name,callback:function(t){e.$set(e.card,"name",t)},expression:"card.name"}})],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("联系电话")]),i("v-uni-input",{attrs:{placeholder:"请输入联系电话"},model:{value:e.card.phone,callback:function(t){e.$set(e.card,"phone",t)},expression:"card.phone"}})],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("头像")]),i("v-uni-view",[i("ups-upload",{attrs:{fileType:"image",uploadFile:e.card.avatar},on:{upload:function(t){arguments[0]=t=e.$handleEvent(t),e.uploadAvatar.apply(void 0,arguments)},remove:function(t){arguments[0]=t=e.$handleEvent(t),e.removeAvatar.apply(void 0,arguments)}}})],1)],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("邮箱")]),i("v-uni-input",{model:{value:e.card.email,callback:function(t){e.$set(e.card,"email",t)},expression:"card.email"}})],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("导航地址")]),i("v-uni-view",{staticClass:"cuIcon-locationfill",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseAddress.apply(void 0,arguments)}}},[e._v(e._s(e.hasAddress?e.card.corp_address.address:"请选择地址"))])],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("联系地址")]),i("v-uni-input",{model:{value:e.card.mailing_address,callback:function(t){e.$set(e.card,"mailing_address",t)},expression:"card.mailing_address"}})],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("文字介绍")])],1),i("v-uni-textarea",{staticClass:"text-box font40 bg-white width100 padding-sm solid",staticStyle:{height:"500rpx"},attrs:{"scroll-y":"true",maxlength:"1200",placeholder:"请输入文字介绍"},model:{value:e.card.introduce,callback:function(t){e.$set(e.card,"introduce",t)},expression:"card.introduce"}}),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("视频介绍")])],1),i("v-uni-view",{staticClass:"bg-white padding-sm"},[i("ups-uploads",{attrs:{fileType:"video",fileList:e.card.videos,maxNum:"1"},on:{upload:function(t){arguments[0]=t=e.$handleEvent(t),e.uploadVideos.apply(void 0,arguments)},remove:function(t){arguments[0]=t=e.$handleEvent(t),e.removeVideos.apply(void 0,arguments)}}})],1),i("v-uni-view",{staticClass:"cu-form-group"},[i("v-uni-view",{staticClass:"title"},[e._v("图片介绍")])],1),i("v-uni-view",{staticClass:"bg-white padding-sm"},[i("ups-movable",{attrs:{imgList:e.card.imgList,imgSize:"75",maxNum:"9"},on:{moveEndList:function(t){arguments[0]=t=e.$handleEvent(t),e.moveEndListHandle.apply(void 0,arguments)},upload:function(t){arguments[0]=t=e.$handleEvent(t),e.uploadCarousels.apply(void 0,arguments)},remove:function(t){arguments[0]=t=e.$handleEvent(t),e.removeCarousels.apply(void 0,arguments)}}})],1),i("v-uni-view",{staticClass:"cu-tabbar-height bg-white"}),i("v-uni-view",{staticClass:"cu-tabbar-height bg-white"}),i("v-uni-view",{staticClass:"cu-tabbar-height bg-white"})],1)],1),i("v-uni-view",{staticClass:"cu-tabbar-height"})],1),i("v-uni-view",{staticClass:"cu-bar btn-group foot bg-white",staticStyle:{"z-index":"99"}},[i("v-uni-button",{staticClass:"cu-btn  round line-grey",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.cancelSubmit.apply(void 0,arguments)}}},[e._v("取消")]),i("v-uni-button",{staticClass:"cu-btn  round line-grey",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.submit.apply(void 0,arguments)}}},[e._v("提交")])],1)],1)},o=[]},7226:function(e,t,i){"use strict";(function(e){var a=i("4ea4");i("4160"),i("a434"),i("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,i("96cf");var n=a(i("1da1")),o=a(i("5530")),s=i("2f62"),r=a(i("9af9")),c=a(i("476e")),u=a(i("35ca")),l={components:{"ups-uploads":r.default,"ups-upload":c.default,"ups-movable":u.default},data:function(){return{card:{carousels:[],imgList:[],videos:[]},hasAddress:!1,currentUser:{}}},onLoad:function(e){var t=this;e.id&&(t.card._id=e.id,t.getBizCardDetail(e.id))},computed:(0,o.default)({},(0,s.mapState)(["user","httpPath"])),methods:{getBizCardDetail:function(t){var i=this;return(0,n.default)(regeneratorRuntime.mark((function a(){var n,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return n=i,a.next=3,wx.cloud.callFunction({name:"sys",data:{$url:"getCardDetailById",id:t}});case 3:o=a.sent,e("log",o," at pagesMgt/BizAboutInput.vue:132"),n.card=o.result.data,n.card.corp_address?n.hasAddress=!0:(n.hasAddress=!1,n.card.corp_address={address:"",latitude:0,longitude:0}),n.card.imgList=[],n.card.carousels&&n.card.carousels.length>0&&n.card.carousels.forEach((function(e){n.card.imgList.push({url:e})}));case 9:case"end":return a.stop()}}),a)})))()},uploadAvatar:function(e){this.card.avatar=e,this.$forceUpdate()},removeAvatar:function(){this.card.avatar="",this.$forceUpdate()},moveEndListHandle:function(e){var t=this;t.card.imgList=e,t.card.carousels=[],t.card.imgList.forEach((function(e){t.card.carousels.push(e.url)})),t.$forceUpdate()},uploadCarousels:function(e){this.card.carousels||(this.card.carousels=[]),this.card.carousels.push(e),this.card.imgList.push({url:e}),this.$forceUpdate()},removeCarousels:function(e){this.card.carousels.splice(e,1),this.card.imgList.splice(e,1),this.$forceUpdate()},uploadVideos:function(e){this.card.videos||(this.card.videos=[]),this.card.videos.push(e),this.$forceUpdate()},removeVideos:function(e){this.card.videos.splice(e,1),this.$forceUpdate()},cancelSubmit:function(){uni.navigateBack()},submit:function(){var t=this;return(0,n.default)(regeneratorRuntime.mark((function i(){var a,n,o,s;return regeneratorRuntime.wrap((function(i){while(1)switch(i.prev=i.next){case 0:return a=t,n=a.card.name+a.card.introduce,i.next=4,wx.cloud.callFunction({name:"sys",data:{$url:"msgSecCheck",value:n}});case 4:if(o=i.sent,e("log",o," at pagesMgt/BizAboutInput.vue:208"),0==o.result.code){i.next=9;break}return uni.showToast({icon:"none",title:"内容含有违规内容，请修改后提交"}),i.abrupt("return");case 9:if(!a.card._id){i.next=14;break}return i.next=12,wx.cloud.callFunction({name:"sys",data:{$url:"updateCard",card:a.card}});case 12:i.next=24;break;case 14:return a.card.site_bg="https://7072-prod-9goq82ctb17bd75f-1306535128.tcb.qcloud.la/resource/MainBg.png",a.card.site=[{title:"最新产品",name:"product",color:"purple",cuIcon:"shop",isOpen:!0,auth:!0},{title:"企业展厅",name:"trend",color:"mauve",cuIcon:"pic",isOpen:!0,auth:!0},{title:"线上活动",name:"activity",color:"cyan",cuIcon:"activity",isOpen:!0,auth:!0},{title:"客服沟通",name:"service",color:"blue",cuIcon:"service",isOpen:!0,auth:!0},{title:"企业服务",name:"company",color:"red",cuIcon:"moreandroid",isOpen:!0,auth:!0},{title:"关于我们",name:"about",color:"green",cuIcon:"info",isOpen:!0,auth:!0}],a.card.accounts=[{account_key:"0000",api_map:{},h5_link:"/pagesSys/card/CardDetail",is_forbidden:!1,is_show:!0,name:"vipcard",need_role:"normal",password:"",remark:"",support_h5:!0,title:"我的名片",url:"/pagesSys/card/CardDetail",user_name:"",view_count:0},{account_key:"1100",api_map:{},h5_link:"",is_forbidden:!1,is_show:!0,name:"edit",need_role:"cardAdmin",password:"",remark:"",support_h5:!1,title:"关于我们",url:"/pagesMgt/BizCardInput",user_name:"",view_count:0},{account_key:"2200",api_map:{},h5_link:"/pagesMgt/BizProductList",is_forbidden:!0,is_show:!0,name:"goods",need_role:"cardAdmin",password:"",remark:"",support_h5:!0,title:"最新产品",url:"/pagesMgt/BizProductList",user_name:"",view_count:0},{account_key:"3300",api_map:{},h5_link:"/pagesMgt/BizActivityList",is_forbidden:!0,is_show:!0,name:"activity",need_role:"cardAdmin",password:"",remark:"",support_h5:!0,title:"线上活动",url:"/pagesMgt/BizActivityList",user_name:"",view_count:0},{account_key:"4400",api_map:{},h5_link:"",is_forbidden:!0,is_show:!0,name:"record",need_role:"cardAdmin",password:"",remark:"",support_h5:!1,title:"企业展厅",url:"/pagesMgt/BizTrendList",user_name:"",view_count:0},{account_key:"5500",api_map:{},h5_link:"/pagesMgt/BizMsgList",is_forbidden:!0,is_show:!0,name:"community",need_role:"cardAdmin",password:"",remark:"",support_h5:!0,title:"客服消息",url:"/pagesMgt/BizMsgList",user_name:"",view_count:0},{account_key:"8810",api_map:{},h5_link:"",is_forbidden:!0,is_show:!1,name:"news",need_role:"cardAdmin",password:"",remark:"",support_h5:!1,title:"企业服务",url:"/pagesMgt/BizCardList",user_name:"",view_count:"0"},{account_key:"8800",api_map:{},h5_link:"/pagesMgt/PersonCardList",is_forbidden:!0,is_show:!0,name:"friend",need_role:"cardAdmin",password:"",remark:"",support_h5:!0,title:"用户管理",url:"/pagesMgt/PersonCardList",user_name:"",view_count:0},{account_key:"9900",api_map:{},h5_link:"/pagesMgt/BizServiceList",is_forbidden:!0,is_show:!0,name:"global",need_role:"sysAdmin",password:"",remark:"",support_h5:!0,title:"系统配置",url:"/pagesMgt/BizServiceList",user_name:"",view_count:0}],i.next=19,wx.cloud.callFunction({name:"sys",data:{$url:"addBizCard",card:a.card}});case 19:return s=i.sent,a.card._id=s.result._id,e("log","新建企业名片 ID",s," at pagesMgt/BizAboutInput.vue:434"),i.next=24,wx.cloud.callFunction({name:"sys",data:{$url:"genBizCardQrcode",cardId:a.card._id,page:"/pagesSys/card/BizAboutExt?id="+a.card._id,width:430}});case 24:uni.reLaunch({url:"/pagesSys/card/BizAboutExt?id="+a.card._id});case 25:case"end":return i.stop()}}),i)})))()},chooseAddress:function(){var t=this;wx.getSetting({success:function(i){e("log","get-setting",i.authSetting," at pagesMgt/BizAboutInput.vue:455");var a=i.authSetting;a["scope.userLocation"]||void 0===a["scope.userLocation"]?t.getUserLocation():a["scope.userLocation"]||wx.showModal({title:"是否授权当前位置？",content:"需要获取您的地理位置，请确认授权，否则定位功能将无法使用",success:function(i){i.confirm&&wx.openSetting({success:function(i){e("log","open-setting-suc",i.authSetting," at pagesMgt/BizAboutInput.vue:474");var a=i.authSetting;a["scope.userLocation"]?t.getUserLocation():wx.showToast({title:"地址授权失败，定位功能无法使用",icon:"none"})},fail:function(t){e("log","open-setting-fail",t," at pagesMgt/BizAboutInput.vue:488")}})}})}})},getUserLocation:function(){var t=this;wx.chooseLocation({success:function(i){e("log",i," at pagesMgt/BizAboutInput.vue:504"),e("log",t.card," at pagesMgt/BizAboutInput.vue:505"),t.card.corp_address?(t.card.corp_address.address=i.address,t.card.corp_address.latitude=i.latitude,t.card.corp_address.longitude=i.longitude):(t.card.corp_address={address:"",latitude:0,longitude:0},t.card.corp_address.address=i.address,t.card.corp_address.latitude=i.latitude,t.card.corp_address.longitude=i.longitude),t.hasAddress=!0,t.$forceUpdate()}})}}};t.default=l}).call(this,i("0de9")["log"])},"7bab":function(e,t,i){var a=i("2a94");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("8e7cff12",a,!0,{sourceMap:!1,shadowMode:!1})},"7df5":function(e,t,i){"use strict";var a;i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return a}));var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",["image"===e.fileType?i("v-uni-view",{staticClass:"grid col-4 grid-square flex-sub"},[e._l(e.fileList,(function(t,a){return i("v-uni-view",{key:a,staticClass:"bg-img",attrs:{"data-url":e.fileList[a]},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.viewFile.apply(void 0,arguments)}}},[i("v-uni-image",{attrs:{src:e.fileList[a],mode:"aspectFill"}}),i("v-uni-view",{staticClass:"cu-tag bg-red",attrs:{"data-index":a},on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.deleteFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-close"})],1)],1)})),e.fileList.length<e.maxNum?i("v-uni-view",{staticClass:"solids",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-cameraadd"})],1):e._e()],2):e._e(),"video"===e.fileType&&e.fileList.length>=e.maxNum?i("v-uni-view",[i("v-uni-view",{staticClass:"cu-tag bg-red fr",attrs:{"data-index":"0"},on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.deleteFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-close"})],1)],1):e._e(),"video"===e.fileType?i("v-uni-view",{staticClass:"grid col-2 grid-square flex-sub rel"},[e.fileList.length>=e.maxNum?i("v-uni-video",{attrs:{src:e.fileList[0],"object-fit":"cover",controls:!0,muted:!0}}):e._e(),e.fileList.length<e.maxNum?i("v-uni-view",{staticClass:" grid col-4 grid-square flex-sub solids",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"iconfont icon-shangchuanshipin text-gray abs center"})],1):e._e()],1):e._e()],1)},o=[]},"88aa":function(e,t,i){"use strict";var a;i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return a}));var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",["image"===e.fileType?i("v-uni-view",{staticClass:"flex-sub"},[e.uploadFile?i("v-uni-view",{staticClass:"bg-img",attrs:{"data-url":e.uploadFile},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.viewFile.apply(void 0,arguments)}}},[i("v-uni-image",{staticClass:"cu-avatar",attrs:{src:e.uploadFile,mode:"aspectFill"}}),i("v-uni-view",{staticClass:"cu-avatar bg-red",on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.deleteFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-close"})],1)],1):i("v-uni-view",{staticClass:"solids",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"cuIcon-cameraadd"})],1)],1):i("v-uni-view",{staticClass:"grid col-2 grid-square flex-sub rel"},[e.uploadFile?i("v-uni-view",[e.uploadFile?i("v-uni-video",{attrs:{src:e.uploadFile,"object-fit":"cover",controls:!0,muted:!0}}):e._e()],1):i("v-uni-view",{staticClass:" grid col-4 grid-square flex-sub solids",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseFile.apply(void 0,arguments)}}},[i("v-uni-text",{staticClass:"iconfont icon-shangchuanshipin text-gray abs center"})],1)],1)],1)},o=[]},"8b18":function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,".padding[data-v-74a1d192]{padding:%?10?%}.text-box[data-v-74a1d192]{height:%?100?%;\n\t/* background-color: #FFFFFF; */-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center;font-size:%?24?%;color:#353535;line-height:1.8}uni-video[data-v-74a1d192]{width:%?750?%}uni-image[data-v-74a1d192]{width:%?750?%}.card-radius[data-v-74a1d192]{border-radius:%?10?%}\n\n/* 遮罩样式 */.shade[data-v-74a1d192]{width:100%;height:100%;position:fixed;top:0;left:0;z-index:90}.trend-popup[data-v-74a1d192]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;height:%?950?%;padding-bottom:62px;position:fixed;left:0;bottom:0;width:100%;z-index:95;border-top-left-radius:3%;border-top-right-radius:3%}.trend-remove-popup[data-v-74a1d192]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;padding:5px;height:%?350?%}.trend-popup-close[data-v-74a1d192]{position:absolute;top:%?30?%;left:%?30?%;font-size:%?39?%;text-align:center;font-weight:700;z-index:99}.trend-popup-title[data-v-74a1d192]{margin-top:%?15?%;line-height:%?60?%;font-size:%?28?%;padding:%?5?% 0;text-align:center;font-weight:700}.trend-popup-content[data-v-74a1d192]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;\n-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;padding:5px;max-height:%?850?%}",""]),e.exports=t},"9af9":function(e,t,i){"use strict";i.r(t);var a=i("7df5"),n=i("c418");for(var o in n)"default"!==o&&function(e){i.d(t,e,(function(){return n[e]}))}(o);i("178a");var s,r=i("f0c5"),c=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"36839de3",null,!1,a["a"],s);t["default"]=c.exports},b119:function(e,t,i){"use strict";var a;i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return a}));var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("v-uni-view",{on:{touchmove:function(t){t.stopPropagation(),t.preventDefault(),arguments[0]=t=e.$handleEvent(t),e.moveHandle.apply(void 0,arguments)}}},[i("v-uni-movable-area",{ref:"areaBox",staticClass:"movarea",attrs:{id:"areaBox"}},[i("v-uni-view",{staticClass:"imgBox"},[e._l(e.scopeImgList,(function(t,a){return i("v-uni-view",{key:a,staticClass:"imgItem margin-right-sm margin-bottom-sm",style:{width:e.imgSize+"px",height:e.imgSize+"px"}},[i("v-uni-image",{ref:"img"+a,refInFor:!0,class:e.hoverImgIdx==="img"+a?"select":"",attrs:{id:"img"+a,src:t.url,mode:"aspectFill"},on:{touchstart:function(t){arguments[0]=t=e.$handleEvent(t),e.tstr(a,t)},touchmove:function(t){arguments[0]=t=e.$handleEvent(t),e.tsmo.apply(void 0,arguments)},touchend:function(t){arguments[0]=t=e.$handleEvent(t),e.toend.apply(void 0,arguments)}}}),i("v-uni-view",{staticClass:"closeBtn",on:{click:function(t){t.stopPropagation(),arguments[0]=t=e.$handleEvent(t),e.deleteFile(a)}}},[i("v-uni-text",{staticClass:"cuIcon-close"})],1)],1)})),e.scopeImgList.length<e.maxNum?i("v-uni-view",{staticClass:"imgItem solids",style:{width:e.imgSize+"px",height:e.imgSize+"px"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseFile.apply(void 0,arguments)}}},[i("v-uni-image",{staticClass:"abs center",style:{width:e.imgSize/2+"px",height:e.imgSize/2+"px"},attrs:{src:"cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/addPhoto.png",mode:"aspectFill"}})],1):e._e()],2),e.moveSrc?i("v-uni-movable-view",{staticClass:"moveV",style:{width:e.imgSize+"px",height:e.imgSize+"px"},attrs:{animation:!1,x:e.x,y:e.y,direction:"all"},on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.onChange.apply(void 0,arguments)}}},[i("v-uni-image",{attrs:{src:e.moveSrc,mode:"aspectFill"}})],1):e._e()],1)],1)},o=[]},c3ed:function(e,t,i){"use strict";(function(e){var a=i("4ea4");i("99af"),i("ac1f"),i("1276"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(i("b85c")),o=i("e3fb"),s={name:"UpsUpload",props:{fileType:{type:String,required:!0},uploadFile:{type:String,required:!0}},data:function(){return{}},methods:{chooseFile:function(){var t=this;"image"===this.fileType?uni.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["album","camera"],success:function(i){var a,s=(0,n.default)(i.tempFilePaths);try{for(s.s();!(a=s.n()).done;){var r=a.value,c=r.split("."),u=c[c.length-1];wx.cloud.uploadFile({cloudPath:(0,o.cloudUploadPath)()+"".concat(Date.now(),"-").concat(Math.floor(1e7*Math.random(0,1)),".")+u,filePath:r}).then((function(i){uni.hideLoading(),i.fileID&&(t.$emit("upload",i.fileID),wx.cloud.callFunction({name:"sys",data:{$url:"cloudImgSecCheck",fileID:i.fileID}}).then((function(t){e("log",t.result," at components/ups-upload/index.vue:70"),0==t.result.code||uni.showToast({icon:"none",title:"图片含有违规内容，请重新选择!"})})))}))}}catch(l){s.e(l)}finally{s.f()}},fail:function(t){e("log",t," at components/ups-upload/index.vue:86")}}):"video"===this.fileType&&uni.chooseVideo({count:1,maxDuration:15,sourceType:["camera","album"],compressed:!1,success:function(i){e("log",i," at components/ups-upload/index.vue:96"),uni.showLoading({title:"加载中"});wx.cloud.uploadFile({cloudPath:(0,o.cloudUploadPath)()+"".concat(Date.now(),"-").concat(Math.floor(1e7*Math.random(0,1)),".png"),filePath:i.tempFilePath}).then((function(e){uni.hideLoading(),e.statusCode<300&&t.$emit("upload",e.fileID)}))},fail:function(t){e("log",t," at components/ups-upload/index.vue:109")}})},viewFile:function(e){wx.previewImage({urls:this.uploadFile,current:e.currentTarget.dataset.url})},deleteFile:function(e){var t=this;uni.showModal({title:"删除",content:"确定要删除?",cancelText:"取消",confirmText:"确定",success:function(e){e.confirm&&t.$emit("remove")}})}}};t.default=s}).call(this,i("0de9")["log"])},c418:function(e,t,i){"use strict";i.r(t);var a=i("f80c"),n=i.n(a);for(var o in a)"default"!==o&&function(e){i.d(t,e,(function(){return a[e]}))}(o);t["default"]=n.a},d183:function(e,t,i){var a=i("f3d9");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("69669d2c",a,!0,{sourceMap:!1,shadowMode:!1})},e3fb:function(e,t,i){function a(e){return""===e||("null"===e||("undefined"===e||(!e&&0!==e&&""!==e||(!(!Array.prototype.isPrototypeOf(e)||0!==e.length)||!(!Object.prototype.isPrototypeOf(e)||0!==Object.keys(e).length)))))}function n(e,t){if(e){switch(t||(t="yyyy-MM-dd"),typeof e){case"string":e=new Date(e.replace(/-/,"/"));break;case"number":e=new Date(e);break}if(!(!e instanceof Date)){var i={yyyy:e.getFullYear(),M:e.getMonth()+1,d:e.getDate(),H:e.getHours(),m:e.getMinutes(),s:e.getSeconds(),MM:(""+(e.getMonth()+101)).substr(1),dd:(""+(e.getDate()+100)).substr(1),HH:(""+(e.getHours()+100)).substr(1),mm:(""+(e.getMinutes()+100)).substr(1),ss:(""+(e.getSeconds()+100)).substr(1)};return t.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,(function(){return i[arguments[0]]}))}}}function o(){return this.dateFormat(new Date,"yyyyMMdd")}function s(e,t){if(e){switch(t||(t="yyyy-MM-dd"),typeof e){case"string":e=new Date(e);break;case"number":e=new Date(e);break}if(!(!e instanceof Date)){var i={yyyy:e.getFullYear(),M:e.getMonth()+1,d:e.getDate(),H:e.getHours(),m:e.getMinutes(),s:e.getSeconds(),MM:(""+(e.getMonth()+101)).substr(1),dd:(""+(e.getDate()+100)).substr(1),HH:(""+(e.getHours()+100)).substr(1),mm:(""+(e.getMinutes()+100)).substr(1),ss:(""+(e.getSeconds()+100)).substr(1)};return t.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,(function(){return i[arguments[0]]}))}}}function r(e,t){var i=!1,a=Date.parse(e),n=Date.parse(t),o=new Date(n).setHours(0,0,0,0);return a<o&&(i=!0),i}function c(e,t){var i=!1,a=Date.parse(e),n=Date.parse(t);return a<n&&(i=!0),i}function u(e){if(e){var t=Date.parse(e),i=Date.parse(new Date),a=Math.abs(i-t);if(a>6048e5){var n=new Date(t),o=n.getFullYear(),s=n.getMonth()+1,r=n.getDate(),c=(new Date).getFullYear();return c==o?s+"月"+r+"日":o+"年"+s+"月"+r+"日"}if(a<6048e5&&a>864e5){var u=Math.floor(a/864e5);return u+"天前"}if(a<864e5&&a>36e5){u=Math.floor(a/36e5);return u+"小时前"}if(a<36e5&&a>=0)return"刚刚"}}function l(e){var t=/^[1][3,4,5,7,8,9][0-9]{9}$/;return!(!t.test(e)||11!=e.length)}function d(){var e=new Date,t="user/"+e.getFullYear()+(""+(e.getMonth()+101)).substr(1)+"/";return t}function p(e){var t="",i=6e4,a=60*i,n=24*a,o=30*n,s=(new Date).getTime(),r=s-e;if(!(r<0)){var c=r/o,u=r/(7*n),l=r/n,d=r/a,p=r/i;return t=c>=1?parseInt(c)+"月前":u>=1?parseInt(u)+"周前":l>=1?parseInt(l)+"天前":d>=1?parseInt(d)+"小时前":p>=1?parseInt(p)+"分钟前":"刚刚",t}}i("b64b"),i("e25e"),i("ac1f"),i("5319"),e.exports={isEmpty:a,dateFormat:n,today:o,formatTime:s,isDayBefore:r,isTimeBefore:c,formatCreateTime:u,isPhoneAvailable:l,cloudUploadPath:d,getDateDiff:p}},e46b:function(e,t,i){var a=i("8b18");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("301c9f28",a,!0,{sourceMap:!1,shadowMode:!1})},f083:function(e,t,i){var a=i("3c7a");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("2403a29d",a,!0,{sourceMap:!1,shadowMode:!1})},f3d9:function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,".solids[data-v-29cb287b]{border:%?1?% dashed #aaa}.iconfont[data-v-29cb287b]{font-size:%?100?%}",""]),e.exports=t},f758:function(e,t,i){"use strict";i.r(t);var a=i("6415"),n=i("193c");for(var o in n)"default"!==o&&function(e){i.d(t,e,(function(){return n[e]}))}(o);i("5f42");var s,r=i("f0c5"),c=Object(r["a"])(n["default"],a["b"],a["c"],!1,null,"74a1d192",null,!1,a["a"],s);t["default"]=c.exports},f80c:function(e,t,i){"use strict";(function(e){var a=i("4ea4");i("99af"),i("4160"),i("a9e3"),i("ac1f"),i("1276"),i("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(i("b85c")),o=i("e3fb"),s={name:"Upload",props:{fileType:{type:String,required:!0},fileList:{type:Array,required:!0},maxNum:{type:Number,default:9}},data:function(){return{}},methods:{chooseFile:function(){var t=this,i=this.maxNum-this.fileList.length;i<0&&(i=0),"image"===this.fileType?wx.chooseImage({count:i,sizeType:["compressed"],sourceType:["album","camera"],success:function(i){var a,s=(0,n.default)(i.tempFilePaths);try{for(s.s();!(a=s.n()).done;){var r=a.value,c=r.split("."),u=c[c.length-1];wx.cloud.uploadFile({cloudPath:(0,o.cloudUploadPath)()+"".concat(Date.now(),"-").concat(Math.floor(1e7*Math.random(0,1)),".")+u,filePath:r}).then((function(i){uni.hideLoading(),i.fileID&&(t.$emit("upload",i.fileID),wx.cloud.callFunction({name:"sys",data:{$url:"cloudImgSecCheck",fileID:i.fileID}}).then((function(t){e("log",t.result," at components/ups-uploads/index.vue:82"),0==t.result.code||uni.showToast({icon:"none",title:"图片含有违规内容，请重新选择!"})})))}))}}catch(l){s.e(l)}finally{s.f()}},fail:function(t){e("log",t," at components/ups-uploads/index.vue:97")}}):"video"===this.fileType&&uni.chooseMedia({count:1,maxDuration:15,sourceType:["camera","album"],compressed:!0,success:function(i){e("log","uRes",i," at components/ups-uploads/index.vue:107"),uni.showLoading({title:"加载中"});var a=(0,o.cloudUploadPath)()+"".concat(Date.now(),"-").concat(Math.floor(1e7*Math.random(0,1))),n=[a+".jpg",a+".mp4"],s=[i.tempFiles[0].thumbTempFilePath,i.tempFiles[0].tempFilePath];n.forEach((function(i,a){wx.cloud.uploadFile({cloudPath:n[a],filePath:s[a]}).then((function(i){e("log","res",i," at components/ups-uploads/index.vue:118"),1==a&&(uni.hideLoading(),i.statusCode<300&&t.$emit("upload",i.fileID))}))}))},fail:function(t){e("log",t," at components/ups-uploads/index.vue:131")}})},viewFile:function(e){wx.previewImage({urls:this.fileList[e.currentTarget.dataset.index],current:e.currentTarget.dataset.url})},deleteFile:function(e){var t=this;uni.showModal({title:"删除",content:"确定要删除?",cancelText:"取消",confirmText:"确定",success:function(i){i.confirm&&t.$emit("remove",e.currentTarget.dataset.index)}})}}};t.default=s}).call(this,i("0de9")["log"])}}]);