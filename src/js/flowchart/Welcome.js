import React, { Component } from 'react';

export default class Welcome extends Component {
   render() {
      return (
         <div className={`welcome-container ${this.props.fadeOut ? 'faded' : ''}`}>
            <div className="logo-container">
               <img className="logo" alt="FlowChamp Logo" src="images/icons/logo.svg"/>
               <img className="logo-back-1" alt="FlowChamp Logo" src="images/icons/light_gray_box.svg"/>
               <img className="logo-back-2" alt="FlowChamp Logo" src="images/icons/dark_gray_box.svg"/>
            </div>
            <img className="welcome-title" alt="flowchamp" src="images/icons/flowchamp.svg" />
         </div>
      );
   }
}
