<template>
  <div class="h5-container" :class="getClassName">
   <AcHeader :title="otherParts.title"></AcHeader>
    <mt-tab-container v-model="mintParams.active">
      <mt-tab-container-item id="1">
        <AcEchart ref="echart" v-if="mintParams.active === '1'" :other="otherParts" @update="updateConfig" @break="() => {mintParams.offlineVisible = true}" :components="components" @updateTemp="renderTemplature"></AcEchart>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="footer">
      <ul class="footer-item-container">
        <li class="footer-item" v-for="(it, index) in components" :key="index" v-show="it.showType === 1">
          <AcSwitch v-if="it.type === 1" :group="it" @update="updateConfig"></AcSwitch>
          <AcNumber v-if="it.type === 2" :group="it" @update="updateConfig"></AcNumber>
          <AcMap v-if="it.type === 3" :group="it" @update="updateConfig"></AcMap>
          <AcString v-if="it.type === 4" :group="it" @update="updateConfig"></AcString>
          <!-- <TimeGroup v-if="it.type === 5" :group="it"></TimeGroup> -->
        </li>
         <li class="footer-item">
             <div class="box" @click="TimeView = true">
            <span class="circle">
              <i class="iconfont icon-yanshikaiguan"></i>
            </span>
            <span class="name">定时</span>
          </div>
         </li>
      </ul>
    </div>
    <Times :timeView="TimeView" @fatherClick="closeTimeListPageFn" />
    <!-- 运行时间提示语 -->
    <!-- 温馨服务 -->
    <div class="serviceFixed" @click="goToService()">
      <span v-if="otherParts.hasFault" class="dotted"></span>
    </div>
    <!-- 离线 -->
    <PromptOffline></PromptOffline>
  </div>
</template>
<script>
import AcMap from './components/acMap.vue'
import AcNumber from './components/acNumber.vue'
import AcSwitch from './components/acSwitch.vue'
import AcString from './components/acString.vue'
// import TimeGroup from './components/timeGroup.vue'
import Times from './components/Times'
import PromptOffline from './components/offline.vue'
import AcHeader from './components/acHeader.vue'
// import Fault from './components/fault.vue'
import AcEchart from './components/acEchart.vue'
// import Health from './components/health.vue'
// import * as eruda from "eruda";
export default {
  components: {
    AcMap,
    AcNumber,
    AcSwitch,
    AcString,
    // TimeGroup,
    Times,
    PromptOffline,
    AcHeader,
    // Fault,
    AcEchart
    // Health
  },
  watch: {
    'otherParts.onoff': {
      deep: true,
      handler (n) {
        this.renderTemplature()
      }
    },
    'otherParts.eco': {
      deep: true,
      handler (n) {
        if (n) {
          if(this.otherParts.mold === '1') {   //制冷设定温可调范围为26℃-31℃
            this.otherParts.minTemperature =260;
            this.otherParts.maxTemperature = 310;
          }else {  //制热设定温可调范围为16℃-25℃
            this.otherParts.minTemperature =160;
            this.otherParts.maxTemperature = 250;
          }
        } else {
          this.otherParts.maxTemperature = 310;
          this.otherParts.minTemperature =160;
        }
        this.renderTemplature()
      }
    },
    'otherParts.online': {
      deep: true,
      handler (n) {
        this.renderTemplature()
      }
    },
    'otherParts.temperature': {
      deep: true,
      handler (n) {
        this.renderTemplature()
      }
    },
    'otherParts.mold': {
      deep: true,
      handler (n) {
        this.renderTemplature()
      }
    }
    // components: {
    //   handler () {
    //     this.refreshParts()
    //   },
    //   deep: true
    // }
  },
  computed: {
    getClassName () {
      const now = new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()
      if (this.mintParams.active === '2') {
        return 'service'
      } else if (now >= 20 * 3600 || now < 5 * 3600) {
        return 'night'
      }
      return ''
    }
  },
  data () {
    return {
      /* eslint-disable */
      components: this.repackage(config.components),
      TimeView:false,
      otherParts: {
        onoff: true,
        online: true,
        mold: '',
        moldText: '',
        wind: '',
        windText: '',
        title: '',
        runtime: 0,
        temperature: '',
        eco: false,
        radixPoint:'',
        indoorTemperature: '',
        minTemperature: 160,
        maxTemperature: 310,
        hasFault: false,
        isPowerful: false,
        isMute: false,
        airType: 0 // 0:分体机 1：柜机
      },
      mintParams: {
        active: '1',
        promptVisible: null,
        offlineVisible: false,
        debugger: false
      }
    }
  },
  methods: {
    closeTimeListPageFn(){
      this.TimeView = false;
    },
    goToService () {
      this.$gomesmart.navigateToService()
    },
    // 重新包装数据
    repackage (data) {
      return data.map(row => {
        if (row.type === 2) {
          row.minValue = row.minValue * (row.rate || 1),
          row.maxValue = row.maxValue * (row.rate || 1),
          row.value = row.value * (row.rate || 1)
        }
        return row
      })
    },
    renderTemplature () {
      const { temperature, minTemperature, maxTemperature, onoff, online, mold, eco } = this.otherParts;
      console.log('get:', this.otherParts);
      const temp = temperature;
      var color = temp < minTemperature + Math.ceil(maxTemperature / 2 - minTemperature / 2) ? '#5CBB9D' : '#EE975C';
      var percent = (temp - minTemperature + 10) / (maxTemperature - minTemperature + 10);
      if (!onoff || !online ) {
        percent = 0
      }
      if (this.$refs['echart']) {
        this.$refs['echart'].echartOptions.gauge.series[0].axisLine.lineStyle.color = [[percent, color], [10, '#dbdbdb']]
      }
    },
    // opt: 是否发送指令
    updateConfig (key, value, opt) {
      // console.log(key, value, opt,'key value opt')
      if (!this.otherParts.onoff && key !== 0 && key !== 38 && opt) {
        this.$toast('请开启空调')
        return
      }
      if (!this.otherParts.online){
        this.mintParams.offlineVisible = true
        return
      }
      this.components.map(group => {
        if (group.key === Number(key)) {
          if (this.mintParams.debugger) {
            group.value = String(value)
          }
          if (opt) {
            this.opts(key, group.type === 2 ? (Number(value) / (group.rate || 1)) : String(value))
          } else {
            group.value = String(value)
          }
        }
        return group

      })

      this.refreshParts()
    },
    // hack解决opt参数问题
    opts (key, value) {
      const { onoff, mold, temperature, airType, wind } = this.otherParts
      switch (Number(key)) {

        // 开关
        case 0:
          if (value == 1) { // 开机
            if (temperature) {
              this.$gomesmart.opt([39,0,17], [0,1,0])
            } else {
              this.$gomesmart.opt([39,0,17,2001], [0,1,0,25])
            }
          } else { // 关机
            this.$gomesmart.opt([39,0,17], [0,0,0])
          }
          break

        // 模式
        case 1001:
          if (value === '0') {
            // 自动模式
            this.$gomesmart.opt([15,1001,33,26,1004,13], [0,0,0,0,0,0]);
          } else if (value === '1') {
            // 制冷
            this.$gomesmart.opt([15,1001,33,26,1004,13], [0,1,0,0,0,0])
          } else if (value === '2') {
            // 除湿
            this.$gomesmart.opt([15,1001,33,26,1002,26,1004,13], [0,2,0,0,1,0,0,0])
          } else if (value === '3') {
            // 制热
            this.$gomesmart.opt([15,1001,33,26,1004,13], [0,3,0,0,0,0])
          } else if (value === '4') {
            // 送风
            this.$gomesmart.opt([15,1001,26,33,1004,13], [0,4,0,0,0,0])
          }
          break

        // 风速
        case 1002:
          if (value === '0') {
            // 自动
            this.$gomesmart.opt([1002,26,33], [0,0,0])
          } else if (value === '1') {
            // 低风
            this.$gomesmart.opt([1002,26,33], [1,0,0])
          } else if (value === '2') {
            // 中低风
            this.$gomesmart.opt([1002,26,33], [2,0,0])
          } else if (value === '3') {
            // 中风
            this.$gomesmart.opt([1002,26,33], [3,0,0])
          } else if (value === '4') {
            // 中高风
            this.$gomesmart.opt([1002,26,33], [4,0,0])
          } else if (value === '5') {
            // 高风
            this.$gomesmart.opt([1002,26,33], [5,0,0])
          }
          break
        // 强劲
        case 26:
          this.$gomesmart.opt([26,1002,33,13],[Number(value),3,0,0]);
          break
        // 静音
        case 33:
          this.$gomesmart.opt([33,1002,26,],[Number(value),1,0])
          break
        // 柔风
        case 13:
          this.$gomesmart.opt([13,26],[Number(value),0])
          break
        // 调节温度
        case 2001:
          this.$gomesmart.opt([2001],[ value])
          break

        // 睡眠
        case 1004:
          if (value === '0') {
            // 自动
            this.$gomesmart.opt([1004], [0])
          } else if (value === '1') {
            // 低风
            this.$gomesmart.opt([1004], [1])
          } else if (value === '4') {
            // 中高风
            this.$gomesmart.opt([1004], [4])
          }else if (value === '2') {
            // 中低风
            this.$gomesmart.opt([1004], [2])
          }
          break
        // 电加热
        case 3:
          this.$gomesmart.opt([3,15], [Number(value),0])
          break
        // 节能
        case 15:
          if(mold==='1'&&temperature<260){     //当制冷设定温小于26℃开启节能时设定温改为26℃
            this.$gomesmart.opt([15, 3,2001], [Number(value),0,260]);

          }else if(mold==='3'&&temperature>250){  //当制热设定温大于25℃开启节能时设定温改为25℃
            this.$gomesmart.opt([15, 3,2001], [Number(value),0,250]);
          }else {
            this.$gomesmart.opt([15, 3], [Number(value),0]);
          }
          break
        default:
          this.$gomesmart.opt([key], [Number(value)])
      }
    },
    // 获取其他部件数据
    refreshParts () {
      this.components.filter(group => {
        if (group.key === 2001) {
          // 温度
          this.otherParts.temperature = Number(group.value)
        }
        if (group.key === 0) {
          // 开关
          this.otherParts.onoff = Number(group.value) === 1
        }
        if (group.key === 1001) {
          //  模式
          group.enums.map(it => {
            if (it.key === group.value) {
              this.otherParts.mold = it.key
              this.otherParts.moldText = it.value
            }
          })
        }
        if (group.key === 1002) {
          //  风速
          group.enums.map(it => {
            if (it.key === group.value) {
              this.otherParts.wind = it.key
              this.otherParts.windText = it.value
            }
          })
        }
        if (group.key === 26) {
          // 强力
          this.otherParts.isPowerful = String(group.value) === '1';
          if(group.value==='1'){
            this.otherParts.windText = group.name
          }
        }
        if (group.key === 33) {
          // 静音
          this.otherParts.isMute = String(group.value) === '1';
          if(group.value==='1'){
            this.otherParts.windText = group.name
          }
        }
        if (group.key === 15) {
          // 节能
          this.otherParts.eco = Number(group.value) === 1
        }
      })
      // 风速与模式排斥
      this.setSpeedxorMode()
    },
    setSpeedxorMode () {
      const {mold} = this.otherParts;
      this.components.map(group => {
        if (group.key === 1002) {
          group.enums.map(it => {
            if (it.key === '0') {
              it.disabled = mold === '2'
            }
            if (it.key === '1') {
              it.disabled = false
            }
            if (it.key === '2') {
              it.disabled = mold === '2'
            }
            if (it.key === '3') {
              it.disabled = mold === '2'
            }
            if (it.key === '4') {
              it.disabled = mold === '2'
            }
            if (it.key === '5') {
              it.disabled = mold === '2'
            }
            if (it.key === '6') {
              it.disabled = !(mold === '1' || mold === '3')
            }
            if (it.key === '7') {
              it.disabled = !(mold === '1' || mold === '3')
            }
            return it
          })
        }
        // 电加热与模式排斥
        if (group.key === 3) {     //电加热只在制热模式下生效
            group.operable = (mold === '0' || mold === '3')
        }
        // 节能与模式排斥
        if (group.key === 15) {  //只在制冷、制热模式下有效。
          group.operable = (mold === '1' || mold === '3')
        }
        // 强力与模式排斥
        if (group.key === 26) {  //强力在除湿模式下无效。
          group.operable = (mold !== '2' )
        }
        // 静音与模式排斥
        if (group.key === 33) {  //静音在除湿模式下无效。
          group.operable = (mold !== '2' )
        }
        // 睡眠与模式排斥
        if (group.key === 17) {  //只在制冷制热模式下有效。
          group.operable = (mold === '1' || mold === '3')
        }
        // 柔风与模式排斥
        if (group.key === 13) {  //只在制冷模式下有效。
          group.operable = (mold === '1')
        }
        return group
      })
    },
    /*
    * disable components
    * onData: 打开的属性集合
    * offData: 关闭的属性集合
    */
    disableConfigByKey (onData, offData) {
      onData = onData || []
      offData = offData || []
      this.components.filter(group => {
        if (onData.indexOf(group.key) > -1) {
          group.operable = true
        }
        if (offData.indexOf(group.key) > -1) {
          group.operable = false
        }
      })
    },

    /*
    ** 处理接收的指令
     */
    command (as) {
      const { isMute, isPowerful, wind } = this.otherParts
      for (var key in as) {
        as[key] = String(as[key]);
        // 静音
        if (key === '33') {
          const val = as[key]
          if (val === '1') {
            this.updateConfig(1002, '7')
          } else if (val === '0' && (as['1002'] || wind) === '7') {
            this.updateConfig(1002, '1')
          }
        }
        this.updateConfig(key, as[key])
      }
    },

    // 初始化设备数据
    initDevice () {
      var _this = this;
      console.log(this,'thissssssssssss');
      if (!this.mintParams.debugger) {
        this.$spinner.open('加载中...')
      }
      this.$gomesmart.setOnPostListener(function (data) {
        var as = JSON.parse(data)['as']
        _this.$spinner.close()
        _this.command(as)
      })
      this.$gomesmart.setOnlineListener(function (result) {
        console.log('-------result',result);
        _this.$spinner.close()
        if (result == '0') {
          // 离线逻辑
          _this.otherParts.online = false
          // _this.mintParams.offlineVisible = true
        } else {
          // 在线逻辑
          _this.otherParts.online = true
          _this.mintParams.offlineVisible = false
        }
      })
      setTimeout(() => {
        this.$gomesmart.req('get', '/v1/user/device/runtime/' + this.$gomesmart.did, {}, (response) => {
          if (response && response.code === 0) {
            this.otherParts.runtime = response.data
          }
        })
      }, 800)
    },
    initFault () {
      this.$gomesmart.setOnFaultListener((code) => {
        if (typeof code === 'string') {
          code = JSON.parse(code)
        }
        this.otherParts.hasFault = code.length > 0
      })
    },
    // 获取标题
    getWebTitle () {
      this.$gomesmart.getDeviceTitle(response => {
        this.otherParts.title = response
      })
    }
  },
  created () {
    this.refreshParts()
  },
  mounted: function () {
    this.initDevice()
    // 获取标题
    this.getWebTitle()
    this.initFault();
    // let el = document.createElement('div');
    // document.body.appendChild(el);
    
    // eruda.init({
    //   container: el,
    //   tool: ['console', 'elements']
    // });
  }
}
</script>
