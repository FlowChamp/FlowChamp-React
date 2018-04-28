import React, { Component } from 'react';

export default class NavButton extends Component {
   handleEvent = () => {
      this.props.onEvent(this.props.action);
   }

   render() {
      return (
         <div className="nav-button" onClick={() => this.handleEvent()}>
            <h3>{this.props.text}</h3>
         </div>
      );
   }
}
