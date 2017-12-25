import Vue from 'vue'
import $ from 'jquery'

Vue.directive('validator', {
  update: function (el, binding, vnode) {
    if (binding.value && binding.value !== binding.oldValue) {
      $(el).find('.validate').children().addClass('border-danger').parent().append('<div class="text-danger mt5"><i class="fa fa-warning"></i>' + binding.value + '</div>')
    } else if (!binding.value) {
      $(el).find('.validate').children().removeClass('border-danger').next('div').remove()
    }
  }
})
