import React, { Component } from 'react';

export default class SettingsView extends Component {
	constructor(props) {
		super(props);
      this.state = {
      };
	}

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-settings-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <h2 className="sidebar-header">{this.props.header}</h2>
         </div>
      );
   }
}
