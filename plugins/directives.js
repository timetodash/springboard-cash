'use strict'

import Vue from 'vue'
import linkifyStr from 'linkifyjs/string'

const EmojiConvertor = require('emoji-js')
const emoji = new EmojiConvertor()
emoji.img_set = 'twitter'
emoji.replace_mode = 'css'

Vue.directive('linkify', {
  bind: (el, binding) => {
    const linkified = linkifyStr(binding.value, {
      target: { url: '_blank', email: '_blank' },
      nl2br: true,
    })
    el.innerHTML = emoji.replace_colons(linkified)
  },
})
