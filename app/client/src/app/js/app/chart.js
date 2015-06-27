import {store} from 'app/store'
import {actions as appActions} from 'app/actions'
// lib/vendor/shim/esri/dojo
import React from 'react'

export class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
    appActions.initChart(document.getElementById('chart').getContext('2d'))
  }
  componentWillUnmount () {
    store.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    let data = this.state.timeseries === undefined ? undefined : JSON.stringify(this.state.timeseries)
    return (
      <div className='app-chart border-box absolute back-transparent overflow-auto'>
        <canvas id='chart' className='fill'></canvas>
      </div>
    )
  }
}
