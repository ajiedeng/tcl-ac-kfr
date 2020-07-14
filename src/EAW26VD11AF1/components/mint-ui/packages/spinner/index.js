import vue from 'vue'
import Spinner from './spinner.vue'

const SpinnerConstructor = vue.extend(Spinner)

const spinnerDom = new SpinnerConstructor({
  el: document.createElement('div'),
  data () {
    return {
      text: '',
      show: false
    }
  }
})

function open (text) {
  document.getElementsByClassName('h5-container')[0].appendChild(spinnerDom.$el)
  spinnerDom.text = text || ''
  spinnerDom.show = true
}

function close () {
  spinnerDom.text = ''
  spinnerDom.show = false
}

function install () {
  vue.prototype.$spinner = {
    open,
    close
  }
}

export default install
