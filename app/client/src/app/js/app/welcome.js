import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions as appActions} from 'app/actions'
import {panel as config} from 'js/config'
import {FoodControls} from 'app/foodControls'

// lib/vendor/esri/dojo
import React from 'react'

export class Welcome extends React.Component {
  render () {
    return (
        <div className='popup'>
          <div className='popup__film'></div>
          <div className='popup__inner'>
            <h2>{messages.welcome}</h2>
            <h3>{messages.title}</h3>
            <div className='popup__foodControls'>
              <FoodControls />
            </div>
            <div className="clear"></div>
            <img className="popup__image" src={resources.openFdaImage} />
            <img className="popup__image" src={resources.blueRasterImage} />
            <p>API Project Details ...</p>
            <p>Project Details ...</p>
            <p>BlueRaster Details ...</p>
          </div>
        </div>
      )
  }
}
