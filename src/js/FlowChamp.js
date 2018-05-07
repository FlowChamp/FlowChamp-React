import React, { Component } from 'react';
//import Flowchart from './flowchart/Flowchart';
import UserManager from './UserManager';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import AppManager from './apps/AppManager';
//import Welcome from './flowchart/Welcome';

export default class FlowChamp extends Component {
   state = {
      user: {
         isLoggedIn: false,
         config: null,
      },
      sidebar: {
         isOpen: false,
      },
      app: {
         splitPane: false
      }
   }

   handleEvent = (options) => {
      switch(options.type) {
         case 'toggle-sidebar':
            this.toggleSidebar(options);
            break;
         case 'user-login':
            this.setUserLoggedIn(options);
            break;
         case 'user-update':
            this.updateUserConfig(options.value);
            break;
         case 'update-user-config':
            this.updateUserConfig(options);
            break;
         case 'get-user-config':
            this.getUserConfig();
            break;
         case 'toggle-split-pane':
            this.toggleSplitPane(options);
            break;
         default:
            console.error("Empty event: ", options);
         break;
      }
   }

   toggleSidebar(options) {
      if (options.value) {
         this.setState({ sidebar: { isOpen: options.value } });
      } else {
         this.setState({
            sidebar: {
               isOpen: !this.state.sidebar.isOpen
            }
         });
      }
   }

   toggleSplitPane(options) {
      if (options.value) {
         this.setState({ app: { splitPane: options.value } });
      } else {
         this.setState(state => {
            state.app.splitPane = !state.app.splitPane;
            return state;
         });
      }
   }

   setUserLoggedIn = options => {
      this.setState(state => {
         state.user.isLoggedIn = true;
         state.user.config = options.value;
         console.log(`User ${options.value.username} successfully logged in`);
         return state;
      });
   }

   getUserConfig = () => {
      const username = this.state.user.config.username;

      UserManager.getUserConfig(username).then((config) => {
         this.setState(state => {
            state.user.config = config;
            return state;
         }, () => {
            this.setState({
               user: {
                  config: config
               }
            });
         });
      }).catch(e => {
         console.error("Unable to get user config: ", e);
      });
   }

   updateUserConfig = options => {
      const config = options.value;

      if (options.stateOnly) {
         this.setState(state => {
            state.user.config = config;
            return state;
         });
         return;
      }
      UserManager.updateConfig(config).then(response => {
         this.setState(state => {
            state.user.config = config;
            console.log("Config updated");
            return state;
         });
      }).catch(e => {
         console.error("Unable to update user config: ", e);
      });
   }

   attemptLogin() {
      const config = localStorage.flowChampConfig
         ? JSON.parse(localStorage.flowChampConfig) : null;

      if (config) {
         UserManager.getUserConfig(config.username).then(config => {
            this.setState(state => {
               state.user.config = config;
               state.user.isLoggedIn = true;
               return state;
            });
         }).catch(e => {
            // User most likely isn't logged in anymore
            console.error('Error: You need to log in again');
            console.log(e);
         });
      }
   }

   componentDidMount() {
      this.attemptLogin();
   }

   render() {
      const {
         user,
         sidebar,
         app
      } = this.state;

      return (
         <div className="app-contents">
            <UserManager
               user={user}
               onEvent={this.handleEvent} />
            <Header
               user={user}
               onEvent={this.handleEvent} />
            <Sidebar
               isOpen={sidebar.isOpen}
               user={user}
               onEvent={this.handleEvent} />
            <AppManager
               splitPane={app.splitPane}
               user={user}
               onEvent={this.handleEvent}/>
         </div>
      );
   }
}
   /*
   updateUserConfig = (config) => {
      this.setState(state => {
         state.config = config;
         state.user.isLoggedIn = true;
         return state;
      }, () => {
         this.getActiveChart(config);
      });
   }
*/

/*
   setActiveChart = options => {
      let config = this.state.user.config;
      const chartName = options.value;

      config['active_chart'] = chartName;

      this.setState({ isLoading: true });
      UserManager.updateConfig({
         config: config,
         field: 'active_chart',
         charts: options.charts,
         value: chartName
      }).then(() => {
         this.setState(state => {
            state.user.config = config;
            return state;
         }, () => {
            if (config['active_chart']) {
               this.getActiveChart();
            }
         });
      }).catch(e => {
         alert("Your session has expired. Please log in again to continue.");
         window.location.reload();
      });
   }

*/

