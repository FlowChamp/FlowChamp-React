import { Component } from 'react';

const API = {
   url: '/api/cpslo',
   mode: null
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
            mode: API.mode,
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
            method: 'POST',
            headers: {
               'Authorization': 'Basic '+btoa(`${options.username}:${options.password}`),
               'Content-Type': 'application/json',
            },
            mode: API.mode,
            body: data
         }).then(response => {
            response.json().then((data) => {
               if (response.status >= 300) {
                  reject(data.message);
               }
               localStorage.flowChampConfig = JSON.stringify(data);
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   // Takes a username and password and attempts to authorize.
   static login = options => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/authorize`;
         const data = JSON.stringify({
            username: options.username,
            password: options.password,
            remember: options.remember
         });

         fetch (url, {
            method: 'POST',
            headers: {
               'Authorization': 'Basic ' + btoa(`${options.username}:${options.password}`),
               'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            mode: API.mode,
            body: data
         }).then(response => {
            if (!response || response.status > 200) {
               reject(response.statusText);
            }
            response.json().then((data) => {
               localStorage.flowChampConfig = JSON.stringify(data);
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static addChart(options) {
      return new Promise(function(resolve, reject) {
         const data = {
            target: options.stockName,
            year: '15-17',
            destination: options.chartName
         };
         const url = `${API.url}/users/${options.config.username}/import`;

         fetch (url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
         }).then(response => {
            response.json().then(data => {
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static updateConfig = config => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/users/${config.username}/config`;

         fetch (url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(config)
         }).then(response => {
            response.json().then(data => {
               if (response.status >= 300) {
                  reject(response);
               }
               localStorage.flowChampConfig = JSON.stringify(config);
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static getUserConfig = (username) => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/users/${username}/config`;

         fetch (url, {
            method: 'GET',
            credentials: 'same-origin',
         }).then(response => {
            response.json().then(data => {
               if (response.status >= 300) {
                  reject(response);
               }
               localStorage.flowChampConfig = JSON.stringify(data);
               resolve(data);
            }).catch(e => {
               console.log("JSON Parse error:", e);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static getActiveChart = (config) => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/users/${config.username}/charts/${config['active_chart']}`;

         fetch (url, {
            method: 'GET',
            credentials: 'same-origin',
         }).then(response => {
            response.json().then(data => {
               if (response.status >= 300) {
                  reject(response);
               }
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static deleteChart = (options) => {
      return new Promise(function(resolve, reject) {
         const config = options.config;
         const url = `${API.url}/users/${config.username}/charts/${options.chartName}`;

         fetch (url, {
            method: 'DELETE',
            credentials: 'same-origin',
         }).then(response => {
            response.json().then(data => {
               if (response.status >= 300) {
                  reject(response);
               }
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   static logOut = (config) => {
      return new Promise(function(resolve, reject) {
         const url = `${API.url}/users/${config.username}/logout`;

         fetch (url, {
            method: 'POST',
            credentials: 'same-origin',
         }).then(response => {
            response.json().then(data => {
               if (response.status >= 300) {
                  reject(response);
               }
               resolve(data);
            });
         }).catch(e => {
            reject(Error(e));
         });
      });
   }

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   render() {
      return null;
   }
}
