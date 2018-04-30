import React, { Component } from 'react';
import { X } from 'react-feather';
import LoadingIndicator from 'react-loading-indicator';

export default class ChartButton extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isActive: props.isActive,
         isLoading: false,
      }
   }

   handleEvent = options => {
      this.props.onEvent(options);
   }

   setActiveChart = () => {
      if (this.state.isActive) {
         return;
      }
      this.setState({isLoading: true});
      this.props.onEvent({
         type: 'set-active-chart',
         value: this.props.chartName
      });
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.isActive !== this.state.isActive) {
         this.setState({
            isActive: nextProps.isActive,
            isLoading: false,
         });
      }
   }

   render() {
      const {
         isActive
      } = this.state;

      return (
         <div className={`chart-button ${isActive ? 'active' : ''}`}
            onClick={this.setActiveChart}>
            <div className="info-container">
               <h3 className="chart-title">{this.props.chartName}</h3>
               <h5 className="chart-type">{this.props.stockChartName.split('_').join(' ')}</h5>
            </div>
            <ActionContainer
               name={this.props.chartName}
               onEvent={this.handleEvent} />
         </div>
      );
   }
}

class ActionContainer extends Component {
   state = {
      isLoading: false
   }

   deleteChart = (e) => {
      e.stopPropagation();
      this.setState({ isLoading: true });
      this.props.onEvent({
         type: 'delete-chart',
         value: this.props.name
      });
   }

   render() {
      return(
         <div className="action-container" onClick={this.deleteChart}>
            {this.state.isLoading
               ? <LoadingIndicator className="loading-indicator"/>
               : <X className="delete-button" />}
         </div>

      );
   }
}
