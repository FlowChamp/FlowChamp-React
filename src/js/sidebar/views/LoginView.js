import React, { Component } from 'react';

export default class LoginView extends Component {
	constructor(props) {
		super(props);
      this.state = {
      };
	}

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   handleSubmit = (e) => {
      if (e) e.preventDefault();
      const username = this.refs.username.value;
      const password = this.refs.password.value;
      this.handleEvent({
         type: 'login',
         value: {
            username: username,
            password: password,
         }
      });
   }

   render() {
      return (
         <div className={`sidebar-view sidebar-login-view ${this.props.isPrevView ? 'slide-in-left' : ''}`}>
            <h2 className="sidebar-header">{this.props.header}</h2>
            <div className="login-image-container">
               <img alt="Cal Poly Logo" src="images/logos/cpslo.png"/>
            </div>
            <form onSubmit={this.handleSubmit}>
               <input required type="text" placeholder="Username" ref="username"/>
               <input required type="password" placeholder="Password" ref="password"/>
               <input className="submit-button" type="submit" value="Submit" />
            </form>
         </div>
      );
   }
}
