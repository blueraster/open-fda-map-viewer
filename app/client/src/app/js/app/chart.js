import {store} from 'app/store'
import {actions as appActions} from 'app/actions'
import {ChartTitle} from 'app/chartTitle'
// lib/vendor/shim/esri/dojo
import React from 'react'

export class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
    appActions.setChartContext(document.getElementById('chart').getContext('2d'))
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
      <div>
        <ChartTitle />
        <div className='app-chart no-bottom no-left no-right margin-auto'>
          <canvas id='chart' className='fill'></canvas>
        </div>
      </div>
    )
  }
}
