import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {map as config} from 'js/config'
import {actions as appActions} from 'app/actions'
// lib/vendor/esri/dojo
import React from 'react'

export class Welcome extends React.Component {
  render () {
    //TODO Figure out why the onClick gets wipes out with SweetAlerts Module
    //onClick={appActions.queryFda(food)}
    let foodControl = (food)=>(
      <button>{food}</button>
    )
    let foodCategories = (
      [for (food of Object.keys(config.foods.individual)) foodControl(config.foods.individual[food])]
    )
    return (
      <div>
        <p className="text-left">{messages.text}</p>
        <h4 className="text-left">{messages.selectHeader}</h4>
        <div>
          {foodCategories}
        </div>
      </div>
    )
  }
}
