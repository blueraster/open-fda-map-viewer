import {actions} from 'app/actions'
import {panel as panelConfig} from 'js/config'
//
import React from 'react'

export class FoodControls extends React.Component {
  render () {
    let foodControl = (food) => <button onClick={() => {actions.queryFda(food)}}>{food}</button>,
        foodGroupControl = (group, foods) => (
          <div className='inline-block'>
            <button onClick={() => {actions.queryFda(document.getElementById(panelConfig.ids.bacteriaSelect).value)}}>{group[0].toUpperCase() + group.substr(1)}</button>
            <select id={panelConfig.ids.bacteriaSelect}>
              {[for (food of foods) <option>{food}</option>]}
            </select>
          </div>
        ),
        foodControls

    foodControls = [for (food of Object.keys(panelConfig.foods.individual)) foodControl(panelConfig.foods.individual[food])]
    foodControls = foodControls.concat([for (group of Object.keys(panelConfig.foods.nested)) foodGroupControl(group, [for (food of panelConfig.foods.nested[group]) food])])
    return (
      <div className='text-black'>
        {foodControls}
      </div>
    )
  }
}
