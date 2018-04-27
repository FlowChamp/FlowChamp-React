import React, { Component } from 'react';
import LoadingIndicator from 'react-loading-indicator';
import UserManager from '../../UserManager';

export default class LoginView extends Component {
   state = {
      onSignup: false,
   };

   handleEvent = (options) => {
      switch(options.type) {
         case 'show-signup':
            this.setState({onSignup: true})
         break;
         case 'show-login':
            this.setState({onSignup: false})
         break;
         case 'route':
            this.route();
            break;
         default:
            console.log(options);
            //this.props.onEvent(options);
         break;
      }
   }

   route = () => {
      let route = this.props.route;
      console.log(route);
      if (route === 'chartSelect' && !this.props.user.start_year) {
         this.props.onEvent({
            type: 'change-view',
            value: 'yearSelect',
            route: route
         });
      } else {
         this.props.onEvent({
            type: 'change-view',
            value: route
         });
      }
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
            {this.state.onSignup
               ?  <SignupForm {...this.props} onEvent={this.handleEvent}/>
               : <LoginForm {...this.props} onEvent={this.handleEvent}/>}
         </div>
      );
   }
}

class LoginForm extends Component {
   state = {
      isLoading: false,
   }

   signupView = () => {
      this.props.onEvent({
         type: 'show-signup',
      });
   }

   handleSubmit = (e) => {
      this.setState({isLoading: true});
      if (e) e.preventDefault();
      const email = this.refs.email.value;
      const password = this.refs.password.value;

      UserManager.login({
         email: email,
         password: password,
      }).then((data) => {
			this.props.onEvent({
				type: 'user-update',
				value: data,
			});
         this.props.onEvent({
            type: 'route'
         });
      });
   }

   render() {
      return (
         <div className="signup-form">
            <h3 className="signup-button"
               onClick={this.signupView}>Need an account? &gt;</h3>
            <form onSubmit={this.handleSubmit}>
               <input required type="text" placeholder="Email" ref="email" autoFocus/>
               <input required type="password" placeholder="Password" ref="password"/>
               <div className="submit-container">
                  <input className="submit-button" type="submit" value="Log In" />
                  <div className="container">
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

class SignupForm extends Component {
   state = {
      isLoading: false,
   }

   signupView = () => {
      this.props.onEvent({
         type: 'show-login',
      });
   }

   handleSubmit = (e) => {
      this.setState({isLoading: true});
      if (e) e.preventDefault();
      const email = this.refs.email.value;
      const password = this.refs.password.value;

      UserManager.requestPin({
         email: email
      }).then((response) => {
         switch(response.message) {
            case 'Internal Server Error':
               alert("500 :/");
            break;
            default:
               this.props.onEvent({
                  type: 'change-view',
                  value: 'pin',
                  data: {
                     email: email,
                     password: password,
                  },
                  route: 'chart-select'
               });
            break;
         }
      }).catch((error) => {
         alert(error);
      });
   }

   render() {
      return (
         <div className="signup-form">
            <h3 className="signup-button"
               onClick={this.signupView}>Already have an account? &gt;</h3>
            <form onSubmit={this.handleSubmit}>
               <input required type="text" placeholder="Email" ref="email" autoFocus/>
               <input required type="password" placeholder="Password" ref="password"/>
               <div className="submit-container">
                  <input className="submit-button" type="submit" value="Sign Up" />
                  <div className="container">
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
