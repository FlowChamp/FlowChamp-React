import React, { Component } from 'react';
import { Menu } from 'react-feather';

export default class Header extends Component {
   handleEvent = (options) => {
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
               <Menu className="menu-icon" onClick={this.toggleSidebar}/>
            </div>
            <div className="header-container center">
               <h3 className="header-title">{this.props.name}</h3>
            </div>
            <div className="header-container right"></div>
         </div>
      );
   }
}
