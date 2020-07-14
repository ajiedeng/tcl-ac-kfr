<template>
  <div id="echartContainer" class="echart-box" :style="{width: echartOptions.width, height: echartOptions.height}">
    <div v-if="canAdjust" class="plus" @click="adjustTemp(5)"></div>
    <div v-if="canAdjust" class="minus" @click="adjustTemp(-5)"></div>
    <div class="value"><span class="c" >{{ showTempText }}</span><em>{{radixPoint}}</em><span>℃</span></div>
    <div class="moldText">{{other.windText}}<em  v-if="other.wind && other.mold">|</em>{{other.moldText}}</div>
    <v-chart :options="echartOptions.gauge" />
  </div>
</template>
<script>
  import DragGuage from './dragGuage.js'

  export default {
  props: ['other', 'components'],
  data () {
    const diameter = document.body.clientWidth // 直径
    return {
      echartOptions: {
        width: diameter + 'px',
        height: diameter + 'px',
        gauge: {
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              type: 'gauge',
              startAngle: 270,
              endAngle: -89.99,
              radius: (diameter / 2) * 0.7,
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false,
                lineStyle: {
                  width: 0,
                  color: [[0.5, '#5CBB9D'], [1, '#dbdbdb']],
                  shadowColor: '#dbdbdb', // 默认透明
                  shadowBlur: 10,
                  opacity: 0
                }
              },
              axisTick: {
                show: true,
                length: (diameter / 2) * 0.08,
                lineStyle: {
                  width: (diameter / 2) * 0.014,
                  color: 'auto'
                }
              },
              splitLine: {
                show: false
              },
              pointer: {
                show: false
              },
              min: 160,
              clockwise: true,
              max: 310,
              splitNumber: 15,
              detail: {
                show: false
              }
            },
            { //内圈
              type: 'gauge',
              startAngle: 270,
              endAngle: -89.99,
              radius: (diameter / 2) * 0.6,
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false,
                lineStyle: {
                  width: 0,
                  color: [[1, '#ebebeb']],
                  opacity: 0
                }
              },
              axisTick: {
                show: true,
                length: (diameter / 2) * 0.03,
                lineStyle: {
                  width: (diameter / 2) * 0.008,
                  color: 'auto'
                }
              },
              splitLine: {
                show: false
              },
              pointer: {
                show: false
              },
              title: {
                show: false
              },
              detail: {
                show: false
              },
              min: 160,
              clockwise: true,
              max: 310,
              splitNumber: 15
            }
          ]
        }
      },
      cacheTemperature: null
    }
  },
  methods: {
    // 调节温度
    adjustTemp (md) {
      let row;
      let mode, eco;
      if (!this.other.online) {
        this.$emit('break')
        return
      }
      if (!this.other.onoff) {
        return this.$toast('请开启空调')
      }
      this.components.filter(group => {
        if (group.key === 2001) {
          row = group
        }else if(group.key===1001) {
          mode=group
        } else if(group.key===15) {
          eco=group
        }
      });
      if (row && md === -5) {
        if (Number(row.value) === row.minValue) {
          return this.$toast('已达最低温度')
        }
        if(Number(row.value)<=260&&Number(mode.value)===1&&Number(eco.value)===1){ //制冷设定温可调范围为26℃-31℃
          return this.$toast('当前温度为ECO模式下最低温度')
        }
        this.$emit('update', 2001, Math.max(row.minValue, row.value - row.stepLen), true);
      }
      if (row && md === 5) {
        if (Number(row.value) === row.maxValue) {
          return this.$toast('已达最高温度')
        }
        if(Number(row.value)>=250&&Number(mode.value)===3&&Number(eco.value)===1){ //制热设定温可调范围为16℃-25℃
          return this.$toast('当前温度为ECO模式下最高温度')
        }
        this.$emit('update', 2001, Math.min(row.maxValue, Number(row.value) + Number(row.stepLen)), true)
      }
    },
    // 根据角度获取值
    getValueByAngle (angle, defaultValue) {
      const value = Math.round(angle / (2 * Math.PI / ((this.other.maxTemperature - this.other.minTemperature + 1) * 0.2))) *5;
      var result = Number(value) + Number(defaultValue);

      if (result < this.other.minTemperature) {
        result = this.other.minTemperature
      }
      if (result > this.other.maxTemperature) {
        result = this.other.maxTemperature
      }
      return result
    }
  },
  computed: {
    canAdjust () {
      return this.other.onoff && this.other.online;

    },
    showTempText: function () {
      let integer;
      if (!this.other.online || !this.other.onoff) {
        return '--'
      }
      integer = (this.other.temperature).toString().split('');
      integer.pop();
      console.log(integer.join(''),'');
      return integer.join('');
    },
    radixPoint(){
      if (!this.other.online || !this.other.onoff) {
        return ''
      }
      return `.${(this.other.temperature).toString().split('').slice(2, 5).join('')}`;
    }
  },
  mounted () {
    // 鼠标滑动温度
    /* eslint-disable no-new */
    var _this = this;
    this.$emit('updateTemp')
    this.dragGuage = new DragGuage(document.getElementById('echartContainer'), {
      noDrag () {
        if (!_this.other.online) {
          _this.$emit('break')
          return true
        }
        if (!_this.other.onoff) {
          _this.$toast('请开启空调');
          return true
        }
      },
      touchStart () {
        _this.cacheTemperature = _this.other.temperature;
      },
      touchMove (angle) {
        if (!_this.other.onoff || !_this.other.online) {
          return
        }
        const value = _this.getValueByAngle(angle, _this.cacheTemperature);
        if (_this.cacheTemperature === value) return
        _this.$emit('update', 2001, value);
      },
      touchEnd (angle) {
        if (String(_this.cacheTemperature) !== String(_this.other.temperature)) {
          _this.$emit('update', 2001, _this.other.temperature, true)
        }
        _this.cacheTemperature = null
      }
    })
  }
}
</script>
