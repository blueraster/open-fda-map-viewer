import {store} from 'app/store'
// lib/vendor/shim/esri/dojo
import React from 'react'
import Chartjs from 'Chartjs'

export class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.state = store.getState()
  }
  componentDidMount () {
    store.listen(this.onChange.bind(this))
    // // console
    let context = document.getElementById('chart').getContext('2d')

    // // var myLineChart = new Chart(ctx).Line(data, options);
    // // Data structure

    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            // {
            //     label: "My First dataset",
            //     fillColor: "rgba(220,220,220,0.2)",
            //     strokeColor: "rgba(220,220,220,1)",
            //     pointColor: "rgba(220,220,220,1)",
            //     pointStrokeColor: "#fff",
            //     pointHighlightFill: "#fff",
            //     pointHighlightStroke: "rgba(220,220,220,1)",
            //     data: [65, 59, 80, 81, 56, 55, 40]
            // },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    }
    let chart = new Chartjs(context).Line(data, {})
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
      <div className='app-chart border-box absolute padding back-transparent overflow-auto'>
        <canvas id='chart' className='fill'></canvas>
      </div>
    )
  }
}
