/* eslint-disable */
/*!
 * Gome Smart Super App Library v3.1.1
 *
 * Date: 2016-11-1
 */
(function (global, factory) {

    /*!
     * 判断是否使用module.exports引入
     * 如果不使用则将GS，开放到全局
     *
     */
    if (typeof module === "object" && typeof module.exports === "object") {

        module.exports = global.document ?
            factory(global, true) :
            function (w) {

                if (!w.document) {

                    throw new Error("This sdk requires a window with a document");

                }

                return factory(w);

            };

    } else {

        factory(global);

    }

// Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
// api 路径
    var timer1=null;
    var apis = {
        "server": {
            "addTiming": {
                "path": "/v1/app/timertask/add",
                "type": "post"
            },
            "modifyTiming": {
                "path": "/v1/app/timertask",
                "type": "put"
            },
            "getTiming": {
                "path": "/v1/app/timertasks",
                "type": "get"
            },
            "removeTiming": {
                "path": "/v1/app/timertask",
                "type": "delete"
            },
            "getHistory": {
                "path": "/data/penetrate",
                "type": "post"
            },
            "getBanners": {
                "path": "/html/banner",
                "type": "post"
            },
            "btDeviceInfo": {
                "path": "/device/special/nobind",
                "type": "post"
            },
            "uploadBTData": {
                "path": "/data/penetrate",
                "type": "post"
            },
            "electricityDay": {
                "path": "/v4/gs/deviceElectricReport/day",
                "type": "post"
            },
            "electricityWeek": {
                "path": "/v4/gs/deviceElectricReport/week",
                "type": "post"
            },
            "electricityMonth": {
                "path": "/v4/gs/deviceElectricReport/month",
                "type": "post"
            },
            "electricityYear": {
                "path": "/v4/gs/deviceElectricReport/year",
                "type": "post"
            },
            "electricitySummary": {
                "path": "/v4/gs/deviceElectricReport/summary",
                "type": "post"
            }
        },

        "native": {

            "common": {},

            "android": {},

            "ios": {}


        }

    }
    var timer=null;
    var errors = {
        "0000": "操作成功",
        "9895": "您今天已经签到过了",
        "9953": "设备控制失败",
        "9969": "您的设置与已有的定时冲突，请重新设置",
        "9977": "请重新登录",
        "9978": "用户已无操作该设备的权限",
        "9984": "该设备不是本公司产品",
        "9899": "服务器错误",
        "9992": "该设备不可用",
        "9993": "参数含有null值或空值",
        "9994": "参数格式错误",
        "9995": "参数长度不符合要求",
        "9996": "参数缺少",
        "9999": "未知错误",
        "10000": "解析数据失败",
        "10001": "设备未初始化",
        "10002": "网络调用失败",
        "10003": "网络调用失败",
        "107": "系统繁忙,请稍后重试"
    }

    // var phoneType = window.location.hash.slice(1).split('/')[0] || 'pc';
    var phoneType = true
    var reqTextNode, resTextNode, reportTextNode;
    var request = (function () {
        var callbackStack = {};
        var i = 1;
        if (phoneType) {
            window.jsCallback = function (data, callback) {
                if (typeof callbackStack[callback] == 'function') {
                    if (data == '') {
                        callbackStack[callback]({
                            errorCode: 10003,
                            errorMessage: '网络调用失败'
                        });
                        callbackStack[callback] = null;
                    } else {
                        var res = typeof data == 'string' ? JSON.parse(data) : data;
                        if (res.opstate === '0001' || res["code"] === 0 || res["code"] === '0') {
                            callbackStack[callback](null, res);
                            callbackStack[callback] = null;
                        } else {
                            callbackStack[callback]({
                                errorCode: res.msg,
                                errorMessage: errors[res.msg] || '未知错误',
                                code: res.code
                            });
                            callbackStack[callback] = null;
                        }
                    }
                }
            }

            return function requestWithNative(operate, subPath, data, callback) {

                var api = apis.server[operate];
                var path = (api ? api.path : "") + (subPath==null ? "" : subPath);
                var type = api ? api.type : operate;
                var cbId = 'cbId' + (i++) + Date.now();
                // console.log("operate=" + operate + ", path="+path);
                callbackStack[cbId] = callback;
                setTimeout(function(){
                    window.location = 'js-call:jsCallServer:' + encodeURIComponent(JSON.stringify({
                        path: path,
                        callback: cbId,
                        type: type,
                        did: deviceId,
                        data: JSON.stringify(data)
                    }));    
                }, 0)
            }
        } else {
            reqTextNode = document.createElement('textarea');
            reqTextNode.hidden = true;
            reqTextNode.id = 'gsqtn';
            document.body.appendChild(reqTextNode);

            resTextNode = document.createElement('textarea');
            resTextNode.hidden = true;
            resTextNode.id = 'gsstn';
            document.body.appendChild(resTextNode);

            reportTextNode = document.createElement('textarea');
            reportTextNode.hidden = true;
            reportTextNode.id = 'gsptn';
            document.body.appendChild(reportTextNode);

            // 发起请求
            return function requestWithPlugin(operate, data, callback) {

                // // 获取路径
                var api = apis.server[operate];
                if (!api) return
                var path = api.path;
                var cbId = 'cbId' + (i++) + Date.now();
                var reqData = {

                    cbId: cbId,
                    path: path,
                    data: data

                };
                if (reqTextNode.value == '') {

                    reqTextNode.value = JSON.stringify([reqData]);

                } else {

                    var reqArray = JSON.parse(reqTextNode.value);
                    reqArray.push(reqData)
                    reqTextNode.value = JSON.stringify(reqArray);

                }

                callbackStack[cbId] = {};
                callbackStack[cbId].callback = callback;
                callbackStack[cbId].interval = setInterval(function () {

                    if (resTextNode.value != '') {

                        var msg = resTextNode.value;
                        resTextNode.value = '';

                        var resArray = JSON.parse(msg);
                        resArray.forEach(function (resStr) {

                            var response = JSON.parse(resStr);
                            var cbId = response.cbId;
                            if (!!callbackStack[cbId]) {

                                clearInterval(callbackStack[cbId].interval);
                                var callback = callbackStack[cbId].callback;
                                callbackStack[cbId] = null;
                                var error = response.error;
                                var res = response.res;
                                if (error) {
                                    // 出错时返回错误
                                    typeof callback === 'function' && callback(res);
                                } else {
                                    if (res.opstate === '0001') {
                                        typeof callback === 'function' && callback(null, res);
                                    } else {
                                        typeof callback === 'function' && callback({

                                            errorCode: res.msg,
                                            errorMessage: errors[res.msg] || '未知错误'
                                        });
                                    }
                                }
                            }
                        });
                    }
                }, 300);
            }
        }

    })()

// 校验回调函数
    function checkCallback(callback) {
        if (typeof callback !== 'function') {
            if (typeof callback === 'undefined') {
                console.warn('没有传入回调函数');
            } else {
                console.error('callback应该为回调函数');
            }
        }
    }

    // 版本号比较
    function compareVersion (curV, reqV) {
      if (curV && reqV) {
        // 将两个版本号拆成数字
        var arr1 = curV.split('.')
        var arr2 = reqV.split('.')
        var minLength = Math.min(arr1.length, arr2.length)
        var position = 0
        var diff = 0
        // 依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
        while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) === 0)) {
          position++
        }
        diff = (diff !== 0) ? diff : (arr1.length - arr2.length)
        // 若curV大于reqV，则返回true
        return diff > 0
      } else {
        // 输入为空
        console.log('版本号不能为空')
        return false
      }
    }

    var deviceId = "";
    window.setDid = function (id) {
        console.log(id);
        deviceId = id;
        setTimeout(function(){
            window.location = 'js-call:jsQuery:' + encodeURIComponent(JSON.stringify({
                "did": deviceId
            }));
        }, 0)
        GS.Device.prototype.did = id
    };

    window.setGid = function (id) {
        GS.Device.prototype.gid = id
    }
    var GS = {};
    //标识设备信息是否加载过
    var isLoaded = false;
// 设备构造方法
    GS.Device = function () {
    }

    GS.Device.prototype = {
        /*!
         * 获取设备历史数据
         * @param  {Array}   dvids     要查询的状态指令值
         * @param  {String}   start     时间戳
         * @param  {String}   end       结束时间的时间戳
         * @param  {Int}   startPage 开始的页数
         * @param  {Int}   pageSize  每页的条数
         * @param  {Function} callback  回调函数
         * @return undefined
         */
        getHistoryData: function (dvids, start, end, startPage, pageSize, callback) {
            checkCallback(callback);
            var dvidStr;
            if (Array.isArray(dvids)) {
                if (dvids.length === 0) {
                    console.error('请提供至少一个状态的dvid');
                    return;
                }
                dvidStr = dvids.join(',')

            } else {
                if (isNaN(dvids)) {
                    console.error('dvids不合法');
                    return;
                } else {
                    dvidStr = '' + dvids;
                }
            }
            var data = {
                pageSize: pageSize,
                startPage: startPage,
                start: start,
                end: end,
                dvids: dvidStr
            }
            var reqData = {
                name: 'gomeHistorydata',
                json: data
            }
            request("getHistory", reqData, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null, JSON.parse(res.json).data);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },
        /*!
         * 上传设备历史数据
         * @param  {Array}   data     数据
         * @param  {Function} callback 上传的回调函数
         * @return undefined
         */
        uploadHistoryData: function (data, callback) {
            request("uploadBTData", data, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },
        /*!
         * 获取设备历史属性
         * @param  {String}   period   历史数据的时间区间 {day, week, month, year}
         * @param  {Array}    dvids    查询状态的dvid
         * @param  {String}   date     日期
         * @param  {String}   type     类型 {sum, average}
         * @param  {Function} callback 回调函数
         * @return undefined
         */
        getStatisticData: function (period, dvids, date, type, callback) {
            checkCallback(callback);
            if (['day', 'week', 'month', 'year'].indexOf(period) === -1) {
                console.error('period应为day,week,month,year中的一种');
                return;
            }
            var dvidStr;
            if (Array.isArray(dvids)) {
                if (dvids.length === 0) {
                    console.error('请提供至少一个状态的dvid');
                    return;
                }
                dvidStr = dvids.join(',')
            } else {
                if (isNaN(dvids)) {
                    console.error('dvids不合法');
                    return;
                } else {
                    dvidStr = '' + dvids;
                }
            }
            if (['sum', 'average', 'raise'].indexOf(type) === -1) {
                console.error('type应为sum,average,raise中的一种');
                return;
            }
            var data = {
                period: period,
                dvids: dvidStr,
                date: date,
                type: type
            }
            var reqData = {
                name: 'gomeStatistic',
                json: data
            }
            request("getHistory", reqData, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null, JSON.parse(res.json));
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },
        /*!
         * 上传设备历史数据
         * @param  {Array}   data     数据
         * @param  {Function} callback 上传的回调函数
         * @return undefined
         */
        uploadStatisticData: function (data, callback) {
            request("uploadBTData", data, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },
        /**
         * 添加定时
         * @param as {Array}  定时任务触发的功能属性
         * @param values {Array}  定时任务触发的功能属性对应的值
         * @param type 定时任务类型，1为周期性的，2为一次性的
         * @param period type=1时必须传入，表示周几执行，传入十进制整数，转换成七位0/1数字表示,如1010101
         * @param time 表示任务执行时间点距离零点零分零秒的秒数，比如00:01:01则传入61
         * @param enable 定时任务是否开启，1-开启
         * @param callback {Function} callback 回调函数
         * @param note 定时任务说明、备注
         */
        addTimer: function (as, values, type, period, time, enable, callback, note) {
            if (!Array.isArray(as) || !Array.isArray(values) || as.length != values.length) {
                console.error('timers 参数有误');
                return;
            }
            checkCallback(callback);
            var str = {cmd: "opt", to: deviceId, as: {}};
            for (var i=0; i< as.length; i++) {
                str.as[as[i]] = values[i]
            }
            str = JSON.stringify(str);
            console.log("action:" + str);
            var data = {
                "enable": enable,
                "did":deviceId,
                "aid":as.join(),
                "value":values.join(),
                "type":type,
                "period":period,
                "time":time,
                "action":str,
                "note":note
            };
            request("addTiming", null, data, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },

        /*!
         * 获取定时任务列表
         * @param  {Function} callback 回调函数
         * @return undefined
         */
        getTimers: function (callback) {
            checkCallback(callback);
            request("getTiming", "/" + deviceId, {}, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null, res["data"] || []);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },

        /*!
         * 删除定时任务
         * @param  id 定时任务的id
         * @param  {Function} callback     回调函数
         * @return undefined
         */
        removeTimer: function (id, callback) {
            checkCallback(callback);
            request("removeTiming", "/" + id, "", function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },
        /**
         * 修改定时任务
         * @param taskId 定时任务id
         * @param as {Array}  定时任务触发的功能属性
         * @param values {Array}  定时任务触发的功能属性对应的值
         * @param type 定时任务类型，1为周期性的，2为一次性的, 无变化传-1
         * @param period type=1时必须传入，表示周几执行，传入十进制整数，转换成七位0/1数字表示,如1010101, 无变化传-1
         * @param time 表示任务执行时间点距离零点零分零秒的秒数，比如00:01:01则传入61, 无变化传-1
         * @param enable 定时任务是否开启，1-开启, 无变化传-1
         * @param callback {Function} callback 回调函数
         */
        modifyTimer: function (taskId, as, values, type, period, time, enable, callback) {
            checkCallback(callback);

            var data = {};

            if (as != null && values != null && as.length == values.length) {
                var str = {cmd: "opt", to: deviceId, as: {}};
                for (var i=0; i< as.length; i++) {
                    str.as[as[i]] = values[i]
                }
                str = JSON.stringify(str);

                data["action"] = str;
                data["aid"] = as.join();
                data["value"] = values.join();
            }
            if (type > -1) {
                data["type"] = type;
            }
            if (period > -1) {
                data["period"] = period;
            }
            if (time > -1) {
                data["time"] = time;
            }
            if (enable > -1) {
                data["enable"] = enable;
            }
            request("modifyTiming", "/" + taskId, data, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(null);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback(error);
                }
            });
        },

        /**
         * 异步请求发送
         * @param type 请求类型
         * @param url 请求url
         * @param data 请求参数
         * @param callback {Function} callback 回调函数
         */
        req: function(type, url, data, callback) {
            request(type, url, data,
            function(error, res) {
                if (!error) {
                    typeof callback === "function" && callback(res)
                } else {
                    typeof callback === "function" && callback(error)
                }
            })
        },

        /**
         * 控制设备
         * @param did 待操作的设备id
         * @param as {Array} 待操作的功能属性
         * @param values {Array} 待操作的功能属性值
         */

        opt: function (as, values) {
            console.log(as, values)
            clearTimeout(timer1)
            timer1=setTimeout(function(){
            if (!Array.isArray(as) || !Array.isArray(values) || as.length != values.length) {
                console.error('操作参数有误，请检查是否为组，且as和values长度一致');
                return;
            }
            window.location = 'js-call:jsOpt:' + encodeURIComponent(JSON.stringify({
                    "did": deviceId,
                    "as": as.join(),
                    "values": values.join()
                }));
            },400)
        },
        /**
         * 控制蓝牙设备
         * @param command 指令名称
         * @param keys {Array} 参数名称
         * @param values {Array} 参数值
         * 参数名称与参数值个数必须相同
         */
        operateBTDevice: function(command, keys, values){
            if (!Array.isArray(keys) || !Array.isArray(values) || keys.length != values.length) {
                console.error('操作参数有误，请检查是否为组，且as和values长度一致');
                return;
            }
            var params = {did: deviceId};
            for (var i = 0; i < keys.length; i ++) {
                params[keys[i]] = values[i];
            }
            var data = {command: command, params: params};
            console.log(JSON.stringify(data));
            switch(phoneType){
                case 'android':
                    HtmlInteractUtil.operateBTDevice(JSON.stringify(data));
                    break;
                case 'ios':
                    setTimeout(function(){
                        window.location = 'js-call:operateBTDevice:' + encodeURIComponent(JSON.stringify({data: data}));
                    }, 0)
                    break;
                default:
                    break;
            }
        },

        //设备在线状态反馈，结果通过result返回，
        // result-0，设备离线(局域网和广域网都不在线)，result-1，在线
        setOnlineListener : function (callback) {
            window.online = function (result) {
                typeof callback === 'function' && callback(result);
                isLoaded = true;
            }
            if (!isLoaded) {
                setTimeout(function(){
                    window.location = 'js-call:trigger';
                }, 0)
            }
        },
        //设备局域网状态反馈，结果通过result返回，
        // result-0，局域网不在线，result-1，局域网在线
        setLanOnlineListener : function (callback) {
            window.lanOnline = function (result) {
                typeof callback === 'function' && callback(result);

            }
        },
        //设备状态变化监听：设备状态变化主动上报、状态查询命令返回、设备操作结果返回
        setOnPostListener : function (callback) {
            window.post = function (data) {
                typeof callback === 'function' && callback(data);
            }
        },
        //故障上报监听：设备发生故障、故障解除时，上报相应故障码，故障码为一个数组，可以现时上报多个
        setOnFaultListener : function (callback) {
            window.fault = function (data) {
                typeof callback === 'function' && callback(data);
            }
        },
        // 进入温馨服务页面
        navigateToService : function () {
            var that = this
            var envs = {
                200: 'http://10.112.80.3:9000',
                300: 'http://10.112.80.4:9000',
                500: 'https://wiki.gomesmart.com',
                800: 'https://znn.gomesmart.com'
            }
            window.getEnv =function (data) {
                if (data) {
                    window.location = 'js-call:detectFault:' + encodeURIComponent(JSON.stringify({url: envs[data] + '/detectFault/service.html?t='+new Date().getTime()}))
                }
            }
            setTimeout(function(){
                window.location = 'js-call:getEnv:' + encodeURIComponent(JSON.stringify({
                    callback: 'getEnv'
                  }))
            }, 200)
        },
        // 进入故障检测页面
        navigateToFault : function (callback) {
            var that = this
            var envs = {
                200: 'http://10.112.80.3:9000',
                300: 'http://10.112.80.4:9000',
                500: 'https://wiki.gomesmart.com',
                800: 'https://znn.gomesmart.com'
            }
            var jump = function (url) {
                setTimeout(function(){
                    window.location = 'js-call:detectFault:' + encodeURIComponent(JSON.stringify({url: url + '/detectFault/index.html?t='+new Date().getTime()}))
                }, 0)
            }
            var validateEnv = function () {
                setTimeout(function(){
                    window.location = 'js-call:getEnv:' + encodeURIComponent(JSON.stringify({
                        callback: 'getEnv'
                      }))
                }, 200)
                callback(true)
            }
            window.getEnv = window.getEnv ||  function (data) {
                console.log(data)
                jump(envs[data])
            }
            if (this.hasFault) {
                validateEnv()
                return
            }
            this.req('get', '/v4/app/device/troublecode/list', {}, function (response) {
                if (response && response.data.length) {
                    that.hasFault = true
                    validateEnv()
                } else {
                    callback(false)
                }
            })
        },
        /**
         * 电量统计
         * @param type 电量类型维度{day: '天->时', week: '年->第几周':, month: '月->天', year: '年->月', all: '总消耗电量'}
         * @param data {Object} 请求参数
         * @param callback {Function} callback 回调函数
         */
        getElectricity: function(type, data, callback) {
            var apiType
            if (type === 'day') {
                apiType = 'electricityDay'
            }
            if (type === 'week') {
                apiType = 'electricityWeek'
            }
            if (type === 'month') {
                apiType = 'electricityMonth'
            }
            if (type === 'year') {
                apiType = 'electricityYear'
            }
            if (type === 'all') {
                apiType = 'electricitySummary'
            }
            data = data || {}
            data.did = deviceId
            if (!apiType) return
            request(apiType, null, data, function (error, res) {
                if (!error) {
                    typeof callback === 'function' && callback(res);
                } else {
                    // 出错时返回错误
                    typeof callback === 'function' && callback({errorCode: 10003, errorMessage: '服务异常'});
                }
            });
        },
        /**
         * 获取设备 title
         * @param callback {Function} callback 回调函数
         */
        getDeviceTitle: function (callback) {
          var version = window.user ? window.user.getAppVersion() : null
          console.log(version)
          if (version && compareVersion(version, '4.0.8.1')) {
            typeof callback === 'function' && callback(window.user.getWebTitle())
            return
          }
          window.getDeviceTitle = function (title) {
            typeof callback === 'function' && callback(window.user.getWebTitle())
          }
          setTimeout(function () {
            window.location = 'js-call:getWebTitle:' + encodeURIComponent(JSON.stringify({
              callback: 'getDeviceTitle'
            }))
          }, 250)
        },
        /**
         * 获取设备状态栏高度 statusBarHeight
         * @param callback {Function} callback 回调函数
         */
        getStatusBarHeight: function (callback) {
          var version = window.user ? window.user.getAppVersion() : null
          if (version && compareVersion(version, '4.0.8.1')) {
            var value = window.user.getStatusBarHeight() / (window.devicePixelRatio || 1)
            typeof callback === 'function' && callback(value)
            return
          }
          window.getStatusBarHeight =  function (height) {
            height = height / (window.devicePixelRatio || 1)
            typeof callback === 'function' && callback(height)
          }
          setTimeout(function () {
            window.location = 'js-call:getStatusBarHeight:' + encodeURIComponent(JSON.stringify({
              callback: 'getStatusBarHeight'
            }))
          }, 200)
        }
    }

    if (!noGlobal) {
        window.GS = GS;
    } else {
        setTimeout(function(){
            window.location = 'js-call:trigger';
        }, 0)
    }

    return GS;
});