import React, { Component } from 'react';
import Switch from 'react-ios-switch';

export default class ToggleButton extends Component {
   constructor(props) {
      super(props);
      this.state = {
         checked: props.checked
      }
   }

   handleEvent = (checked) => {
      let action = this.props.action;
      if (action) {
         action.value = checked;
         this.setState({ checked: checked });
         this.props.onEvent(action);
      } else {
         this.setState({ checked: checked });
         this.props.onEvent(checked);
      }
   }

   render() {
      return(
         <div className={`nav-button ${this.props.classNames}`}
            onClick={() => {this.handleEvent(!this.state.checked)}}>
            <div className="left-container">
               <h3>{this.props.label}</h3>
            </div>
            <div className="right-container">
               <Switch
                  checked={this.state.checked}
                  onChange={this.handleEvent} />
            </div>
         </div>
      );
   }
}
