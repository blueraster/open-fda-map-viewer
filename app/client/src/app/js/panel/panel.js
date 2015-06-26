import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions} from 'app/actions'
import {store} from 'panel/store'

// lib/vendor/esri/dojo
import React from 'react'

export class Panel extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
    actions.mapInit()
  }
  componentWillUnmount () {
    store.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    return (
        <div className='app__panel'>
          <div>Open FDA Enforcement MAPPER</div>
          <div>
            <select>
              <option>Joe's Sauce</option>
            </select>
            <div>total event count</div>
            <ul>
              <li>event 1</li>
              <li>event 2</li>
              <li>event 3</li>
              <li>event 4</li>
            </ul>
            <div>Event Details</div>
            <div>
              <ul>
                <li>attribute</li>
                <li>attribute</li>
                <li>attribute</li>
              </ul>
            </div>
          </div>
        </div>
    )
  }
}
