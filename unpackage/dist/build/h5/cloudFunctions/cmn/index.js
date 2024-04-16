const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');
cloud.init({
    env:"prod-9goq82ctb17bd75f",
    traceUser:true
});
const randomStr = require("randomstring");
const pinyin = require('chinese-to-pinyin');

const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
const pageSize = 10;
const qrcodeNameLen = 9;

//【--------------定义数据库表--------------】
const dbSysChatRoom = db.collection('sys_chat_room');
const dbCmnActivity = db.collection('cmn_activity');
const dbCmnProduct = db.collection('cmn_product');
const dbCmnTrend = db.collection('cmn_trend');
const dbCmnOrder = db.collection('cmn_order');
const dbCmnComment = db.collection('cmn_comment');




//【--------------云函数入口--------------】
exports.main = async (event, context) => {
    const app = new tcbRouter({ event });

    //【--------------列表--------------】

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
        ctx.body.data = res.data ||[]
    });

    //根据userId获取列表
    app.router('getTrendListByUserId', async (ctx) => {
		ctx.body = {router:'getTrendListByUserId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnTrend
            .where({user_id:event.userId})
            .orderBy('create_at','desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data=res.data;
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
        ctx.body.data=res.data;
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
        ctx.body.data=res.data;
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
        ctx.body.data=res.data;
    });

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
        ctx.body.data=res.data;
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
        ctx.body.data = res.data;
    });

    //包含产品和活动
    app.router('getOrderListByUserId', async (ctx) => {
        ctx.body = {router:'getOrderListByUserId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnOrder
            .where({
                user_id:event.userId
            })
            .orderBy('create_at', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data = res.data
    });

    //包含产品和活动
    app.router('getOrderListByUserIdAndState', async (ctx) => {
        ctx.body = {router:'getOrderListByUserIdAndState',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let search_str = event.search_str||'';
        let res = await dbCmnOrder
            .where(
                _.and([
                    {
                        search_str:db.RegExp({
                            regexp:'.*'+ search_str +'.*',
                            options:'i',
                        })
                    },
                    {
                        user_id:event.userId,
                        order_state:_.in(event.orderStates),
                    }
                ])
            )
            .orderBy('_id', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data = res.data||[];
    });

    //仅筛选初卖家范围内的订单
    app.router('getSellerOrderListByUserIdAndState', async (ctx) => {
        ctx.body = {router:'getSellerOrderListByUserIdAndState',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let search_str = event.search_str||'';
        let res = await dbCmnOrder
            .where(
                _.and([
                    {
                        search_str:db.RegExp({
                            regexp:'.*'+ search_str +'.*',
                            options:'i',
                        })
                    },
                    {
                        user_id:event.userId,
                        seller_id:event.bizCardId,
                        order_state:_.in(event.orderStates),
                    }
                ])
            )
            .orderBy('create_at', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data = res.data || [];
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
        ctx.body.data = res.data
    });

    //获取购物袋意愿清单
    app.router('getWishOrderListByUserId', async (ctx) => {
        ctx.body = {router:'getWishOrderListByUserId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnOrder
            .where({
                user_id:event.userId,
                order_state:'wish'
            })
            .orderBy('create_at', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data = res.data
    });

    //获取准备确认下单的意愿清单
    app.router('getNeedConfirmOrderListByUserId', async (ctx) => {
        ctx.body = {router:'getNeedConfirmOrderListByUserId',event,code: 0,message: 'success'};
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let res = await dbCmnOrder
            .where({
                user_id:event.userId,
                _id:_.in(event.orderIds),
                order_state:'wish'
            })
            .orderBy('create_at', 'desc')
            .skip(skipNum)
            .limit(pageSize)
            .get();
        ctx.body.data = res.data
    });

    //获取指定订单
    app.router('getOrderById', async (ctx) => {
        ctx.body = {router:'getOrderById',event,code: 0,message: 'success'};

        let res = await dbCmnOrder
            .doc(event.id)
            .get();
        ctx.body.data = res.data
    });

    //获取指定待付款订单
    app.router('getNeedPayOrderById', async (ctx) => {
        ctx.body = {router:'getNeedPayOrderById',event,code: 0,message: 'success'};

        let res = await dbCmnOrder
            .where({
                _id:event._id,
                order_state:'needPay'
            })
            .get();
        ctx.body.data = res.data[0]||{}
    });

    //获取产品可售列表
    app.router('getOnSaleProductList', async (ctx) => {
        ctx.body = { router:'getOnSaleProductList', code: 0, message: 'success' };
        let res = await dbCmnProduct
            .where(
                {
                    card_id: event.cardId,//名片关联产品
                    on_sale:true
                }
            )
            .orderBy('create_at', 'desc')
            .get();
        ctx.body.data = res.data
    });

    //获取动态点赞列表
    app.router('getTrendLikeList', async (ctx) => {
		ctx.body = {router:'getTrendLikeList',event,code: 0,message: 'success'};
        let skipNum = 0;
        let pSize = pageSize;
        if(event.pageSize){
            pSize = event.pageSize;
        }
        if (event.page > 1) {
            skipNum = (event.page - 1) * pSize;
        }
        let res = await dbCmnTrend
							.aggregate()
							.addFields({
								isLike: $.in([event.userId,'$likes_ids']),
								isFollow:false
							})
							.skip(skipNum)
							.limit(pageSize)
							.sort({ 'likes_num': -1 })
							.end();
        ctx.body.data = res.list;
    });

    //获取动态订单列表
    app.router('getTrendOrderList', async (ctx) => {
		ctx.body = { router:'getTrendOrderList', code: 0, message: 'success' };
        let skipNum = 0;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pageSize;
        }
        let trendId =  event.trendId || '0';
       	let res = await dbCmnOrder
							.where({
								trend_id: trendId
							})
							.skip(skipNum)
							.limit(pageSize)
							.orderBy('create_at', 'desc')
							.get();
		let orders = res.data;
		if (event.userId) {
			for (let i = 0; i < orders.length; i++) {
				//判断是否用于控制权限
				orders[i].isOwner = orders[i].user_id == event.userId;
				//判断是否用于商家控制权限
				orders[i].isSeller = orders[i].seller_id == event.userId;
			}
		}
		ctx.body.data = orders;
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
		ctx.body.data = res.data;
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
		ctx.body.data = res.data;
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
        ctx.body.data=commentList
    });

    //【--------------详情--------------】

    //根据Id获取详情
    app.router('getActivityDetail', async (ctx) => {
        ctx.body = {router:'getActivityDetail', code: 0, message: 'success' };
        let res = await dbCmnActivity.doc(event.id).get();
        ctx.body.data = res.data;
    });

    app.router('getActivityDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getActivityDetailByQrcode',code: 0, message: 'success' };
        let res = await dbCmnActivity.where({
            qrcode: event.qrcode
        }).get();
        ctx.body.data= res.data[0];
    });

    app.router('getProductDetail', async (ctx) => {
        ctx.body = {router:'getProductDetail', code: 0, message: 'success' };
        let res = await dbCmnProduct.doc(event.id).get();
        ctx.body.data = res.data;
    });

    app.router('getProductDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getProductDetailByQrcode',code: 0, message: 'success' };
        let res = await dbCmnProduct.where({
            qrcode: event.qrcode
        }).get();
        ctx.body.data= res.data[0];
    });

    app.router('getTrendDetail', async (ctx) => {
        ctx.body = {router:'getTrendDetail', code: 0, message: 'success' };
        let res = await dbCmnTrend.doc(event.id).get();
        ctx.body.data = res.data;
    });

    app.router('getTrendDetailByQrcode', async (ctx) => {
        ctx.body = { router:'getTrendDetailByQrcode',code: 0, message: 'success' };
        let res = await dbCmnTrend.where({
            qrcode: event.qrcode
        }).get();
        ctx.body.data= res.data[0];
    });


    //【--------------新增--------------】

    //发布一条动态
    app.router('addTrend', async (ctx) => {
        ctx.body = {router:'addTrend',event,code: 0,message: 'success'};
        let trend = event.trend||{};
        trend.create_at = new Date();
        const wxContext = cloud.getWXContext();
        trend._openid = wxContext.OPENID;
        if(trend.videos.length>0){
            const result = await cloud.getTempFileURL({
                fileList: [trend.videos[0]],
            });
            trend.video_temp_url = result.fileList[0].tempFileURL;
        }else if(trend.carousels.length>0 ){
            const result = await cloud.getTempFileURL({
                fileList: trend.carousels,
            });
            trend.img_urls = result.fileList;
        }

        let result = await dbCmnTrend.add({
            data:trend,
        });
        ctx.body._id = result._id;
    });

    // 生成动态二维码
    app.router('genTrendQrcode', async (ctx) => {
        ctx.body = { router:'genTrendQrcode',event,code: 0, message: 'success' };
        let scene = 'qrcode='+event.id.substr(0,23);
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
            await dbCmnTrend.doc(event.id).update({
                data:{
                    qrcode_info:qrcodeInfo,
                    qrcode:event.id.substr(0,23),
                }
            })
        } catch (err) {
            console.log(err)
        }
        ctx.body.data= qrcodeInfo;
    });

    // 生成活动二维码
    app.router('genActivityQrcode', async (ctx) => {
        ctx.body = { router:'genActivityQrcode',event,code: 0, message: 'success' };
        let scene = 'qrcode='+event.id.substr(0,23);
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
            await dbCmnActivity.doc(event.id).update({
                data:{
                    qrcode_info:qrcodeInfo,
                    qrcode:event.id.substr(0,23),
                }
            })
        } catch (err) {
            console.log(err)
        }
        ctx.body.data= qrcodeInfo;
    });

    // 生成产品二维码
    app.router('genProductQrcode', async (ctx) => {
        ctx.body = { router:'genProductQrcode',event,code: 0, message: 'success' };
        let scene = 'qrcode='+event.id.substr(0,23);
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
            await dbCmnProduct.doc(event.id).update({
                data:{
                    qrcode_info:qrcodeInfo,
                    qrcode:event.id.substr(0,23),
                }
            })
        } catch (err) {
            console.log(err)
        }
        ctx.body.data= qrcodeInfo;
    });

	//新增活动
    app.router('addActivity', async (ctx) => {
        ctx.body = {router:'addActivity', code: 0, message: 'success' };
        console.log('addActivity',event);
        let activity = event.activity;
        activity.create_at = new Date();

        //报名时间，签到时间处理
        let parseSignUpDate = activity.sign_up.date+' '+activity.sign_up.time;
        //第二个replace里，是' '，中间有个空格
        let time = (parseSignUpDate+':00').replace(/-/g,':').replace(' ',':').split(':');
        activity.sign_up.date_time = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);
        let parseSignInDate = activity.sign_in.date+' '+activity.sign_in.time;
        time = (parseSignInDate+':00').replace(/-/g,':').replace(' ',':').split(':');
        activity.sign_in.date_time = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);

        let res = await dbCmnActivity.add({data:activity});
        ctx.body._id = res._id;
    });
	
	//新增活动
	app.router('addProduct', async (ctx) => {
	    ctx.body = {router:'addProduct', code: 0, message: 'success' };
	    console.log('addProduct',event);
	    let product = event.product;
	    product.create_at = new Date();
	    let res = await dbCmnProduct.add({data:product});
	    ctx.body._id = res._id;
	});

    // 新增意愿订单
    app.router('addWishOrder', async (ctx) => {
        ctx.body = {router:'addWishOrder', code: 0, message: 'success' };
        let order = event.order||{_id:'',user_id:''};
        //查找状态为wish的当前用户订单，如果有相同订单，合并一处
        let res = await dbCmnOrder
            .where({
                user_id:order.user_id,
                order_state:'wish'
            }).get();
        let dbOrderList = res.data;
        // [wish]类型的订单;
        order.items.forEach(item=>{
            let isFind = false;
            for(let i in dbOrderList){
                if(isFind){break;}
                let dbOrder = dbOrderList[i];
                for(let j in dbOrder.items){
                    //找到
                    if(dbOrder.items[j].id==item.id){
                        //合并产品数量
                        item.num +=dbOrder.items[j].num;
                        //合并订单
                        order._id = dbOrder._id;
                        isFind = true;
                        break;
                    }
                }
            }
        });
        //合并愿望清单
        if (order._id && order._id.length>0){
            ctx.body._id=order._id;
            console.log('merge order._id',order._id);
            let orderId = order._id;
            delete order._id;
            await dbCmnOrder.doc(orderId).set({
                data: order
            });
        }
        //新增
        else{
            const wxContext = cloud.getWXContext();
            const orderNum='1' + randomStr.generate({ length: 5, charset: 'numeric' });
            order.order_num = orderNum;
            order._openid = wxContext.OPENID;
            res = await dbCmnOrder.add({
                data: order
            });
            console.log('new order._id',res._id);
            ctx.body._id=res._id;
        }
    });

	// 新增订单
	app.router('confirmOrder', async (ctx) => {
        ctx.body = {router:'confirmOrder', code: 0, message: 'success' };
        let order = event.order||{_id:'',user_id:''};
        let toUserOpenId ='';
        let goPageUrl = '/pagesSys/my/NeedPayOrder?id='+order._id;

        const wxContext = cloud.getWXContext();
        const orderNum='1' + randomStr.generate({ length: 5, charset: 'numeric' });
        order.order_num = orderNum;
        order._openid = wxContext.OPENID;
        order.create_at = new Date();
        //构建索引
        let searchKeys = [];
        order.items.forEach(item=>{
            searchKeys.push(item.title);
        });
        searchKeys.push(orderNum);
        searchKeys.push(order.recipient.phone);
        let search_str = searchKeys.join(',');
        let search_str_part1 = pinyin(search_str,{keepRest: true, firstCharacter:true,removeTone: true,removeSpace: true});
        let search_str_part2 = pinyin(search_str,{keepRest: true,removeTone: true,removeSpace: true});
        search_str = search_str_part1 + ' | ' + search_str_part2 + ' | ' + search_str;
        order.search_str = search_str;
        let res = await dbCmnOrder.add({
            data: order
        });
        ctx.body._id = res._id;
        let params ={
                touser:toUserOpenId,
                page:goPageUrl,
                bizName:order.name,
            };
        // 订单完成则通知下单人
        if(order.order_state=='needPay'){
            //发消息
            params.number=order.order_num;
            params.orderAt=new Date();
            params.user=order.recipient.name;
            params.address=order.recipient.address||'';
            params.remark=order.recipient.remark||'';

            await cloud.callFunction({
                name:'cmn',
                data:{
                    $url:'newOrderNotify',
                    param:params
                }
            })
        }

    });

    // 修改订单
    app.router('updateOrder', async (ctx) => {
        ctx.body = {router:'updateOrder', code: 0, message: 'success' };
        let order = event.order||{_id:''};
        // 更新
        order.update_at = new Date();
        let orderId = order._id;
        console.log('orderId',orderId,'order',order);
        delete order._id;
        await dbCmnOrder.doc(orderId).set({
            data: order
        });
    });

    // 订单付款
    app.router('payOrder', async (ctx) => {
        ctx.body = {router:'payOrder', code: 0, message: 'success' };
        let order = event.order||{_id:'',user_id:''};
        let toUserOpenId ='';
        let goPageUrl = '/pagesSys/my/WaitSendOrder?id='+order._id;

        // 更新
        order.pay_at = new Date();
        let orderId = order._id;
        delete order._id;
        await dbCmnOrder.doc(orderId).set({
            data: order
        });

        let params ={
            touser:toUserOpenId,
            page:goPageUrl,
            bizName:order.name,
        };
        // 订单完成则通知下单人
        if(order.order_state=='needPay'){
            //发消息
            params.status="待收货";
            params.content="您的订单已付款！";
            params.remark="备注";
            await cloud.callFunction({
                name:'cmn',
                data:{
                    $url:'orderConfirm',
                    param:params
                }
            })
        }
    });

    // 订单收货
    app.router('shippedOrder', async (ctx) => {
        ctx.body = {router:'shippedOrder', code: 0, message: 'success' };
        let order = event.order||{_id:'',user_id:''};
        let toUserOpenId ='';
        let goPageUrl = '/pagesSys/my/NeedReceiveOrder?id='+order._id;

        // 更新
        order.update_at = new Date();
        let orderId = order._id;
        delete order._id;
        await dbCmnOrder.doc(orderId).set({
            data: order
        });

        let params ={
            touser:toUserOpenId,
            page:goPageUrl,
            bizName:order.name,
        };
        // 订单完成则通知下单人
        if(order.order_state=='shipped'){
            //发消息
            params.status="待收货";
            params.content="您的订单已发货！";
            params.remark="备注";
            await cloud.callFunction({
                name:'cmn',
                data:{
                    $url:'orderConfirm',
                    param:params
                }
            })
        }
    });

    // 新增订单：来自动态推广、活动预定、产品购买
    app.router('ReturnOrSupportOrder', async (ctx) => {
        ctx.body = {router:'ReturnOrSupportOrder', code: 0, message: 'success' };
        let order = event.order||{_id:'',user_id:''};
        let toUserOpenId ='';
        let goPageUrl = '/pagesSys/my/NeedReturnOrSupportOrderOrder?id='+order._id;

        // 更新
        order.update_at = new Date();
        let orderId = order._id;
        delete order._id;
        await dbCmnOrder.doc(orderId).set({
            data: order
        });

        let params ={
            touser:toUserOpenId,
            page:goPageUrl,
            bizName:order.name,
        };
        // 订单完成则通知下单人
        if(order.order_state=='needReturnOrSupport'){
            //发消息
            params.status="已完成";
            params.content="您的订单已完成！";
            params.remark="备注";
            await cloud.callFunction({
                name:'cmn',
                data:{
                    $url:'orderConfirm',
                    param:params
                }
            })
        }
    });
	
    //动态点赞
    app.router('addTrendLike', async (ctx) => {
        ctx.body = {router:'addTrendLike',event,code: 0,message: 'success'};
        await dbCmnTrend.doc(event.id).update({
            data:{
                likes:_.push(event.like),
                likes_ids:_.push(event.like.user_id),
                likes_num:_.inc(1)
            }
        });
    });
	
	//动态评论点赞
	app.router('addComment', async (ctx) => {
	    ctx.body = {router:'addComment',event,code: 0,message: 'success'};
	    let res = await dbCmnComment.add({
	        data: event.comment
	    });
        ctx.body._id = res._id;
	});

    //动态评论点赞
    app.router('addCommentLike', async (ctx) => {
        ctx.body = {router:'addCommentLike',event,code: 0,message: 'success'};
        await dbCmnComment.doc(event.id).update({
            data: {
                likes: _.push(event.like),
                likes_ids:_.push(event.like.user_id),
                likes_num: _.inc(1)
            }
        });
    });

    //回复动态评论
    app.router('addCommentReply', async (ctx) => {
        ctx.body = {router:'addCommentReply',event,code: 0,message: 'success'};
        await dbCmnComment.doc(event.id).update({
            data: {
                replys: _.push(event.reply),
                replys_num: _.inc(1)
            }
        });
    });

    //新增动态评论回复点赞
    app.router('addCommentReplyLike', async (ctx) => {
        ctx.body = {router:'addCommentReplyLike',event,code: 0,message: 'success'};
        await dbCmnComment.doc(event.id).update({
            data: {
                'replys[0].likes': _.push(event.like),
                'replys[0].likes_num': _.inc(1)
            }
        });
    });

    //【--------------修改--------------】

    //更新活动
    app.router('updateActivity', async (ctx) => {
        ctx.body = {router:'updateActivity', code: 0, message: 'success' };
        console.log('updateActivity',event);
        let activity =event.activity;

        //报名时间，签到时间处理
        let parseSignUpDate = activity.sign_up.date+' '+activity.sign_up.time;
        //第二个replace里，是' '，中间有个空格
        let time = (parseSignUpDate+':00').replace(/-/g,':').replace(' ',':').split(':');
        activity.sign_up.date_time = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);
        let parseSignInDate = activity.sign_in.date+' '+activity.sign_in.time;
        time = (parseSignInDate+':00').replace(/-/g,':').replace(' ',':').split(':');
        activity.sign_in.date_time = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]);

        console.log('activity',activity);
        let currentId = activity._id;
        delete activity._id;
        dbCmnActivity.doc(currentId).set({
            data: activity,
        }).then((res)=>{
            console.log('update success',res)
        })
    });

	app.router('updateProduct', async (ctx) => {
        ctx.body = {router:'updateProduct', code: 0, message: 'success' };
		let product =event.product;
		//cloudPath替换
		let currentId = product._id;
		delete product._id;
		dbCmnProduct.doc(currentId).set({
		    data: product,
		}).then((res)=>{
		    console.log('update success',res)
		})
    });

    //同步动态评论计数
    app.router('updateCommentCount',async(ctx)=>{
		ctx.body = {router:'updateCommentCount', code: 0, message: 'success' };
        await dbCmnComment.where({
            _id: event.content._id
        }).remove();
        //同步评论计数减1
        await dbCmnTrend.doc(event.content.trend_id).update({
            data: {
                comments_num: _.inc(-1)
            }
        });
    });


	//【--------------删除--------------】
    //根据ID批量删除订单
    app.router('removeWishOrder', async (ctx) => {
        ctx.body = {router:'removeWishOrder',event,code: 0,message: 'success'};
        await dbCmnOrder.where({
            _id: _.in(event.orderIds)
        }).remove();
    });

    app.router('removeOrder', async (ctx) => {
        ctx.body = {router:'removeOrder',event,code: 0,message: 'success'};
        await dbCmnOrder.doc(event.id).remove();
    });

    //根据ID删除一条
    app.router('removeActivity', async (ctx) => {
		 ctx.body = {router:'removeActivity',event,code: 0,message: 'success'};
		await dbCmnActivity.where({
			_id: event.content._id
		}).remove();
    });

    app.router('removeProduct', async (ctx) => {
		ctx.body = {router:'removeProduct',event,code: 0,message: 'success'};
        await dbCmnProduct.where({
            _id: event.content._id
        }).remove();
    });

	app.router('removeTrend',async(ctx) =>{
		ctx.body = {router:'removeTrend',event,code: 0,message: 'success'};
		await dbCmnTrend.where({
			_id: event.content._id
		}).remove()
  });
  
    //动态取消点赞
    app.router('removeTrendLike', async (ctx) => {
        ctx.body = {router:'removeTrendLike',event,code: 0,message: 'success'};
        await dbCmnTrend.doc(event.id).update({
            data: {
                likes: _.pull({ user_id: _.eq(event.like.user_id)}),
                likes_ids: _.pull(event.like.user_id),
                likes_num: _.inc(-1)
            }
        });
    });

	app.router('removeComment', async (ctx) => {
		ctx.body = {router:'removeComment',event,code: 0,message: 'success'};
		let result = await dbCmnTrend.doc(event.id).update({
		  data: {
			comments_num: _.inc(-1)
		  }
		});
		await dbCmnComment.where({
			_id: event.content._id
		}).remove()
	});
	  
    //去掉动态评论点赞
    app.router('removeCommentLike', async (ctx) => {
        ctx.body = {router:'removeCommentLike',event,code: 0,message: 'success'};
        await dbCmnComment.doc(event.id).update({
            data: {
                likes: _.pull({ user_id: _.eq(event.like.user_id) }),
                likes_ids: _.pull(event.like.user_id),
                likes_num: _.inc(-1)
            }
        });
    });

    //删除动态评论回复
    app.router('removeCommentReply', async (ctx) => {
        ctx.body = {router:'removeCommentReply',event,code: 0,message: 'success'};
        await dbCmnComment.doc(event.id).update({
            data: {
                forwards: _.pull({ user_id: _.eq(event.forward.user_id) }),
                forwards_num: _.inc(-1)
            }
        });
        await dbCmnTrend.doc(event.trendId).update({
            data: {
                comments_num: _.inc(1)
            }
        });
    });

    //删除动态评论回复点赞
    app.router('removeCommentReplyLike', async (ctx) => {
        ctx.body = {router:'removeCommentReplyLike',event,code: 0,message: 'success'};
        await dbCmnComment.doc(event.id).update({
            data: {
                'replys.likes': _.pull({ user_id: _.eq(event.like.user_id) }),
                'replys.likes_num': _.inc(-1)
            }
        });
    });

	//【--------------状态--------------】

    //根据ID设定状态
    app.router('setActivityStatus', async (ctx) => {
		ctx.body = {router:'setActivityStatus',event,code: 0,message: 'success'};
        await dbCmnActivity.doc(event.id).update({
            data:{
                is_open:event.is_open
            }
        })
    });

    app.router('setProductStatus', async (ctx) => {
		ctx.body = {router:'setProductStatus',event,code: 0,message: 'success'};
        await dbCmnProduct.doc(event.id).update({
            data:{
                is_open:event.is_open
            }
        })
    });

	app.router('switchComments',async(ctx) =>{
		ctx.body = {router:'switchComments',event,code: 0,message: 'success'};
		let result = await dbCmnTrend.doc(event.id).update({
		  data:{
			is_open_commentList:event.isOpenComments
		  }
		})
	});

    //修改状态为已完成
    app.router('confirmOrder', async (ctx) => {
		ctx.body = {router:'confirmOrder',event,code: 0,message: 'success'};
        await dbCmnOrder.doc(event.id).update({
            data:{
                is_finished:event.is_finished
            }
        })
    });

    //更新评论记录条数
    app.router('commentCount', async (ctx) => {
        ctx.body = {router:'commentCount', code: 0, message: 'success' };
        if(event.type=='sum'){
            await dbCmnComment
					.where({
						trend_id: event.trendId
					}).get();
			let commentList = res.data;
			ctx.body.data=commentList.length;
        }else if(event.type=='inc'){
            await dbCmnTrend.doc(event.trendId).update({
                data: {
                    comments_num: _.inc(1)
                }
            })
        }else if(event.type=='dec'){
            await dbCmnTrend.doc(event.trendId).update({
                data: {
                    comments_num: _.inc(-1)
                }
            })
        }
    });
	
	app.router('newOrderNotify', async (ctx) => {
	   ctx.body = {router:'newOrderNotify', code: 0, message: 'success' };
		let  params = event.param;
		console.log(params);
	 try {
		  let now = new Date;
		  let nowTime = now.getHours()+":"+now.getMinutes();
	     const result = await cloud.openapi.subscribeMessage.send({
				touser: params.touser,
				page:params.page,
				data:{
					character_string4: {
						value: params.number
					},
					time3: {
						value: nowTime
					},
					thing1: {
						value: params.user
					},
					thing2:{
						value:params.address||'未填写'
					},
					thing6: {
						value: params.remark||'未填写'
					}
				},
				templateId:"SBvuQn9sqim9sqJnHs9ShmNaahCusc8q_OV4DFhC8w8"
	       });
			ctx.body.code = result.errCode;
			ctx.body.data = result;
	   } catch (err) {
	     ctx.body.code = 1;
		  ctx.body.data=err;
		  
	   }
	 });
	app.router('orderConfirm', async (ctx) => {
	  ctx.body = {router:'orderConfirm', code: 0, message: 'success' };
	
			let  params = event.param;
			console.log(params);
	try {
	    const result = await cloud.openapi.subscribeMessage.send({
				touser: params.touser,
				page:params.page,
				data:{
					thing1: {
						value: params.status
					},
					thing2: {
						value: params.content
					},
					name3: {
						value: params.bizName
					},
					thing4:{
						value:params.remark
					}
				},
				templateId:"njsMMfSLKmfzTXV5Y7_HHz5GoyTzA6k54PS1if8qyWE"
	      });
			ctx.body.code = result.errCode;
			ctx.body.data = result;
	  } catch (err) {
	    ctx.body.code = 1;
		  ctx.body.data=err;
		  
	  }
	});
	
	app.router('msgNotify', async (ctx) => {
	  ctx.body = { router:'msgNotify',event,code: 0, message: 'success' };
		let params = {
			touser:'oVg784iBth1G5xDX3NZYnaZbUHSI',
			page:'/pages/my/home',
			sender:'系统通知',
			content:'你有多条未读消息，请查看',
			sendDate:new Date(),
			msgType:"系统消息"
		};
			console.log(params);
	try {
	    const result = await cloud.openapi.subscribeMessage.send({
				touser: params.touser,
				page:params.page,
				data:{
					name1: {
						value: params.sender
					},
					thing2: {
						value: params.content
					},
					date3: {
						value: params.sendDate
					},
					phrase4:{
						value:params.msgType
					}
				},
				templateId:"wMtLCWXeyiVqZS4kjQJ1eQDDF7qzoES2jGhHe-OXFSc"
	      });
			ctx.body.code = result.errCode;
			ctx.body.data = result;
	  } catch (err) {
	    ctx.body.code = 1;
		  ctx.body.data=err;
		  
	  }
	}); 
	
	//【--------------统计--------------】
	
	// 获取当前人的统计信息
	app.router('getSum', async (ctx) => {
		ctx.body = { router:'getSum',event,code: 0, message: 'success' };
	    let accountSum={
            newMsgNum: 0,
            wishOrderNum: 0,
            totalOrderNum: 0,
	    };
	
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
        let total = 0;
	    if(res.data.length>0){
            total=res.data[0].source_unread;
	    }
        accountSum.newMsgNum=total;
	
	    res = await dbCmnOrder.where({
	        user_id:event.userId,
            order_state:'wish'
	    }).count();
	    accountSum.wishOrderNum=res.total;
	
	    res = await dbCmnOrder.where({
	        user_id:event.userId,
            //待付款、已取消、待发货、待收货、退款或售后
            order_state:_.in(['needPay','canceled','needSend','shipped','finished'])
	    }).count();
	    accountSum.totalOrderNum=res.total;
	    ctx.body.data = accountSum;
	});

	//【--------------测试脚本--------------】
    

    return app.serve();
};


//【--------------公共函数--------------】
