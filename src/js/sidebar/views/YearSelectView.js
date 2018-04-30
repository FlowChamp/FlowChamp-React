import React, { Component } from 'react';
import NavButton from '../components/NavButton';
import UserManager from '../../UserManager';

export default class YearSelectView extends Component {
	constructor(props) {
		super(props);
      this.state = {
         viewStack: [],
         data: [],
      };
      this.handleEvent = this.handleEvent.bind(this);
	}

   handleEvent(options) {
      switch(options.type) {
         case 'user-update':
            UserManager.updateConfig(options);
            break;
         default:
            this.props.onEvent(options);
            break;
      }
   }

   setYear = year => {
      console.log(this.props);
      UserManager.updateConfig({
         config: this.props.user.config,
         field: 'start_year',
         value: year
      }).then(response => {
         this.props.onEvent({
            type: 'change-view',
            value: this.props.route
         });
      }).catch(e => {
         console.log("Error when updating config:");
         console.log(e);
      });
   }

   getYearButtons() {
      const currentYear = new Date().getFullYear();
      let buttons = [];

      for (let i=currentYear; i>currentYear-10; i--) {
         buttons.push(
            <NavButton
               key={i}
               name={i}
               index={i}
               data={i}
               onEvent={this.setYear}
               text={i} />
         );
      }
      return buttons;
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-chart-select-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <h2 className="sidebar-header">{this.props.header}</h2>
            {this.getYearButtons()}
         </div>
      );
   }
}
