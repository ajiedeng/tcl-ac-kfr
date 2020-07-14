<template>
  <div>
    <div class="box" @click="show" :class="{disabled: disabledClass}">
      <span class="circle">
        <i class="iconfont" :class="group.icon"></i>
      </span>
      <span class="name">{{group.name}}</span>
    </div>
    <mt-popup class="popup-acstring" position="center" v-model="visible">
      <h5>{{group.name}}</h5>
      <input class="textInput" type="text" v-model="value" placeholder="请输入" />
      <div class="btns">
        <button type="button" @click="visible=false">取消</button>
        <button type="button" @click="save">确认</button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
export default {
  props: ['group'],
  data () {
    return {
      visible: false,
      value: this.group.value || ''
    }
  },
  watch: {
    visible (n) {
      const el = document.getElementsByClassName('footer-item-container')[0]
      if (n) {
        el.style.overflow = 'visible'
      } else {
        setTimeout(() => {
          el.removeAttribute('style')
        }, 300)
      }
    }
  },
  computed: {
    disabledClass () {
      return !this.group.operable || (this.group.key !== 0 && !this.$parent.otherParts.onoff)
    }
  },
  methods: {
    show () {
      if (!this.$parent.otherParts.online) {
        this.$parent.mintParams.offlineVisible = true
        return
      }
      if (!this.$parent.otherParts.onoff) {
        return this.$toast('请开启空调')
      }
      if (!this.group.operable) return
      this.visible = true
      this.value = this.group.value
    },
    changeHandler (key) {
      this.value = key
    },
    save () {
      this.$emit('update', this.group.key, this.value, true)
      this.visible = false
    }
  }
}
</script>
<style lang="less">
  .popup-acstring{
    width: 80%;
    border-radius:16px;
    h5{
      margin-top: 40px;
      text-align: center;
      font-size: 38px;
    }
    .textInput{
      height: 60px;
      width: 80%;
      border-radius:6px;
      border: 1px solid #979797;
      margin: 40px auto;
      padding: 0 10px;
      display: block;
    }
    .btns{
      border-top: 1px solid #e5e5e5;
      button{
        background: #ccc;
        border: 0;
        color: #fff;
        width: 50%;
        font-size: 32px;
        padding: 28px 0;
        text-align: center;
        &:last-child{
          background: #5CBB9D;
        }
      }
    }
  }
</style>
