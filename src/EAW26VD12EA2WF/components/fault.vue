<template>
  <div class="faultBox">
    <mt-cell title="故障检测" :label="description" :class="{isFault: this.fault}">
      <button class="gm-btn gm-btn-primary" @click="check">立即检查</button>
    </mt-cell>
    <mt-popup class="popup-fault-prompt" v-model="show">
      <div class="title">
        温馨提示
      </div>
      <div class="con">
        抱歉，当前设备暂不支持该服务
      </div>
      <a class="btn" @click="show = false">知道啦</a>
    </mt-popup>
  </div>
</template>
<script>
export default {
  props: ['fault', 'disabled', 'other'],
  data () {
    return {
      show: false,
      env: null,
      loaded: true
    }
  },
  computed: {
    description () {
      return this.fault ? '您当前设备疑似出现故障，建议立刻检测' : '全方面的故障检测，省事省力省心'
    }
  },
  methods: {
    check () {
      if (!this.other.online) {
        this.$emit('break')
        return
      }
      this.$gomesmart.navigateToFault((bool) => {
        if (!bool) {
          this.show = true
        }
      })
    }
  }
}
</script>
<style lang="less">
.faultBox{
  margin-top: 36px;
  .mint-cell-text{
    font-size: 30px;
  }
  .mint-cell-label{
    font-size: 20px;
    margin-top: 12px;
  }
  .mint-cell-wrapper{
    background-image: none;
  }
  .isFault {
    .mint-cell-label{
      color: #FF9B04;
    }
  }
}
.popup-fault-prompt{
  width: 80%;
  border-radius: 10px;
  overflow: hidden;
  .title{
    font-size: 38px;
    margin: 40px 0;
    font-weight: 700;
    text-align: center;
    color: #333;
  }
  .con{
    text-align: center;
    padding: 0 40px;
    line-height: 45px;
    font-size: 28px;
    margin-bottom: 52px;
  }
  .btn{
    display: inline-block;
    width: 100%;
    height: 88px;
    background: #5CBB9D;
    color: #fff;
    line-height: 88px;
    text-align: center;
    font-size: 32px;
    margin: 30px auto 0;
    display: block;
  }
}
</style>
