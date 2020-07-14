<template>
  <div>
    <div class="box" @click="show" :class="{disabled: disabledClass}">
      <span class="circle">
        <i class="iconfont" :class="group.icon"></i>
      </span>
      <span class="name">{{group.name}}</span>
    </div>
    <mt-popup class="popup-acnumber" position="bottom" v-model="visible">
      <h5>{{group.name}}</h5>
      <div class="rangeBox">
        <div class="high">{{value}}</div>
        <mt-range ref="range" v-model="value" :min="group.minValue" :max="group.maxValue" :step="group.stepLen" :bar-height="0">
          <div class="range-min-max" slot="start">{{group.minValue}}</div>
          <div class="range-min-max" slot="end">{{group.maxValue}}</div>
        </mt-range>
      </div>
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
      value: this.group.value
    }
  },
  computed: {
    disabledClass () {
      return !this.group.operable || (this.group.key !== 0 && !this.$parent.otherParts.onoff)
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
  .popup-acnumber{
    width: 100%;
    border-radius:16px 16px 0px 0px;
    h5{
      margin-top: 40px;
      text-align: center;
      font-size: 28px;
    }
    .rangeBox{
      margin: 90px 70px;
      .high{
        text-align: center;
        font-size: 30px;
        margin-bottom: 20px;
      }
      .mt-range-runway{
        border-radius: 11px;
        height: 12px;
        background: #E8E8E8;
      }
      .mt-range-progress{
        border-radius: 11px 0 0 11px;
        height: 12px !important;
        background: #5CBB9D;
      }
      .range-min-max{
        padding: 0 20px;
        font-size: 30px;
      }
      .mt-range-thumb{
        box-shadow:0px 0px 16px 0px rgba(215,215,215,0.5);
      }
    }
    .btns{
      border-top: 1px solid #e5e5e5;
      button{
        background: transparent;
        border: 0;
        width: 50%;
        font-size: 28px;
        padding: 30px 0;
        text-align: center;
        &:first-child{
          border-right: 1px solid #e5e5e5;
        }
        &:last-child{
          color: #5CBB9D;
        }
      }
    }
  }
</style>
