<template>
  <div class="warm-service-health">
    <div class="row" @click="visible=true">
      <div class="title">
        <i class="iconfont icon-jiankangjiance"></i>健康监测<i class="gm-icon-wenhao"></i>
        <p class="sub">当前设备已运行<span :class="getClassName">{{runtime}}</span>{{unit}}</p>
      </div>
      <span class="t">健康状态：<span :class="getClassName">{{getStatusName}}</span></span>
      <!-- <button class="gm-btn">时间清零</button> -->
    </div>
    <div v-if="getIntroduce" class="prompt">
      {{getIntroduce}}
      <span class="arrow-right"></span>
    </div>
    <Prompt></Prompt>
  </div>
</template>
<script>
import Prompt from './prompt.vue'
export default {
  data () {
    return {
      runtime: 0,
      unit: '小时',
      status: null,
      min: 90 * 24,
      max: 200 * 24,
      visible: false
    }
  },
  components: {
    Prompt
  },
  computed: {
    getStatusName () {
      const { status } = this
      return status === 1 ? '良好' : status === 2 ? '一般' : status === 3 ? '透用' : '良好'
    },
    getIntroduce () {
      const { status } = this
      let str = ''
      switch (status) {
        case 1:
          str = ''
          break
        case 2:
          str = `您当前设备使用时长超过${this.min}${this.unit}，建议尽快清洗，清洗完成记得执行清零操作哦`
          break
        case 3:
          str = `您当前设备使用时长超过${this.max}${this.unit}，建议尽快清洗，清洗完成记得执行清零操作哦`
          break
      }
      return str
    },
    getClassName () {
      const { status } = this
      let str = ''
      switch (status) {
        case 1:
          str += 'color-primary'
          break
        case 2:
          str += 'color-warn'
          break
        case 3:
          str += 'color-danger'
          break
        default:
          str += 'color-primary'
      }
      return str
    }
  },
  methods: {
    query () {
      this.$gomesmart.req('post', '/v4/app/health/status', { did: this.$gomesmart.did }, (response) => {
        if (response && !response.errorCode) {
          const { data } = response
          this.runtime = data.rules ? data.runningTime : Math.floor(data.runningTime / 60)
          this.status = data.status
          // if (data.unit) {
          //   this.unit = data.unit
          // }
          if (data.rules) {
            this.min = response.data.rules[0].maxVal
            this.max = response.data.rules[1].maxVal
          }
        }
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.query()
    }, 300)
  }
}
</script>
<style lang="less" scoped>
.warm-service-health{
  padding: 30px 0;
  .row{
    display: flex;
    justify-content: center;
    align-items: center;
    .title{
      flex: 1;
      font-size: 30px;
      line-height: 42px;
      .iconfont{
        font-size: 30px;
        margin-right: 10px;
        color: #5CBB9D;
      }
      .sub{
        font-size: 20px;
        color: #999;
        margin-top: 5x;
      }
      .gm-icon-wenhao{
        width: 28px;
        height: 28px;
        background: url(../assets/img/wenhao.png) no-repeat;
        background-size: 100%;
        position: relative;
        top: -5px;
        left: 3px;
        display: inline-block;
      }
    }
    .t{
      font-size: 28px;
    }
  }
  .gm-btn{
    padding: 0 26px;
    height: 60px;
    background:rgba(92,187,157,1);
    border-radius:8px;
    border: 0;
    color: #fff;
    font-size: 28px;
  }
  .prompt{
    padding: 20px 80px 20px 30px;
    background: #FFF6DD;
    font-size: 20px;
    line-height: 28px;
    margin-top: 20px;
    color: #FF9B04;
    position: relative;
    .arrow-right{
      display: inline-block;
      width: 18px;
      height: 28px;
      background: url(../assets/img/arrow-right.png) no-repeat;
      background-size: 100%;
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .color-primary{
    color: #5CBB9D !important;
  }
  .color-warn{
    color: #FF9B04 !important;
  }
  .color-danger{
    color: #F14A27 !important;
  }
}
</style>
