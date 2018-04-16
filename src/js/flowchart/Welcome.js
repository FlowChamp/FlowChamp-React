import React, { Component } from 'react';

export default class Welcome extends Component {
   render() {
      return (
         <div className={`welcome-container ${this.props.fadeOut ? 'faded' : ''}`}>
            <img alt="FlowChamp Logo" src="images/icons/logo.svg"/>
            <h3 className="welcome-title">FlowChamp</h3>
         </div>
      );
   }
}
