import {actions} from 'app/actions'
import {panel as panelConfig} from 'js/config'
//
import React from 'react'

export class FoodControls extends React.Component {
  render () {
    let foodControl = (food) => <button onClick={() => {actions.queryFda(food)}}>{food}</button>,
        foodGroupControl = (group, foods) => (
          <div className='inline-block'>
            {[for (food of foods) foodControl(food)]}
          </div>
        ),
        foodControls = [<span>Foods:</span>]

    foodControls = foodControls.concat([for (food of Object.keys(panelConfig.foods.individual)) foodControl(panelConfig.foods.individual[food])])
    foodControls = foodControls.concat([<span className='text-white'>Bacteria:</span>])
    foodControls = foodControls.concat([for (group of Object.keys(panelConfig.foods.nested)) foodGroupControl(group, [for (food of panelConfig.foods.nested[group]) food])])
    return (
      <div className='foodControls'>
        {foodControls}
      </div>
    )
  }
}
