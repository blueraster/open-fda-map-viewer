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
            <h3>{messages.title}</h3>
            <div>{messages.instructions}</div>
            <div className='popup__foodControls'>
              <FoodControls />
            </div>
            <div className="clear"></div>
            <a href='https://open.fda.gov/'><img className="popup__image" src={resources.openFdaImage} /></a>
            <a href='http://www.blueraster.com/'><img className="popup__image--br" src={resources.blueRasterImage} /></a>
            <p>API Project Details ...</p>
            <p>Project Details ...</p>
            <p>BlueRaster Details ...</p>
          </div>
        </div>
      )
  }
}
