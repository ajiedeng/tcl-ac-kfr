<template>
  <div>
    <div v-transfer-dom>
      <popup class="timing-popup" :value="$parent.timingVisible" @on-hide="$parent.timingVisible = false">
        <popup-header left-text="&lt;" right-text="保存" @on-click-left="$parent.timingVisible = false" @on-click-right="save" title="定时"></popup-header>
        <group gutter="0">
          <radio v-model="value" :options="lists" @on-change="radioChange"></radio>
        </group>
        <cell class="timing-cell" title="自定义" is-link @click.native="setClock">
          <div class="timing">
            <span style="color: #5CBB9D;" v-if="selfDefined">{{count[0]}}小时{{count[1]}}分钟</span>
            <span v-if="!selfDefined">请选择</span>
          </div>
        </cell>
      </popup>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="visible" class="timing-dialog">
        <h4>时间选择</h4>
        <picker :data="counts" v-model="count"></picker>
        <div class="btns">
          <button class="btn-cancel" @click="visible = false">取消</button>
          <button class="btn-sure" @click="setSelfTime">确定</button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
import { PopupHeader, Popup, TransferDom, Group, XSwitch, Radio, Cell, Picker, XDialog } from 'vux'
export default {
  directives: {
    TransferDom
  },
  data () {
    return {
      counts: [
        Array.from(Array(24), (v, k) => {
          return {
            value: String(k),
            name: k + '小时'
          }
        }),
        Array.from(Array(59), (v, k) => {
          return {
            value: String(k + 1),
            name: k + 1 + '分钟'
          }
        })
      ],
      count: [],
      visible: false,
      lists: [{
        key: 1,
        timestamp: 0,
        value: '关闭'
      }, {
        key: 2,
        timestamp: 30 * 60,
        value: '30分钟'
      }, {
        key: 3,
        timestamp: 1 * 60 * 60,
        value: '1小时'
      }, {
        key: 4,
        timestamp: 1.5 * 60 * 60,
        value: '1.5小时'
      }, {
        key: 5,
        timestamp: 2 * 60 * 60,
        value: '2小时'
      }, {
        key: 6,
        timestamp: 2.5 * 60 * 60,
        value: '2.5小时'
      }, {
        key: 7,
        timestamp: 3 * 60 * 60,
        value: '3小时'
      }],
      value: 1,
      selfDefined: false
    }
  },
  components: {
    PopupHeader,
    Popup,
    Group,
    Radio,
    XSwitch,
    Cell,
    Picker,
    XDialog
  },
  methods: {
    setClock () {
      this.visible = true
    },
    radioChange (value) {
      this.selfDefined = false
    },
    save () {
      this.$parent.timingVisible = false
      let result
      if (this.value) {
        result = this.lists.filter(it => it.key === this.value)[0].timestamp
      } else {
        result = this.count[0] * 3600 + this.count[1] * 60
      }
      this.$emit('modify', result)
    },
    setSelfTime () {
      if (this.count.length === 2) {
        this.value = null
        this.$nextTick(() => {
          this.selfDefined = true
        })
      }
      this.visible = false
    }
  }
}
</script>
<style lang="less">
 @baserem: 1/75rem;
  .timing-popup{
    background: #fff;
    .weui-cells{
      font-size: 26 * @baserem;
      .weui-cell{
        height: @baserem * 50;
      }
    }
    .timing-cell{
      font-size: 28 * @baserem;
      .timing{
        padding: .3rem 0;
      }
      &:before{
        display: none;
      }
    }
    .vux-popup-header-left{
      font-size: 25px;
      font-family: serif,sans-serif,monospace,cursive,fantasy,arial;
      font-weight: 700;
    }
  }
  .timing-dialog{
    .weui-dialog{
      bottom: 0;
      width: 100%;
      max-width: none;
      top: auto;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      h4{
        font-size: 16px;
        line-height: 2rem;
        border-bottom: 1px solid #e5e5e5;
        margin: 0 .7rem;
      }
      .btns {
        border-top: 1px solid #e5e5e5;
        margin-top: @baserem * 10;
        height: @baserem * 80;
        padding-top: @baserem * 10;
        button{
          width: 50%;
          display: block;
          float: left;
          height: @baserem * 60;
          background: none;
          border: none;
          font-size: @baserem * 28;
          & + button{
            border-left: 1px solid #e5e5e5;
            color: #5CBB9D;
          }
        }
      }
    }
  }
</style>