import React, { Component } from 'react';

export default class MainView extends Component {
   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-main-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <img alt="logo" className="sidebar-logo" src="images/icons/logo.svg"/>
            <h3 className="sidebar-subheader">Flowcharts</h3>
            <ChartSelectWidget
               {...this.props}
               onEvent={this.handleEvent} />
         </div>
      );
   }
}

class ChartSelectWidget extends Component {
   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   newChart = () => {
      if (!this.props.user.isLoggedIn && this.props.user.requireAuth) {
         this.handleEvent({
            type: 'change-view',
            value: 'login',
         });
      } else {
         this.handleEvent({
            type: 'change-view',
            value: 'chartSelect',
            demo: true,
         });
      }
   }

   render() {
      return (
         <div className="chart-select-container">
            <h3 className="new-chart-button"
             onClick={this.newChart}>+</h3>
         </div>
      );
   }
}
