import {actions} from 'app/actions'
import {panel as panelConfig} from 'js/config'
//
import React from 'react'

export class FoodControls extends React.Component {
  render () {
    let foodControl = (food) => <button className='foodControls__button' onClick={() => {actions.queryFda(food)}}>{food}</button>,
        foodGroupControl = (foods) => (
          <div className='inline-block'>
            {[for (food of foods) foodControl(food)]}
          </div>
        ),
        foodControls = [<span className='foodControls__label'break>Foods:</span>]

    foodControls = foodControls.concat([for (food of Object.keys(panelConfig.foods.individual)) foodControl(panelConfig.foods.individual[food])])
    foodControls = foodControls.concat([<span className='foodControls__label'>Contaminants:</span>])
    foodControls = foodControls.concat([for (group of Object.keys(panelConfig.foods.nested)) foodGroupControl([for (food of panelConfig.foods.nested[group]) food])])
    foodControls = foodControls.concat([<span className='foodControls__label'>Severity:</span>, foodGroupControl(['Class I', 'Class II', 'Class III'])])

    return (
      <div className='foodControls'>
        {foodControls}
      </div>
    )
  }
}
