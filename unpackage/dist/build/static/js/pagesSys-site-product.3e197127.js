(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pagesSys-site-product"],{"0adb":function(e,t,a){"use strict";var i;a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){return i}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[e.categories.length>1?a("v-uni-view",{staticClass:"padding-sm flex flex-wrap"},e._l(e.categories,(function(t,i){return a("v-uni-view",{key:i,staticClass:"padding-xs"},[t.checked?a("v-uni-view",{staticClass:"cu-tag  bg-grey round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseTag(i)}}},[e._v(e._s(t.label))]):a("v-uni-view",{staticClass:"cu-tag line-gray round",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseTag(i)}}},[e._v(e._s(t.label))])],1)})),1):e._e(),a("v-uni-view",[a("ups-products",{attrs:{productList:e.products}})],1),a("v-uni-view",{staticClass:"cu-tabbar-height"})],1)},n=[]},"0e23":function(e,t,a){"use strict";var i=a("d169"),r=a.n(i);r.a},"17cb":function(e,t,a){"use strict";var i;a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){return i}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",{staticClass:"grid col-2"},e._l(e.productList,(function(t,i){return a("v-uni-view",{key:i},[a("v-uni-view",{staticClass:"product rel"},[a("v-uni-view",{on:{click:function(a){arguments[0]=a=e.$handleEvent(a),e.goProductDetail(t)}}},[a("v-uni-image",{staticClass:"product-image",attrs:{mode:"aspectFill",src:t.cover}}),a("v-uni-text",{staticClass:"product-title"},[e._v(e._s(t.title))]),a("v-uni-view",{staticClass:"price-line",staticStyle:{"margin-top":"-20rpx"}},[t.price>0?a("v-uni-text",{staticClass:"text-bold text-red text-lg"},[e._v(e._s("￥"+t.price))]):a("v-uni-text",{staticClass:"text-gray"},[e._v("价格面议")])],1)],1),e.isShowSwitch?a("v-uni-view",{staticClass:"cu-bar margin-left-sm margin-right-sm round",staticStyle:{"margin-top":"-20rpx"}},[a("v-uni-view",[a("v-uni-text",{class:t.on_sale?"text-red":"text-gray"},[e._v(e._s(t.state))])],1),a("v-uni-switch",{staticClass:"green",class:t.on_sale?"checked":"",attrs:{checked:!!t.on_sale},on:{change:function(a){arguments[0]=a=e.$handleEvent(a),e.switchOnSale(t,i)}}})],1):e._e()],1)],1)})),1)},n=[]},"1a02":function(e,t,a){var i=a("24fb");t=i(!1),t.push([e.i,".product[data-v-31c7343f]{background-color:#fff;border-radius:%?18?%;margin:%?10?% %?10?%}.product-image[data-v-31c7343f]{background-color:#dcdcdc;width:%?350?%;height:%?350?%;border-top-left-radius:%?18?%;border-top-right-radius:%?18?%;margin-bottom:10px}.product-title[data-v-31c7343f]{margin-left:%?8?%;margin-right:%?8?%;text-overflow:ellipsis;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;height:%?70?%;font-size:%?24?%}.price-line[data-v-31c7343f]{margin-left:%?8?%;margin-right:%?8?%;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;align-items:center}",""]),e.exports=t},"7d44":function(e,t,a){"use strict";a("a9e3"),a("b680"),a("ac1f"),a("1276"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i={name:"ups-products",props:{productList:{type:Array,required:!0},isEdit:{type:[Boolean,String],required:!1,default:!1},isShowSwitch:{type:[Boolean,String],required:!1,default:!1}},data:function(){return{}},computed:{priceArray:function(e){var t=String(Number(e).toFixed(2)).split(".");return t}},methods:{goProductDetail:function(e){var t="";t=this.isEdit?"/pagesCmn/product/ProductDetail?id="+e._id:"/pagesCmn/product/ProductDetailExt?id="+e._id,uni.navigateTo({url:t})},switchOnSale:function(e,t){this.$emit("operateProduct","switchState",e,t)}}};t.default=i},"8cff":function(e,t,a){"use strict";a.r(t);var i=a("efad"),r=a.n(i);for(var n in i)"default"!==n&&function(e){a.d(t,e,(function(){return i[e]}))}(n);t["default"]=r.a},d169:function(e,t,a){var i=a("1a02");"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var r=a("4f06").default;r("22b02324",i,!0,{sourceMap:!1,shadowMode:!1})},e371:function(e,t,a){"use strict";a.r(t);var i=a("7d44"),r=a.n(i);for(var n in i)"default"!==n&&function(e){a.d(t,e,(function(){return i[e]}))}(n);t["default"]=r.a},e397:function(e,t,a){"use strict";a.r(t);var i=a("0adb"),r=a("8cff");for(var n in r)"default"!==n&&function(e){a.d(t,e,(function(){return r[e]}))}(n);var c,o=a("f0c5"),s=Object(o["a"])(r["default"],i["b"],i["c"],!1,null,"32c65c91",null,!1,i["a"],c);t["default"]=s.exports},efad:function(e,t,a){"use strict";var i=a("4ea4");a("4160"),a("c975"),a("4d63"),a("ac1f"),a("25f0"),a("5319"),a("1276"),a("498a"),a("159b"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("96cf");var r=i(a("1da1")),n=i(a("5530")),c=a("2f62"),o=i(a("f977")),s=i(a("d3b3")),u={components:{"ups-products":o.default},data:function(){return{products:[],checkedLabels:[],page:1,bizCard:{},categories:[{label:"全部",checked:!0}]}},onReady:function(){wx.setNavigationBarTitle({title:"最新产品"})},onShow:function(){this.getList()},onPullDownRefresh:function(){this.page=1,this.getList(),uni.stopPullDownRefresh()},onReachBottom:function(){this.page++,this.getList()},computed:(0,n.default)({},(0,c.mapState)(["user","filePath"])),methods:(0,n.default)((0,n.default)({},(0,c.mapMutations)(["convertFilePath"])),{},{getList:function(){var e=this;return(0,r.default)(regeneratorRuntime.mark((function t(){var a,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=e,1==a.page&&(a.products=[]),i=null,t.next=5,s.default.callFunction({name:"web",data:{$url:"getOnSaleProductListByCardId",cardId:a.user.userInfo.bizCardId,checkedLabels:a.checkedLabels,page:a.page}});case 5:return i=t.sent,a.products=JSON.parse(i.result.data)||[],a.products.forEach((function(e){0==e.cover.indexOf("cloud")&&(a.convertFilePath(e.cover),e.cover=a.filePath)})),t.next=10,s.default.callFunction({name:"web",data:{$url:"getCardDetailById",id:a.user.userInfo.bizCardId}});case 10:i=t.sent,a.bizCard=JSON.parse(i.result.data)||{},0==a.checkedLabels.length&&a.doCategories();case 13:case"end":return t.stop()}}),t)})))()},doCategories:function(){var e=this;return(0,r.default)(regeneratorRuntime.mark((function t(){var a,i,r,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:a=e,i=a.bizCard.tags||{card:"",products:"",activity:"",trends:""},r=i.products||"",a.categories=[{label:"全部",checked:!0,manage:!1}],n="",r=r.replace(RegExp("，","g"),","),r.indexOf(",")>0&&r.split(",").forEach((function(e){e.trim().length>0&&n.indexOf(e)<0&&(n+=e,a.categories.push({label:e,checked:!1,manage:!1}))}));case 7:case"end":return t.stop()}}),t)})))()},chooseTag:function(e){var t=this;return(0,r.default)(regeneratorRuntime.mark((function a(){var i;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:i=t,i.checkedLabels=[],i.products=[],0==e?(i.checkedLabels=[],i.categories[0].checked=!0,i.page=1,i.getList(),i.categories.forEach((function(e){"全部"!=e.label&&(e.checked=!1)}))):(i.categories[e].checked=!i.categories[e].checked,i.categories.forEach((function(e){e.checked&&"全部"!=e.label&&i.checkedLabels.push(e.label)})),0==i.checkedLabels.length?(i.checkedLabels=[],i.categories[0].checked=!0,i.page=1,i.getList()):(i.categories[0].checked=!1,i.page=1,i.getList())),i.$forceUpdate();case 5:case"end":return a.stop()}}),a)})))()}})};t.default=u},f977:function(e,t,a){"use strict";a.r(t);var i=a("17cb"),r=a("e371");for(var n in r)"default"!==n&&function(e){a.d(t,e,(function(){return r[e]}))}(n);a("0e23");var c,o=a("f0c5"),s=Object(o["a"])(r["default"],i["b"],i["c"],!1,null,"31c7343f",null,!1,i["a"],c);t["default"]=s.exports}}]);