function isEmpty(a){
    if (a === "") return true; //检验空字符串
    if (a === "null") return true; //检验字符串类型的null
    if (a === "undefined") return true; //检验字符串类型的 undefined
    if (!a && a !== 0 && a !=="") return true; //检验 undefined 和 null
    if (Array.prototype.isPrototypeOf(a) && a.length === 0 ) return true; //检验空数组
    if (Object.prototype.isPrototypeOf(a) && Object.keys(a).length === 0 ) return true;  //检验空对象
    return false;
}

function dateFormat (date, format) {
    if (!date) return;
    if (!format)
        format = "yyyy-MM-dd";
    switch (typeof date) {
        case "string":
            date = new Date(date.replace(/-/, "/"));
            break;
        case "number":
            date = new Date(date);
            break;
    }
    if (!date instanceof Date) return;
    var dict = {
        "yyyy" : date.getFullYear(),
        "M" : date.getMonth() + 1,
        "d" : date.getDate(),
        "H" : date.getHours(),
        "m" : date.getMinutes(),
        "s" : date.getSeconds(),
        "MM" : ("" + (date.getMonth() + 101)).substr(1),
        "dd" : ("" + (date.getDate() + 100)).substr(1),
        "HH" : ("" + (date.getHours() + 100)).substr(1),
        "mm" : ("" + (date.getMinutes() + 100)).substr(1),
        "ss" : ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
        return dict[arguments[0]];
    });
}
function today(){
    return(this.dateFormat(new Date(),'yyyyMMdd'))
}
function formatTime (date, format) {
    if (!date) return;
    if (!format)
        format = "yyyy-MM-dd";
    switch (typeof date) {
        case "string":
            date = new Date(date);
            break;
        case "number":
            date = new Date(date);
            break;
    }
    if (!date instanceof Date) return;
    var dict = {
        "yyyy" : date.getFullYear(),
        "M" : date.getMonth() + 1,
        "d" : date.getDate(),
        "H" : date.getHours(),
        "m" : date.getMinutes(),
        "s" : date.getSeconds(),
        "MM" : ("" + (date.getMonth() + 101)).substr(1),
        "dd" : ("" + (date.getDate() + 100)).substr(1),
        "HH" : ("" + (date.getHours() + 100)).substr(1),
        "mm" : ("" + (date.getMinutes() + 100)).substr(1),
        "ss" : ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
        return dict[arguments[0]];
    });
}

/** 比较日期  如果d1<d2 返回true d1>=d2返回false
 * @param {Object} d1
 * @param {Object} d2
 */
 
function isDayBefore(d1,d2){
	let ret=false;
	let v1= Date.parse(d1)
	let v2 = Date.parse(d2)
	let v3 = new Date(v2).setHours(0,0,0,0)
	if(v1<v3){
		ret=true;
	}
	return ret;
}
/** 比较时间 如果t1<t2 返回true  t1>t2返回false
 * @param {Object} t1
 * @param {Object} t2
 */
function isTimeBefore(t1,t2){
	let ret=false;
	let v1= Date.parse(t1)
	let v2 = Date.parse(t2)
	if(v1<v2){
		ret=true;
	}
	return ret;
}

function formatCreateTime(createAt){
	if(createAt){
		let valueTime= Date.parse(createAt)
		var newData =  Date.parse(new Date());
		var diffTime = Math.abs(newData-valueTime);
		if (diffTime > 7 * 24 * 3600 * 1000) {
			  var date = new Date(valueTime);
			  var y = date.getFullYear();
			  var m = date.getMonth() + 1;
			  var d = date.getDate();
			  let cy=new Date().getFullYear();
			  
			  return cy==y?m + '月' + d +'日':y+'年'+ m + '月' + d +'日';
		
		} else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
		  // //注释("一周之内");
	
		  // var time = newData - diffTime;
		  var dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000));
		  return dayNum + "天前";
	
		} else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
		  // //注释("一天之内");
		  // var time = newData - diffTime;
		  var dayNum = Math.floor(diffTime / (60 * 60 * 1000));
		  return dayNum + "小时前";
	
		} else if (diffTime < 3600 * 1000 && diffTime >= 0) {
		  return '刚刚'
		}
	}
};
function isPhoneAvailable(phoneNum) {
	let myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;
	if (!myreg.test(phoneNum) || phoneNum.length!=11 ) {
		return false;
	} else {
		return true;
	}
};

function cloudUploadPath(){
	let date = new Date()
	let p = 'user/'+ date.getFullYear() + ("" + (date.getMonth() + 101)).substr(1) +'/';
	return p;
};

function getDateDiff(dateTimeStamp){
    var date = "";
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if(diffValue < 0){return;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
        date="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
        date="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        date=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        date=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
        date=""+ parseInt(minC) +"分钟前";
    }else
        date="刚刚";
    return date;
}

module.exports = {
    isEmpty,
    dateFormat,
    today,
    formatTime,
	isDayBefore:isDayBefore,
	isTimeBefore:isTimeBefore,
	formatCreateTime:formatCreateTime,
	isPhoneAvailable:isPhoneAvailable,
	cloudUploadPath,
    getDateDiff,
}