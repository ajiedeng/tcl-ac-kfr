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
          <TimeGroup v-if="it.type === 5" :group="it"></TimeGroup>
        </li>
      </ul>
    </div>
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
import TimeGroup from './components/timeGroup.vue'
import PromptOffline from './components/offline.vue'
import AcHeader from './components/acHeader.vue'
// import Fault from './components/fault.vue'
import AcEchart from './components/acEchart.vue'
export default {
  components: {
    AcMap,
    AcNumber,
    AcSwitch,
    AcString,
    TimeGroup,
    PromptOffline,
    AcHeader,
    // Fault,
    AcEchart
  },
  watch: {
    'otherParts.onoff': {
      deep: true,
      handler (n) {
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
      handler () {
        this.renderTemplature()
      }
    },
    'otherParts.mold': {
      deep: true,
      handler () {
        this.renderTemplature()
      }
    },
    components: {
      handler () {
        this.refreshParts()
      },
      deep: true
    }
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
        indoorTemperature: '',
        minTemperature: 16,
        maxTemperature: 30,
        hasFault: false,
        isPowerful: false,
        isMute: false,
        airType: 0 // 0:分体机 1：柜机
      },
      mintParams: {
        active: '1',
        promptVisible: null,
        offlineVisible: false,
        debugger: true
      }
    }
  },
  methods: {
    goToService () {
      this.$gomesmart.navigationTo('deviceService')
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
      const { temperature, minTemperature, maxTemperature, onoff, online, mold } = this.otherParts
      var color = temperature < minTemperature + Math.ceil(maxTemperature / 2 - minTemperature / 2) ? '#5CBB9D' : '#EE975C'
      var percent = (temperature - minTemperature + 1) / (maxTemperature - minTemperature + 1)
      if (!onoff || !online || ['0'].indexOf(mold) > -1) {
        percent = 0
      }
      if (this.$refs['echart']) {
        this.$refs['echart'].echartOptions.gauge.series[0].axisLine.lineStyle.color = [[percent, color], [1, '#dbdbdb']]  
      }
    },
    // opt: 是否发送指令
    updateConfig (key, value, opt) {
      console.log(key, value, opt)
      if (!this.otherParts.onoff && key !== 0 && opt) {
        this.$toast('请开启空调')
        return
      }
      this.components.filter(group => {
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
    },
    // hack解决opt参数问题
    opts (key, value) {
      const { onoff, mold, temperature, airType, wind } = this.otherParts
      switch (Number(key)) {

        // 开关
        case 0:
          if (value == 1) { // 开机 
            if (temperature) {
              this.$gomesmart.opt([0,17,40], [1,0,0]) 
            } else {
              this.$gomesmart.opt([0,17,40,2001], [1,0,0,25])
            }
          } else { // 关机
            this.$gomesmart.opt([0,17,40], [0,0,0]) 
          }
          break

        // 模式
        case 1001:
          if (value === '0') {
            // 自动模式
            if (wind === '6') {
              // 强劲风
              this.$gomesmart.opt([39,1001,26,1002,17,3,40], [0,0,0,3,0,0,0])
            } else if (wind === '7') {
              // 静音风
              this.$gomesmart.opt([39,1001,33,1002,17,3,40], [0,0,0,1,0,0,0])
            } else {
              this.$gomesmart.opt([39,1001,33,1002,17,3,40], [0,0,0,1,0,0,0])
            }
          } else if (value === '1') {
            // 制冷
            this.$gomesmart.opt([39,1001,17,3,40], [0,1,0,0,0])
          } else if (value === '2') {
            // 除湿
            this.$gomesmart.opt([39,1001,33,26,1002,17,3,40], [0,2,0,0,1,0,0,0])
          } else if (value === '3') {
            // 制热
            this.$gomesmart.opt([39,1001,17,3,40], [0,3,0,1,0])
          } else if (value === '4') {
            // 送风
            if (wind === '6') {
              this.$gomesmart.opt([39,1001,26,1002,17,3,40], [0,4,0,3,0,0,0])
            } else if (wind === '7') {
              this.$gomesmart.opt([39,1001,33,1002,17,3,40], [0,4,0,1,0,0,0])
            } else {
              this.$gomesmart.opt([39,1001,17,3,40], [0,4,0,0,0])
            }
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
            this.$gomesmart.opt([1002,26,33], [5,0,0])
          } else if (value === '3') {
            // 中风
            this.$gomesmart.opt([1002,26,33], [2,0,0])
          } else if (value === '4') {
            // 中高风
            this.$gomesmart.opt([1002,26,33], [6,0,0])
          } else if (value === '5') {
            // 中高风
            this.$gomesmart.opt([1002,26,33], [3,0,0])
          } else if (value === '6') {
            // 中高风
            this.$gomesmart.opt([1002,26,33], [3,0,0])
          } else if (value === '7') {
            // 中高风
            if (airType === 0) {
              this.$gomesmart.opt([1002,26,33], [3,0,0])
            } else if (airType === 1) {
              this.$gomesmart.opt([1002,26,33], [3,1,0])
            }
            
          }
          break

        // 上下扫风
        case 1006:
          this.$gomesmart.opt([1006], [value])
          break

        // 左右扫风
        case 1007:
          this.$gomesmart.opt([1007], [value])
          break

        // 灯光
        case 14:
          this.$gomesmart.opt([14], [value])
          break

        // 调节温度
        case 2001:
          this.$gomesmart.opt([2001],[value])
          break

        // 睡眠
        case 17:
          if (value == 1) {
            if(['1', '3'].indexOf(String(this.otherParts.mold)) > -1) {
              this.otherParts.airType === 0 ? this.$gomesmart.opt([17,33,26,1002,40], [1,1,0,1,1]) : this.$gomesmart.opt([17,40], [1,1])
            }
          } else {
            this.$gomesmart.opt([17,40], [0,0])
          }
          break

        // 辅热
        case 3:
          this.$gomesmart.opt([3], [value])
          break

        default:
          this.$gomesmart.opt([key], [value])
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
          this.otherParts.isPowerful = String(group.value) === '1'
        }
        if (group.key === 33) {
          // 静音
          this.otherParts.isMute = String(group.value) === '1'
        }

        if (group.key === 2003) {
          // 室温
          this.otherParts.indoorTemperature = group.value
        }
      })
      // 风速与模式排斥
      this.setSpeedxorMode()
    },
    setSpeedxorMode () {
      const {mold, isMute, airType} = this.otherParts
      this.components.filter(group => {
        if (group.key === 1002) {
          group.enums.map(it => {
            it.disabled = false
            if (mold === '0') {
              it.disabled = ['6', '7'].indexOf(it.key) > -1
            } else if (mold === '1') {
              it.disabled = (isMute && airType === 0 && ['6'].indexOf(it.key) > -1)
            } else if (mold === '2') {
              it.disabled = it.key !== '1'
            } else if (mold === '4') {
              it.disabled = ['6', '7'].indexOf(it.key) > -1
            }
          })
        }
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
        as[key] = String(as[key])
        // 风速
        if (key === '1002') {
          const val = as[key]
          if (val === '1') {
            // 静音->静音风、低风
            as[key] = (as['33'] || isMute) === '1' ? '7' : '1'
          }
          if (val === '2') {
            // 中风
            as[key] = '3'
          }
          if (val === '3') {
            // 强劲->强劲风、高风
            as[key] = (as['26'] || isPowerful) === '1' ? '6' : '5'
          }
          if (val === '5') {
            // 中低风
            as[key] = '2'
          }
          if (val === '6') {
            // 强劲->强劲风、中高风
            as[key] = (as['26'] || isPowerful) === '1' ? '6' : '4'
          }
        }

        // 静音
        if (key === '33') {
          const val = as[key]
          if (val === '1') {
            this.updateConfig(1002, '7')
          } else if (val === '0' && (as['1002'] || wind) === '1') {
            this.updateConfig(1002, '1')
          }
        }

        // 强劲
        if(key == "26"){
          const val = as[key]
          if (val === '1') {
            this.updateConfig(1002, '6') // 强劲风
          } else if (val === '0' && (as['1002'] === '3' || ['5', '6'].indexOf(wind) > -1) ) {
            this.updateConfig(1002, '5') // 高风
          }
        }

        // 左右扫风
        if (key === '1007') {
          const val = as[key]
          if (val === '7') {
            as[key] = '80'
          }
          if (val === '8') {
            as[key] = '99'
          }
        }

        this.updateConfig(key, as[key])
      }
    },

    // 初始化设备数据
    initDevice () {
      var _this = this
      if (!this.mintParams.debugger) {
        this.$spinner.open('加载中...')
      }
      this.$gomesmart.setOnPostListener(function (data) {
        var as = JSON.parse(data)['as']
        _this.$spinner.close()
        _this.command(as)
      })
      this.$gomesmart.setOnlineListener(function (result) {
        _this.$spinner.close()
        if (result === '0') {
          // 离线逻辑
          _this.otherParts.online = false
          _this.mintParams.offlineVisible = true
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
    }
  },
  created () {
    this.refreshParts()
  },
  mounted: function () {
    var _this = this
    this.initDevice()
    // 获取title
    this.$gomesmart.getDeviceTitle((data) => {
      this.otherParts.title = data
    })
    this.$nextTick(() => {
      this.initFault()
    })
  },
}
</script>
