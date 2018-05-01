import React, { Component } from 'react';
import ToggleButton from '../components/ToggleButton';
import NavButton from '../components/NavButton';

export default class SettingsView extends Component {
   getSettingsEvents = () => {
      return {
         'clear-cache': {
            type: 'button',
            label: 'Clear cache',
            action: {
               type: 'clear-cache'
            }
         }
      };
   }

   handleEvent = (options) => {
      switch(options.type) {
         case 'clear-cache':
            localStorage.flowChampConfig = null;
            window.location.reload();
            break;
         default:
            this.props.onEvent(options);
            break;
      }
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
         } else {
            settingsButtons.push(
               <NavButton
                  key={options.label}
                  text={options.label}
                  action={options.action}
                  onEvent={this.handleEvent}/>
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
