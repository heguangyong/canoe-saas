(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesSys-card-CardQrcode"],{2140:function(t,a,e){var n=e("24fb");a=n(!1),a.push([t.i,".card[data-v-bb396394]{width:100%;height:100%;position:absolute}.card-name[data-v-bb396394]{font-size:%?66?%;text-align:center;margin-top:%?200?%}.card-position[data-v-bb396394]{font-size:%?40?%;text-align:center;margin-top:%?20?%}.radiu[data-v-bb396394]{border-radius:50%;width:%?500?%;height:%?500?%}.card-image[data-v-bb396394]{border-radius:30%;width:%?400?%;height:%?400?%;display:inline-block;margin:%?50?%}.card-title[data-v-bb396394]{text-align:center;font-size:%?36?%;margin-top:%?800?%}",""]),t.exports=a},"90ff":function(t,a,e){"use strict";var n;e.d(a,"b",(function(){return r})),e.d(a,"c",(function(){return i})),e.d(a,"a",(function(){return n}));var r=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-uni-view",{staticClass:"bg-dark"},[e("cu-custom",{attrs:{isBack:!0}},[e("template",{attrs:{slot:"backText"},slot:"backText"},[t._v("返回")]),e("template",{attrs:{slot:"content"},slot:"content"},[t._v("名片码")])],2),e("v-uni-view",{staticClass:"card bg-dark"},[e("v-uni-view",{},[e("v-uni-view",{staticClass:"card-name"},[t._v(t._s(t.card.name))]),e("v-uni-view",{staticClass:"card-position"},[t._v(t._s(t.card.corp_name))]),e("v-uni-view",{staticClass:"abs radiu bg-white",staticStyle:{left:"50%",top:"50%",transform:"translate(-50%,-50%)"}},[e("v-uni-image",{staticClass:"card-image",attrs:{src:t.card.qrcode_info.tempFileURL}})],1),e("v-uni-view",{staticClass:"card-title"},[t._v("扫一扫上方二维码，查看名片")])],1)],1)],1)},i=[]},9181:function(t,a,e){"use strict";var n=e("a420"),r=e.n(n);r.a},"9d64":function(t,a,e){"use strict";e.r(a);var n=e("f08b"),r=e.n(n);for(var i in n)"default"!==i&&function(t){e.d(a,t,(function(){return n[t]}))}(i);a["default"]=r.a},a420:function(t,a,e){var n=e("2140");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var r=e("4f06").default;r("796313a0",n,!0,{sourceMap:!1,shadowMode:!1})},f08b:function(t,a,e){"use strict";var n=e("4ea4");Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0,e("96cf");var r=n(e("1da1")),i=n(e("d3b3")),s={data:function(){return{card:{qrcode_info:{fileID:"",tempFileURL:""}}}},onLoad:function(t){this.getDetail(t.id)},methods:{getDetail:function(t){var a=this;return(0,r.default)(regeneratorRuntime.mark((function e(){var n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=a,r={},e.next=4,i.default.callFunction({name:"web",data:{$url:"getCardDetailById",id:t}});case 4:r=e.sent,n.card=JSON.parse(r.result.data)||{};case 6:case"end":return e.stop()}}),e)})))()}}};a.default=s},fca8:function(t,a,e){"use strict";e.r(a);var n=e("90ff"),r=e("9d64");for(var i in r)"default"!==i&&function(t){e.d(a,t,(function(){return r[t]}))}(i);e("9181");var s,c=e("f0c5"),o=Object(c["a"])(r["default"],n["b"],n["c"],!1,null,"bb396394",null,!1,n["a"],s);a["default"]=o.exports}}]);