<template>
  <div>
    <mt-popup class="popup-run-time" v-model="$parent.visible">
      <div class="con">
        <div class="title">健康监测</div>
        <p>健康监测的时间依据是：您的设备从成功绑定后，计算设备每次运行使用时间，离线，断网，断电等场景期间时间不计</p>
      </div>
      <a class="btn" @click="$parent.visible = false">我知道了</a>
    </mt-popup>
  </div>
</template>
<script>
export default {
  methods: {
    close () {
      this.$emit('update', false)
    }
  }
}
</script>
<style scoped lang="less">
  .popup-run-time{
    overflow: hidden;
    width: 80%;
    border-radius: 10px;
    .con{
      padding: 40px;
      .title{
        font-size: 30px;
        font-weight: 700;
        text-align: left;
        color: #333;
        border-left: 4px solid #5CBB9D;
        padding-left: 10px;
      }
      p {
        line-height: 50px;
        margin-top: 20px;
        font-size: 28px;
        text-align: left;
      }
    }
    .btn{
      display: block;
      width: 90%;
      height: 88px;
      background: #5CBB9D;
      border-radius: 10px;
      color: #fff;
      line-height: 88px;
      text-align: center;
      font-size: 32px;
      margin: 30px auto;
    }
  }
</style>
