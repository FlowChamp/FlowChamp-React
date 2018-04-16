import React, { Component } from 'react';
import ToggleButton from '../components/ToggleButton';

export default class SettingsView extends Component {
	constructor(props) {
		super(props);
      this.state = {
      };
	}

   getSettingsEvents = () => {
      const isDemo = this.props.isDemo;
      return {
         'demo': {
            type: 'toggle',
            label: 'Demo Mode',
            value: isDemo,
            action: {
               type: 'demo'
            }
         }
      };
   }

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   getSettingsButtons = () => {
      let settingsButtons = [];
      const events = this.getSettingsEvents();

      for (let event in events) {
         const options = events[event];
         if (options.type === "toggle") {
            settingsButtons.push(
               <ToggleButton {...options}
                  key={options.label}
                  checked={options.value}
                  onEvent={() => {this.handleEvent(options.action)}}/>
            );
         }
      }
      return settingsButtons;
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-settings-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <h2 className="sidebar-header">{this.props.header}</h2>
            <div className="button-container">
               {this.getSettingsButtons()}
            </div>
         </div>
      );
   }
}
