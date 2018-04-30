import { Component } from 'react';

const API = {
   url: '/api/cpslo'
}

export default class UserManager extends Component {
	constructor(props) {
		super(props);
      this.state = {
         user: props.user
      };
	}

   static requestPin = options => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/getpin`;
         const data = JSON.stringify({email: options.email});

         fetch (url, {
            headers: {
               'Content-Type': 'application/json'
            },
            method: 'POST',
            body: data
         }).then(response => {
            response.json().then((data) => {
               if (response.status >= 300) {
                  reject(data.message)
               }
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static signup = options => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/signup`;
         const data = JSON.stringify({
            token: options.token,
            pin: options.pin
         });

         fetch (url, {
            headers: {
               'Authorization': 'Basic '+btoa(`${options.username}:${options.password}`),
               'Content-Type': 'application/json'
               'credentials': 'same-origin'
            },
            method: 'POST',
            body: data
         }).then(response => {
            response.json().then((data) => {
               if (response.status >= 300) {
                  reject(data.message);
               }
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static login = options => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/authorize`;
         const data = JSON.stringify({
            username: options.username,
            password: options.password
         });

         fetch (url, {
            method: 'POST',
            headers: {
               'Authorization': 'Basic ' + btoa(`${options.username}:${options.password}`),
               'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: data
         }).then(response => {
            if (!response || response.status > 200) {
               reject(response.statusText);
            }
            response.json().then((data) => {
               console.log(response);
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
         const url = `${API.url}/users/${config.username.split('-')[1]}/config`;

         fetch (url, {
            method: 'POST',
            credentials: 'include',
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
