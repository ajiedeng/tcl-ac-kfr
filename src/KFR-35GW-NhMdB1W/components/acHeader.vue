<template>
  <div :style="{paddingTop: marginTop}">
    <mt-header class="header" :title="title" :style="{marginTop: 0}">
      <mt-button icon="back" slot="left" @click="goBack"></mt-button>
      <mt-button icon="more" slot="right" @click="clickMore"></mt-button>
    </mt-header>
  </div>
</template>
<script>
export default {
  props: ['title'],
  data () {
    return {
      marginTop: '0'
    }
  },
  methods: {
    clickMore () {
      this.$gomesmart.navigationTo('deviceMore')
    },
    goBack () {
      this.$gomesmart.navigationTo('deviceClose')
    }
  },
  mounted () {
    this.$gomesmart.getStatusBarHeight(height => {
      this.marginTop = height + 'px'
    })
  }
}
</script>
