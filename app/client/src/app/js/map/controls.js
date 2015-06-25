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
        <div className='search-container z-index-map absolute'><div id={config.controls.ids.search}></div></div>
        <div className='locate-button-container z-index-map absolute'><div id={config.controls.ids.locate}></div></div>
        <div className='home-button-container z-index-map absolute'><div id={config.controls.ids.home}></div></div>
      </div>
    )
  }
}
