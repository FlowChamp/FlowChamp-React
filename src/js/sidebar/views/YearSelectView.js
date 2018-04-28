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
      UserManager.updateConfig({
         field: 'starting_year',
         value: year
      });
   }

   getYearButtons() {
      const currentYear = new Date().getFullYear();
      let buttons = [];
      console.log(this.props);

      for (let i=currentYear; i>currentYear-10; i--) {
         buttons.push(
            <NavButton
               key={i}
               name={i}
               index={i}
               action={{
                  type: 'user-update',
                  value: {
                     config: this.props.data,
                     field: 'starting_year',
                     value: i
                  }
               }}
               onEvent={this.handleEvent}
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
