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
        maxTemperature: 32,
        hasFault: false
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
    renderTemplature (value) {
      const { temperature, minTemperature, maxTemperature, onoff, online, mold } = this.otherParts
      const temp = value || temperature
      var color = temp < minTemperature + Math.ceil(maxTemperature / 2 - minTemperature / 2) ? '#5CBB9D' : '#EE975C'
      var percent = (temp - minTemperature + 1) / (maxTemperature - minTemperature + 1)
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
      this.refreshParts()
    },
    // hack解决opt参数问题
    opts (key, value) {
      const { onoff, mold } = this.otherParts
      switch (Number(key)) {
        case 1001:
          this.$gomesmart.opt([1001,17,26,11,15,3,38,10],[value,0,0,0,0,0,1,0]) // 调节模式
          break
        case 0:
          if (value == 1) {
            this.$gomesmart.opt([0,38],[1,1]) // 开机
          } else {
            this.$gomesmart.opt([0,17,26,15,3],[0,0,0,0,0]) // 关机
          }
          break
        case 2001:
          if (['0', '2', '4'].indexOf(this.otherParts.mold) > -1) return
          this.$gomesmart.opt([2001],[value]) // 调节温度
          break
        case 1002:
          this.$gomesmart.opt([1002,26,17],[value,0,0]) // 设定风速
          break
        case 26:
          // 强力
          if (value == 1 && ['1', '3', '4'].indexOf(mold) > -1) {
            this.$gomesmart.opt([26,1002,17,15,10,11,2001],[1,mold === '4' ? 3: 0,0,0,0,0,mold === '1' ? 160 : mold === '3' ? 310 : 0])
          }
          if (value == 0) {
            this.$gomesmart.opt([26,1002],[0,mold === '4' ? 3 : 0])
          }
          break
        case 17:
          if (value == 1) {
            this.$gomesmart.opt([17,26,15,1002],[1,0,0,mold === '4' ? 3: 0])
          } else {
            this.$gomesmart.opt([17,1002],[0,mold === '4' ? 3: 0])
          }
          break
        case 15:
          if (value == 1) {
            this.$gomesmart.opt([15,17,26],[1,0,0])
          } else {
            this.$gomesmart.opt([15],[0]);
          }
          break
        default:
          this.$gomesmart.opt([key], [value])
      }
    },
    // 获取其他部件数据
    refreshParts () {
      this.components.filter(group => {
        if (group.key === 2001) {
          this.otherParts.temperature = group.value
        }
        if (group.key === 2003) {
          this.otherParts.indoorTemperature = group.value
        }
        if (group.key === 0) {
          this.otherParts.onoff = Number(group.value) === 1
        }
        if (group.key === 1001) {
          group.enums.map(it => {
            if (it.key === group.value) {
              this.otherParts.mold = it.key
              this.otherParts.moldText = it.value
            }
          })
        }
        if (group.key === 1002) {
          group.enums.map(it => {
            if (it.key === group.value) {
              this.otherParts.wind = it.key
              this.otherParts.windText = it.value
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
    // 初始化设备数据
    initDevice () {
      var _this = this
      if (!this.mintParams.debugger) {
        this.$spinner.open('加载中...')
      }
      this.$gomesmart.setOnPostListener(function (data) {
        var as = JSON.parse(data)['as']
        _this.$spinner.close()
        for (var key in as) {
          if (key == 1001) {
            var m = as[key]
            if (m == 1) {
              _this.disableConfigByKey([1002, 26, 17, 15], [3])
            } else if (m == 2) {
              _this.disableConfigByKey([], [1002, 26, 17, 15, 3])
            } else if (m == 3) {
              _this.disableConfigByKey([3, 1002, 26, 17, 15], [])
            } else if (m == 4) {
              _this.disableConfigByKey([1002, 26], [17, 3, 15])
            } else if (m == 0) {
              _this.disableConfigByKey([1002, 3], [17, 26, 15])
            }
          }
          if (key == 2001) {
            _this.disableConfigByKey([2001])
            as[key] = parseInt(as[key] / 10)
          }
          if (key == 2003) {
            var m = _this.otherParts.mold
            if (m == 1) {
              _this.disableConfigByKey([1002, 26, 17, 15], [3])
            } else if (m == 2) {
              _this.disableConfigByKey([], [1002, 26, 17, 15, 3])
            } else if (m == 3) {
              _this.disableConfigByKey([3, 1002, 26, 17, 15], [])
            } else if (m == 4) {
              _this.disableConfigByKey([1002, 26], [17, 3, 15, 2001])
            } else if (m == 0) {
              _this.disableConfigByKey([1002, 3], [17, 26, 15])
            }
          }
          _this.updateConfig(key, as[key])
        }
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
      // setTimeout(() => {
      //   this.$gomesmart.req('get', '/v1/user/device/runtime/' + this.$gomesmart.did, {}, (response) => {
      //     if (response && response.code === 0) {
      //       this.otherParts.runtime = response.data
      //     }
      //   })
      // }, 800)
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
