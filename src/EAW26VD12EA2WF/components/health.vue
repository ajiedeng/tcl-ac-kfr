<template>
  <div class="health" :class="getClassName">
    <div class="h-row">
      <div @click="visible=true" class="title">健康监测<i class="gm-icon-wenhao"></i><p class="runtime">当前设备已运行<span class="t">{{runtime}}</span>小时</p></div>
      <div class="t"  v-if="getIntroduce">健康状态：{{getStatusName}}</div>
    </div>
    <div v-if="getIntroduce" class="prompt">
      {{getIntroduce}}
      <span class="arrow-right"></span>
    </div>
    <!-- 运行时间提示语 -->
    <PromptRunTime></PromptRunTime>
  </div>
</template>
<script>
import PromptRunTime from './prompt.vue'
export default {
  props: ['other'],
  components: {
    PromptRunTime
  },
  data () {
    return {
      runtime: 0,
      status: null,
      visible: false
    }
  },
  computed: {
    getClassName () {
      const { status } = this
      let str = ''
      switch (status) {
        case 1:
          str += 'health-primary'
          break
        case 2:
          str += 'health-warn'
          break
        case 3:
          str += 'health-error'
          break
        default:
          str += 'health-primary'
      }
      return str
    },
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
          str = '您当前设备使用时长超过300小时，建议尽快清洗空调滤网，提升室内空气质量，避免影响健康'
          break
        case 3:
          str = '您当前设备使用时长超过500小时，建议尽快清洗空调滤网，提升室内空气质量，避免影响健康'
          break
      }
      return str
    }
  },
  methods: {
    query () {
      this.$gomesmart.req('post', '/v4/app/health/status', { did: this.$gomesmart.did }, (response) => {
        console.log('/health/status')
        if (response && !response.errorCode) {
          this.runtime = response.data.runningTime
          this.status = response.data.status
        }
      })
    }
  },
  mounted () {
    setTimeout(() => {
      this.query()
    }, 350)
  }
}
</script>
<style lang="less" scoped>
  .health {
    font-size: 28px;
    border-bottom:1px solid #ebebeb;
    padding-bottom: 20px;
    .h-row{
      display: flex;
      align-items: center;
      margin-top: 40px;
      .title{
        flex: 1;
        font-size: 30px;
        .runtime{
          font-size: 20px;
          color: #999;
          margin-top: 12px;
        }
        .gm-icon-wenhao{
          width: 28px;
          height: 28px;
          background: url(../assets/img/wenhao.png) no-repeat;
          background-size: 100%;
          position: relative;
          top: -5px;
          display: inline-block;
        }
      }
    }
    &.health-primary .t{
      color: #5CBB9D !important;
    }
    &.health-warn .t{
      color: #FF9B04 !important;
    }
    &.health-error .t{
      color: #F14A27 !important;
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
  }
</style>
