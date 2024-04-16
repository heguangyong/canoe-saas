(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/ups-movable/index"],{860:function(t,e,n){"use strict";n.r(e);var o=n(861),r=n(863);for(var i in r)"default"!==i&&function(t){n.d(e,t,(function(){return r[t]}))}(i);n(865);var c,a=n(15),s=Object(a["default"])(r["default"],o["render"],o["staticRenderFns"],!1,null,"8849571e",null,!1,o["components"],c);s.options.__file="components/ups-movable/index.vue",e["default"]=s.exports},861:function(t,e,n){"use strict";n.r(e);var o=n(862);n.d(e,"render",(function(){return o["render"]})),n.d(e,"staticRenderFns",(function(){return o["staticRenderFns"]})),n.d(e,"recyclableRender",(function(){return o["recyclableRender"]})),n.d(e,"components",(function(){return o["components"]}))},862:function(t,e,n){"use strict";var o;n.r(e),n.d(e,"render",(function(){return r})),n.d(e,"staticRenderFns",(function(){return c})),n.d(e,"recyclableRender",(function(){return i})),n.d(e,"components",(function(){return o}));var r=function(){var t=this,e=t.$createElement;t._self._c},i=!1,c=[];r._withStripped=!0},863:function(t,e,n){"use strict";n.r(e);var o=n(864),r=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=r.a},864:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=n(12),r=n(39);function i(t,e){var n;if("undefined"===typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(n=c(t))||e&&t&&"number"===typeof t.length){n&&(t=n);var o=0,r=function(){};return{s:r,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=t[Symbol.iterator]()},n:function(){var t=n.next();return a=t.done,t},e:function(t){s=!0,i=t},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}function c(t,e){if(t){if("string"===typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,e):void 0}}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function s(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?s(Object(n),!0).forEach((function(e){f(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function f(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var l={name:"imageUploadMovable",props:{imgList:{type:Array,required:!0,default:function(){return[]}},imgSize:{type:Number,default:function(){return 80}},maxNum:{type:Number,default:9}},data:function(){return{scopeImgList:this.imgList,areaBoxInfo:{},x:0,y:0,idx:0,moveSrc:"",areaBoxTop:0,hoverImgIdx:"",inBoxXY:{}}},watch:u(u({},(0,o.mapState)(["user","cloudPath"])),{},{imgList:function(){var t=this;t.scopeImgList=t.imgList,this.getDomInfo("areaBox",(function(e){t.areaBoxInfo=e,t.scopeImgList.forEach((function(n,o){t.getDomInfo("img"+o,(function(t){n.x=t.left-e.left})),t.getDomInfo("img"+o,(function(t){n.y=t.top-e.top}))}))}))}}),mounted:function(){var t=this;this.getDomInfo("areaBox",(function(e){t.areaBoxInfo=e,t.scopeImgList.forEach((function(n,o){t.getDomInfo("img"+o,(function(t){n.x=t.left-e.left})),t.getDomInfo("img"+o,(function(t){n.y=t.top-e.top}))}))}))},methods:{chooseFile:function(){var e=this,n=this.maxNum-this.scopeImgList.length;n<0&&(n=0),wx.chooseImage({count:n,sizeType:["compressed"],sourceType:["album","camera"],success:function(n){var o,c=i(n.tempFilePaths);try{for(c.s();!(o=c.n()).done;){var a=o.value,s=a.split("."),u=s[s.length-1];wx.cloud.uploadFile({cloudPath:(0,r.cloudUploadPath)()+"".concat(Date.now(),"-").concat(Math.floor(1e7*Math.random(0,1)),".")+u,filePath:a}).then((function(n){t.hideLoading(),n.fileID&&(e.$emit("upload",n.fileID),wx.cloud.callFunction({name:"sys",data:{$url:"cloudImgSecCheck",fileID:n.fileID}}).then((function(e){0==e.result.code||t.showToast({icon:"none",title:"图片含有违规内容，请重新选择!"})})))}))}}catch(f){c.e(f)}finally{c.f()}},fail:function(t){console.log(t)}})},viewFile:function(t){wx.previewImage({urls:this.scopeImgList[t.currentTarget.dataset.index],current:t.currentTarget.dataset.url})},deleteFile:function(e){var n=this;t.showModal({title:"删除",content:"确定要删除?",cancelText:"取消",confirmText:"确定",success:function(t){t.confirm&&n.$emit("remove",e)}})},moveHandle:function(){},onChange:function(t){},tstr:function(t,e){var n=this.areaBoxInfo.top,o=this.areaBoxInfo.left;this.x=this.scopeImgList[t].x,this.y=this.scopeImgList[t].y,this.moveSrc=this.scopeImgList[t].url,this.idx=t;var r=e.changedTouches[0].clientX-o,i=e.changedTouches[0].clientY-n;this.inBoxXY={x:r-this.scopeImgList[t].x,y:i-this.scopeImgList[t].y}},tsmo:function(t){var e=this,n=this.areaBoxInfo.top,o=this.areaBoxInfo.left,r=this.imgSize,i=t.changedTouches[0].clientX-o,c=t.changedTouches[0].clientY-n;this.x=i-this.inBoxXY.x,this.y=c-this.inBoxXY.y,this.scopeImgList.forEach((function(t,n){i>t.x&&i<t.x+r&&c>t.y&&c<t.y+r&&(e.hoverImgIdx="img"+n)}))},toend:function(t){var e=this,n=this.areaBoxInfo.top,o=this.areaBoxInfo.left,r=this.imgSize,i=t.changedTouches[0].clientX-o,c=t.changedTouches[0].clientY-n;for(var a in this.scopeImgList){var s=this.scopeImgList[a];if(i>s.x&&i<s.x+r&&c>s.y&&c<s.y+r){e.scopeImgList[e.idx].url=e.scopeImgList[a].url,e.scopeImgList[a].url=e.moveSrc;break}}this.moveSrc="",this.hoverImgIdx="",console.log("change",this.imgList,this.scopeImgList,e.scopeImgList),this.$emit("moveEndList",this.imgList)},getDomInfo:function(e,n){var o=t.createSelectorQuery().in(this);o.select("#"+e).boundingClientRect().exec((function(t){n(t[0])}))}}};e.default=l}).call(this,n(1)["default"])},865:function(t,e,n){"use strict";n.r(e);var o=n(866),r=n.n(o);for(var i in o)"default"!==i&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=r.a},866:function(t,e,n){}}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/ups-movable/index.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/ups-movable/index-create-component',
    {
        'components/ups-movable/index-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(860))
        })
    },
    [['components/ups-movable/index-create-component']]
]);
