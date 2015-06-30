// src
import {map as config} from 'js/config'
// lib/vendor/esri/dojo
import React from 'react'
import HomeButton from 'esri/dijit/HomeButton'
import LocateButton from 'esri/dijit/LocateButton'
import Search from 'esri/dijit/Search'

export class Controls extends React.Component {
  componentDidMount() {
    // new HomeButton({map: this.props.map}, 'home-button').startup()
    // new LocateButton({map: this.props.map}, 'locate-button').startup()
  }
  render() {
    return (
      <div>
        <div className='home-button-container z-index-map absolute'><div id={config.controls.ids.home}></div></div>
        <div className='fullscreen-button-container z-index-map absolute'><button className='button--esri' onClick={this.toggleFullscreen}>f</button></div>
      </div>
    )
  }
  toggleFullscreen () {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
      } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
      } else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
      } else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
}
