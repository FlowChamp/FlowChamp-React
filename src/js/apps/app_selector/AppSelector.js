import React, { Component } from 'react';

export default class AppSelector extends Component {
   render() {
      return (
         <div className="app app-selector">
            <h2 className="app-header">Choose an app</h2>
            <div className="app-button-container">
               <AppButton />
               <AppButton />
            </div>
         </div>
      );
   }
}

class AppButton extends Component {
   render() {
      return (
         <div className="app-button">
            <img src="images/icons/flowchart.svg"/>
            <h3>Flowchart</h3>
         </div>
      );
   }
}
