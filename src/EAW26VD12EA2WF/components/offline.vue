<template>
  <div>
      <mt-popup class="popup-offline" v-model="$parent.mintParams.offlineVisible">
        <div class="title">
          温馨提示
        </div>
        <div class="con">
          <p>当前设备已离线，请检查：</p>
          <p class="info">1.设备是否断电，如断电请重新通电</p>
          <p class="info">2.设备是否断网，如断网请重新联网</p>
        </div>
        <a class="btn" @click="$parent.mintParams.offlineVisible = false">我知道了</a>
      </mt-popup>
  </div>
</template>
<style scoped lang="less">
  .popup-offline{
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
      text-align: left;
      padding: 0 40px;
      line-height: 45px;
      font-size: 28px;
      p{
        color: #333;
        margin-bottom: 12px;
        &.info{
          color: #666;
          margin-bottom: 0;
        }
      }
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
      box-shadow: 4px 10px 5px #5CBB9D;
    }
  }
</style>
