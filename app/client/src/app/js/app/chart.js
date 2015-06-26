import {store} from 'app/store'
// lib/vendor/shim/esri/dojo
import React from 'react'

export class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
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
      <div className='app-chart absolute back-white overflow-auto'>
        <div>Time series data:</div>
        <div className='border-black'>{data}</div>
      </div>
    )
  }
}
