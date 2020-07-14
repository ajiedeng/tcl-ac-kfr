<template>
  <div>
    <div class="box" @click="show" :class="{disabled: disabledClass, selected: group.value>0&&group.key===1004}">
      <span class="circle">
        <i class="iconfont" :class="group.icon"></i>
      </span>
      <span class="name">{{group.name}}</span>
    </div>
    <mt-popup class="popup-acmap" position="bottom" v-model="visible">
      <h5>{{group.name}}</h5>
      <AcSelect :value="value" :options="group.enums" @change="changeHandler"></AcSelect>
      <div class="btns">
        <button type="button" @click="cancel">取消</button>
        <button type="button" @click="save">确认</button>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import AcSelect from './select.vue'
export default {
  props: ['group'],
  components: {
    AcSelect
  },
  data () {
    return {
      visible: false,
      value: this.group.value || ''
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
      this.value = this.group.value
      this.$nextTick(() => {
        this.visible = true
      })
      this.stopScroll();
    },
    changeHandler (key) {
      this.value = key
    },
    save () {
      this.$emit('update', this.group.key, this.value, true)
      this.visible = false
      this.moveScroll()
    },
    cancel () {
      this.visible = false
      this.moveScroll()
    },
    //禁止页面滑动
    stopScroll(){
      document.body.style.position = 'fixed';
    },
    //取消滚动限制
    moveScroll(){
      document.body.style.position = 'initail';//出现滚动条
    }
  }
}
</script>
<style lang="less">
  .popup-acmap{
    width: 100%;
    border-radius:16px 16px 0px 0px;
    h5{
      margin-top: 40px;
      text-align: center;
      font-size: 28px;
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
