import React, { Component } from 'react';

export default class MainView extends Component {
	constructor(props) {
		super(props);
      this.state = {
         viewStack: [],
      };
	}

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   render() {
      return (
         <div className="sidebar-view sidebar-main-view">
            <img alt="logo" className="sidebar-logo" src="images/icons/logo.png"/>
            <h3>Flowcharts</h3>
         </div>
      );
   }
}
