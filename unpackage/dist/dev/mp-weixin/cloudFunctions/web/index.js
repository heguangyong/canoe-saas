const cloud = require('wx-server-sdk');
const rp = require('request-promise');
const md5 = require('js-md5');
const base64url = require('base64-url');
const sha1 = require('sha-1');
const tcbRouter = require('tcb-router');
cloud.init({
                env:"prod-9goq82ctb17bd75f",
                traceUser:true
            });
const randomStr = require("randomstring");

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
const dbCmnActivity = db.collection('cmn_activity');
const dbCmnProduct = db.collection('cmn_product');
const dbCmnTrend = db.collection('cmn_trend');
const dbCmnOrder = db.collection('cmn_order');
const dbCmnComment = db.collection('cmn_comment');




//【--------------云函数入口--------------】
exports.main = async (event, context) => {
    const app = new tcbRouter({ event });

    //【--------------列表--------------】

    app.router('getOnSaleProductListByCardId', async (ctx) => {
        ctx.body = {router:'getOnSaleProductListByCardId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res =null;
        if(event.checkedLabels.length>0){
            res= await dbCmnProduct
                .where({
                    card_id:event.cardId,
                    on_sale:true,
                    tags:_.in(event.checkedLabels)
                })
                .orderBy('create_at','desc')
                .skip(skipNum)
                .limit(pageSize)
                .get();
        }else{
            res= await dbCmnProduct
                .where({
                    card_id:event.cardId,
                    on_sale:true,
                })
                .orderBy('create_at','desc')
                .skip(skipNum)
                .limit(pageSize)
                .get();
        }
        ctx.body.data=JSON.stringify(res.data);
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
            let listGroup = holders.data[0].cards ||{};
            let avatarList = [];
            for (let key in listGroup) {
                listGroup[key].forEach(each=>{
                    if(each.avatar.indexOf('http')>-1){
                    }else{
                        avatarList.push(each.avatar);
                    }
                });
            }
            let result = await cloud.getTempFileURL({
                fileList: avatarList,
            });
            // console.log('avatarList',avatarList,'result.fileList',result.fileList);
            for (let key in listGroup) {
                listGroup[key].forEach(each=>{
                    if(each.avatar.indexOf('http')>-1){
                    }else{
                        for(let idx in result.fileList){
                            let subStrIdx = result.fileList[idx].tempFileURL.lastIndexOf('/');
                            let imageName = result.fileList[idx].tempFileURL.substr(subStrIdx+1);
                            // console.log('compare image',imageName,'each.avatar',each.avatar);
                            if(each.avatar.indexOf(imageName)>0){
                                each.avatar = result.fileList[idx].tempFileURL;
                                break;
                            }
                        }
                    }
                });
            }
            ctx.body.data = JSON.stringify(holders.data[0]);
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
        ctx.body.data = JSON.stringify(list);
    });

    // 新增聊天信息
    app.router('getNewChatMsgList', async (ctx) => {
        ctx.body = { router:'getNewChatMsgList',event,code: 0, message: 'success' };
        ctx.body = { code: 0, message: 'success' };
        let list = [];
        let res = await dbSysChatMsg
            .where({
                room_id: event.id,
                create_at:_.gt(event.create_at)
            })
            .get();
        if(res.data.length>0){
            list = res.data;
        }else{
            ctx.body.code=-1;
            ctx.body.message='没有历史记录了'
        }
        ctx.body.data = JSON.stringify(list);
    });

    app.router('getProductOrderListByUserId', async (ctx) => {
        ctx.body = {router:'getProductOrderListByUserId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnOrder
            .where({
                user_id:event.userId,
                order_type:event.orderType
            })
            .orderBy('create_at', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        //构建转换头像
        let seller_avatar = '';
        if(res.data[0].seller_avatar.indexOf('http')>-1){
            seller_avatar = res.data[0].seller_avatar;
        }else{
            let result = await cloud.getTempFileURL({
                fileList: [res.data[0].seller_avatar],
            });
            seller_avatar = result.fileList[0].tempFileURL;
        }
        //构建转换列表：cover背景图seller_avatar
        let cloudImageList = [];
        //轮询订单
        res.data.forEach(each=>{
            each.items.forEach(item=>{
                //产品背景图:默认取第一个产品介绍图
               cloudImageList.push(item.detail.carouse[0]);
            });
        });
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        console.log('cloudImageList',result.fileList);
        res.data.forEach(each=>{
            each.seller_avatar = seller_avatar;
            each.items.forEach(item=>{
                //产品背景图
                for(let idx in result.fileList){
                    let subStrIdx = item.detail.carouse[0].lastIndexOf('/');
                    let imageName = item.detail.carouse[0].substr(subStrIdx+1);
                    // console.log('compare',imageName,result.fileList[idx].tempFileURL);
                    if(result.fileList[idx].tempFileURL.length=0){
                        result.fileList[idx].tempFileURL = result.fileList[idx].fileID;
                    }
                    if(result.fileList[idx].tempFileURL.indexOf(imageName)>0){
                        item.detail.carouse[0] = result.fileList[idx].tempFileURL;
                        break;
                    }
                }
            });
        });
        ctx.body.data = JSON.stringify(res.data);
    });

    //获取产品订单列表
    app.router('getProductOrderList', async (ctx) => {
        ctx.body = {router:'getProductOrderList', code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }

        let productId =  event.productId||'0';
        let res = await dbCmnOrder
            .where({
                product_id: productId
            })
            .skip(skipNum)
            .limit(pageSize)
            .orderBy('create_at', 'desc')
            .get();
        //构建转换列表
        let cloudImageList = [];
        //轮询订单
        res.data.forEach(each=>{
            if(each.avatar.indexOf('http')>-1){
            }else{
                cloudImageList.push(each.avatar);
            }
        });
        if(cloudImageList.length>0){
            let result = await cloud.getTempFileURL({
                fileList: cloudImageList,
            });
            console.log('cloudImageList',result.fileList);
            res.data.forEach(item=>{
                for(let i in result.fileList){
                    let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                    let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                    if(item.avatar.indexOf(imageName)>0){
                        item.avatar= result.fileList[i].tempFileURL;
                        break;
                    }
                }
            });
        }
        ctx.body.data = JSON.stringify(res.data);
    });

    //获取活动订单列表
    app.router('getActivityOrderList', async (ctx) => {
        ctx.body = {router:'getActivityOrderList', code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnOrder
            .where({
                activity_id: event.activityId
            })
            .skip(skipNum)
            .limit(pageSize)
            .orderBy('create_at', 'desc')
            .get();

        // console.log('activityId',event.activityId,'res.data',res.data);
        //构建转换列表
        let cloudImageList = [];
        //轮询订单
        res.data.forEach(each=>{
            if(each.avatar.indexOf('http')>-1){
            }else{
                cloudImageList.push(each.avatar);
            }
        });
        if(cloudImageList.length>0){
            let result = await cloud.getTempFileURL({
                fileList: cloudImageList,
            });
            console.log('cloudImageList',result.fileList);
            res.data.forEach(item=>{
                for(let i in result.fileList){
                    let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                    let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                    if(item.avatar.indexOf(imageName)>0){
                        item.avatar= result.fileList[i].tempFileURL;
                        break;
                    }
                }
            });
        }
        ctx.body.data = JSON.stringify(res.data);
    });

    app.router('getActivityOrderListByUserId', async (ctx) => {
        ctx.body = { router:'getActivityOrderListByUserId',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnOrder
            .where({
                user_id:event.userId,
                order_type:event.orderType
            })
            .orderBy('create_at', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        //构建转换头像
        let seller_avatar = '';
        let result = {};
        if(res.data[0].seller_avatar.indexOf('http')>-1){
            seller_avatar = res.data[0].seller_avatar;
        }else{
            result = await cloud.getTempFileURL({
                fileList: [res.data[0].seller_avatar],
            });
            seller_avatar = result.fileList[0].tempFileURL;
        }
        //构建转换列表：cover背景图seller_avatar
        let cloudImageList = [];
        //轮询订单
        res.data.forEach(each=>{
            each.items.forEach(item=>{
                //活动背景图
                cloudImageList.push(item.detail.cover);
            });
        });
        result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        console.log('cloudImageList',result.fileList);
        res.data.forEach(each=>{
            each.seller_avatar = seller_avatar;
            each.items.forEach(item=>{
                //活动背景图
                for(let idx in result.fileList){
                    let subStrIdx = item.detail.cover.lastIndexOf('/');
                    let imageName = item.detail.cover.substr(subStrIdx+1);
                    // console.log('compare',imageName,result.fileList[idx].tempFileURL);
                    if(result.fileList[idx].tempFileURL.length=0){
                        result.fileList[idx].tempFileURL = result.fileList[idx].fileID;
                    }
                    if(result.fileList[idx].tempFileURL.indexOf(imageName)>0){
                        item.detail.cover = result.fileList[idx].tempFileURL;
                        break;
                    }
                }
            });
        });
        ctx.body.data = JSON.stringify(res.data);
    });

    //根据传入chatIdList 检索聊天室列表
    app.router('getChatRoomList', async (ctx) => {
        ctx.body = { router:'getChatRoomList',event,code: 0, message: 'success' };
        let res = await dbSysChatRoom.where(_.or([
                {source_id:_.in(event.chatIdList)},
                {target_id:_.in(event.chatIdList)}
            ])
        ).get();

        ctx.body.data = JSON.stringify(res.data)||[];
    });

    //根据cardId获取列表
    app.router('getActivityListByCardId', async (ctx) => {
        ctx.body = {router:'getActivityListByCardId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnActivity
            .where({card_id:event.cardId})
            .orderBy('create_at','desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        //构建转换列表：cover背景图seller_avatar
        let cloudImageList = [];
        cloudImageList.push(res.data[0].avatar);
        //轮询订单
        res.data.forEach(each=>{
            //活动背景图
            cloudImageList.push(each.cover);
        });
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        console.log('cloudImageList',result.fileList);
        res.data.forEach(item=>{
            let findAvatar =false;
            let findCover = false;
            for(let i in result.fileList){
                let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                if(item.avatar.indexOf(imageName)>0){
                    item.avatar= result.fileList[i].tempFileURL;
                    findAvatar=true;
                }
                if(item.cover.indexOf(imageName)>0){
                    item.cover= result.fileList[i].tempFileURL;
                    findCover=true;
                }
                if(findAvatar && findCover){
                    break;
                }
            }
        });
        ctx.body.data=JSON.stringify(res.data);
    });

    app.router('getProductListByCardId', async (ctx) => {
        ctx.body = {router:'getProductListByCardId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res =null;
        if(event.checkedLabels.length>0){
            res= await dbCmnProduct
                .where({
                    card_id:event.cardId,
                    tags:_.in(event.checkedLabels)
                })
                .orderBy('create_at','desc')
                .skip(skipNum)
                .limit(pageSize)
                .get();
        }else{
            res= await dbCmnProduct
                .where({
                    card_id:event.cardId
                })
                .orderBy('create_at','desc')
                .skip(skipNum)
                .limit(pageSize)
                .get();
        }
        //构建转换列表：cover背景图seller_avatar
        let cloudImageList = [];
        cloudImageList.push(res.data[0].avatar);
        //轮询订单
        res.data.forEach(each=>{
            //活动背景图
            cloudImageList.push(each.carouse[0]);
        });
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        console.log('cloudImageList',result.fileList);
        res.data.forEach(item=>{
            let findAvatar =false;
            let findCover = false;
            for(let i in result.fileList){
                let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                if(item.avatar.indexOf(imageName)>0){
                    item.avatar= result.fileList[i].tempFileURL;
                    findAvatar=true;
                }
                if(item.carouse[0].indexOf(imageName)>0){
                    item.carouse[0]= result.fileList[i].tempFileURL;
                    findCover=true;
                }
                if(findAvatar && findCover){
                    break;
                }
            }
        });
        ctx.body.data=JSON.stringify(res.data);
    });

    app.router('getTrendListByCardId', async (ctx) => {
        ctx.body = {router:'getTrendListByCardId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnTrend
            .where({card_id:event.cardId})
            .orderBy('create_at','desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data=JSON.stringify(res.data);
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

        ctx.body.data = JSON.stringify(res.data) ||[];
    });

    //检索个人名片列表
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

        ctx.body.data = JSON.stringify(res.data) ||[];
    });

    //获取动态评论列表
    app.router('getCommentList', async (ctx) => {
        ctx.body = {router:'getCommentList', code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnComment
            .where({
                trend_id:event.trendId
            }).skip(skipNum)
            .limit(pageSize)
            .orderBy('create_at', 'desc')
            .get();
        let commentList = res.data;

        if (event.userId) {
            for (let i = 0; i < commentList.length; i++) {
                //判断是否有管理权限
                commentList[i].isOwner = event.userId == commentList[i].user_id;
                if (commentList[i].likes_ids && commentList[i].likes_ids.indexOf(event.userId) > -1) {
                    commentList[i].isLike = true;
                } else {
                    commentList[i].isLike = false;
                }
            }
        }
        ctx.body.data=JSON.stringify(commentList);
    });

    //抖音动态列表
    app.router('getDyTrendList', async (ctx) => {
        ctx.body = { router:'getDyTrendList',event,code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnTrend.where(
            _.or([
                {
                    _id: event.trendId,
                },
                {
                    card_id:event.cardId
                }
            ])
        )
            .orderBy('create_at','desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();

        //构建转换列表：cover背景图seller_avatar
        let cloudImageList = [];
        cloudImageList.push(res.data[0].avatar);
        //轮询订单
        res.data.forEach(each=>{
            each.carousels.forEach(carousel=>{
                cloudImageList.push(carousel);
            });
            each.videos.forEach(video=>{
                cloudImageList.push(video);
            });

        });
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        console.log('cloudImageList',result.fileList);
        res.data.forEach(item=>{
            let findAvatar =false;
            let findCover = false;
            for(let i in result.fileList){
                let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                if(item.avatar.indexOf(imageName)>0){
                    item.avatar= result.fileList[i].tempFileURL;
                    findAvatar=true;
                }
                if(item.cover.indexOf(imageName)>0){
                    item.cover= result.fileList[i].tempFileURL;
                    findCover=true;
                }
                if(findAvatar && findCover){
                    break;
                }
            }
        });

        ctx.body.data = JSON.stringify(res.data) ||[]
    });

    //【--------------详情--------------】

    //跨端登录(验证名片中：用户手机号，授权码)
    //考虑到web交互方式不同，一次性获取当前页面所有信息，避免多次交互加载
    app.router('webLogin', async (ctx) => {
        ctx.body = { router:'webLogin',event,code: 0, message: 'success' };
        let phone = event.phone||'';
        let authCode = event.authCode||'';

        //1、获取名片
        let res = await dbSysCard.where({
            phone: phone,
            auth_code: authCode
        }).get();
        let card = res.data[0]||{};
        if(card.user_id){
            //2、获取用户
            res = await dbSysUser.doc(card.user_id).get();
            let user = res.data;
            ctx.body.data=JSON.stringify({'user':user,'card':card});
        }else{
            ctx.body.data=JSON.stringify({'user':{},'card':{}});
        }

    });

    app.router('getUserDetail', async (ctx) => {
        ctx.body = { router:'getUserDetail',event,code: 0, message: 'success' };
        let res = await dbSysUser.doc(event.id).get();
        ctx.body.data = JSON.stringify(res.data);
    });

    app.router('getCardDetailById', async (ctx) => {
        ctx.body = { router:'getCardDetailById',event,code: 0, message: 'success' };
        let res = await dbSysCard.doc(event.id).get();
        if(res.data.avatar.length>0 && res.data.avatar.indexOf('http')<0){
            let result = await cloud.getTempFileURL({
                fileList: [res.data.avatar],
            });
            res.data.avatar = result.fileList[0].tempFileURL;
        }
        if(res.data.videos.length>0 && res.data.videos[0].indexOf('http')<0){
            let result = await cloud.getTempFileURL({
                fileList: [res.data.videos[0]],
            });
            res.data.videos[0] = result.fileList[0].tempFileURL;
        }
        if(res.data.pay_info){
            //构建转换列表
            let cloudImageList = [];
            res.data.pay_info.forEach(each=>{
                cloudImageList.push(each.qrcode);
            });
            let result = await cloud.getTempFileURL({
                fileList: cloudImageList,
            });
            // console.log('pay_info',result.fileList);
            res.data.pay_info.forEach(item=>{
                for(let i in result.fileList){
                    let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                    let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                    if(item.qrcode.indexOf(imageName)>0){
                        item.qrcode= result.fileList[i].tempFileURL;
                        break;
                    }
                }
            });
        }
        if(res.data.carousels){
            //构建转换列表
            let cloudImageList = [];
            res.data.carousels.forEach(each=>{
                cloudImageList.push(each);
            });
            let result = await cloud.getTempFileURL({
                fileList: cloudImageList,
            });
            let carousels =[];
            res.data.carousels.forEach(item=>{
                for(let i in result.fileList){
                    let subStrIdx = result.fileList[i].tempFileURL.lastIndexOf('/');
                    let imageName = result.fileList[i].tempFileURL.substr(subStrIdx+1);
                    if(item.indexOf(imageName)>0){
                        carousels.push(result.fileList[i].tempFileURL);
                        break;
                    }
                }
            });
            res.data.carousels = carousels;
        }
        ctx.body.data = JSON.stringify(res.data);
    });

    app.router('getCardDetailByUserId', async (ctx) => {
        ctx.body = { router:'getCardDetailByUserId',event,code: 0, message: 'success' };
        let res = await dbSysCard.where({
            user_id: event.userId
        }).get();
        if(res.data[0].avatar.indexOf('http')<0) {
            let result = await cloud.getTempFileURL({
                fileList: [res.data[0].avatar],
            });
            res.data[0].avatar = result.fileList[0].tempFileURL;
        }
        ctx.body.data=JSON.stringify(res.data[0]);
    });

    app.router('getCardDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getCardDetailByQrcode',code: 1, message: 'success' };
        let res = await dbSysCard.where({
            qrcode: event.qrcode
        }).get();
        if(res.data[0].avatar.indexOf('http')<0) {
            let result = await cloud.getTempFileURL({
                fileList: [res.data[0].avatar],
            });
            res.data[0].avatar = result.fileList[0].tempFileURL;
        }
        ctx.body.data= JSON.stringify(res.data[0]);
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
            ctx.body.data = JSON.stringify(holders.data[0]);
        }
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
        let data = res.data[0]||{};
        let result = null;
        if(data.source_avatar){
            result = await cloud.getTempFileURL({
                fileList: [data.source_avatar],
            });
            data.source_avatar = result.fileList[0].tempFileURL;
        }
        if(data.target_avatar){
            result = await cloud.getTempFileURL({
                fileList: [data.target_avatar],
            });
            data.target_avatar = result.fileList[0].tempFileURL;
        }
        ctx.body.data = JSON.stringify(data);
    });

    app.router('getProductDetail', async (ctx) => {
        ctx.body = {router:'getProductDetail', code: 0, message: 'success' };
        let res = await dbCmnProduct.doc(event.id).get();
        //构建转换列表：0:头像，其他图
        let cloudImageList = [res.data.avatar];
        cloudImageList = cloudImageList.concat(res.data.carouse);
        cloudImageList = cloudImageList.concat(res.data.detail.images);
        // console.log('cloudImageList',cloudImageList);
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        // console.log('convert http url',result.fileList);
        res.data.avatar = result.fileList[0].tempFileURL;
        for(let i in res.data.carouse){
            let item = res.data.carouse[i];
            for(let idx in result.fileList){
                let subStrIdx = item.lastIndexOf('/');
                let imageName = item.substr(subStrIdx+1);
                // console.log('carouse compare',imageName,result.fileList[idx].tempFileURL);
                if(result.fileList[idx].tempFileURL.indexOf(imageName)>0){
                    res.data.carouse[i] = result.fileList[idx].tempFileURL;
                    break;
                }
            }
        }
        for(let j in res.data.detail.images){
            let item = res.data.detail.images[j];
            for(let idx in result.fileList){
                let subStrIdx = item.lastIndexOf('/');
                let imageName = item.substr(subStrIdx+1);
                // console.log('images compare',imageName,result.fileList[idx].tempFileURL);
                if(result.fileList[idx].tempFileURL.indexOf(imageName)>0){
                    res.data.detail.images[j] = result.fileList[idx].tempFileURL;
                    break;
                }
            }
        }
        ctx.body.data = JSON.stringify(res.data);
    });

    app.router('getProductDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getProductDetailByQrcode',code: 0, message: 'success' };
        let res = await dbCmnProduct.where({
            qrcode: event.qrcode
        }).get();
        //构建转换列表：0:头像，其他图
        let cloudImageList = [res.data[0].avatar];
        cloudImageList = cloudImageList.concat(res.data[0].carouse);
        cloudImageList = cloudImageList.concat(res.data[0].detail.images);
        // console.log('cloudImageList',cloudImageList);
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        // console.log('convert http url',result.fileList);
        res.data[0].avatar = result.fileList[0].tempFileURL;
        for(let i in res.data[0].carouse){
            let item = res.data[0].carouse[i];
            for(let idx in result.fileList){
                let subStrIdx = item.lastIndexOf('/');
                let imageName = item.substr(subStrIdx+1);
                // console.log('carouse compare',imageName,result.fileList[idx].tempFileURL);
                if(result.fileList[idx].tempFileURL.indexOf(imageName)>0){
                    res.data[0].carouse[i] = result.fileList[idx].tempFileURL;
                    break;
                }
            }
        }
        for(let j in res.data[0].detail.images){
            let item = res.data[0].detail.images[j];
            for(let idx in result.fileList){
                let subStrIdx = item.lastIndexOf('/');
                let imageName = item.substr(subStrIdx+1);
                // console.log('images compare',imageName,result.fileList[idx].tempFileURL);
                if(result.fileList[idx].tempFileURL.indexOf(imageName)>0){
                    res.data[0].detail.images[j] = result.fileList[idx].tempFileURL;
                    break;
                }
            }
        }
        ctx.body.data= JSON.stringify(res.data[0]);
    });


    //根据Id获取详情
    app.router('getActivityDetail', async (ctx) => {
        ctx.body = {router:'getActivityDetail', code: 0, message: 'success' };
        let res = await dbCmnActivity.doc(event.id).get();

        //构建转换列表：头像，cover,其他图
        let cloudImageList = [];
        cloudImageList.push(res.data.avatar);
        cloudImageList.push(res.data.cover);
        cloudImageList = cloudImageList.concat(res.data.carousels);
        // console.log('cloudImageList',cloudImageList);
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        // console.log('convert http url',result.fileList);
        res.data.avatar = result.fileList[0].tempFileURL;
        result.fileList.forEach(item=>{
           let subStrIdx = item.tempFileURL.lastIndexOf('/');
           let imageName = item.tempFileURL.substr(subStrIdx+1);
           if(res.data.avatar.indexOf(imageName)>0){
               res.data.avatar = item.tempFileURL;
           }else if(res.data.cover.indexOf(imageName)>0){
               res.data.cover = item.tempFileURL;
           }else{
               for(let idx in res.data.carousels){
                   if(res.data.carousels[idx].indexOf(imageName)>0){
                       res.data.carousels[idx] = item.tempFileURL;
                       break;
                   }
               }
           }
        });
        ctx.body.data = JSON.stringify(res.data);
    });

    app.router('getActivityDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getActivityDetailByQrcode',code: 0, message: 'success' };
        let res = await dbCmnActivity.where({
            qrcode: event.qrcode
        }).get();
        //构建转换列表：头像，cover,其他图
        let cloudImageList = [];
        cloudImageList.push(res.data[0].avatar);
        cloudImageList.push(res.data[0].cover);
        cloudImageList = cloudImageList.concat(res.data[0].carousels);
        // console.log('cloudImageList',cloudImageList);
        let result = await cloud.getTempFileURL({
            fileList: cloudImageList,
        });
        // console.log('convert http url',result.fileList);
        res.data[0].avatar = result.fileList[0].tempFileURL;
        result.fileList.forEach(item=>{
            let subStrIdx = item.tempFileURL.lastIndexOf('/');
            let imageName = item.tempFileURL.substr(subStrIdx+1);
            if(res.data[0].avatar.indexOf(imageName)>0){
                res.data[0].avatar = item.tempFileURL;
            }else if(res.data[0].cover.indexOf(imageName)>0){
                res.data[0].cover = item.tempFileURL;
            }else{
                for(let idx in res.data[0].carousels){
                    if(res.data[0].carousels[idx].indexOf(imageName)>0){
                        res.data[0].carousels[idx] = item.tempFileURL;
                        break;
                    }
                }
            }
        });
        ctx.body.data= JSON.stringify(res.data[0]);
    });

    app.router('getTrendDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getTrendDetailByQrcode',code: 0, message: 'success' };
        let res = await dbCmnTrend.where({
            qrcode: event.qrcode
        }).get();

        ctx.body.data= JSON.stringify(res.data[0]);
    });

    app.router('getPhone', async (ctx) => {
        ctx.body = { router:'getPhone',event,code: 0, message: 'success' };
        const res = await cloud.getOpenData({
            list: [event.cloudId], // 假设 event.openData.list 是一个 CloudID 字符串列表
        });
        ctx.body.data= JSON.stringify(res.list[0].data);
    });
    //【--------------新增--------------】


    //【--------------修改--------------】


	//【--------------删除--------------】



	//【--------------状态--------------】

    /**
     * 签名算法
     * jsapi_ticket 用于签名的 jsapi_ticket
     * url 用于签名的 url ，注意必须动态获取，不能 hardcode
     */
    app.router('signWeixin', async (ctx) => {
        ctx.body = { router:'signWeixin',event,code: 0, message: 'success' };
        //升阶助手cardId
        let cardId ='SYS_DEFAULT_TEMPLATE_RECORD';
        let card_res = await dbSysCard.doc(cardId).get();
        let card = card_res.data;
        console.log('card wx_config',card.wx_config);
        let signRet = {
                url:event.url||'',
                debug:card.wx_config.debug||false,
                appId:card.wx_config.appId||'',
                access_token: card.wx_config.access_token||'',
                jsApiList: card.wx_config.jsApiList||[],
                jsapi_ticket: card.wx_config.jsapi_ticket||'',
                nonceStr: card.wx_config.nonceStr||Math.random().toString(36).substr(2, 15),
                timestamp: card.wx_config.timestamp||parseInt(new Date().getTime() / 1000) + '',
                signature: card.wx_config.signature||''
            };
        console.log('old signRet',signRet,'needRefreshSignature',event.needRefreshSignature);
        //没有ticket 或者需要刷新
        if(signRet.jsapi_ticket=='' || event.needRefreshSignature){
            //没有access_token 或者需要刷新
            if(signRet.access_token=='' || event.needRefreshSignature){
                //getAccessToken
                let token_options = {
                    method:'GET',
                    url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc42ba3b82548c8b6&secret=d70d79af4512e4c49b162c28810ec8c7',
                };
                let token_res = await rp(token_options);
                signRet.access_token=JSON.parse(token_res).access_token;
                console.log('token_res1',token_res,'signRet.access_token',signRet.access_token);
                //缓存token至card中 access_token
                dbSysCard.doc(cardId).update({
                    data:{
                        'wx_config.nonceStr':signRet.nonceStr,
                        'wx_config.timestamp':signRet.timestamp,
                        'wx_config.access_token':signRet.access_token,
                    }
                });
            }
            if(signRet.access_token){
                //getJsapi_ticket
                let ticket_options = {
                    method:'GET',
                    url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+signRet.access_token+'&type=jsapi',
                };
                let ticket_res = await rp(ticket_options);

                //获取成功，缓存到card中
                signRet.jsapi_ticket=JSON.parse(ticket_res).ticket;
                console.log('ticket_res1',ticket_res,'signRet.jsapi_ticket',signRet.jsapi_ticket);
                if(signRet.jsapi_ticket){
                    //制作签名
                    let signObject={
                        jsapi_ticket:signRet.jsapi_ticket,
                        nonceStr:signRet.nonceStr,
                        timestamp:signRet.timestamp,
                        url:signRet.url
                    };
                    let keys = Object.keys(signObject);
                    keys = keys.sort();
                    let newArgs = {};
                    keys.forEach(function (key) {
                        newArgs[key.toLowerCase()] = signObject[key];
                    });

                    let string = '';
                    for (let k in newArgs) {
                        string += '&' + k + '=' + newArgs[k];
                    }
                    let string1 = string.substr(1);
                    console.log('string1',string1);
                    signRet.signature = sha1(string1);
                    console.log('new signRet1',signRet);

                    //缓存token至card中 jsapi_ticket
                    dbSysCard.doc(cardId).update({
                        data:{
                            'wx_config.jsapi_ticket':signRet.jsapi_ticket,
                            'wx_config.signature':signRet.signature,
                        }
                    });
                }
            }
        }

        ctx.body.data= JSON.stringify(signRet);
    });


	//【--------------统计--------------】

    // 获取当前人的统计信息
    app.router('getSum', async (ctx) => {
        ctx.body = { router:'getSum',event,code: 0, message: 'success' };
        let accountSum={
            newMsgNum: 0,
            productOrderNum: 0,
            activityOrderNum: 0,
        };

        let total = 0;
        let holders = await dbSysCardHolder.where(
            {
                "user_id": event.userId
            }
        ).get();
        if(holders.data.length>0){
            let cardHolder = holders.data[0];
            //按字母分组的名片
            let holderIdList = cardHolder.search_data || [];
            let chatIdList = [cardHolder.card_id];
            for(let idIdx in holderIdList){
                chatIdList.push(holderIdList[idIdx].id);
            }
            //获取聊天室信息
            let res = await dbSysChatRoom.where(_.or([
                    {source_id:_.in(chatIdList)},
                    {target_id:_.in(chatIdList)}
                ])
            ).get();
            let chatRooms = res.data||[];
            chatRooms.forEach(room=>{
                total +=room.source_unread;
            });
        }
        accountSum.newMsgNum=total;

        res = await dbCmnOrder.where({
            user_id:event.userId,
            order_type:'product'
        }).count();
        accountSum.productOrderNum=res.total;

        res = await dbCmnOrder.where({
            user_id:event.userId,
            order_type:'activity'
        }).count();
        accountSum.activityOrderNum=res.total;

        ctx.body.data = JSON.stringify(accountSum);
    });

    //【-------------第三方集成--------------】

    //查找用户是否存在，不存在创建新用户
    app.router('huajiSsoUrl', async (ctx) => {
        ctx.body = { router:'huajiSsoUrl',event,code: 0, message: 'success' };
        let id = '';
        let post_options = {
            method:'POST',
            url:'https://apac.6connex.com/publicapi/users/executeAPIcall',
            body:event.readApiForm,
            json:true
        };
        let post_res = await rp(post_options);
        // 不存在账号
        if(post_res.apicallsetoutput[0]._apicallresultcode==0){
            post_options = {
                method:'POST',
                url:'https://apac.6connex.com/publicapi/users/executeAPIcall',
                body:event.createApiForm,
                json:true
            };
          await rp(post_options);
        }

        let now = (new Date()).getTime();
        let form = event.readApiForm.apicallsetinput[0];
        let data = form.email+':'+form.event_id+':'+now+':'+ event.readApiForm.apiUsername+':'+ event.readApiForm.apiPassword;
        // console.log('data',data,'hash',md5(data));
        let token = form.email+':'+form.event_id+':'+now+':'+event.readApiForm.apiUsername+':'+md5(data);
        let encodeToken = base64url.encode(token);
        console.log('encodeToken',encodeToken);
        let sso_options = {
            method:'GET',
            url:'https://apac.6connex.com/publicapi/users/signon2?APIResponse='+encodeToken,
        };
        let sso_res = await rp(sso_options);
        console.log('sso_res',sso_res);
        let reg= /(https?):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        let ssoUrl = sso_res.match(reg)[0];
        console.log('ssoUrl',ssoUrl);
        ctx.body.data= ssoUrl;
    });


    return app.serve();
};


//【--------------公共函数--------------】