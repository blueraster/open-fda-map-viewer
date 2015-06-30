import {messages} from 'js/messages'
import {resources} from 'js/resources'
import {actions as appActions} from 'app/actions'
// lib/vendor/esri/dojo
import React from 'react'
// import {DropModal as Modal} from 'boron'
// var Modal = require('boron/DropModal');
export class Welcome extends React.createClass {
  showModal(){
    this.refs.modal.show()
  }
  hideModal(){
    this.refs.modal.hide()

  }
  render () {
    //onClick={appActions.queryFda(food)}
    // let foodControl = (food)=>(
    //   <button>{food}</button>
    // )
    // let foodCategories = (
    //   [for (food of Object.keys(config.foods.individual)) foodControl(config.foods.individual[food])]
    // )
    return (
      <button onClick={this.showModal.bind(this)}>Open</button>
      // <Modal ref="modal">
      //     <h2>I'm a dialog</h2>
      //     <button onClick={this.hideModal.bind(this)}>Close</button>
      // </Modal>
    )
  }
}


      // <div>
      //   <p className="text-left">{messages.text}</p>
      //   <h4 className="text-left">{messages.selectHeader}</h4>
      //   <div>
      //     {foodCategories}
      //   </div>
      // </div>

// showModal: function(){
//         this.refs.modal.show();
//     },
//     hideModal: function(){
//         this.refs.modal.hide();
//     },
//     render: function() {
//         return (
//             <button onClick={this.showModal}>Open</button>
//             <Modal ref="modal">
//                 <h2>I'm a dialog</h2>
//                 <button onClick={this.hideModal}>Close</button>
//             </Modal>
//         );
//     }
