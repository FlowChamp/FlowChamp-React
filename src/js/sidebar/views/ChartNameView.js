import React, { Component } from 'react';
import UserManager from '../../UserManager';

export default class ChartNameView extends Component {
   state = {
      loading: false,
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
         this.props.onEvent({
            type: 'user-update',
            value: data
         });
         this.props.onEvent({
            type: 'empty-views'
         });
      }).catch((error) => {
         this.setState({ error: error });
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
               <input className="submit-button" type="submit" value="Add Chart" />
            </form>
         </div>
      );
   }
}
