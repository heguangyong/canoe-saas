## 1、业务概述
[企业工具箱]:(http://cb.upservce.com/#/pagesCmn/product/ShareProductDetail?id=28ee4e3e60f429272b841a0a5a0c0fa6)
### 1.1、权限概述
*  名片分为个人名片（person）和公司名片（biz）；个人名片是通过绑定微信号来做直接关联的。公司名片不需要绑定手机微信。
*  所有功能均有权限约束，普通用户拥有bizCard权限，其他更高权限的功能点击时需要输入管理码才能进入操作。
*  管理码：此处避免权限长期有效，一旦修改管理码，所有拥有原管理码的用户需重新输入新管理码才能获得访问权限。
*  默认用户拥有bizCard权限，公司名片管理者拥有cardAdmin权限。系统管理员通过user表中补充设定role：systemAdmin。 
 ### 1.2、权限概述  
*  sys_user表是核心表  
*  包含userInfo：来自微信的认证授权、bizCardId（公司名片ID），cardId（用户名片ID）。    
 ### 1.3、业务概述 
*  个人名片可以配置管理的企业名片，配置完可在个人名片中链接显示企业名片的链接；同时个人名片下方的展厅会自动展示对应企业名片展厅内容。  

##  2、技术概述 
### 2.1、版本环境  
+  [HBX中uniapp项目 使用微信小程序云开发](https://ask.dcloud.net.cn/article/37914)  
+  [uniapp 微信小程序调用云函数步骤](https://blog.csdn.net/u010637394/article/details/108129398)  
+  [微信小程序云函数路由优化tcb-router](https://blog.csdn.net/hongxue8888/article/details/104599794/)
+  [小程序云数据库使用watch操作，不返回结果](https://blog.csdn.net/qq_23049111/article/details/109628203)
+  
### 2.2、vue.config.js（当前配置方式依赖旧版本）
*  第一次启动时把此文件改为vue.config.js.bak，正常启动后，再改回来  
*  新环境建议复制旧环境中node_modules依赖环境，直接更新新环境可能因为版本依赖升级导致无法正常启动（需从新配置vue.config.js）
*  
### 2.3 Idear打开项目看不到目录
*  关闭IDEA
*  删除项目文件夹下的.idea文件夹
*  重新用IDEA工具打开项目
*  
### 2.4 数据表新环境部署需要调整表的访问权限，客服对话需要放开权限才能正常获取聊天数据  

### 2.5 vendor.js 过大的处理方式
+  [HBuilderX创建的项目勾选运行-->运行到小程序模拟器-->运行时是否压缩代码](https://uniapp.dcloud.io/matter?id=vendorjs%e8%bf%87%e5%a4%a7%e7%9a%84%e5%a4%84%e7%90%86%e6%96%b9%e5%bc%8f)

### 2.6 跨端Web方案集成
*  [进入腾讯云开发控制台入口：小程序公众号登录](https://developers.weixin.qq.com/community/develop/worksheet/2333828466812780545/wx01f5262087609802)
*  [公众平台帐号授权](https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Ftcb)
*  [App.vue引入H5访问:配置云环境、申请移动安全来源、应用凭证](https://docs.cloudbase.net/api-reference/web/adapter.html)
*  [uniapp跨端实战utils/adapter.js](https://cloud.tencent.com/developer/article/1758581)
*  [cloudbase云函数集成](https://docs.cloudbase.net/api-reference/server/node-sdk/introduction.html)

### 2.7 云平台开放权限给第三方(忽略)
+  [在第三方云函数平台创建访问管理账号](https://cloud.tencent.com/document/product/598/13674)
+  [提供第三方访问的用户:SecretId/SecretKey](https://console.cloud.tencent.com/cam/user/create?systemType=SubAccount)
+  


### 2.7 定制第三方网站主页方案（含单点登录方案；跨域问题方案）
*  在目录thirdParty下新建第三方网站主页目录：例如 huaji；并建访问页面login.vue
*  通过cloudbase方式匿名登录，访问云函数（通过与小程序云平台共享方式打通）
*  跨域问题：在云函数中解析出重定向的页面，回传到调用的VUE页面，然后使用window.location.href打开。
```
res = await cloudbase.callFunction({
    name:'web',
    data:{
        $url:'huajiSsoUrl',
        readApiForm:readApiForm,
        createApiForm:createApiForm,
    }
});
console.log('ssoUrl',res.result.data);
window.location.href = res.result.data;
```


### 2.8 定制活动模版方案
1.  用小程序新建一个活动，上传活动基本信息
2.  在后台数据库中找到对应记录，根据活动页面需要的，补充缺失的数据信息
3.  参考pagesCms/activity/a001/活动模版复制新模版

### 2.9 公众号分享集成方案

*  [微信开放文档](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html)
*  引入jweixin-module模块用于提供分享公众号能力
*  生成access_token并缓存到小程序数据库中对应企业card中（云函数默认是动态IP，需要在对应云函数上配置为固定IP）
*  生产jsApi_ticket并缓存到小程序数据库中对应企业card中
*  令牌失效需要刷新后再访问（参考a001/index.vue）
```
//-------------------------
let reqUrl = "http://cb.upservce.com/#/pagesCmn/product/ShareProductDetail?id="+that.product._id;
//提供分享公众号能力
res = await cloudbase.callFunction({
	name:'web',
	data:{
		$url:'signWeixin',
		url:reqUrl,
		needRefreshSignature:false
	}
});
let signRet =  JSON.parse(res.result.data);
console.log('sign',res.result.data);
jweixin.config({
	debug: signRet.debug, // 调试，发布的时候改为false
	appId: signRet.appId,//'wxc42ba3b82548c8b6',
	nonceStr: signRet.nonceStr,
	timestamp: signRet.timestamp,
	signature: signRet.signature,
	jsApiList: signRet.jsApiList,//[ 'updateAppMessageShareData','updateTimelineShareData','onMenuShareAppMessage','onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone'],
});

jweixin.ready(() => {   //需在用户可能点击分享按钮前就先调用
	//旧：群分享
	jweixin.onMenuShareAppMessage({
		title: that.product.title, // 分享标题
		desc: that.product.detail.content, // 分享描述
		link: reqUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl:  that.product.cover, // 分享图标
		success: function () {
			// 设置成功
			console.log('success');
		}
	});
	//旧：分享朋友圈
	jweixin.onMenuShareTimeline({
		title: that.product.title, // 分享标题
		desc: that.product.detail.content, // 分享描述
		link: reqUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl:  that.product.cover, // 分享图标
		success: function () {
			// 设置成功
			console.log('success');
		}
	});
	//新接口
	jweixin.updateAppMessageShareData({
		title: that.product.title, // 分享标题
		desc: that.product.detail.content, // 分享描述
		link: reqUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		imgUrl:  that.product.cover, // 分享图标
		success: function () {
			// 设置成功
			console.log('success');
		}
	});
});

jweixin.error ((res)=>{
	console.log('jweixin.error',res);
	//刷新后再分享
	cloudbase.callFunction({
		name:'web',
		data:{
			$url:'signWeixin',
			url:reqUrl,
			needRefreshSignature:true
		}
	});
	setTimeout (() => {
		uni.showToast({
			icon:'none',
			title:'产品授权变更，需刷新后重新分享！'
		});
	} , 500 );
});
//-------------------------
```


### 2.10 物联网集成方案

* 参考孙西杰门禁二维码调用第三方API接口方案（具体可在gitlab中找创智良仓小程序的2021年历史版本）
* 参考华集集成第三方线上会议API（具体可参考thirdParty目录下代码）


### 3.1  新建一个接入端（对应企业名片）

* 登陆微信小程序，获取小程序页面小程序码，输入接入端url,剧烈：pagesSys/card/BizAboutExt?id=UPS_3D 
* 生成二维码图片上传至云平台文件服务器上企业接入端目录card:(cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/card/UPS_3D/qrcode.png)
* 导出sys_card表中模版数据，修改对应接入端NodeB的配置信息，并倒入到sys_card中，完成NodeB的初始化工作。
* 修改qrcode_info:{fileID:"cloud://...",page:"pagesSys/card/BizAboutExt?id=UPS_3D",tempFIleURL:"https://..."}}