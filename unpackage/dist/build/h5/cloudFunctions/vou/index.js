const cloud = require('wx-server-sdk');
const tcbRouter = require('tcb-router');
cloud.init({
                env:"fs-2021-0ga2fi4lf4529d85",
                traceUser:true
            });
const randomStr = require("randomstring");

const wxContext = cloud.getWXContext();
const openId = wxContext.OPENID;
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
const pageSize = 10;

//【--------------定义数据库表--------------】
const dbVoucher = db.collection('voucher');
const dbVouActivity = db.collection('vou_activity');
const dbVouEntry = db.collection('vou_entry');
const dbVouTemplate = db.collection('vou_template');

//【--------------公共函数--------------】



//【--------------云函数入口--------------】
exports.main = async (event, context) => {
    const app = new tcbRouter({ event });

    //【--------------列表--------------】

    //获取优惠券列表
    app.router('getVoucherList', async (ctx) => {
		ctx.body = {router:'getVoucherList', code: 0, message: 'success' }
        let skipNum = 0;
        let pSize = event.pageSize||pageSize;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pSize;
        }
        let vouchers = [];
        let res = {};
        //查询指定用户的指定商务名片的数据；适用于客户查看自己在名片下的券
        if(event.cardId && event.userId){
            res = await dbVoucher.where({
                user_id:event.userId,
                card_id:event.cardId,
                status:event.status
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
                vouchers = res.data;
        }
        //券活动下所有分配的券列表
        else if(event.activityId){
            res = await dbVoucher.where({
                activity_id:event.activityId,
                status:event.status
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
                vouchers = res.data;
        }
        //查询指定用户的所有券列表
        else if(event.userId){
            res = await dbVoucher.where({
                user_id:event.userId,
                status:event.status
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
                vouchers = res.data;
        }
        ctx.body.data = vouchers
    });

    //获取核销列表
    app.router('getWriteOffList', async (ctx) => {
		ctx.body = {router:'getWriteOffList', code: 0, message: 'success' };
        let skipNum = 0;
        let pSize = event.pageSize||pageSize;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pSize;
        }
        let vouchers = [];
        //查询指定入口的数据；
        if(event.entryId){
            await dbVoucher.where({
                entry_id:event.entryId,
                status:'USED'
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get().then((res) => {
                    vouchers = res.data;
                });
        }
        ctx.body.data = vouchers
    });

    app.router('getActivityList', async (ctx) => {
		ctx.body = {router:'getActivityList', code: 0, message: 'success' };
        let skipNum = 0;
        let pSize = event.pageSize||pageSize;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pSize;
        }
        let activity = [];
        let res ={};
        if(event.cardId && event.userId){
            res = await dbVouActivity.where({
                card_id:event.cardId,
                user_id:event.userId,
                status:event.status
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
            activity = res.data;
        }
        else if(event.cardId){
            res = await dbVouActivity.where({
                card_id:event.cardId,
                status:event.status
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
            activity = res.data;
        }
        ctx.body.data = activity
    });

    app.router('getEntryList', async (ctx) => {
		ctx.body = {router:'getEntryList', code: 0, message: 'success' }
        let skipNum = 0;
        let pSize = event.pageSize||pageSize;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pSize;
        }
        let entries = [];
        let res = {};
        //用户权限过滤
        if(event.cardId && event.userId) {
            res = await dbVouEntry.where({
                user_id: event.userId,
                card_id: event.cardId,
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
            entries = res.data;
        }
        //根据企业名片过滤
        else if(event.cardId){
            res = await dbVouEntry.where({
                card_id: event.cardId
            })
                .skip(skipNum)
                .limit(pSize)
                .orderBy('create_at', 'desc')
                .get();
            entries = res.data;
        }
        ctx.body.data = entries
    });

    app.router('getTemplateList', async (ctx) => {
		ctx.body = {router:'getTemplateList', code: 0, message: 'success' }
        let skipNum = 0;
        let pSize = event.pageSize||pageSize;
        if (event.page > 1) {
            skipNum = (event.page - 1) * pSize;
        }
        let res = await dbTemplates
            .skip(skipNum)
            .limit(pSize)
            .orderBy('create_at', 'desc')
            .get();
        ctx.body.data = res.data;
    });

    //【--------------详情--------------】

    app.router('getVoucherDetail', async (ctx) => {
        ctx.body = {router:'getVoucherDetail', code: 0, message: 'success' }
        let res =await dbVoucher.doc(event.id).get();
        let voucher = res.data;
        let cover = voucher.cover||'';
        //转换http cover链接
        if(cover.indexOf('cloud://')>=0){
            const result = await cloud.getTempFileURL({ fileList: [cover],});
            console.log('fileList',result.fileList);
            voucher.cover = result.fileList[0].tempFileURL;
        }
        ctx.body.data = voucher
    });

    app.router('getActivityDetail', async (ctx) => {
        ctx.body = {router:'getActivityDetail', code: 0, message: 'success' }
        let res =await dbVouActivity.doc(event.id).get();
        let activity = res.data;
        //转换http cover链接
        let cover = activity.cover||'';
        if(cover.indexOf('cloud://')>=0){
            const result = await cloud.getTempFileURL({ fileList: [cover],});
            console.log('fileList',result.fileList);
            activity.cover = result.fileList[0].tempFileURL;
        }
        ctx.body.data = activity
    });

    app.router('getEntryDetail', async (ctx) => {
        ctx.body = {router:'getEntryDetail', code: 0, message: 'success' }
        let res =await dbVouEntry.doc(event.id).get();
        let entry = res.data;
        ctx.body.data = entry
    });

    app.router('getEntryDetailByNumber', async (ctx) => {
        ctx.body = {router:'getEntryDetailByNumber', code: 0, message: 'success' }
        let res =await dbVouEntry.where({
            number:event.number
        }).get();
        let entries = res.data;
        ctx.body.data = entries[0];
    });

    app.router('getTemplateDetail', async (ctx) => {
        ctx.body = {router:'getTemplateDetail', code: 0, message: 'success' }
        let res =await dbVouTemplate.doc(event.id).get();
        ctx.body.data = res.data;
    });

    //【--------------保存--------------】

    //更新或新增优惠券
    app.router('saveVoucher', async (ctx) => {
        ctx.body = {router:'saveVoucher', code: 0,message: 'success'};
        let voucher = {};
        voucher = event.voucher;
        voucher.create_at = new Date();
        voucher._openid = openId;
        let result = {};
        if(voucher._id){
            let tempId = voucher._id;
            delete voucher._id;
            result = await dbVoucher.doc(tempId).update({
                data:voucher
            })
            ctx.body.data=voucher
        }
        //新增
        else{
            result = await dbVoucher.add({
                data:voucher,
            });
        }

        ctx.body.data = result._id;
    });

    //更新活动
    app.router('saveActivity', async (ctx) => {
        ctx.body = {router:'saveActivity', code: 0,message: 'success'};
        let activity = {};
        activity = event.activity;
        activity.create_at = new Date();
        activity._openid = openId;
        let result = {};
        if(activity._id){
            let tempId = activity._id;
            delete activity._id;
            result = await dbVouActivity.doc(tempId).update({
                data:activity
            });
            ctx.body.data=activity 
        }
        //新增
        else{
            result = await dbVouActivity.add({
                data:activity
            });
            ctx.body.data = result._id;
        }
    });


    //更新核销入口名称
    app.router('updateEntryName', async (ctx) => {
        ctx.body = {router:'updateEntryName', code: 0,message: 'success'};
        let res = await dbVouActivity.doc(event.id).update({
            data:{
                name:event.name
            }
        });
        ctx.body.data=res
    });

    //保存：新增或更新入口
    app.router('saveEntry', async (ctx) => {
        ctx.body = {router:'saveEntry', code: 0,message: 'success'};
        let entry = {};
        entry = event.entry;
        entry.create_at = new Date();
        entry._openid = openId;
        let result = {};
        if(entry._id){
            let tempId = entry._id;
            delete entry._id;
            result = await dbVouEntry.doc(tempId).update({
                data:entry
            });
            ctx.body.data = entry;
        }
        //新增
        else{
            result = await dbVouEntry.add({
                data:entry,
            });
        }
        ctx.body.data = result._id;
    });

    //保存模版
    app.router('saveTemplate', async (ctx) => {
        ctx.body = {router:'saveTemplate', code: 0,message: 'success'};
        let template = {};
        template = event.template;
        template.create_at = new Date();
        template._openid = openId;
        let result = {};
        if(event.optType='edit'){

        }
        //新增
        else{
            result = await dbVouTemplate.add({
                data:template,
            });
        }

        ctx.body.data = result._id;
    });

    //【--------------删除--------------】

    app.router('removeVoucher',async(ctx) =>{
		ctx.body = {router:'removeVoucher', code: 0,message: 'success'};
        await dbVoucher.doc(event.id).remove();
        ctx.body = {
            code: 0,
            message: 'success'
        }
    });

    app.router('removeActivity',async(ctx) =>{
        ctx.body = {router:'removeActivity', code: 0,message: 'success'};
        await dbVouActivity.doc(event.id).remove();
    });

    //删除
    app.router('removeEntry',async(ctx) =>{
        ctx.body = {router:'removeEntry', code: 0,message: 'success'};
        await dbVouEntry.doc(event.id).remove();
    });

    app.router('removeTemplate',async(ctx) =>{
        ctx.body = {router:'removeTemplate', code: 0,message: 'success'};
        await dbVouTemplate.doc(event.templateId).remove();
    });

    //【--------------状态--------------】

    //更新核销券记录
    app.router('writeOffVoucher', async (ctx) => {
        ctx.body = {router:'writeOffVoucher', code: 0,message: 'success'};
        let leftVouchers = event.leftVouchers||[];
        let writeOffVouchers = event.writeOffVouchers||[];
        let endVouchers = event.endVouchers||[];
        //1、更新剩余券记录
        if(leftVouchers.length>0){
            leftVouchers.forEach(eachUpdate=>{
                let tempId = eachUpdate._id;
                delete eachUpdate._id;
                eachUpdate.status='TO_BE_USE';
                dbVoucher.doc(tempId).update({ data:eachUpdate });
            });
        }
        //2、更新核销券记录
        if(writeOffVouchers.length>0){
            writeOffVouchers.forEach(eachNew=>{
                if(eachNew._id){
                    delete eachNew._id;
                    eachNew.status='USED';
                    eachNew.create_at = new Date();
                    dbVoucher.add({ data:eachNew });
                }
            });
        }
        //3、删除用光的券记录
        if(endVouchers){
            endVouchers.forEach(eachDelete=>{
                dbVoucher.doc(eachDelete._id).remove();
            });
        }
    });


    //锁定活动记录
    app.router('lockedActivity', async (ctx) => {
        ctx.body = {router:'lockedActivity', code: 0,message: 'success'};
        let activity = event.activity ||{};
        let result = {};
        if(activity._id){
            let tempId = activity._id;
            delete activity._id;
            result = await dbVouActivity.doc(tempId).update({
                data:activity
            });
            ctx.body.data = result 
        }
    });

    //解锁活动记录
    app.router('unlockActivity', async (ctx) => {
        ctx.body = {router:'unlockActivity', code: 0,message: 'success'};
        let res = await dbVouActivity.doc(event.id).update({
            data:{
                tx_locked:false
            }
        });
        ctx.body.data = res 
    });

    //生成入口二维码
    app.router('genEntryQrCode', async (ctx) => {
		ctx.body = {router:'genEntryQrCode', code: 0,message: 'success'};
        let qrRes = await cloud.callFunction({
            name:'cmn-openapi',
            data:{
                $url:'genQrcode',
                scene:'number='+event.number,
                page:'pagesVoucher/vou-customers/CustomerVoucherList',
                width:430,
            }
        });
        await dbVouEntry.doc(event.id).update({
            data:{
                qrcode_info:qrRes.result.data,
                number:event.number
            }
        });
        ctx.body.data=qrRes.result.data

    });

    return app.serve();
};