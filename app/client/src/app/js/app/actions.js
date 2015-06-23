import {dispatcher} from 'js/dispatcher'
import {app as config} from 'js/config'
import {messages} from 'js/messages'

export const actions = dispatcher.createActions(class {
  init () {
    document.title = messages.title
    document.body.className = config.dojoTheme
    this.dispatch()
  }
})
