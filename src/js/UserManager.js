import { Component } from 'react';

export default class UserManager extends Component {
	constructor(props) {
		super(props);
      this.state = {
         user: props.user
      };
	}

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   login = () => {
      const user = this.state.user;
      const url = "https://flowchamp.org/api/cpslo/authorize";

      if (!user.isLoggedIn && user.username && user.password) {
         console.log("logging in...");
         fetch (url, {
            headers: {
               'Authorization': 'Basic '+btoa(`${user.username}:${user.password}`),
            },
            mode: 'cors',
            method: 'POST',
         })
         .then(response => {
            response.json().then((data) => {
               console.log(data);
               this.setState(state => {
                  state.user.config = data;
                  state.user.isLoggedIn = true;
                  return state;
               });
               this.handleEvent({
                  type: 'user-update',
                  value: this.state.user,
               });
            });
         })
         .catch(e => {
            console.log(e);
         })
      }
   }

   componentDidUpdate() {
      this.login();
   }

   render() {
      return null;
   }
}
