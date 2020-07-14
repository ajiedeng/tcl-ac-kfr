<template>
<div>
  <div class="box" @click="showClock">
      <span class="circle">
        <i class="iconfont" :class="group.icon"></i>
      </span>
      <span class="name">{{group.name}}</span>
    </div>
  <div id="sel-box" class="times-box">
    <!-- <div class="toast" v-show="toastShow">{{toastText}}</div> -->
    <!-- 定时列表 -->
    <div id="timing" v-if="timlistPage">
      <div class="time_box">
        <!-- 头部 -->
        <div class="myheader">
          <div style="margin-left:35%;">定时列表</div>
          <div style="color:#5CBB9D; margin-left:25%;" @click="selectTimPageFn">添加</div>
        </div>
        <!-- 定时列表内容 -->
        <div class="flex-col">
          <ul class="myul" style="overflow-y: auto;">
            <li
              class="mmyli"
              v-for="item in this.timlist"
              :key="item.id"
              :class="candelete.id == item.id ?'move' : ''"
              @touchstart="touchStart2(item)"
              @touchend="touchEnd2(item)"
            >
              <div class="timcont flex">
                <div
                  style="width:100%;"
                  @click="modifytim(item.id,item.istimon,item.typ,item.ifRepeat,item.weekdayinfo,item.hour,item.min)"
                >
                  <div
                    v-if="item.hour <= 9 && item.min <= 9"
                    class="timdiv"
                  >0{{item.hour}} : 0{{item.min}} {{item.typ}}</div>
                  <div
                    v-else-if="item.hour <= 9"
                    class="timdiv"
                  >0{{item.hour}} : {{item.min}} {{item.typ}}</div>
                  <div
                    v-else-if="item.min <= 9"
                    class="timdiv"
                  >{{item.hour}} : 0{{item.min}} {{item.typ}}</div>
                  <div v-else class="timdiv">{{item.hour}} : {{item.min}} {{item.typ}}</div>
                  <div style="color:#999999" >{{item.weekday}}</div>
                </div>

                <mt-switch
                  class="myswicth"
                  v-model="item.istimon"
                  active-color="#5CBB9D"
                  inactive-color="#E8E8E8"
                  @change="operateTim($event,item.id,item.istimon,item.typ,item.ifRepeat,item.weekdayinfo,item.hour,item.min)"
                ></mt-switch >
              </div>
              <div class="del" @touchstart="deleteItem(item.id)">删除</div>
            </li>
          </ul>

          <div class="flex">
            <div
              class="myleft flex timercancel-flex"
              style="height:48px;"
              data-val="2.1"
              @click="closeTimeListPageFn"
            >取消</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 定时设置 -->
    <div id="timing" v-if="selectTimeView">
      <div class="time_box">
        <!-- 头部 -->
        <div class="myheader flex">
          <div>定时</div>
        </div>
        <!-- 打开关闭 -->
        <div class="myheader mytime flex">
          <div
            class="mmyleft-top flex"
            :class=" timingOff ? 'timselected':'timeunpick' "
            @click="timingOffFn"
          >关闭</div>
          <div
            class="myright-top flex"
            :class=" timingOn ? 'timselected':'timeunpick' "
            @click="timingOnFn"
          >打开</div>
        </div>

        <div class="area_roll_mask">
          <div class="area_roll">
            <div>
              <div
                top="0"
                ref="province"
                class="gear2"
                data-areatype="area_province"
                data-type="provs"
                :data-len="(pData1 && pData1.length) ? pData1.length : 0"
                val="5"
                @touchstart="gearTouchStart"
                @touchmove="gearTouchMove"
                @touchend="gearTouchEnd"
              >
                <div class="toothl" v-for="(item,index) in pData1" :key="index">{{item.text}}</div>
              </div>

              <div class="area_grid">:</div>
            </div>

            <div>
              <div
                class="gear2"
                top="0"
                ref="city"
                data-areatype="area_city"
                data-type="city"
                :data-len="(pData2 && pData2.length) ? pData2.length : 0"
                @touchstart="gearTouchStart"
                @touchmove="gearTouchMove"
                @touchend="gearTouchEnd"
                val="5"
              >
                <div class="toothr" v-for="(item,index) in pData2" :key="index">{{item.text}}</div>
              </div>

              <div class="area_grid"></div>
            </div>
          </div>
        </div>

        <div class="selectw">
          <el-checkbox-group v-model="checkboxGroup1" size="mini">
            <el-checkbox-button v-for="wday in weekdays" :label="wday" :key="wday">{{wday}}</el-checkbox-button>
          </el-checkbox-group>
        </div>

        <div class="header flex">
          <div class="inner-myleft myleft flex" data-val="2.1" @click="closeTimeSelePageFn">取消</div>
          <span class="verdiv"></span>
          <div class="myright flex" @click="sureTimeSelePageFn">确定</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>

// import _grobal from "@/components/globalData";
// var device = _grobal.device;
// var deviceData = _grobal.deviceData;
import 'public/gomesmart.js'
var device = new window.GS.Device()
console.log(device);
export default {
  props:["group"],
  data() {
    return {
      toastShow: false,
      toastText: '',

      timlistPage: true, // 定时列表页面
      timlist:[          // 定时列表
      ],
      unit: {},
      clientNum: {}, // 记录开始滑动（x1）,结束滑动（x2）的鼠标指针的位置
      candelete: {}, // 滑动的item
      listnum: 0,
      timeOutEvent: 0, //定时器
      timeView: false,
      candelete: {},      // 滑动的item

      selectTimeView: false, // 定时设置
      timingOn: true, // 定时打开
      timingOff: false, //定时关闭

      date: new Date(), // 获取当前时刻
      ifNight: false, // 是否是晚上
      mins: 0, // 当前分钟
      hours: 0, // 当前时刻

      weekdays: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      checkboxGroup1: [],
          selects: {
          select1: "",
          select2: "",
          select3: ""
      },
      defaultData: [{ id: 0, text: 0 }, { id: 0, text: 0 }],
        //选择
      pData1: [
        { id: 0, text: "00" },
        { id: 1, text: "01" },
        { id: 2, text: "02" },
        { id: 3, text: "03" },
        { id: 4, text: "04" },
        { id: 5, text: "05" },
        { id: 6, text: "06" },
        { id: 7, text: "07" },
        { id: 8, text: "08" },
        { id: 9, text: "09" },
        { id: 10, text: "10" },
        { id: 11, text: "11" },
        { id: 12, text: "12" },
        { id: 13, text: "13" },
        { id: 14, text: "14" },
        { id: 15, text: "15" },
        { id: 16, text: "16" },
        { id: 17, text: "17" },
        { id: 18, text: "18" },
        { id: 19, text: "19" },
        { id: 20, text: "20" },
        { id: 21, text: "21" },
        { id: 22, text: "22" },
        { id: 23, text: "23" }
      ],
      pData2: [
        { id: 0, text: "00" },
        { id: 1, text: "01" },
        { id: 2, text: "02" },
        { id: 3, text: "03" },
        { id: 4, text: "04" },
        { id: 5, text: "05" },
        { id: 6, text: "06" },
        { id: 7, text: "07" },
        { id: 8, text: "08" },
        { id: 9, text: "09" },
        { id: 10, text: "10" },
        { id: 11, text: "11" },
        { id: 12, text: "12" },
        { id: 13, text: "13" },
        { id: 14, text: "14" },
        { id: 15, text: "15" },
        { id: 16, text: "16" },
        { id: 17, text: "17" },
        { id: 18, text: "18" },
        { id: 19, text: "19" },
        { id: 20, text: "20" },
        { id: 21, text: "21" },
        { id: 22, text: "22" },
        { id: 23, text: "23" },
        { id: 24, text: "24" },
        { id: 25, text: "25" },
        { id: 26, text: "26" },
        { id: 27, text: "27" },
        { id: 28, text: "28" },
        { id: 29, text: "29" },
        { id: 30, text: "30" },
        { id: 31, text: "31" },
        { id: 32, text: "32" },
        { id: 33, text: "33" },
        { id: 34, text: "34" },
        { id: 35, text: "35" },
        { id: 36, text: "36" },
        { id: 37, text: "37" },
        { id: 38, text: "38" },
        { id: 39, text: "39" },
        { id: 40, text: "40" },
        { id: 41, text: "41" },
        { id: 42, text: "42" },
        { id: 43, text: "43" },
        { id: 44, text: "44" },
        { id: 45, text: "45" },
        { id: 46, text: "46" },
        { id: 47, text: "47" },
        { id: 48, text: "48" },
        { id: 49, text: "49" },
        { id: 50, text: "50" },
        { id: 51, text: "51" },
        { id: 52, text: "52" },
        { id: 53, text: "53" },
        { id: 54, text: "54" },
        { id: 55, text: "55" },
        { id: 56, text: "56" },
        { id: 57, text: "57" },
        { id: 58, text: "58" },
        { id: 59, text: "59" }
      ],
    };
  },
  //渲染到页面的时候
  created(){
    const that = this;
    this.renderUI();
    this.getTimersFn();
  },
  mounted(){
    // ================= 获取定时列表
    // that.getTimersFn();
  },
  watch:{
    timeView: function(n){
      const el = document.getElementsByClassName('footer-item-container')[0];
      if (n) {
        el.style.overflow = 'visible'
      } else {
        setTimeout(() => {
          el.removeAttribute('style')
        }, 300)
      }
      this.renderUI();
      this.getTimersFn();
    }
  },
  methods: {
    renderUI(){
      this.timlistPage = this.timeView;

       // 判断黑夜白天
      let _this = this;

      clearInterval(_this.timer);
      this.timer = setInterval(() => {
        _this.date = new Date(); // 修改数据date
        _this.hours = _this.date.getHours();
        _this.mins = _this.date.getMinutes();
        // _this.defaultData[0].id = _this.hours;
        // _this.defaultData[0].text = _this.hours;
        // _this.defaultData[1].id = _this.mins;
        // _this.defaultData[1].text = _this.mins;
        if (_this.hours >= 20 || _this.hours <= 4) _this.ifNight = true;
        // if(_this.hours <= 20) _this.ifNight = true;
      }, 500);
    },
    // toast(str){
    //   let v = this;
    //   v.toastText = str;
    //   v.toastShow = true;
    //   setTimeout(function(){
    //     v.toastShow = false;
    //   }, 1500)
    // },
    showClock () {
      if (!this.$parent.otherParts.online) {
        this.$parent.mintParams.offlineVisible = true
        return
      }
      if (this.timeView) {
        this.timeView = false
      } else {
        this.timeView = true
      }
      this.stopScroll();
    },
    //禁止页面滑动
    stopScroll(){
      document.body.style.position = 'fixed';
    },
    //取消滚动限制
    moveScroll(){
      document.body.style.position = 'initail';//出现滚动条
    },
    closeTimeListPageFn() { // 定时列表 - 取消
      this.timlistPage = false;
      this.timeView = false;
      document.body.style.position = 'initail';
      // var content = document.getElementsByTagName('body')[0];
      // content.style.overflow = 'scroll';
      this.$emit('fatherClick', '这是子组件传递的消息');
    },
    // 更新定时列表
    getTimersFn() {
      var self = this;
      self.timlist = [];
      // alert('【have times】')
      device.getTimers(function(res, datas) {
        // console.log('device.getTimerdevice.getTimerdevice.getTimerdevice.getTimer')
        // let datas = [{
        //   "action" : "{'cmd':'opt','to':'virta6ca5cbcddff42','as': {'0':1}}",
        //   "did":"virta6ca5cbcddff42",
        //   "aid":"0",
        //   "uid":"950",
        //   "gid":"tulcar",
        //   "enable":"1",
        //   "expired":null,
        //   "period":"0",
        //   "taskid":"5d4e",
        //   "time":64080,
        //   "day":null,
        //   "timeOfDay":null,
        //   "type":2,
        //   "value":1,
        //   "note":'开关机'
        // }]
        // let res = null;
        if (res === null) {
          self.listnum = datas.length;
          for (var i = 0; i < datas.length; i++) {
            var data_ID = datas[i].taskId; // realid
            var second = datas[i].time * 1; // time
            var h = parseInt(second / 3600); // hour
            var min = parseInt((second - h * 3600) / 60); //min
            // var s = second - h * 3600 - min * 60; // 不需要 肯定是整的

            var dataStatus = datas[i].action; // ？？？？
            var dvid = dataStatus.split(":")[3].split("{")[1]; // dvid ？？？
            var dvidStr = dataStatus.split(":")[4].split("}")[0]; // value ？？？
            var typ = dvidStr * 1 == 1 ? "打开设备" : "关闭设备"; // 状态 开关机文字
            var ifRepeat = datas[i].type * 1 == 1 ? true : false; // 是否重复
            var data_week = datas[i].period; // 循环时间
            var obj = self.getTimesWeekFn(data_week);
            var weekday = obj[0];
            var weekdayinfo = obj[1]; // 转换成字符串

            var istimon = datas[i].enable * 1 ? true : false; // 启用

            self.addtoourtimlist(
              data_ID,
              istimon,
              typ,
              ifRepeat,
              weekday,
              weekdayinfo,
              h,
              min
            );
          }
        }
      });
    },
    // 十进制转字符串与arr
    getTimesWeekFn(data) {
      var weeksHtml = "";
      var weeksinfo = [0, 0, 0, 0, 0, 0, 0];
      var weeksDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var addZero = ["", "000000", "00000", "0000", "000", "00", "0", ""];

      var numData = parseInt(data);

      if (numData != 0) {
        var TenData = numData.toString(2); // 二进制字符串
        var weekLength = TenData.length;

        var weekData = addZero[weekLength] + TenData;
        for (var i = 0; i < weekData.length; i++) {
          var cons = weekData[i] == 1 ? weeksDay[i] : "";
          weeksinfo[i] = weekData[i] == 1 ? 1 : 0;
          weeksHtml += cons;
          if (i != weekData.length - 1) weeksHtml += " ";
        }
      } else {
        weeksHtml = "不重复";
      }
      return [weeksHtml, weeksinfo];
    },
    modifytim(index, itemison, typ, ifr, weekarr, hour, min) {
      var that = this;
      var weekmo = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      that.ifmodifyt = true;
      that.modindex = index;
      that.defaultData[0].id = hour;
      that.defaultData[0].text = hour;
      that.defaultData[1].id = min;
      that.defaultData[1].text = min;
      that.timingOff = typ == "关闭设备" ? true : false;
      that.timingOn = typ == "打开设备" ? true : false;
      for (var i = 0; i < weekarr.length; i++) {
        if (weekarr[i] == 1) {
          that.checkboxGroup1.push(weekmo[i]);
        }
      }
      that.selectTimeView = true;
      that.setTop(that.defaultData);
      that.timlistPage = false;
    },
    operateTim(e, index, itemison, typ, ifr, weekarr, hour, min) { // 开关按钮

      console.log('【切换开关 e, index, itemison, typ, ifr, weekarr, hour, min】', e, index, itemison, typ, ifr, weekarr, hour, min)
      if (!this.nowdel) {
        console.log("=======>修改定时运行");
        var that = this;
        var valuesnew = typ == "关闭设备" ? 0 : 1;
        var enablenew = 1;
        var asa = [0];
        var valuesa = [valuesnew];
        var addtyp = ifr ? 1 : 2;
        var period = that.arrtoten(weekarr);
        var sett = hour * 1 * 3600 + min * 1 * 60;
        var period2 = that.oldPeroidFn(period);
        if (itemison) enablenew = 1;
        else enablenew = 0;
        if (
          enablenew == 0 ||
          !that.getaddTimesErr(index, valuesnew, addtyp, period, period2, sett)
        ) {
          // that.timlistPage = false;
          // that.timlistPage = true;
          device.modifyTimer(
            index,
            asa,
            valuesa,
            addtyp,
            period,
            sett,
            enablenew,
            function(res) {
              // var jsondata = JSON.stringify(res);
              // alert(jsondata);
              if (res == null) {
                that.$toast("修改定时成功");
                // alert("修改定时成功");
              } else {
                that.$toast("修改定时失败！");
                // alert("修改定时失败！");
              }
            }
          );
        } else {
          // that.getTimersFn();
          for (var i = 0; i < that.timlist.length; i++) {
            if (that.timlist[i].id == index) {
              that.timlist[i].istimon = itemison ? false : true;
              break;
            }
          }
          // that.timlistPage = false;
          // that.timlistPage = true;
        }
        that.timlistPage = false;
        that.timlistPage = true;
      }
    },
    selectTimPageFn() { // 选择添加定时
      this.timlistPage = false;
      this.selectTimeView = true;
      this.timingOn = true;
      this.timingOff = false;
      this.checkboxGroup1 = [];
      this.defaultData[0].id = this.hours;
      this.defaultData[0].text = this.hours;
      this.defaultData[1].id = this.mins;
      this.defaultData[1].text = this.mins;
      this.setTop(this.defaultData);
    },
    /**
     * 删除item
     * index是下标
     */
    deleteItem(index) {  // 删除定时
      var that = this;
      that.nowdel = true;
      // that.timlist.splice(index, 1); // 要删掉的
      // that.listnum--; // 要删掉的
      console.log('【点击删除 index】：',index)
      device.removeTimer(index, function(res) {
        console.log(res);
        var res = JSON.parse(res);
        if (res == null) {
          that.getTimersFn();
          that.$toast("删除定时成功");
          // alert("删除定时成功");
          that.nowdel = false;
        } else {
          that.$toast("删除定时失败！");
          // alert("删除定时失败！");
          that.nowdel = false;
        }
      });
    },
    touchStart2(item) {
      let touchs = event.changedTouches[0];
      // 记录开始滑动的鼠标位置
      this.clientNum.x1 = touchs.pageX;
      this.candelete = {};
    },
    touchEnd2(item) {
      let touchs = event.changedTouches[0];
      // 记录结束滑动的鼠标位置
      this.clientNum.x2 = touchs.pageX;
      this.candelete = {};
      // 判断滑动距离大于10，判定为滑动成功，否则失败
      if (
        this.clientNum.x2 < this.clientNum.x1 &&
        Math.abs(this.clientNum.x1) - Math.abs(this.clientNum.x2) > 20
      ) {
        event.preventDefault();
        this.candelete = item;
      } else if (
        this.clientNum.x2 > this.clientNum.x1 &&
        Math.abs(this.clientNum.x2) - Math.abs(this.clientNum.x1) > 5
      ) {
        event.preventDefault();
        this.candelete = {};
      }
    },
    // ===================================================
    timingOffFn() {
      this.timingOn = false;
      this.timingOff = true;
    },
    // 暂时选择了定时关闭 or 定时开机
    timingOnFn() {
      this.timingOn = true;
      this.timingOff = false;
    },
    // 添加定时任务
    addTimerFn: function(as, values, type, period, time, enable, callback) {
      var that = this;
      var asArr = [as]; // as {Array}: 定时任务触发的功能属性
      var valuesArr = [values]; // values {Array}: 定时任务触发的功能属性对应的值
      var note = "对设备开关的定时"; // note: 定时任务说明、备注

      device.addTimer(
        asArr,
        valuesArr,
        type, // type: 定时任务类型，1为周期性的，2为一次性的
        period, // type=1时必须传入，表示周几执行，传入十进制整数，转换成七位0/1数字表示,如1010101
        time, // 表示任务执行时间点距离零点零分零秒的秒数，比如00:01:01则传入61
        enable, // 定时任务是否开启，1-开启
        callback,
        note
      );
    },
    // 时间选择
    // touch开始
    gearTouchStart(e) {
      e.stopPropagation();
      e.preventDefault();
      var target = e.target;
      while (true) {
        if (!target.classList.contains("gear2")) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      clearInterval(target["int_" + target.id]);
      target["old_" + target.id] = e.targetTouches[0].screenY;
      target["o_t_" + target.id] = new Date().getTime();
      var top = target.getAttribute("top");
      if (top) {
        target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
      } else {
        target["o_d_" + target.id] = 0;
      }
      target.style.webkitTransitionDuration = target.style.transitionDuration =
        "0ms";
    },
    //手指移动
    gearTouchMove(e) {
      e.stopPropagation();
      e.preventDefault();
      var target = e.target;
      while (true) {
        if (!target.classList.contains("gear2")) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      target["new_" + target.id] = e.targetTouches[0].screenY;
      target["n_t_" + target.id] = new Date().getTime();
      var f =
        ((target["new_" + target.id] - target["old_" + target.id]) * 30) /
        window.innerHeight;
      target["pos_" + target.id] = target["o_d_" + target.id] + f;
      target.style["-webkit-transform"] =
        "translate3d(0," + target["pos_" + target.id] + "em,0)";
      target.setAttribute("top", target["pos_" + target.id] + "em");
      if (e.targetTouches[0].screenY < 1) {
        gearTouchEnd(e);
      }
    },
    // touch结束
    gearTouchEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      var target = e.target;
      while (true) {
        if (!target.classList.contains("gear2")) {
          target = target.parentElement;
        } else {
          break;
        }
      }
      var flag =
        (target["new_" + target.id] - target["old_" + target.id]) /
        (target["n_t_" + target.id] - target["o_t_" + target.id]);
      if (Math.abs(flag) <= 0.2) {
        target["spd_" + target.id] = flag < 0 ? -0.08 : 0.08;
      } else {
        if (Math.abs(flag) <= 0.5) {
          target["spd_" + target.id] = flag < 0 ? -0.16 : 0.16;
        } else {
          target["spd_" + target.id] = flag / 2;
        }
      }
      if (!target["pos_" + target.id]) {
        target["pos_" + target.id] = 0;
      }
      this.rollGear(target);
    },
    rollGear(target) {
      var _this = this;
      var d = 0;
      var stopGear = false;

      function setDuration() {
        target.style.webkitTransitionDuration = target.style.transitionDuration =
          "200ms";
        stopGear = true;
      }

      clearInterval(target["int_" + target.id]);
      target["int_" + target.id] = setInterval(function() {
        var pos = target["pos_" + target.id];
        var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
        pos += speed;
        if (Math.abs(speed) > 0.1) {
        } else {
          var b = Math.round(pos / 2) * 2;
          pos = b;
          setDuration();
        }
        if (pos > 0) {
          pos = 0;
          setDuration();
        }
        var minTop = -(target.dataset.len - 1) * 2;
        if (pos < minTop) {
          pos = minTop;
          setDuration();
        }
        if (stopGear) {
          var gearVal = Math.abs(pos) / 2;
          _this.setGear(target, gearVal);
          // _this.setGear(target, Math.abs(pos) / 2);
          clearInterval(target["int_" + target.id]);
        }
        target["pos_" + target.id] = pos;
        target.style["-webkit-transform"] = "translate3d(0," + pos + "em,0)";
        target.setAttribute("top", pos + "em");
        d++;
      }, 30);
    },
    setGear(target, val) {
      var endVal = Math.round(val);
      var type = target.getAttribute("data-type");
      // 不是联级
      if (type === "provs") {
        this.selects.select1 = this.pData1[endVal];
      } else if (type === "city") {
        this.selects.select2 = this.pData2[endVal];
      }
    },
    setTop(defaultData) {
      console.log('defaultData =======',defaultData);
      this.$nextTick(() => {
        var province = this.$refs.province;
        var city = this.$refs.city;
        var pos1 = 0;
        var pos2 = 0;
        // if (defaultData.length === 0 && this.isRemember) {
        //   city.setAttribute("top", "0em");
        //   city.style["-webkit-transform"] = "translate3d(0, 0, 0)";
        //   return;
        // }
        if (defaultData[0] != null) {
          this.selects.select1 = defaultData[0];
          for (var i = 0, len = this.pData1.length; i < len; i++) {
            if (this.pData1[i].text == defaultData[0].text) {
              pos1 = -(i * 2);
              break;
            }
          }

          province.style.transform = province.style["-webkit-transform"] =
            "translate3d(0," + pos1 + "em,0)";
          province.setAttribute("top", pos1 + "em");
        }
        if (defaultData[1] != null) {
          for (var i = 0, len = this.pData2.length; i < len; i++) {
            if (this.pData2[i].text == defaultData[1].text) {
              pos2 = -(i * 2);
              break;
            }
          }
          this.selects.select2 = defaultData[1];
          city.setAttribute("top", pos2 + "em");
          city.style["-webkit-transform"] = "translate3d(0," + pos2 + "em,0)";
        }
      });
    },
    closeTimeSelePageFn() {
      // 定时设置 - 取消
      this.selectTimeView = false;
      this.timlistPage = true;
      this.checkboxGroup1 = [];
    },
    arrtoten(arr) {
      var period = 0;
      var i = 0;
      // 转十进制
      for (i = 0; i < 7; i++) {
        if (arr[i] * 1 == 1) {
          var tmp = 1;
          var j = 6 - i;
          for (j; j > 0; j--) {
            tmp = tmp * 2;
          }
          period += tmp;
        }
      }
      return period;
    },
    addtoourtimlist(id, ifon, typeofit, ifRep, wekd, info, hour, minu) {
      // 添加我们的定时列表
      // alert(id, ifon, typeofit, ifRep, wekd, info, hour, minu)
      var that = this;
      that.unit = {};
      that.unit.id = id;
      that.unit.istimon = ifon;
      that.unit.typ = typeofit;
      that.unit.ifRepeat = ifRep;
      that.unit.weekday = wekd;
      that.unit.weekdayinfo = info;
      that.unit.hour = hour;
      that.unit.min = minu;
      that.timlist.push(that.unit);
      // that.listnum++; // 要删掉的
    },
    addtotimlist(ifon, typeofit, ifRep, wekd, info, hour, minu) {
      // 添加定时列表
      var that = this;
      // that.unit = {};
      // that.unit.id = this.listnum + 1;
      // that.unit.istimon = ifon;
      // that.unit.typ = typeofit;
      // that.unit.ifRepeat = ifRep;
      // that.unit.weekday = wekd;
      // that.unit.weekdayinfo = info;
      // that.unit.hour = hour;
      // that.unit.min = minu;
      // that.timlist.push(that.unit);
      // that.listnum++;

      // 添加定时任务
      var asArr = 0; // as {Array}: 定时任务触发的功能属性
      var valuesArr = 0; // values {Array}: 定时任务触发的功能属性对应的值
      var note = "对设备开关的定时"; // note: 定时任务说明、备注
      var addtyp = 2;
      var period = 0;
      var sett = hour * 1 * 3600 + minu * 1 * 60;
      var enable = ifon ? 1 : 0;
      if (!ifon) enable = 0;
      if (typeofit != "关闭设备") valuesArr = 1;
      if (ifRep) {
        addtyp = 1;
        period = that.arrtoten(info);
      }

      // that.addtoourtimlist(
      //   that.listnum,
      //   ifon,
      //   typeofit,
      //   ifRep,
      //   wekd,
      //   info,
      //   hour,
      //   minu
      // ); // 要删掉的
      // console.log("info==========>",info);
      that.addTimerFn(asArr, valuesArr, addtyp, period, sett, enable, function(
        res
      ) {
        var res = JSON.parse(res);
        if (res === null) {
          that.getTimersFn(); //获取定时列表
          that.$toast("添加定时成功");
          // alert("添加定时成功");
        } else {
          that.$toast("添加定时失败！");
          // alert("添加定时失败！");
        }
      });
    },
    // 10 进制转二进制
    oldPeroidFn(data) {
      var addZero = ["", "000000", "00000", "0000", "000", "00", "0", ""];
      var numData = parseInt(data);

      var weekData = "";
      if (numData != 0) {
        var TenData = numData.toString(2);
        var weekLength = TenData.length;
        weekData = addZero[weekLength] + TenData;
      } else {
        weekData = 0;
      }

      return weekData;
    },
    // 添加定时冲突：
    getaddTimesErr(index, values, type, period1, period2, time) {
      var self = this;
      var period = period2; // 二进制的周期;
      var sqlPeriod = period1; // 十进制的周期；
      var iferr = false; // flag
      var oldindex = index;
      // alert(period);

      var nowWeek = new Date().getDay();
      var nextWeek = nowWeek < 6 ? nowWeek + 1 : 0;

      var d = new Date();
      var nowMinTimes = d.getMinutes();
      var nowHourTimes = d.getHours();
      var nowSecondTimes = d.getSeconds();
      var nowTimes =
        nowMinTimes * 1 * 60 + nowHourTimes * 1 * 3600 + nowSecondTimes;
      var fairTimes = time - nowTimes;

      var weeksModel = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      // 一、与之前添加的定时冲突：
      var oldtimlist = self.timlist;
      for (var i = 0; i < oldtimlist.length; i++) {
        if (oldtimlist[i].id != oldindex) {
          var oldTimes = oldtimlist[i].hour * 3600 + oldtimlist[i].min * 60; // 时间 多少秒
          // var old_Status = oldtimlist[i].action;
          var oldStatus = oldtimlist[i].typ == "关闭设备" ? 0 : 1; // 状态（开关机）
          var sqlPeroid = self.arrtoten(oldtimlist[i].weekdayinfo); // 十进制
          var oldPeroid = self.oldPeroidFn(sqlPeroid); // 定时周期 二进制
          var oldEnable = oldtimlist[i].istimon; // 启用状态
          // 重复周期
          var weeksRepeatHtml = ""; // 都是循环定时
          var weeksOldRepeatBoor = false; // 之前为循环定时，现在不是
          var weeksOldRepeatHtml = "";
          var weeksNowRepeatBoor = false; // 之前不是循环定时，现在是循环定时
          var weeksNowRepeatHtml = false;
          // alert(oldPeroid);
          if (oldPeroid != 0 && period != 0 && oldEnable == 1) {
            // 都是循环定时
            // console.log("都是重复定时======");
            var oldoptionVal = oldPeroid.split("");
            var periodVal = period.split("");
            for (var j = 0; j < oldoptionVal.length; j++) {
              if (
                oldoptionVal[j] == periodVal[j] &&
                oldoptionVal[j] == 1 &&
                periodVal[j] == 1
              ) {
                weeksRepeatHtml += weeksModel[j];
              }
            }
          } else if (oldPeroid != 0 && period == 0 && oldEnable == 1) {
            // console.log("之前为重复定时，现在不是重复定时======");
            var oldoptionVal = oldPeroid.split("");
            // 当前添加非循环定时、之前为循环定时
            // console.log(nowTimes, time);
            if (nowTimes < time) {
              // 今天开启
              // console.log("今天开启");
              weeksOldRepeatBoor = oldoptionVal[nowWeek] == 1 ? true : false;
              weeksOldRepeatHtml = weeksModel[nowWeek];
            } else {
              // 明天开启
              // console.log("明天开启");
              weeksOldRepeatBoor = oldoptionVal[nextWeek] == 1 ? true : false;
              weeksOldRepeatHtml = weeksModel[nextWeek];
            }
            // console.log("oldoptionVal", oldoptionVal);
            // console.log("nowWeek", nowWeek);
            // console.log("nextWeek", nextWeek);
            // console.log("weeksOldRepeatBoor", weeksOldRepeatBoor);
          } else if (oldPeroid == 0 && period != 0 && oldEnable == 1) {
            // 当前添加重复定时 之前不是重复定时
            // console.log("之前为不重复定时，现在是重复定时======");
            var nowPeriodVal = period.split("");
            if (nowTimes < oldTimes) {
              // 今天开启
              // console.log("今天开启");
              weeksNowRepeatBoor = nowPeriodVal[nowWeek] == 1 ? true : false;
              weeksNowRepeatHtml = weeksModel[nowWeek];
            } else {
              // 明天开启
              // console.log("明天开启");
              weeksNowRepeatBoor = nowPeriodVal[nextWeek] == 1 ? true : false;
              weeksNowRepeatHtml = weeksModel[nextWeek];
            }
            // console.log("weeksNowRepeatBoor:", weeksNowRepeatBoor);
            // console.log("weeksNowRepeatHtml:", weeksNowRepeatHtml);
          }

          // 2、添加一个重复定时
          if (
            oldTimes == time &&
            oldStatus == values &&
            weeksRepeatHtml != "" &&
            oldEnable == 1
          ) {
            // 都是循环定时
            self.$toast("定时冲突！");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
          if (
            oldTimes == time &&
            oldStatus == values &&
            oldPeroid == 0 &&
            period == 0 &&
            oldEnable == 1
          ) {
            // 都不是循环定时
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
          if (
            oldTimes == time &&
            oldStatus == values &&
            oldPeroid != 0 &&
            period == 0 &&
            weeksOldRepeatBoor == true &&
            oldEnable == 1
          ) {
            // 之前添加为循环定时，当前不是循环定时
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
          if (
            oldTimes == time &&
            oldStatus == values &&
            oldPeroid == 0 &&
            period != 0 &&
            weeksNowRepeatBoor == true &&
            oldEnable == 1
          ) {
            // 之前添加为不是循环定时，当前是循环定时
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }

          // 3、添加一个冲突定时
          if (oldTimes == time && weeksRepeatHtml != "" && oldEnable == 1) {
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
          if (
            oldTimes == time &&
            oldPeroid == 0 &&
            period == 0 &&
            oldEnable == 1
          ) {
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
          if (
            oldTimes == time &&
            oldPeroid != 0 &&
            period == 0 &&
            weeksOldRepeatBoor == true &&
            oldEnable == 1
          ) {
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
          if (
            oldTimes == time &&
            oldPeroid == 0 &&
            period != 0 &&
            weeksNowRepeatBoor == true &&
            oldEnable == 1
          ) {
            self.$toast("定时冲突");
            // alert("与之前定时时间冲突；设置失败！");
            iferr = true;
            return iferr;
          }
        }
      }
      return iferr;

      // var enable = 1;
      // self.addTimerFn(as, values, type, sqlPeriod, time, enable, function(res) {
      //   var res = JSON.parse(res);
      //   if (res === null) {
      //     self.getTimersFn();
      //     $(".times_show").removeClass("hidden");
      //     $(".times_sel").addClass("hidden");
      //   } else {
      //     alert("添加定时失败！");
      //   }
      // });
    },
    sureTimeSelePageFn() {
      // 定时 - 保存
      var that = this;
      if (!that.ifmodifyt) {
        // 新建定时任务
        if (that.listnum <= 19) {
          that.selectTimeView = false;
          that.timlistPage = true;
          var tmpop;
          var rep;
          var tmpwk = "";
          var info = [0, 0, 0, 0, 0, 0, 0]; // 日一二三四五六七八
          var values = 0;
          var type = 2;

          if (that.timingOff) {
            tmpop = "关闭设备";
          } else {
            tmpop = "打开设备";
            values = 1;
          }
          if (that.checkboxGroup1.length > 0) {
            var i = 0;
            for (i = 0; i < that.checkboxGroup1.length; i++) {
              tmpwk = tmpwk + " " + that.checkboxGroup1[i];
              if (that.checkboxGroup1[i] == "周一") info[1] = 1;
              else if (that.checkboxGroup1[i] == "周二") info[2] = 1;
              else if (that.checkboxGroup1[i] == "周三") info[3] = 1;
              else if (that.checkboxGroup1[i] == "周四") info[4] = 1;
              else if (that.checkboxGroup1[i] == "周五") info[5] = 1;
              else if (that.checkboxGroup1[i] == "周六") info[6] = 1;
              else info[0] = 1;
            }
            rep = true;
            type = 1;
          } else {
            tmpwk = "不重复";
            rep = false;
          }
          var period1 = that.arrtoten(info);
          var period2 = that.oldPeroidFn(period1);
          var times = that.selects.select1.id * 3600 + that.selects.select2.id * 60;
          console.log('【添加定时】', tmpop,rep,tmpwk,info,that.selects.select1.id,that.selects.select2.id)
          if ( !that.getaddTimesErr(999, values, type, period1, period2, times) ) {
            that.addtotimlist(
              true,
              tmpop, // "打开设备" "关闭设备"
              rep, // true false
              tmpwk, // "不重复" / "周一..."
              info, // [0,0,0,0,0,0]
              that.selects.select1.id, // hour
              that.selects.select2.id // min
            );
          }
        } else {
          that.$toast("最多添加20条定时任务");
          // alert("最多添加20条定时任务");
          that.selectTimeView = false;
          that.timlistPage = true;
        }
      } else {
        // 编辑先前定时任务
        that.ifmodifyt = false;
        var valuesnew = that.timingOff == true ? 0 : 1;
        var enablenew = 1;
        var asa = [0];
        var valuesa = [valuesnew];
        var info = [0, 0, 0, 0, 0, 0, 0];
        var addtyp = 2;
        if (that.checkboxGroup1.length > 0) {
          var i = 0;
          for (i = 0; i < that.checkboxGroup1.length; i++) {
            tmpwk = tmpwk + " " + that.checkboxGroup1[i];
            if (that.checkboxGroup1[i] == "周一") info[1] = 1;
            else if (that.checkboxGroup1[i] == "周二") info[2] = 1;
            else if (that.checkboxGroup1[i] == "周三") info[3] = 1;
            else if (that.checkboxGroup1[i] == "周四") info[4] = 1;
            else if (that.checkboxGroup1[i] == "周五") info[5] = 1;
            else if (that.checkboxGroup1[i] == "周六") info[6] = 1;
            else info[0] = 1;
          }
          addtyp = 1;
        } else {
          addtyp = 2;
        }
        var period = that.arrtoten(info);
        var period2 = that.oldPeroidFn(period);
        var sett =
          that.selects.select1.id * 3600 + that.selects.select2.id * 60;
        that.checkboxGroup1 = [];
        if (
          !that.getaddTimesErr(
            that.modindex,
            valuesnew,
            addtyp,
            period,
            period2,
            sett
          )
        ) {
          device.modifyTimer(
            that.modindex,
            asa,
            valuesa,
            addtyp,
            period,
            sett,
            enablenew,
            function(res) {
              // var jsondata = JSON.stringify(res);
              // alert(jsondata);
              if (res == null) {
                that.$toast("修改定时成功");
                // alert("修改定时成功");
                that.getTimersFn();
                that.selectTimeView = false;
                that.timlistPage = true;
              } else {
                that.$toast("修改定时失败！");
                // alert("修改定时失败！");
                that.getTimersFn();
                that.selectTimeView = false;
                that.timlistPage = true;
              }
            }
          );
        } else {
          that.ifmodifyt = true;
        }
      }
    },
  }
};
</script>
<style>
@import "../assets/css/times.css";
.block {
  height: 40px;
}
.el-slider__button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
