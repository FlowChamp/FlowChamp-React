import React, { Component } from 'react';

export default class Header extends Component {
	constructor(props) {
		super(props);
      console.log(props);
	}

   handleEvent = (options) => {
      console.log(options);
      this.props.onEvent(options);
   }

   toggleSidebar = () => {
      this.handleEvent({
         type: 'sidebar',
         action: 'toggle',
      });
   }

   render() {
      return (
         <div className="header">
            <div className="header-container left">
               <h3 onClick={this.toggleSidebar}>MENU</h3>
            </div>
            <div className="header-container center">
               <h3>{this.props.name}</h3>
            </div>
            <div className="header-container right"></div>
         </div>
      );
   }
}
