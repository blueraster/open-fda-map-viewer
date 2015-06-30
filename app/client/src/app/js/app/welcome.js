import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions as appActions} from 'app/actions'
import {panel as config} from 'js/config'
// lib/vendor/esri/dojo
import React from 'react'

export class Welcome extends React.Component {
  open () {
  }
  close (){
    let closeIcon = document.getElementsByClassName('popup')
    closeIcon[0].classList.add('hidden')
  }
  render () {
    let foodControl = (food) => <button onClick={() => {appActions.queryFda(food)}}>{food}</button>
    let foodGroupControl = (group, foods) => (
          <div className='inline-block'>
            <button onClick={() => {appActions.queryFda(document.getElementById(config.ids.bacteriaSelect).value)}}>{group[0].toUpperCase() + group.substr(1)}</button>
            <select id={config.ids.bacteriaSelect}>
              {[for (food of foods) <option>{food}</option>]}
            </select>
          </div>
        ),
    foodControls

    foodControls = [for (food of Object.keys(config.foods.individual)) foodControl(config.foods.individual[food])]
    foodControls = foodControls.concat([for (group of Object.keys(config.foods.nested)) foodGroupControl(group, [for (food of config.foods.nested[group]) food])])
    return (
        <div className='popup'>
          <div className='popup__film'></div>
          <div className='popup__inner'>
            <h2>{messages.welcome}</h2>
            <h3>{messages.title}</h3>
            {foodControls}
            <div className="clear"></div>
            <img className="popup__image" src={resources.openFdaImage} />
            <img className="popup__image" src={resources.blueRasterImage} />
          </div>
        </div>
      )
  }
}
