import React from 'react'
import {store} from 'app/store'

export class ChartTitle extends React.Component {
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
    return (
      <div className='text-center'>{this.state.foodToQuery} Recalls for {this.state.timeseriesYear}</div>
    )
  }
}
