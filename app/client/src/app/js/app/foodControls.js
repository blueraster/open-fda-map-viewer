import {actions} from 'app/actions'
import {panel as panelConfig} from 'js/config'
import {store as appStore} from 'app/store'
//
import React from 'react'

export class FoodControls extends React.Component {
  constructor (props) {
    super(props)
    this.state = appStore.getState()
  }
  componentDidMount () {
    appStore.listen(this.onChange.bind(this))
  }
  componentWillUnmount () {
    appStore.unlisten(this.onChange)
  }
  onChange (state) {
    this.setState(state)
  }
  render () {
    let count =0;
    let foodControl = (food, label = food) => {

          let className = 'foodControls__button'

          if (food === this.state.foodToQuery) {className = className += ' active'}
          if (count<4) {className = className += ' four'}
          if (count>3 && count <7) {className = className += ' three'}
          if (count>=7 && count <10) {className = className += ' three'}
          count = count +1;
          return <button className={className} onClick={() => {actions.queryFda(food)}}>{label}</button>
        },
        foodGroupControl = (foods) => (
          <div className='inline-block full'>
            {[for (food of foods) foodControl(food)]}
          </div>
        ),
        foodControls = [<span className='foodControls__label'break>Foods:</span>]

    foodControls = foodControls.concat([for (food of Object.keys(panelConfig.foods.individual)) foodControl(panelConfig.foods.individual[food])])
    foodControls = foodControls.concat([<span className='foodControls__label'>Contaminants:</span>])
    foodControls = foodControls.concat([for (group of Object.keys(panelConfig.foods.nested)) foodGroupControl([for (food of panelConfig.foods.nested[group]) food])])
    foodControls = foodControls.concat([<span className='foodControls__label'>Severity:</span>])
    foodControls = foodControls.concat([foodControl('Class III', 'Low'), foodControl('Class II', 'Medium'), foodControl('Class I', 'High')])

    return (
      <div className='foodControls'>
        {foodControls}
      </div>
    )
  }
}
