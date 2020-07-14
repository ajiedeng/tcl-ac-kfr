<template>
  <div class="ac-spinner-container" v-show="show">
    <div class="v-spinner-box">
      <div class="v-spinner">
        <div class="v-moon"></div>
      </div>
      <div class="spinner-text" style="line-height: 40px; height: 40px;" v-if="text">{{text}}</div>
    </div>
    <div class="v-spinner-mask"></div>
  </div>
</template>
<script>
export default {
  name: 'ac-spinner'
}
</script>
<style lang="less">
  .ac-spinner-container{
    .v-spinner-mask{
      content: '';
      display: block;
      top: 0;
      left: 0;
      background: #000;
      position: fixed;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 99;
    }
    .v-clip{
      border-width:  5px;
    }
    .v-spinner-box{
      position: fixed;
      z-index: 2;
      text-align: center;
      transform: translate(-50%,-50%);
      top: 50%;
      left: 50%;
      z-index: 100;
      padding: 30px;
      &:after{
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: #000;
        opacity: 0.5;
        z-index: -1;
      }
      .spinner-text{
        color: #fff;
        font-size: 30px;
        margin-top: 10px;
      }
    }
    .v-spinner .v-moon {
      margin: 0 auto;
      -webkit-animation: mint-spinner-rotate 0.8s infinite linear;
              animation: mint-spinner-rotate 0.8s infinite linear;
      border: 8px solid transparent;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      border-top-color: #cccccc;
      border-left-color: #cccccc;
      border-bottom-color: #cccccc;
    }

    @-webkit-keyframes mint-spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }
    @keyframes mint-spinner-rotate {
    0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }
  }
</style>
