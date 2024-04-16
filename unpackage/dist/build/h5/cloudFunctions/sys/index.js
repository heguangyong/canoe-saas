const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');
cloud.init({
                env:"prod-9goq82ctb17bd75f",
                traceUser:true
            });

const randomStr = require('randomstring');
const pinyin = require('chinese-to-pinyin');

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
const pageSize = 10;
const qrcodeNameLen = 9;

//【--------------定义数据库表--------------】
const dbSysUser = db.collection('sys_user');
const dbSysCard = db.collection('sys_card');
const dbSysCardHolder = db.collection('sys_card_holder');
const dbSysChatRoom = db.collection('sys_chat_room');
const dbSysChatMsg = db.collection('sys_chat_msg');



//【--------------云函数入口--------------】
exports.main = async (event, context) => {
    const app = new tcbRouter({ event });
  
    //【--------------列表--------------】

    //检索名片列表
    app.router('searchCardList', async (ctx) => {
		 ctx.body = { router:'searchCardList',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbSysCard.where(
            _.and([{
                search_str:db.RegExp({
                    regexp:'.*'+ event.search_str +'.*',
                    options:'i',
                })
            },
                {
                    priority:_.gte(0)
                }])
        )
            .skip(skipNum)
            .limit(pageSize)
            .orderBy('group_index','asc')
            .orderBy('priority', 'desc')
            .get();
        ctx.body.data = res;
    });

    //基于角色的检索名片列表
    app.router('searchRoleBasedCardList', async (ctx) => {
		ctx.body = { router:'searchRoleBasedCardList',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let list = [];
        if(event.role.indexOf('normal')>=0){
            let managed_list =[];
            if(event.managed_card.length>0){
                event.managed_card.forEach(each=>{
                    managed_list.push(each.card_id);
                })
            }
            list = await dbSysCard.where(
                _.and([
                    {
                        search_str:db.RegExp({
                            regexp:'.*'+ event.search_str +'.*',
                            options:'i',
                        })
                    },
                    {
                        card_type:'biz'
                    },
                    {
                        _id:_.in(managed_list)
                    },
                    {
                        priority:_.gte(0)
                    }
                ])
            )
                .skip(skipNum)
                .limit(pageSize)
                .orderBy('group_index','asc')
                .orderBy('priority', 'desc')
                .get();
        }

        ctx.body.data = list;
    });

    //检索个人名片列表
    app.router('searchPersonCardList', async (ctx) => {
        ctx.body = { router:'searchPersonCardList',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbSysCard.where(
            _.and([
                {
                    search_str:db.RegExp({
                        regexp:'.*'+ event.search_str +'.*',
                        options:'i',
                    })
                },
                {
                    card_type:'person'
                },
                {
                    priority:_.gte(0)
                }
            ])
        )
            .skip(skipNum)
            .limit(pageSize)
            .orderBy('group_index','asc')
            .orderBy('priority', 'desc')
            .get();

        ctx.body.data = res.data ||[]
    });

    //检索企业名片列表
    app.router('searchBizCardList', async (ctx) => {
		ctx.body = { router:'searchBizCardList',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbSysCard.where(
            _.and([
                {
                    search_str:db.RegExp({
                        regexp:'.*'+ event.search_str +'.*',
                        options:'i',
                    })
                },
                {
                    card_type:'biz'
                },
                {
                    priority:_.gte(0)
                }
            ])
        )
            .skip(skipNum)
            .limit(pageSize)
            .orderBy('group_index','asc')
            .orderBy('priority', 'desc')
            .get();

        ctx.body.data = res.data
    });

    //查询聊天室
    app.router('getChatRoom', async (ctx) => {
        ctx.body = { router:'getChatRoom',event,code: 0, message: 'success' };
        let res = await dbSysChatRoom.where(
                            _.or([
                                {
                                    source_id: event.sourceId,
                                    target_id: event.targetId
                                },
                                {
                                    source_id: event.targetId,
                                    target_id: event.sourceId
                                },
                            ])
                        )
                        .get();
        if(!res.data[0]){
            ctx.body.code=-1;
        }
        ctx.body.data = res.data[0]||{}
    });

    //获取历史聊天信息列表
    app.router('getChatMsgList', async (ctx) => {
		ctx.body = { router:'getChatMsgList',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        
        let list = [];
        let res = await dbSysChatMsg.where({ room_id: event.id }).skip(skipNum)
            .limit(pageSize)
            .orderBy('create_at', 'desc')
            .get();
        if(res.data.length>0){
            list = res.data;
        }else{
            ctx.body = { code: -1, message: '没有历史记录了' }
        }
        ctx.body.data = list
    });

    //【--------------详情--------------】
    app.router('getUserDetail', async (ctx) => {
        ctx.body = { router:'getUserDetail',event,code: 0, message: 'success' };
        let res = await dbSysUser.doc(event.id).get();
        ctx.body.data = res.data
    });

    app.router('getCardDetailById', async (ctx) => {
        ctx.body = { router:'getCardDetailById',event,code: 0, message: 'success' };
		let res = await dbSysCard.doc(event.id).get();
		ctx.body.data = res.data;
    });

    app.router('getCardDetailByUserId', async (ctx) => {
        ctx.body = { router:'getCardDetailByUserId',event,code: 0, message: 'success' };
        let res = await dbSysCard.where({
            user_id: event.userId
        }).get();
		ctx.body.data=res.data[0];
    });

    app.router('getCardDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getCardDetailByQrcode',code: 1, message: 'success' };
        let res = await dbSysCard.where({
            qrcode: event.qrcode
        }).get();
        ctx.body.data= res.data[0];
    });

    //根据名片ID获取名片收藏夹
    app.router('getCardHolderByCardId', async (ctx) => {
        ctx.body = { router:'getCardHolderByCardId',event,code: 0, message: 'success' };
        let holders = await dbSysCardHolder.where(
            {
                "card_id": event.cardId
            }
        ).get();
        if(holders.data.length>0){
            ctx.body.data = holders.data[0]
        }
    });

    //根据UserId获取名片收藏夹
    app.router('getCardHolderByUserId', async (ctx) => {
        ctx.body = { router:'getCardHolderByUserId',event,code: 0, message: 'success' };
        let holders = await dbSysCardHolder.where(
            {
                "user_id": event.userId
            }
        ).get();
        if(holders.data.length>0){
            ctx.body.data = holders.data[0]
        }
    });
	
	// 历史聊天信息
	app.router('getChatMsgHistoryList', async (ctx) => {
		ctx.body = { router:'getChatMsgHistoryList',event,code: 0, message: 'success' };
		let skipNum = 0;
		if (event.page > 1) {
		skipNum = (event.page - 1) * pageSize;
		}
		ctx.body = { code: 0, message: 'success' };
		let list = [];
		let res = await dbSysChatMsg.where({ room_id: event.id }).skip(skipNum)
					.limit(pageSize).orderBy('create_at', 'desc').get();
		if(res.data.length>0){
		  list = res.data;
		}else{
		  ctx.body.code=-1;
		  ctx.body.message='没有历史记录了' 
		}
		ctx.body.data = list
	});

    //根据传入chatIdList 检索聊天室列表
    app.router('getChatRoomList', async (ctx) => {
        ctx.body = { router:'getChatRoomList',event,code: 0, message: 'success' };
        let res = await dbSysChatRoom.where(_.or([
                {source_id:_.in(event.chatIdList)},
                {target_id:_.in(event.chatIdList)}
            ])
        ).get();
        ctx.body.data = res.data||[];
    });

	app.router('getPhone', async (ctx) => {
		ctx.body = { router:'getPhone',event,code: 0, message: 'success' };
		console.log('event.cloudId',event.cloudId);
		const res = await cloud.getOpenData({
		  list: [event.cloudId], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		ctx.body.data= res.list[0].data
	  });
	  
    //【--------------新增--------------】

    //微信注册
    app.router('registerUser', async (ctx) => {
		ctx.body = { router:'registerUser',event,code: 0, message: 'success' };
		let wxContext = cloud.getWXContext();
		let openId = wxContext.OPENID;
        let userInfo = event.userInfo||{};
        let res = await dbSysUser.where({
           _openid: openId
        }).get();
        let user = res.data[0]||{};
		console.log('user',user);
        if (user._id) {
            ctx.body.data = user;
        } else {
			user._openid = openId;
            user.userInfo = userInfo;
            user.creat_at = Date.now();
            let res = await dbSysUser.add({ data: user });
            user._id = res._id;
        }
        ctx.body.data=user;
    });

    //新增个人名片
    app.router('addCard', async (ctx) => {
		let wxContext = cloud.getWXContext();
		let openId = wxContext.OPENID;
        ctx.body = { router:'addCard',event,code: 0, message: 'success' };
        console.log('addCard',event);

        //收藏者对象
        let card ={};
		card._openid = openId;
		card.create_at=new Date();
        let user =event.user;
        card.user_id = user._id||'0';
        card.name = user.userInfo.nickName || '';
        card.avatar = user.userInfo.avatarUrl;
        card.corp_address = {address:'',latitude:0,longitude:0};
        card.card_type='person';//个人名片
        card.auth_code = randomStr.generate({ length: 4, charset: 'numeric' });//跨端访问授权码，与手机号配合使用
		
        console.log('card',card);
        //构建姓名索引
        let search_str = card.name;
        let search_str_part1 = pinyin(card.name,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        let groupIndex = search_str.substr(0,1).toUpperCase();//必须中文或字母开头

        console.log('card _id',card._id,'分组字母',groupIndex,'search_data',search_str);
        card.priority = 0;
        card.search_str = search_str;
        card.group_index = groupIndex;

        let res = await dbSysCard.add({
            data:card,
        });
        console.log('create card success',res);

        ctx.body._id = res._id
    });

    app.router('initCardHolder', async (ctx) => {
        ctx.body = { router:'initCardHolder',event,code: 0, message: 'success' };
        console.log('initCardHolder',event);
        //同步初始化个人名片收藏夹
        //读取系统给定默认记录来创建新的收藏夹记录 userId= 'SYS_DEFAULT_TEMPLATE_RECORD'
        let holders = await dbSysCardHolder.where({
            _id: 'SYS_DEFAULT_TEMPLATE_RECORD',
        }).get();
        let myHolder = holders.data[0];
        delete myHolder._id;
        myHolder.card_id=event.card_id;
        myHolder.user_id=event.user_id;
        myHolder.holder_name=event.holder_name;
        let res = await dbSysCardHolder.add({
            data: myHolder
        });
        console.log('init myHolder success',res);
        ctx.body._id = res._id
    });

    //新增企业名片
    app.router('addBizCard', async (ctx) => {
        let wxContext = cloud.getWXContext();
        let openId = wxContext.OPENID;
        ctx.body = { router:'addBizCard',event,code: 0, message: 'success' };
        console.log('addBizCard',event);

        //收藏者对象
        let card ={};
        card._openid = openId;
        card.create_at=new Date();
        let bizCard =event.card;
        card.user_id = '0';
        card.name = bizCard.name || '';
        card.avatar = bizCard.avatar;
        card.corp_address = {address:'',latitude:0,longitude:0};
        card.card_type='biz';//企业名片
        card.accounts = bizCard.accounts;
        card.auth_code = randomStr.generate({ length: 4, charset: 'numeric' });//跨端访问授权码，与手机号配合使用

        console.log('card',card);
        //构建姓名索引
        let search_str = card.name;
        let search_str_part1 = pinyin(card.name,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        let groupIndex = search_str.substr(0,1).toUpperCase();//必须中文或字母开头

        console.log('card _id',card._id,'分组字母',groupIndex,'search_data',search_str);
        card.priority = 0;
        card.search_str = search_str;
        card.group_index = groupIndex;

        let res = await dbSysCard.add({
            data:card,
        });
        console.log('create card success',res);
        ctx.body._id = res._id
    });


    // 生成个人名片二维码
	app.router('genPersonCardQrcode', async (ctx) => {
		ctx.body = { router:'genCardQrcode',event,code: 0, message: 'success' };

        //更新用户信息
        await dbSysUser.doc(event.id).update({
            data:{
                userInfo:event.userInfo,//默认企业名片
            }
        });

        let scene = 'qrcode='+event.cardId.substr(0,23);
		let page = event.page;
		let width = event.width || 430;
		let qrcodeInfo={};
		try {
		  // 1、通过云调用生成二维码
		  const result = await cloud.openapi.wxacode.getUnlimited({
			scene: scene,
			page: page,
			width: width
		  });
		  // 2、上传图片到云存储
		  let imgName=randomStr.generate({ length: qrcodeNameLen, charset: 'numeric' })+'_qrcode.jpg';
		  const upload = await cloud.uploadFile({
			cloudPath: 'qrcode/'+imgName,
			fileContent: result.buffer,
		  });
		  // 3、返回图片地址
		  let fileID = upload.fileID;
		  const fileList = [fileID];
		  console.log(fileList);
		  const tempRes = await cloud.getTempFileURL({
			fileList: fileList,
		  });
		  let resFile = tempRes.fileList[0];
		  qrcodeInfo.fileID = resFile.fileID; 
		  qrcodeInfo.tempFileURL = resFile.tempFileURL;
		  qrcodeInfo.scene = scene;
		  qrcodeInfo.page = page;
		  qrcodeInfo.width = width;
		  // 更新名片二维码
		  await dbSysCard.doc(event.cardId).update({
		  	data:{
		  		qrcode_info:qrcodeInfo,
                qrcode:event.cardId.substr(0,23),
		  	}
		  })
		} catch (err) {
		  console.log(err)
		}
		ctx.body.data= qrcodeInfo;
	  });


    // 生成企业名片二维码
    app.router('genBizCardQrcode', async (ctx) => {
        ctx.body = { router:'genBizCardQrcode',event,code: 0, message: 'success' };

        let scene = 'qrcode='+event.cardId.substr(0,23);
        let page = event.page;
        let width = event.width || 430;
        let qrcodeInfo={};
        try {
            // 1、通过云调用生成二维码
            const result = await cloud.openapi.wxacode.getUnlimited({
                scene: scene,
                page: page,
                width: width
            });
            // 2、上传图片到云存储
            let imgName=randomStr.generate({ length: qrcodeNameLen, charset: 'numeric' })+'_qrcode.jpg';
            const upload = await cloud.uploadFile({
                cloudPath: 'qrcode/'+imgName,
                fileContent: result.buffer,
            });
            // 3、返回图片地址
            let fileID = upload.fileID;
            const fileList = [fileID];
            console.log(fileList);
            const tempRes = await cloud.getTempFileURL({
                fileList: fileList,
            });
            let resFile = tempRes.fileList[0];
            qrcodeInfo.fileID = resFile.fileID;
            qrcodeInfo.tempFileURL = resFile.tempFileURL;
            qrcodeInfo.scene = scene;
            qrcodeInfo.page = page;
            qrcodeInfo.width = width;
            // 更新名片二维码
            await dbSysCard.doc(event.cardId).update({
                data:{
                    qrcode_info:qrcodeInfo,
                    qrcode:event.cardId.substr(0,23),
                }
            })
        } catch (err) {
            console.log(err)
        }
        ctx.body.data= qrcodeInfo;
    });

	  //创建聊天室
	  app.router('addChatRoom', async (ctx) => {
	    ctx.body = {router:'addChatRoom',event,code: 0,message: 'success'};
	    let chatRoom =event.chatRoom || {};
	    chatRoom.create_at = new Date();
	    let result = await dbSysChatRoom.add({
	      data:chatRoom
	    });
	    ctx.body.data = result._id;
	  });
	  
	//发送消息
	app.router('addTalk', async (ctx) => {
		ctx.body = {code: 0,message: 'success'};
		let talk = {};
		talk = event.talk;
		talk.create_at = Date.parse(new Date());
		//报名时间，签到时间处理
		let date = new Date(new Date().getTime()+28800000);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		let hours = date.getHours();
		let minutes = date.getMinutes();
		if (hours >= 0 && hours <= 9) {
			hours = "0" + hours;
		}
		if (minutes >= 0 && minutes <= 9) {
			minutes = "0" + minutes;
		}
		talk.send_time = year+"年"+month+"月"+strDate+"日 "+hours+":"+minutes;
		let result = await dbSysChatMsg.add({
		  data:talk,
		});
		ctx.body.data = result._id;
	});

    //个人收藏名片（依据一个用户对应一个收藏夹记录）
    app.router('addHolder', async (ctx) => {
        ctx.body = { router:'addHolder',event,code: 0, message: 'success' };
        console.log('addHolder',event);

        //---用于关键字检索---
        //被收藏姓名、职位、公司
        let name = event.name||'';
        let phone = event.phone||'';
        let position = event.position||'';
        let corp = event.corp||'';
        //---拼接关键字---
        let search_str = name+','+phone+','+position+','+corp;
        let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        let groupIndex = search_str.trim().substr(0,1).toUpperCase();//必须中文或字母开头
        console.log('分组字母',groupIndex);
        //---用于关键字检索---

        let userId = event.userId;
        let holderName = event.holderName;
        let cardId = event.id;
        //收藏者对象
        let myHolder = {};
        let card ={};
        card.id=cardId;
        card.name=name;
        card.phone=phone;
        let avatar = event.avatar||'';
        card.avatar= avatar;
        card.position=position;
        card.corp=corp;
        card.subject=event.subject;
        card.user_id=event.user_id;
        card.has_holder =true;
        card.in_exchange =false;
        card.card_type= event.cardType||'person';
        card.search_str= search_str;
        console.log('card',card);
        let holders = await dbSysCardHolder.where(
            {
                user_id: userId
            }
        ).get();
        console.log('holders',holders.data);

        //更新(找到名片夹)
        if(holders.data.length>0){
            //查找是否已收藏名片
            console.log('holders',holders,holders.data[0].search_data);
            myHolder = holders.data[0];
            //查找是否存在
            let existIndex = -1;
            for(let index in myHolder.search_data){
                if(myHolder.search_data[index].id==cardId){
                    existIndex =index;
                    break;
                }
            }

            //名片夹更新
            if(existIndex>-1){
                console.log('更新名片');
                card.update_at=new Date();
                for(let index in myHolder.cards[groupIndex]){
                    if(myHolder.cards[groupIndex][index].id == cardId){
                        //更新名片
                        myHolder.cards[groupIndex][index] = card;
                    }
                }
            }
            //新增
            else{
                console.log('新增名片');
                card.creat_at=new Date();
                //新增名片
                myHolder.cards[groupIndex].push(card);
            }
            //检索信息
            if(existIndex>-1){
                myHolder.search_data[existIndex].search_str = search_str;
                myHolder.search_data[existIndex].has_holder = true;
                myHolder.search_data[existIndex].in_exchange = false;
            }else{
                myHolder.search_data.push({'id':cardId,'search_str':search_str,'has_holder':true,'in_exchange':false})
            }

            let currentId = myHolder._id;
            delete myHolder._id;
            //更新名片夹
            await dbSysCardHolder.doc(currentId).set({
                data: myHolder,
            }).then((res)=>{
                console.log('update success',res)
            })
        }
        //新增（首次收藏时创建整个收藏夹记录）
        else{
            console.log('初始化名片夹');
            //读取系统给定默认记录来创建新的收藏夹记录 userId= 'SYS_DEFAULT_TEMPLATE_RECORD'
            holders = await dbSysCardHolder.where({
                _id: 'SYS_DEFAULT_TEMPLATE_RECORD',
            }).get();
            myHolder = holders.data[0];
            delete myHolder._id;
            myHolder.user_id=userId;
            myHolder.holder_name=holderName;
            card.creat_at=new Date();
            myHolder.cards[groupIndex].push(card);
            myHolder.search_data.push({'id':cardId,'search_str':search_str,'has_holder':true,'in_exchange':false});
            console.log('init myHolder',myHolder);
            await dbSysCardHolder.add({
                data: myHolder
            }).then((res)=>{
                console.log('init holder success',res);
            })
        }
    });

    //企业收藏名片（依据一个企业名片对应一个收藏夹记录）
    app.router('addBizHolder', async (ctx) => {
        ctx.body = { router:'addBizHolder',event,code: 0, message: 'success' };
        console.log('addBizHolder',event);

        //---用于关键字检索---
        //被收藏姓名、职位、公司
        let name = event.name||'';
        let phone = event.phone||'';
        let position = event.position||'';
        let corp = event.corp||'';
        //---拼接关键字---
        let search_str = name+','+phone+','+position+','+corp;
        let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        let groupIndex = search_str.trim().substr(0,1).toUpperCase();//必须中文或字母开头
        console.log('分组字母',groupIndex);
        //---用于关键字检索---

        let bizCardId = event.bizCardId;
        let holderName = event.holderName;
        let cardId = event.id;
        //收藏者对象
        let myHolder = {};
        let card ={};
        card.id=cardId;
        card.name=name;
        card.phone=phone;
        let avatar = event.avatar||'';
        card.avatar= avatar;
        card.position=position;
        card.corp=corp;
        card.subject=event.subject;
        card.user_id=event.user_id;
        card.has_holder =true;
        card.in_exchange =false;
        card.card_type= event.cardType||'person';
        card.search_str= search_str;
        console.log('card',card);
        let holders = await dbSysCardHolder.where(
            {
                card_id: bizCardId
            }
        ).get();
        console.log('holders',holders.data);

        //更新(找到名片夹)
        if(holders.data.length>0){
            //查找是否已收藏名片
            console.log('holders',holders,holders.data[0].search_data);
            myHolder = holders.data[0];
            //查找是否存在
            let existIndex = -1;
            for(let index in myHolder.search_data){
                if(myHolder.search_data[index].id==cardId){
                    existIndex =index;
                    break;
                }
            }

            //名片夹更新
            if(existIndex>-1){
                console.log('更新名片');
                card.update_at=new Date();
                for(let index in myHolder.cards[groupIndex]){
                    if(myHolder.cards[groupIndex][index].id == cardId){
                        //更新名片
                        myHolder.cards[groupIndex][index] = card;
                    }
                }
            }
            //新增
            else{
                console.log('新增名片');
                card.creat_at=new Date();
                //新增名片
                myHolder.cards[groupIndex].push(card);
            }
            //检索信息
            if(existIndex>-1){
                myHolder.search_data[existIndex].search_str = search_str;
                myHolder.search_data[existIndex].has_holder = true;
                myHolder.search_data[existIndex].in_exchange = false;
            }else{
                myHolder.search_data.push({'id':cardId,'search_str':search_str,'has_holder':true,'in_exchange':false})
            }

            let currentId = myHolder._id;
            delete myHolder._id;
            //更新名片夹
            dbSysCardHolder.doc(currentId).set({
                data: myHolder,
            }).then((res)=>{
                console.log('update success',res)
            })
        }
        //新增（首次收藏时创建整个收藏夹记录）
        else{
            console.log('初始化名片夹');
            //读取系统给定默认记录来创建新的收藏夹记录 userId= 'SYS_DEFAULT_TEMPLATE_RECORD'
            holders = await dbSysCardHolder.where({
                _id: 'SYS_DEFAULT_TEMPLATE_RECORD',
            }).get();
            myHolder = holders.data[0];
            delete myHolder._id;
            myHolder.user_id='';
            myHolder.holder_name=holderName;
            card.creat_at=new Date();
            myHolder.cards[groupIndex].push(card);
            myHolder.search_data.push({'id':cardId,'search_str':search_str,'has_holder':true,'in_exchange':false});
            console.log('init myHolder',myHolder);
            dbSysCardHolder.add({
                data: myHolder
            }).then((res)=>{
                console.log('init holder success',res);
            })
        }
    });

    //新增聊天室
    app.router('createChatRoom', async (ctx) => {
        ctx.body = {code: 0,message: 'success'};
        let chat = event.chat || {};
        chat.create_at = new Date();
        let res = await dbSysChatRoom.add({
            data:chat,
        });
        ctx.body.data = res._id;
    });

    //发送消息
    app.router('sendChatMsg', async (ctx) => {
        ctx.body = {code: 0,message: 'success'};
        let talk = event.talk || {};
        talk.create_at = Date.parse(new Date());
        //报名时间，签到时间处理
        let date = new Date(new Date().getTime()+28800000);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        talk.send_time = year+"年"+month+"月"+strDate+"日 "+hours+":"+minutes;
        let res = await dbSysChatMsg.add({
            data:talk,
        });
        ctx.body.data = res._id;
    });

    //【--------------修改--------------】

    //合入用户管理模块密码
    app.router('updateUserInfo', async (ctx) => {
        ctx.body = { router:'updateUserInfo',event,code: 0, message: 'success' };
        await dbSysUser.doc(event.id).update({
            data:{
                userInfo:event.userInfo
            }
        })
    });



    //更新名片
    app.router('updateCard', async (ctx) => {
        ctx.body = { router:'updateCard',event,code: 0, message: 'success' };
        console.log('updateCard',event);

        //收藏者对象
        let card =event.card;
        //被收藏姓名、职位、公司
        let name = card.name||'';
        let phone = card.phone||'';
        let position = card.corp_position||'';
        let corp = card.corp_name||'';
        let tags = card.tags||{card:'',products:'',activity:'',trends:''};
        let tags_str = tags.card+','+tags.products+','+tags.activity+','+tags.trends;
        let search_str = name+','+phone+','+position+','+corp+','+tags_str;
        let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        let groupIndex = search_str.substr(0,1).toUpperCase();//必须中文或字母开头

        dbSysCard.doc(card._id).update({
            data:{
                name:card.name,
                avatar:card.avatar,
                cover:card.cover,
                phone:card.phone,
                email:card.email,
                wx_number:card.wx_number,
                corp_name:card.corp_name,
                corp_position:card.corp_position,
                corp_address:card.corp_address,
                mailing_address:card.mailing_address,
                introduce:card.introduce,
                carousels:card.carousels,
                videos:card.videos,
                subject:card.subject,
                group_index:groupIndex,
                priority:0,
                search_str:search_str,
                tags:card.tags,
                card_level:card.card_level||'',
                accounts:card.accounts||[],
                auth_code:card.auth_code||'',
                recipients:card.recipients
            }
        })
    });

    //更新收藏的名片（依据一个用户对应一个收藏夹记录，更新当前记录中cards中对应card）
    app.router('updateCardFromHolder', async (ctx) => {
        ctx.body = { router:'updateCardFromHolder',event,code: 0, message: 'success' };
        console.log('updateCardFromHolder',event);

        let userId = event.userId;
        let groupKey = event.groupKey;
        let subIndex = event.subIndex;
        let card ={};
        card.id=event.card._id;
        card.name=event.card.name;
        card.avatar= event.card.avatar||'';
        card.position=event.card.corp_position||'';
        card.corp=event.card.corp_name||'';
        card.user_id=event.card.user_id||'';
        card.has_holder =true;
        card.in_exchange =false;
        card.card_type=event.card.card_type||'person';
        card.phone=event.card.phone||'';
        card.role=event.card.role||'';//被收藏的名片的角色；客户，party：会员，核销员

        //---拼接关键字---
        let search_str = card.name+','+card.phone+','+card.position+','+card.corp;
        let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        //---用于关键字检索---
        card.search_str= search_str;
        console.log('card',card);
        //收藏者对象
        let myHolder = {};
        let holders = await dbSysCardHolder.where(
            {
                user_id: userId
            }
        ).get();
        console.log('holders',holders.data);

        //更新(找到名片夹)
        if(holders.data.length>0){
            //查找是否已收藏名片
            console.log('holders',holders,holders.data[0].search_data);
            myHolder = holders.data[0];
            //查找是否存在
            let existIndex = -1;
            for(let index in myHolder.search_data){
                if(myHolder.search_data[index].id==card.id){
                    existIndex =index;
                    break;
                }
            }

            //名片夹更新
            if(existIndex>-1){
                console.log('更新名片',myHolder.cards[groupKey],subIndex);
                //替换名片
                myHolder.cards[groupKey].splice(subIndex,1,card);
            }

            let currentId = myHolder._id;
            delete myHolder._id;
            //更新名片夹
            dbSysCardHolder.doc(currentId).set({
                data: myHolder,
            }).then((res)=>{
                console.log('update success',res)
            })
        }
    });

    //更新收藏的名片（依据一个企业对应一个收藏夹记录，更新当前记录中cards中对应card）
    app.router('updateCardFromBizHolder', async (ctx) => {
        ctx.body = { router:'updateCardFromBizHolder',event,code: 0, message: 'success' };
        console.log('updateCardFromBizHolder',event);

        let cardId = event.cardId;
        let groupKey = event.groupKey;
        let subIndex = event.subIndex;
        let card ={};
        //名片对象中_id
        if(event.card._id){
            card.id=event.card._id;
        }
        //收藏夹列表中ID
        else if(event.card.id){
            card.id=event.card.id;
        }

        //收藏者对象
        let myHolder = {};
        let holders = await dbSysCardHolder.where(
            {
                card_id: cardId
            }
        ).get();
        console.log('holders',holders.data);

        //更新(找到名片夹)
        if(holders.data.length>0){
            //查找是否已收藏名片
            console.log('holders',holders,holders.data[0].search_data);
            myHolder = holders.data[0];
            //查找是否存在
            let existIndex = -1;
            for(let index in myHolder.search_data){
                if(myHolder.search_data[index].id==card.id){
                    existIndex =index;
                    break;
                }
            }

            //名片夹更新
            if(existIndex>-1){
                console.log('更新名片',myHolder.cards[groupKey],subIndex);
                card =  myHolder.cards[groupKey][subIndex];
                card.name=event.card.name;
                if(event.card.avatar){
                    card.avatar= event.card.avatar;
                }
                if(event.card.corp_position){
                    card.position=event.card.corp_position;
                }
                if(event.card.corp_name){
                    card.corp=event.card.corp_name;
                }
                if(event.card.subject){
                    card.subject=event.card.subject;
                }
                if(event.card.user_id){
                    card.user_id=event.card.user_id;
                }
                card.has_holder =true;
                card.in_exchange =false;
                card.card_type=event.card.card_type||'person';
                if(event.card.phone){
                    card.phone=event.card.phone;
                }
                if(event.card.role){
                    //被收藏的名片的角色；客户，party：会员，核销员
                    card.role=event.card.role
                }
                //---拼接关键字---
                let search_str = card.name+','+card.phone+','+card.position+','+card.corp;
                let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
                let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
                search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
                //---用于关键字检索---
                card.search_str= search_str;
                console.log('card',card);

                //替换名片
                myHolder.cards[groupKey].splice(subIndex,1,card);
            }

            let currentId = myHolder._id;
            delete myHolder._id;
            //更新名片夹
            dbSysCardHolder.doc(currentId).set({
                data: myHolder,
            }).then((res)=>{
                console.log('update success',res)
            })
        }
    });

    //更新聊天室信息
    app.router('updateChatRoom', async (ctx) => {
        ctx.body = { router:'updateChatRoom',event,code: 0, message: 'success' };
        let detail = {tid:event.tid}||{};
        if(event.isSource){
            await dbSysChatRoom.doc(event.id)
                .update({
                    data:{
                        content: _.push(detail),
                        last_time:Date.parse(new Date()),
                        last_history:event.last_history,
                        target_unread: _.inc(1)
                    }
                });
        }else{
            await dbSysChatRoom.doc(event.id)
                .update({
                    data:{
                        content: _.push(detail),
                        last_time:Date.parse(new Date()),
                        last_history:event.last_history,
                        source_unread: _.inc(1)
                    }
                });
        }
    });

    //清除未读聊天信息
    app.router('clearUnreadChatTip', async (ctx) => {
        ctx.body = { router:'clearUnreadChatTip',event,code: 0, message: 'success' };
        if(event.isSource){
            await dbSysChatRoom.doc(event.id)
                .update({
                    data:{
                        source_unread:0
                    }
                });
        }else{
            await dbSysChatRoom.doc(event.id)
                .update({
                    data:{
                        target_unread: 0
                    }
                });
        }
    });

    //【--------------删除--------------】

    //删除商务名片
    app.router('removeCard', async (ctx) => {
        ctx.body = { router:'removeCard',event,code: 0, message: 'success' };
        console.log('removeCard',event);
        await dbSysCard.doc(event.cardId).remove();
    });

    //删除收藏的名片（依据一个用户对应一个收藏夹记录，删除当前记录中对应search_data和cards中对应card）
    app.router('removeCardFromHolder', async (ctx) => {
        ctx.body = { router:'removeCardFromHolder',event,code: 0, message: 'success' };
        console.log('removeCardFromHolder',event);
        //个人
        let userId = event.userId||'';
        //公司网站
        let siteCardId = event.siteCardId||'';
        let groupKey = event.groupKey;
        let subIndex = event.subIndex;
        let cardId = event.cardId;
        //收藏者对象
        let myHolder = {};
        let holders = {};
        if(userId.length>0){
            holders = await dbSysCardHolder.where(
                {
                    user_id: userId
                }
            ).get();
        }else if(siteCardId.length>0){
            holders = await dbSysCardHolder.where(
                {
                    card_id: siteCardId
                }
            ).get();
        }
        console.log('holders',holders.data);

        //更新(找到名片夹)
        if(holders.data.length>0){
            //查找是否已收藏名片
            console.log('holders',holders,holders.data[0].search_data);
            myHolder = holders.data[0];
            //查找是否存在
            let existIndex = -1;
            for(let index in myHolder.search_data){
                if(myHolder.search_data[index].id==cardId){
                    existIndex =index;
                    break;
                }
            }

            //名片夹更新
            if(existIndex>-1){
                console.log('删除名片',myHolder.cards[groupKey],subIndex);
                //删除名片
                myHolder.cards[groupKey].splice(subIndex,1);
                //删除索引
                myHolder.search_data.splice(existIndex,1);
            }

            let currentId = myHolder._id;
            delete myHolder._id;
            //更新名片夹
            dbSysCardHolder.doc(currentId).set({
                data: myHolder,
            }).then((res)=>{
                console.log('update success',res)
            })
        }
    });

    //【--------------状态--------------】
	
	app.router('msgSecCheck', async (ctx) => {
	   ctx.body = {router:'msgSecCheck', code: 0, message: 'success' };
	   const { value } = event;
	   try {
	     const res = await cloud.openapi.security.msgSecCheck({
	       content: value
	     });
	     ctx.body.code = res.errCode;
	   } catch (err) {
	     ctx.body.code = 1;
	     ctx.body.error = err;
	   }
	 });
	 
	 app.router('imgSecCheck', async (ctx) => {
	   ctx.body = {router:'imgSecCheck', code: 0, message: 'success' };
	   const {value} = event;
	   try {
	     const res = await cloud.openapi.security.imgSecCheck({
	       media: {
	         header:{'Content-Type':'application/octet-stream'},
	         contentType: 'image/*',
	         value: Buffer.from(value)
	       }
	     });
	     console.log(res);
	     ctx.body.code = res.errCode;
	   } catch (err) {
	     ctx.body.code=1;
	   }
	 });
	 
	app.router('cloudImgSecCheck', async (ctx) => {
	    ctx.body = {router:'cloudImgSecCheck', code: 0, message: 'success' };
	    const { fileID } = event;
	    const res = await cloud.downloadFile({fileID:fileID,});
	    const buffer= res.fileContent;
	    try {
	        let mime ='image/png';
	        const mimes = {
	          'png': 'image/png',
	          'gif': 'image/gif',
	          'jpg': 'image/jpeg',
	          'jpeg': 'image/jpeg'
	        };
	        const spl = fileID.split(".");
	        const ext=spl[spl.length-1];
	        mime = mimes[ext];
	        const ress = await cloud.openapi.security.imgSecCheck({
	        media: {
	          header: { 'Content-Type': 'application/octet-stream' },
	          contentType:mime,
	          value: buffer
	        }
	      });
		  if (ress.errCode == '87014') {
		  		await deleteCloudFile(fileID)  
		  }
	      ctx.body.code = ress.errCode;
	    } catch (err) {
	      console.log(err);
	      if (err.errCode == '87014') {
	        ctx.body.code = err.errCode;
		  	 await deleteCloudFile(fileID)  
		    }
	    }
	  });

    //检查是否收藏
    app.router('checkHolder', async (ctx) => {
        ctx.body = { router:'checkHolder',event,code: 0, message: 'success' };
        let cardId = event.cardId;
        let holders = await dbSysCardHolder.where(
            {
                "user_id": event.userId
            }
        ).get();
        let hasHolder = false;
        if(holders.data.length>0){
            for(let index in holders.data[0].search_data){
                if(holders.data[0].search_data[index].id ==cardId){
                    hasHolder = true;
                    break;
                }
            }
        }
        ctx.body.data = {'hasHolder':hasHolder};
    });

    //直接交换名片(人与人/人与企业；不存在企业和人)
    app.router('exchangeCards', async (ctx) => {
        ctx.body = { router:'exchangeCards',event,code: 0, message: 'success' };

        let result = await dbSysCard.doc(event.askCardId) .get();
        //ask
        let askCard = result.data;
        askCard.is_ask =false;
        askCard.is_answer =true;
        askCard.room_id=event.roomId||'';

        result = await dbSysCard.doc(event.answerCardId).get();
        //answer
        let answerCard = result.data;
        answerCard.is_ask=true;
        answerCard.is_answer=false;
        answerCard.room_id=event.roomId||'';

        result = await dbSysCardHolder.where(
            {card_id:event.askCardId}
        ).get();
        //请求交换者的名片夹,保存目标交换者名片
        let askHolder = result.data[0]||{'user_id':askCard.user_id||'-1','holder_name':askCard.name,'card_id':askCard._id};
        askHolder.card_id = askHolder.card_id || askCard._id;//交换时补充card_id

        result = await dbSysCardHolder.where(
            {card_id:answerCard._id}
        ).get();
        //目标交换者名片夹,保存请求者名片(被交换者有可能是企业名片，没有user_id)
        let answerHolder = result.data[0]||{'user_id':answerCard.user_id||'-1','holder_name':answerCard.name,'card_id':answerCard._id};
        answerHolder.card_id = answerHolder.card_id||answerCard._id;//交换时补充card_id
        //请求者保存目标交换者名片
        await saveExchangeHolder(askHolder,answerCard,true,false);
        //目标交换者保存请求者名片
        await saveExchangeHolder(answerHolder,askCard,true,false);
    });

	//更新主表未读信息
	app.router('updateChatRoomUnreadTip', async (ctx) => {
	  ctx.body = { router:'updateChatRoomUnreadTip',event,code: 0, message: 'success' };
	  let detail = {};
	  detail = {tid:event.tid};
	  if(event.isSource){
		  await dbSysChatRoom.doc(event.id)
			  .update({
				  data:{
					content: _.push(detail),
					last_time:Date.parse(new Date()),
					last_history:event.last_history,
					target_unread: _.inc(1)
				  }
			  });
	  }else{
		  await dbSysChatRoom.doc(event.id)
			  .update({
				  data:{
					content: _.push(detail),
					last_time:Date.parse(new Date()),
					last_history:event.last_history,
					source_unread: _.inc(1)
				  }
			  });
	  }
	  
	});
  
    //汉字转拼音函数
    app.router('pinyin',async(ctx)=>{
        ctx.body = { router:'pinyin',event,code: 0, message: 'success' };
        console.log('event.chineseName',event.chineseName);
        ctx.body.data = pinyinUtil(event.chineseName,{keepRest: true, firstCharacter:true})
    });


    //FileID 转url
    app.router('convertFileIdToUrl', async (ctx) => {
        const result = await cloud.getTempFileURL({
            fileList: [event.fileId],
        });
        ctx.body = { code: 0, message: 'success' };
        ctx.body.data = result.fileList[0].tempFileURL;
    });


    //根据服务设定状态
    app.router('setServiceStatus', async (ctx) => {
        ctx.body = {router:'setServiceStatus',event,code: 0,message: 'success'};
        await dbSysCard.doc(event.id).update({
            data:{
                accounts:event.accounts
            }
        })
    });

	//【--------------统计--------------】
	
	
	
	
	
	
	
	

    //【--------------测试脚本--------------】
    app.router('refreshAllCardData', async (ctx) => {
        ctx.body = { router:'refreshAllCardData',event,code: 0, message: 'success' };
        let res = await dbSysCard.get();
        if (res.data.length > 0) {
            for(let index in res.data){
                let card = res.data[index];
                //被收藏姓名、职位、公司
                let name = card.name||'';
                let position = card.corp_position||'';
                let corp = card.corp_name||'';
                let search_str = name+','+position+','+corp;
                let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
                let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
                search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
                let groupIndex = search_str.substr(0,1).toUpperCase();//必须中文或字母开头
                console.log('card _id',card._id,'分组字母',groupIndex,'search_data',search_str);
                dbSysCard.doc(card._id).update({
                    data:{
                        group_index:groupIndex,
                        priority:0,
                        search_str:search_str
                    }
                })
            }
        }
    });

    return app.serve();
};



//【--------------公共函数--------------】

async function deleteCloudFile(fileID){
    let farr = [];
    farr.push(fileID);
    let ress = await cloud.deleteFile({
        fileList: farr
    });
    console.log(fileID,ress)
}

//保存交换的名片至名片夹
async function saveExchangeHolder(holder,card,hasHolder,inExchange){
    let currentHolder={};//名片夹
    let currentCard ={};//名片夹中的名片对象
    //-----------------------------------
    //检查名片
    if(card){
        //查重
        if(holder._id!=null){
            for(let index in holder.search_data){
                if(holder.search_data[index].id== card._id){
                    console.log('名片夹：',holder.holder_name,'已存在名片：',card.name);
                    return;
                }
            }
        }

        //初始化名片
        currentCard.id=card._id;
        currentCard.user_id= card.user_id;
        currentCard.name=card.name;
        currentCard.avatar = card.avatar || '';
        currentCard.position=card.corp_position||'';
        currentCard.corp=card.corp_name||'';
        currentCard.user_id=card.user_id;
        currentCard.has_holder =hasHolder||false;
        currentCard.in_exchange = inExchange||true;
        currentCard.is_ask = card.is_ask;
        currentCard.is_answer = card.is_answer;
        currentCard.subject = card.subject;
        currentCard.creat_at=new Date();
        currentCard.room_id=card.room_id||'';
    }

    //生成名片夹中检索内容（支持：首字母、拼音、中文查询）
    let search_str = currentCard.name+','+currentCard.position+','+currentCard.corp;
    let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
    let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
    search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;

    //识别检索字母
    let groupIndex = search_str.trim().substr(0,1).toUpperCase();//必须中文或字母开头

    //-----------------------------------
    // 保存名片至名片夹
    if(holder._id==null){
        //初始化名片夹
        //读取系统给定默认记录来创建新的收藏夹记录 userId= 'SYS_DEFAULT_TEMPLATE_RECORD'
        let result = await dbSysCardHolder.doc('SYS_DEFAULT_TEMPLATE_RECORD').get();
        currentHolder = result.data;
        delete currentHolder._id;
        currentHolder.card_id=holder.card_id;
        currentHolder.user_id=holder.user_id;
        currentHolder.holder_name=holder.holder_name;
        currentHolder.is_ask = holder.is_ask;
        currentHolder.is_answer = holder.is_answer;
        //收藏新增名片
        currentHolder.cards[groupIndex].push(currentCard);
        currentHolder.search_data.push({'id':currentCard.id,'search_str':search_str,'has_holder':currentCard.has_holder,'in_exchange':currentCard.in_exchange});
        console.log('holder',currentHolder,'groupIndex',groupIndex,'card',currentCard,'search_str',search_str);
        let holderId= await dbSysCardHolder.add({
            data: currentHolder
        }).catch((e)=>{
            console.log('init holder e',e);
        })
    }else{
        currentHolder = holder;
        //收藏新增名片
        currentHolder.cards[groupIndex].push(currentCard);
        currentHolder.search_data.push({'id':currentCard.id,'search_str':search_str,'has_holder':currentCard.has_holder,'in_exchange':currentCard.in_exchange});
        console.log('holder',currentHolder,'groupIndex',groupIndex,'card',currentCard,'search_str',search_str);
        let currentHolderId = currentHolder._id;
        delete currentHolder._id;
        //更新名片夹
        await dbSysCardHolder.doc(currentHolderId).set({
            data: currentHolder,
        }).then((res)=>{
            console.log('update holder success',res)
        })
    }
}







