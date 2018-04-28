import { Component } from 'react';

export default class UserManager extends Component {
	constructor(props) {
		super(props);
      this.state = {
         user: props.user
      };
	}

   static requestPin = options => {
      return new Promise(function(resolve, reject) {
         const url = "https://flowchamp.org/api/cpslo/getpin";
         const data = JSON.stringify({email: options.email});

         fetch (url, {
            headers: {
               'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: data
         }).then(response => {
            response.json().then((data) => {
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static signup = options => {
      return new Promise(function(resolve, reject) {
         const url = "https://flowchamp.org/api/cpslo/signup";
         const data = JSON.stringify({
            pin: options.pin
         });

         fetch (url, {
            headers: {
               'Authorization': 'Basic '+btoa(`${options.email}:${options.password}`),
               'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: data
         }).then(response => {
            response.json().then((data) => {
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static login = options => {
      return new Promise(function(resolve, reject) {
         const url = "https://flowchamp.org/api/cpslo/authorize";
         const data = JSON.stringify({
            email: options.email,
            password: options.password
         });

         fetch (url, {
            headers: {
               'Authorization': 'Basic '+btoa(`${options.email}:${options.password}`),
               'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'POST',
            body: data
         }).then(response => {
            response.json().then((data) => {
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static updateConfig = options => {
      return new Promise(function(resolve, reject) {
         let config = options.value.config;
         const url = `https://flowchamp.org/api/cpslo/users/${config.username}/config`;

         fetch (url, {
            mode: 'cors',
            body: config
         }).then(response => {
            response.json().then(data => {
               console.log(data);
               resolve(data);
            });
         }).catch(e => {
            console.log(e);
            reject(Error(e));
         });
      });

   }

   static getCurrentYear() {
      console.log(this.state.user);
   }

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   render() {
      return null;
   }
}
