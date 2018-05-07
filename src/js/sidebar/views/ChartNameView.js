import React, { Component } from 'react';
import UserManager from '../../UserManager';
import LoadingIndicator from 'react-loading-indicator';

export default class ChartNameView extends Component {
   state = {
      isLoading: false,
      error: null
   };

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   handleSubmit = (e) => {
      this.setState({isLoading: true});
      if (e) e.preventDefault();
      const chartName = this.refs.chartName.value;

      UserManager.addChart({
         config: this.props.user.config,
         stockName: this.props.data._name,
         chartName: chartName
      }).then((data) => {
         this.setState({isLoading: false});
         this.props.onEvent({
            type: 'update-user-config',
            value: data,
            stateOnly: true
         });
         this.props.onEvent({
            type: 'empty-views'
         });
      }).catch((error) => {
         this.setState({
            error: error,
            isLoading: false,
         });
      });
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-login-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <h3 className="info">Give your chart a fancy new name</h3>
            <form onSubmit={this.handleSubmit}>
               <input required type="text" placeholder="Flowchart Name" ref="chartName" autoFocus/>
               <h3 className="error-msg">{this.state.error}</h3>
               <div className="submit-container">
                  <input className="submit-button" type="submit" value="Add chart" />
                  <div className="loading-indicator">
                  {this.state.isLoading
                     ? <LoadingIndicator className="loading-indicator"
                        segmentLength={8} segmentWidth={3}/> : ''}
                  </div>
               </div>
            </form>
         </div>
      );
   }
}
