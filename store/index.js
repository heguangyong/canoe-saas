import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state:{
	    version:'1.0.18',
        env: 'prod-9goq82ctb17bd75f',//云开发环境ID
		user:{},
		cache:{},
		openid:'',
        bizCard:{},//企业名片
        defaultBizCard:{
            _id:'SYS_DEFAULT_TEMPLATE_RECORD',
            name:'升阶助手',
            avatar:'cloud://prod-9goq82ctb17bd75f.7072-prod-9goq82ctb17bd75f-1306535128/resource/logo2.png',
            role:'normal'
        },
        //默认用户名片权限
        cardAccount:{
            account_key: "0000",
            api_map: {},
            h5_link: "/pagesSys/card/CardDetail",
            is_forbidden: false,
            is_show: true,
            name: "vipcard",
            need_role: "normal",
            password: "",
            remark: "",
            support_h5: true,
            title: "我的名片",
            url: "/pagesSys/card/CardDetail",
            user_name: "",
            view_count: 0
        },

        resourceRootName:'',//云存储文件根位置
        cloudRoot:'',//fileId位置
        httpRoot:'',//云存储文件根位置
        filePath:'',//fileId转换过来的https地址
        needAuthFlag:false//默认不需要授权
	},
	mutations:{
        //根据fileId转换https url路径
        convertFilePath(state,fileId){
            //云存储文件根位置
            if(state.resourceRootName.length==0){
                state.resourceRootName='7072-'+state.env+'-1306535128';
                state.cloudRoot='cloud://'+state.env+'.'+state.resourceRootName+'/';//fileId位置
                state.httpRoot='https://'+state.resourceRootName+'.tcb.qcloud.la/';//http访问文件根位置
            }
            state.filePath = state.httpRoot+fileId.split(state.resourceRootName)[1];
            console.log('convert url',state.filePath);
        },
        // 拦截微信授权
        needWxAuth(state,bizCard){
            let version = uni.getStorageSync("version");
            //必要时版本强制更新
            if(!version || version!=state.version){
                state.user = {};
                uni.removeStorageSync("user");
                uni.setStorageSync("version",state.version);
            }
            state.needAuthFlag = Object.keys(state.user).length===0;
            console.log('needAuthFlag',state.needAuthFlag);
            //已经有授权，判断用户是否需要更新sites权限集
            if(!state.needAuthFlag){
                // console.log('state.user _id',state.user._id);
                //=====初始化用户权限======
                //如果没传入参数
                if(!bizCard || !bizCard._id){
                    //如果用户有绑定企业名片
                    if(state.user.bizCardId){
                        state.defaultBizCard._id=state.user.bizCardId;
                        state.defaultBizCard.name=state.user.bizCardName;
                        state.defaultBizCard.avatar=state.user.bizCardAvatar;
                        state.defaultBizCard.role=state.user.role;
                    }
                    //如果没有绑定，设定默认
                    bizCard = state.defaultBizCard;
                }
                //如果传入了参数
                else{
                    bizCard.role='normal';
                }
                console.log('needWxAuth bizCard',bizCard);

                //判断用户是否需要更新sites权限集
                let findFlag = false;
                for(let i in state.user.userInfo.sites){
                    if(state.user.userInfo.sites[i].bizCardId==bizCard._id){
                        findFlag =true;
                        break;
                    }
                }
                //存在则返回
                if(findFlag){
                    return ;
                }

                //=====初始化用户权限======
                let site={
                    accounts:[],
                    role:bizCard.role,
                    bizCardId:bizCard._id,
                    bizCardName:bizCard.name,
                    bizCardAvatar:bizCard.avatar
                };

                if(!state.user.userInfo.accounts){
                    state.user.userInfo.accounts=[];
                }
                //当前环境如果不存在，初始化当前环境
                if(state.user.userInfo.accounts.length==0){
                    state.user.userInfo.accounts.push(state.cardAccount);
                    state.user.userInfo.bizCardId=bizCard._id;
                    state.user.userInfo.bizCardName=bizCard.name;
                    state.user.userInfo.bizCardAvatar=bizCard.avatar;
                    state.user.userInfo.role=bizCard.role;
                }
                //补充备用环境
                site.accounts.push(state.cardAccount);
                if(!state.user.userInfo.sites){
                    state.user.userInfo.sites =[];
                }
				if(bizCard._id){
					 state.user.userInfo.sites.push(site);
					 console.log('新增商务站点 needWxAuth',site,'bizCard',bizCard);
				}
                //没有找到需要补充
                uni.setStorageSync("user",state.user);
                uni.setStorageSync("openid",state.user._openid);
                //  #ifdef MP-WEIXIN
                wx.cloud.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:state.user._id,
                        userInfo:state.user.userInfo
                    }
                });
                //  #endif
                //  #ifdef H5
                cloudbase.callFunction({
                    name:'sys',
                    data:{
                        $url:'updateUserInfo',
                        id:state.user._id,
                        userInfo:state.user.userInfo
                    }
                });
                //  #endif
            }
        },

        //传入部分bizCard结构:{_id,name,avatar}
		wxAuth(state,bizCard){
            //如果没传入参数
            if(!bizCard){
                //如果用户有绑定企业名片
                if(state.user.bizCardId){
                    state.defaultBizCard._id=state.user.bizCardId;
                    state.defaultBizCard.name=state.user.bizCardName;
                    state.defaultBizCard.avatar=state.user.bizCardAvatar;
                    state.defaultBizCard.role=state.user.role;
                }
                bizCard = state.defaultBizCard;
            }
            //如果传入了参数
            else{
                bizCard.role='normal';
            }
            console.log('wxAuth bizCard',bizCard);
            //  #ifdef MP-WEIXIN
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    if(res.userInfo){
                        state.user.userInfo = res.userInfo;
                        state.user.userInfo.role = 'normal';//默认角色：允许访问企业名片开放资源
                        console.log('userInfo',state.user.userInfo);
                        wx.cloud.callFunction({
                            name:'sys',
                            data:{
                                $url:'registerUser',//如果有就返回，如果没有就新建
                                userInfo:state.user.userInfo
                            },
                            success:resRegister=>{
                                console.log('sys.registerUser',resRegister.result);
                                if(resRegister.result.code==0){
                                    state.user = resRegister.result.data||{};
                                    uni.setStorageSync("user",state.user);
                                    uni.setStorageSync("openid",state.user._openid);

                                    //判断用户是否需要更新sites权限集
                                    let findFlag = false;
                                    for(let i in state.user.userInfo.sites){
                                        if(state.user.userInfo.sites[i].bizCardId==bizCard._id){
                                            findFlag =true;
                                            break;
                                        }
                                    }
                                    //不存在，新建用户名片
                                    if(!findFlag){
                                        //=====初始化用户权限======
                                        let site={
                                            accounts:[],
                                            role:bizCard.role,
                                            bizCardId:bizCard._id,
                                            bizCardName:bizCard.name,
                                            bizCardAvatar:bizCard.avatar
                                        };

                                        //当前环境如果不存在，初始化当前环境
                                        if(!state.user.userInfo.accounts){
                                            state.user.userInfo.accounts=[];
                                        }
                                        if(state.user.userInfo.accounts.length==0){
                                            state.user.userInfo.accounts.push(state.cardAccount);
                                            state.user.userInfo.bizCardId=bizCard._id;
                                            state.user.userInfo.bizCardName=bizCard.name;
                                            state.user.userInfo.bizCardAvatar=bizCard.avatar;
                                            state.user.userInfo.role=bizCard.role;
                                        }
                                        //补充备用环境
                                        site.accounts.push(state.cardAccount);
                                        if(!state.user.userInfo.sites){
                                            state.user.userInfo.sites=[];
                                        }
                                        state.user.userInfo.sites.push(site);

                                        uni.setStorageSync("user",state.user);
                                        uni.setStorageSync("openid",state.user._openid);
                                    }

                                    wx.cloud.callFunction({
                                        name:'sys',
                                        data:{
                                            $url:'updateUserInfo',
                                            id:state.user._id,
                                            userInfo:state.user.userInfo
                                        }
                                    }).then(userInfoRes =>{
                                        console.log('统一更新用户信息 updateUserInfo res',userInfoRes);
                                        //查找个人名片
                                        wx.cloud.callFunction({
                                            name:'sys',
                                            data:{
                                                $url:'getCardDetailByUserId',
                                                userId:state.user._id||'0',
                                            }
                                        }).then(res => {
                                            console.log('寻找用户名片',res.result.data);
                                            //找不到
                                            if(!res.result.data){
                                                //找不到,新建名片
                                                wx.cloud.callFunction({
                                                    name:'sys',
                                                    data:{
                                                        $url:'addCard',
                                                        user:state.user,
                                                    }
                                                }).then(res =>{
                                                    console.log('不存在用户名片时 create My card',res);
                                                    // 补充cardId到user.userInfo中
                                                    state.user.userInfo.cardId=res.result._id;
                                                    // 更新缓存
                                                    uni.setStorageSync("user",state.user);
                                                    // 更新数据库
                                                    wx.cloud.callFunction({
                                                        name:'sys',
                                                        data:{
                                                            $url:'genPersonCardQrcode',
                                                            id:state.user._id,
                                                            cardId:state.user.userInfo.cardId,
                                                            userInfo:state.user.userInfo,
                                                            page:'pagesSys/card/ShareCardDetail',
                                                            width:430,
                                                        }
                                                    }).then(res =>{
                                                        console.log('生成名片码 genCardQrcode',res.result.data);
                                                        wx.cloud.callFunction({
                                                            name:'sys',
                                                            data:{
                                                                $url:'initCardHolder',
                                                                card_id:state.user.userInfo.cardId,
                                                                holder_name:state.user.userInfo.nickName,
                                                                user_id:state.user._id
                                                            }
                                                        }).then(res =>{
                                                            console.log('初始化名片收藏夹 initCardHolder success _id:',res.result._id);
                                                            state.needAuthFlag = false;
                                                        });
                                                    })
                                                })
                                            }else{
                                                state.needAuthFlag = false;
                                            }
                                        })
                                    });
                                }
                            },
                            fail:err=>{
                                console.log('失败'+err)
                            }
                        })
                    }else{
                        uni.showToast({
                            icon:'none',
                            title:'授权失败,请重新授权!'
                        })
                    }
                }
            })
            //  #endif
		},

        updateUserAuth(state,authCard){
            let isFind = false;

            for(let i in state.user.userInfo.sites){
                if(authCard._id == state.user.userInfo.sites[i].bizCardId){
                    state.user.userInfo.bizCardId = state.user.userInfo.sites[i].bizCardId;
                    state.user.userInfo.bizCardName = state.user.userInfo.sites[i].bizCardName;
                    state.user.userInfo.bizCardAvatar = state.user.userInfo.sites[i].bizCardAvatar;
                    state.user.userInfo.role = state.user.userInfo.sites[i].role;
                    //相应权限也需要切换
                    state.user.userInfo.accounts = state.user.userInfo.sites[i].accounts;
                    isFind = true;
                    console.log('切换 updateUserAuth',authCard.name,authCard._id);
                    break;
                }
            }
            if(!isFind & authCard._id){
                state.user.userInfo.bizCardId = authCard._id;
                state.user.userInfo.bizCardName = authCard.name;
                state.user.userInfo.bizCardAvatar = authCard.avatar;
                state.user.userInfo.role = 'normal';
                //补充默认权限
                state.user.userInfo.accounts.push(state.cardAccount);
                //加入个人访问过站点备忘清单
                let newSite = {
                    bizCardId : state.user.userInfo.bizCardId,
                    bizCardName : state.user.userInfo.bizCardName,
                    bizCardAvatar : state.user.userInfo.bizCardAvatar,
                    role : state.user.userInfo.role,
                    accounts : state.user.userInfo.accounts
                };
                state.user.userInfo.sites.push(newSite);
                console.log('新增商务站点 updateUserAuth',authCard.name,authCard._id);
            }

            uni.setStorageSync("user",state.user);
            wx.cloud.callFunction({
                name:'sys',
                data:{
                    $url:'updateUserInfo',
                    id:state.user._id,
                    userInfo:state.user.userInfo
                }
            });
        },

		logIn(state,user){
			state.user = user || {};
			state.openid = user._openid||'';
			uni.setStorageSync("user",user);
			uni.setStorageSync("openid",user._openid)
		},
		updateUser(state,user){
			state.user = user || {};
			uni.setStorageSync("user",user);
		},
		logOut(state){
			state.user = {};
			uni.removeStorageSync("user");
		},
		isLogin(state){
			let openid=uni.getStorageSync("openid")||'';
			if(openid){
				let user = uni.getStorageSync("user");
				if(user){
					state.user = user;
				}
			}else{
				uni.removeStorageSync("user");
			}
		},
		setCache(state,cValue){
			state.cache= {...state.cache,...cValue};
		}
	}
});

export default store