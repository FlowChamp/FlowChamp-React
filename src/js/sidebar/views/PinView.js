import React, { Component } from 'react';
import UserManager from '../../UserManager';

export default class PinView extends Component {
   state = {
      loading: false,
   };

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   handleSubmit = (e) => {
      this.setState({isLoading: true});
      if (e) e.preventDefault();
      const pin = this.refs.pin.value;
      const username = this.props.data.username;
      const password = this.props.data.password;
      const email = this.props.data.email;

      UserManager.signup({
         pin: pin,
         email: email,
         username: username,
         password: password
      }).then((response) => {
         switch(response.message) {
            case 'Internal Server Error':
               alert("500 :/");
            break;
            default:
               console.log(response.message);
            break;
         }
      }).catch((error) => {
         alert(error);
      });
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-login-view
            ${this.props.isPrevView ? 'slide-in-left' : ''}
            ${this.props.isEnteringNewView ? 'entering-new-view' : ''}
            ${this.props.isEnteringOldView ? 'entering-old-view' : ''}`}>
            <div className="login-image-container">
               <img alt="FlowChamp Logo" src="images/icons/logo_text.svg"/>
            </div>
            <form onSubmit={this.handleSubmit}>
               <input required type="text" placeholder="PIN" ref="pin"/>
               <input className="submit-button" type="submit" value="Complete Signup" />
            </form>
         </div>
      );
   }
}
