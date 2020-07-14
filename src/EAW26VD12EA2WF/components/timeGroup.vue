<template>
  <div>
    <div class="box" @click="showClock">
      <span class="circle">
        <i class="iconfont" :class="group.icon"></i>
      </span>
      <span class="name">{{group.name}}</span>
    </div>
    <!-- 定时列表 -->
    <mt-popup class="popup-timing" v-model="show" position="bottom">
      <mt-header title="定时列表">
        <mt-button slot="right" @click="addTimeHandler">添加</mt-button>
      </mt-header>
      <div class="bd" v-if="show">
        <mt-cell-swipe v-for="it in list" :key="it.taskId" :label="showTextByPeriod(it.period)" :title="showInlineDesc(it)" :right="rightButton(it)" @click.native="(e) => { editTimeHandler(e, it) }">
          <mt-switch v-model="it.enable" @change="(value) => { toggleEnable(value, it) }" @click.native="clickEnabel"></mt-switch>
        </mt-cell-swipe>
      </div>
      <div class="btns">
        <button type="button" @click="show=false">取消</button>
      </div>
    </mt-popup>
    <!-- 设置时间 -->
    <mt-popup class="popup-timing popup-timing-add" v-model="show1" position="bottom">
      <h5>设置时间</h5>
      <mt-picker :slots="times" @change="timerChangeHandler" value-key="name" :item-height="itemHeight"></mt-picker>
      <div class="bd">
        <mt-cell title="开关机">
          <mt-switch v-model="onoff"></mt-switch>
        </mt-cell>
        <mt-cell title="重复" is-link @click.native="cycleHandler">
          <span>{{showRepeatText}}</span>
        </mt-cell>
      </div>
      <div class="btns">
        <button type="button" @click="show1=false">取消</button>
        <button type="button" @click="saveTimeHandler">确认</button>
      </div>
    </mt-popup>
    <!-- 重复性选择 -->
    <mt-popup class="popup-timing popup-timing-cycle" v-model="show2" position="bottom">
      <div class="bd">
        <mt-checklist align="right" v-if="show2" v-model="checklist1" :options="options"></mt-checklist>
      </div>
      <div class="btns">
        <button type="button" @click="show2=false">取消</button>
        <button type="button" @click="saveCycle">确认</button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: ['group'],
  data () {
    return {
      show: false,
      show1: false,
      show2: false,
      onoff: true,
      itemHeight: parseInt(document.getElementsByTagName('html')[0].style.fontSize) / 75 * 60,
      minuteValue: '',
      taskId: null,
      list: [],
      // list: [{action: JSON.stringify({as:{0:0}}), period: 2, time: 0}],
      xVisible: false,
      checklist: [],
      checklist1: [],
      times: [
        {
          ...this.getTimerByNum(0, 23),
          textAlign: 'right'
        },
        {
          divider: true,
          content: '：'
        },
        {
          ...this.getTimerByNum(0, 59),
          textAlign: 'left'
        }
      ],
      options: [
        { value: 32, label: '周一' },
        { value: 16, label: '周二' },
        { value: 8, label: '周三' },
        { value: 4, label: '周四' },
        { value: 2, label: '周五' },
        { value: 1, label: '周六' },
        { value: 64, label: '周日' }
      ],
      cacheValue: []
    }
  },
  computed: {
    showRepeatText () {
      var num = 0
      this.options.map(it => {
        if (this.checklist.indexOf(it.value) > -1) {
          num += it.value
        }
      })
      return this.showTextByPeriod(num)
    }
  },
  watch: {
    show (n) {
      const el = document.getElementsByClassName('footer-item-container')[0]
      if (n) {
        el.style.overflow = 'visible'
        this.getTimer()
      } else {
        setTimeout(() => {
          el.removeAttribute('style')
        }, 300)
      }
    },
    minuteValue (value) {
      this.times[0].defaultIndex = parseInt(value.split(':')[0])
      this.times[2].defaultIndex = parseInt(value.split(':')[1])
    }
  },
  methods: {
    getTimerByNum (min, max) {
      var obj = {
        flex: 1,
        values: [],
        defaultIndex: 0,
        textAlign: 'center'
      }
      for (let i = min; i <= max; i++) {
        obj.values.push({
          value: Number(i),
          name: String(i)
        })
      }
      return obj
    },
    timerChangeHandler (picker, values) {
      this.minuteValue = this.numberPad(values[0].value) + ':' + this.numberPad(values[1].value)
    },
    rightButton (group) {
      return [{
        content: '删除',
        style: { background: '#EE3E54', width: 180 / 75 + 'rem' },
        handler: (e) => {
          this.removeTimer(group.taskId)
        }
      }]
    },
    showClock () {
      if (!this.$parent.otherParts.online) {
        this.$parent.mintParams.offlineVisible = true
        return
      }
      this.show = true
    },
    addTimeHandler () {
      if (this.list.length >= 20) {
        return this.$toast('最多添加20条定时任务')
      }
      this.show1 = true
      this.onoff = true
      this.taskId = null
      this.checklist1 = []
      this.checklist = []
      this.minuteValue = moment().format('hh:mm')
      // this.$refs.datetime.render()
    },
    cycleHandler () {
      this.show2 = true
      this.checklist1 = this.checklist.concat([])
    },
    saveCycle () {
      this.checklist = this.checklist1.concat([])
      this.show2 = false
    },
    showTextByPeriod (period) {
      period = Number(period)
      if (period === 0) {
        return '仅一次'
      } else if (period === 65) {
        return '周末'
      } else if (period === 62) {
        return '工作日'
      } else if (period === 127) {
        return '每一天'
      } else {
        var a = period.toString(2).split('')
        var str = ''
        for (var i = 0; i < a.length; i++) {
          this.options.map(it => {
            if (a[i] === '1' && Math.pow(2, a.length - i - 1) === it.value) {
              str += ',' + it.label
            }
          })
        }
        return str.substr(1)
      }
    },
    clickEnabel (e) {
      e.stopPropagation()
    },
    toggleEnable (val, it) {
      const data = JSON.parse(JSON.stringify(it))
      const { action } = data
      const as = []; const values = []
      for (var i in JSON.parse(action).as) {
        const value = JSON.parse(action).as[i]
        as.push(i)
        values.push(value)
      }
      data.as = as
      data.values = values
      this.updateTimer(data)
    },
    showTime (time) {
      return this.numberPad(parseInt(time / 3600)) + ':' + this.numberPad(parseInt(time % 3600 / 60))
    },
    numberPad (value) {
      return String(value).length === 1 ? ('0' + value) : value
    },
    showInlineDesc (group) {
      var str = this.showTime(group.time)
      str += '\n\n' + (Number(JSON.parse(group.action).as['0']) === 1 ? '打开设备' : '关闭设备')
      return str
    },
    saveTimeHandler () {
      var opts = {}
      opts.as = [0]
      opts.values = [this.onoff ? '1' : '0']
      opts.period = this.getPeriod()
      if (opts.period === 0) {
        opts.type = 2
      } else {
        opts.type = 1
      }
      opts.time = 0
      this.minuteValue.split(':').map((it, index) => {
        opts.time += Math.pow(60, 2 - index) * parseInt(it)
      })
      opts.enable = true
      if (this.taskId) {
        opts.taskId = this.taskId
        this.updateTimer(opts)
      } else {
        this.addTimer(opts)
      }
      this.sho1 = false
    },
    getPeriod () {
      var count = 0
      this.checklist.map(it => {
        count += it
      })
      return count
    },
    editTimeHandler (e, group) {
      e.stopPropagation()
      this.minuteValue = this.showTime(group.time)
      this.show1 = true
      this.onoff = Number(JSON.parse(group.action).as['0']) === 1
      var checklist = []
      var a = Number(group.period || 0).toString(2).split('')
      for (var i = 0; i < a.length; i++) {
        this.options.map(it => {
          if (a[i] === '1' && Math.pow(2, a.length - i - 1) === it.value) {
            checklist.push(it.value)
          }
        })
      }
      this.checklist = checklist
      this.taskId = group.taskId
    },
    addTimer (opts) {
      const { type, period, time, enable, values, as } = opts
      if (!this.$parent.mintParams.debugger) {
        this.$spinner.open('新增中...')
      }
      this.$gomesmart.addTimer(as, values, type, period, time, enable ? 1 : 0, (err, timers) => {
        this.$spinner.close()
        if (err) {
          return this.$toast('新增失败')
        }
        this.$toast('新增成功')
        this.show1 = false
        this.getTimer()
      })
    },
    updateTimer (opts) {
      const { taskId, type, period, time, enable, values, as } = opts
      if (!this.$parent.mintParams.debugger) {
        this.$spinner.open('更新中...')
      }
      this.$gomesmart.modifyTimer(taskId, as, values, type, period, time, enable ? 1 : 0, (err, timers) => {
        this.$spinner.close()
        if (err) {
          return this.$toast('更新失败')
        }
        this.$toast('更新成功')
        this.show1 = false
        this.getTimer()
      })
    },
    // 删除定时
    removeTimer (id) {
      if (!this.$parent.mintParams.debugger) {
        this.$spinner.open('删除中...')
      }
      this.$gomesmart.removeTimer(id, (err) => {
        this.$spinner.close()
        if (err) {
          return this.$toast('删除失败')
        }
        this.getTimer()
      })
    },
    // 获取定时
    getTimer () {
      if (!this.$parent.mintParams.debugger) {
        this.$spinner.open('加载中...')
      }
      this.$gomesmart.getTimers((err, timers) => {
        this.$spinner.close()
        if (err) {
          return
        }
        this.list = timers.map(group => {
          group.enable = Number(group.enable) === 1
          group.action = group.action.replace(/'/g, '"')
          return group
        })
      })
    }
  }
}
</script>
<style lang="less">
.popup-timing{
  width: 100%;
  border-radius:16px 16px 0px 0px;
  .mint-header{
    background: transparent;
    color: #333;
    margin: 40px 0;
    padding: 0 30px;
  }
  .mint-header-title{
    font-size: 28px;
  }
  .mint-header-button{
    .mint-button-text{
      font-size: 30px;
      color: #5CBB9D;
    }
  }
  .bd{
    .mint-cell{
      background: transparent;
      border-bottom:  1px solid #e5e5e5;
      padding: 20px 0;
      &:last-child{
        border-bottom: none;
      }
    }
    .mint-cell-wrapper{
      font-size: 30px;
      background-image: none;
    }
    .mint-cell-text{
      font-size: 30px;
    }
    .mint-cell-label{
      margin-top: 12px;
      font-size: 30px;
      color: #999;
    }
    .mint-cell-swipe-buttongroup{
      text-align: center;
      .mint-cell-swipe-button{
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 30px;
      }
    }
  }
  .btns{
    border-top: 1px solid #e5e5e5;
    display: flex;
    button{
      background: transparent;
      border: 0;
      flex: 1;
      font-size: 28px;
      padding: 30px 0;
      text-align: center;
      &:nth-child(2){
        color: #5CBB9D;
        border-left: 1px solid #e5e5e5;
      }
    }
  }
}
.popup-timing-add{
  h5{
    text-align: center;
    margin: 40px 0;
    font-size: 28px;
  }
  .picker-item{
    font-size: 36px;
    color: #999;
    &.picker-selected{
      color: #333;
    }
  }
  .picker-center-highlight{
    background: #F3F3F3;
    z-index: -1;
  }
  .picker-slot-divider{
    font-size: 36px;
    margin: 0 30px;
  }
  .bd{
    padding: 0 20px;
    margin-top: 5px;
    .mint-cell{
      background: transparent;
      border-top:  1px solid #e5e5e5;
      border-bottom: none;
      padding: 20px 0;
    }
    .mint-cell-allow-right::after{
      border: 4px solid #999;
      border-bottom-width: 0;
      border-left-width: 0;
      width: 12px;
      height: 12px;
    }
    .mint-cell-value.is-link{
      margin-right: 40px;
    }
  }
}
.popup-timing-cycle{
  .bd{
    padding: 0 20px;
  }
  .mint-cell-wrapper{
    background-image: none;
    .mint-checklist-label{
      padding: 26px 0;
    }
    .mint-cell-title{
      font-size: 30px;
    }
    .mint-checkbox-input:checked + .mint-checkbox-core{
      background: #5CBB9D;
      border-color: #5CBB9D;
    }
    .mint-checkbox-core{
      width: 35px;
      height: 35px;
      &:after{
        width: 10px;
        height: 16px;
        left: 10px;
      }
    }
  }
}
</style>
