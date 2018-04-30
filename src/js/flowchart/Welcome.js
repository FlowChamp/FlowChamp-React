import React, { Component } from 'react';
import LoadingIndicator from 'react-loading-indicator';

export default class Welcome extends Component {
   constructor(props) {
      super(props);
      this.state ={
         isLoading: props.isLoggedIn
      }
   }

   componentWillReceiveProps(nextProps) {
      this.setState({ isLoading: nextProps.isLoggedIn });
   }

   render() {
      return (
         <div className={`welcome-container ${this.props.fadeOut ? 'faded' : ''}`}>
            <div className="welcome">
               <div className="logo-container">
                  <img className="logo" alt="FlowChamp Logo" src="images/icons/logo.svg"/>
                  <img className="logo-back-1" alt="FlowChamp Logo" src="images/icons/light_gray_box.svg"/>
                  <img className="logo-back-2" alt="FlowChamp Logo" src="images/icons/dark_gray_box.svg"/>
               </div>
               <img className="welcome-title" alt="flowchamp" src="images/icons/flowchamp.svg" />
               {this.state.isLoading
                  ? <div className="loading-container">
                     <h3 className="message">Loading chart...</h3>
                     <div>
                        <LoadingIndicator className="loading-indicator"
                           segmentLength={8} segmentWidth={3}/>
                     </div>
                  </div> : '' }
            </div>
         </div>
      );
   }
}
