import React, { Component } from 'react';
import ChartButton from '../components/ChartButton';
import UserManager from '../../UserManager';

export default class MainView extends Component {
   handleEvent = (options) => {
      switch(options.type) {
         case 'set-active-chart':
            this.setActiveChart(options);
            break;
         case 'delete-chart':
            this.deleteChart(options);
            break;
         default:
            this.props.onEvent(options);
            break;
      }
   }

   setActiveChart(options) {
      let config = this.props.user.config;

      config.active_chart = options.value;
      this.handleEvent({
         type: 'update-user-config',
         value: config
      });
   }

   deleteChart = options => {
      const chartName = options.value;
      let config = this.props.user.config;
      const activeChart = config['active_chart'];
      let stateOnly = true;

      UserManager.deleteChart({
         config: config,
         chartName: chartName
      }).then(response => {
         config = response;

         if (!config.active_chart) {
            config.active_chart = Object.keys(config.charts)[0];
            stateOnly = false;
         }
         this.handleEvent({
            type: 'update-user-config',
            value: config,
            stateOnly: stateOnly
         });
      }).catch(e => {
         console.error("Unable to delete chart", e);
      });
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-main-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <img alt="logo" className="sidebar-logo" src="images/icons/logo_blue.svg"/>
            <h3 className="sidebar-subheader">Flowcharts</h3>
            <ChartSelectWidget
               {...this.props}
               onEvent={this.handleEvent} />
         </div>
      );
   }
}

class ChartSelectWidget extends Component {
   constructor() {
      super();
      this.state = {
         charts: null,
      }
   }

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   getChartData = () => {
      if (!this.props.user.isLoggedIn) {
         return;
      }
      this.setState({charts: this.props.user.config.charts});
   }

   getChartButtons = () => {
      if (!this.props.user.isLoggedIn) {
         return;
      }
      const config = this.props.user.config;
      const chartButtons = [];

      for (let name in config.charts) {
         chartButtons.push(
            <ChartButton
               key={name}
               isActive={config['active_chart'] === name}
               chartName={name}
               stockChartName={config.charts[name]}
               onEvent={this.handleEvent}
               />
         );
      }
      return chartButtons;
   }

   newChart = () => {
      if (!this.props.user.isLoggedIn) {
         this.handleEvent({
            type: 'change-view',
            value: 'login',
            // Where to go after user logged in
            route: 'chartSelect',
         });
      } else {
         this.handleEvent({
            type: 'change-view',
            value: 'chartSelect',
         });
      }
   }

   componentDidMount() {
      this.getChartData();
   }

   componentWillReceiveProps(nextProps) {
      if (!nextProps.user.config) {
         return;
      }
      this.setState(state => {
         state.charts = nextProps.user.config.charts;
         return state;
      });
   }

   render() {
      return (
         <div className="chart-select-container">
            {this.getChartButtons()}
            <h3 className="new-chart-button"
             onClick={this.newChart}>+</h3>
         </div>
      );
   }
}
