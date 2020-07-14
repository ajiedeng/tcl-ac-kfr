<template>
  <ul class="ac-select">
    <template v-for="(it, index) in options">
      <li :key="index" :class="{selected: it.key === value}"  @click="changeHandler(it.key)" v-if="!it.disabled">{{it.value}}</li>
    </template>
  </ul>
</template>
<script>
export default {
  props: ['options', 'value'],
  methods: {
    changeHandler (key) {
      this.$emit('change', key)
    }
  }
}
</script>
<style lang="less">
  ul.ac-select{
    padding: 0 30px;
    & > li{
      padding: 40px 0;
      border-bottom: 1px solid #e5e5e5;
      font-size: 30px;
      position: relative;
      &:last-child{
        border-bottom: none;
      }
      &.selected{
        color: #5CBB9D;
        &::before{
          content: "\e80f";
          font-family: "iconfont" !important;
          font-size: 30px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          position: absolute;
          right: 0;
        }
      }
    }
  }
</style>
