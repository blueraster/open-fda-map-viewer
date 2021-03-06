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
            <h2 className='no-margin text-center'>{messages.title}</h2>
            <hr className='popup__hr' />
            <div>{messages.instructions}</div>
            <div className='popup__foodControls'>
              <FoodControls />
            </div>
            <div className="clear"></div>
            <a target='_blank' href='https://open.fda.gov/'><img className="popup__image" src={resources.openFdaImage} /></a>
            <a target='_blank'  href='http://www.blueraster.com/'><img className="popup__image--br" src={resources.blueRasterImage} /></a>
            <a target='_blank' href='https://github.com/blueraster/open-fda-map-viewer' className='text-decoration-none'><h3>View on GitHub</h3></a>
          </div>
        </div>
      )
  }
}
