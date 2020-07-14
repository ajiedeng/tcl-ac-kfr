<template>
  <div>
    <div class="box" @click="save" :class="{selected: group.value == 1, disabled: disabledClass}">
      <span class="circle">
        <i class="iconfont" :class="group.icon"></i>
      </span>
      <span class="name">{{group.name}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['group'],
  computed: {
    disabledClass () {
      return !this.group.operable || (this.group.key !== 0 &&this.group.key !== 38&& !this.$parent.otherParts.onoff)
    }
  },
  methods: {
    save () {
      if (!this.$parent.otherParts.online) {
        this.$parent.mintParams.offlineVisible = true
        return
      }
      if (!this.$parent.otherParts.onoff && this.group.key !== 0 && this.group.key !==38) {
        return this.$toast('请开启空调')
      }
      if (!this.group.operable) return
      this.$emit('update', this.group.key, String(this.group.value) === '1' ? '0' : '1', true)
    }
  }
}
</script>
