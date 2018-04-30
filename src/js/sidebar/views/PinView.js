import React, { Component } from 'react';
import UserManager from '../../UserManager';

export default class PinView extends Component {
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
      const pin = this.refs.pin.value;
      const username = this.props.data.username;
      const password = this.props.data.password;
      const email = this.props.data.email;
      const token = this.props.data.token;
      console.log(this.props);


   UserManager.signup({
      pin: pin,
      email: email,
      username: username,
      password: password,
      token: token
   }).then((response) => {
      this.props.onEvent({
         type: this.props.route ? 'change-view' : 'empty-views',
         value: this.props.route
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
            <div className="login-image-container">
               <img alt="FlowChamp Logo" src="images/icons/logo_text.svg"/>
            </div>
            <h3 className="info">
               We sent a 6-digit PIN to <strong>{this.props.data.email}.</strong> Please enter it here to complete signup.
            </h3>
            <form onSubmit={this.handleSubmit}>
               <input required type="text" placeholder="PIN" ref="pin" autofocus/>
               <h3 className="error-msg">{this.state.error}</h3>
               <input className="submit-button" type="submit" value="Complete Signup" />
            </form>
         </div>
      );
   }
}
