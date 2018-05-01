import React, { Component } from 'react';
import Flowchart from './flowchart/Flowchart';
import UserManager from './UserManager';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import CourseModal from './CourseModal';
import Welcome from './flowchart/Welcome';

export default class FlowChamp extends Component {
   state = {
      user: {
         requireAuth: true,
         isLoggedIn: false,
         config: null,
      },
      sidebar: {
         isOpen: false,
         isClosing: false,
      },
      modal: {
         isOpen: false,
         data: null,
      },
      currentChart: {
         isBuilding: false,
         _name: null,
         name: "Welcome",
         data: null,
      }
   }

   handleEvent = (options) => {
      switch(options.type) {
         case 'sidebar':
            this.toggleSidebar(options);
            break;
         case 'demo':
            this.toggleDemo(options.value);
            break;
         case 'open-course-modal':
            this.setModalData(options);
            break;
         case 'close-course-modal':
            this.closeModal();
            break;
         case 'user-login':
            this.setUserLoggedIn(options);
            break;
         case 'user-update':
            this.updateUserConfig(options.value);
            break;
         case 'set-active-chart':
            this.setActiveChart(options);
            break;
         case 'get-active-chart':
            this.getActiveChart();
            break;
         case 'get-user-config':
            this.getUserConfig();
            break;
         case 'delete-chart':
            this.deleteChart(options);
            break;
         case 'chart-builder':
            this.toggleChartBuilder(options);
            break;
         default:
            console.error("Empty event: ", options);
         break;
      }
   }

   toggleSidebar = (options) => {
      if (this.state.sidebar.isOpen) {
         this.closeSidebar();
      } else {
         this.setState(state => {
            state.sidebar.isOpen = true;
            return state;
         });
      }
   }

   closeSidebar = () => {
      this.setState(state => {
         state.sidebar.isClosing = true;
         return state;
      });
      setTimeout(() => {
         this.setState(state => {
            state.sidebar.isOpen = false;
            state.sidebar.isClosing = false;
            return state;
         });
      }, 290);
   }

   setModalData = (options) => {
      this.setState(state => {
         state.modal.data = options.value;
         state.modal.isOpen = true;
         return state;
      });
   }

   closeModal = () => {
      this.setState(state => {
         state.modal.isOpen = false;
         state.modal.data = null;
         return state;
      });
   }

   toggleDemo = (value) => {
      this.setState(state => {
         state.user.requireAuth = !value;
         return state;
      });
   }

   toggleChartBuilder = options => {
      this.setState(state => {
         state.currentChart.isBuilding = true;
         state.currentChart._name = 'Chart_Builder';
         state.currentChart.name = 'Chart Builder';
         state.currentChart.data = null;

         return state;
      });
   }

   setUserLoggedIn = options => {
      this.setState(state => {
         state.user.isLoggedIn = true;
         state.user.config = options.value;
         console.log(`User ${options.value.username} successfully logged in`);
         return state;
      });
   }

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

   deleteChart = options => {
      const chartName = options.value;
      let config = this.state.user.config;
      const activeChart = config['active_chart'];
      const needNewActiveChart = chartName === activeChart;

      UserManager.deleteChart({
         config: config,
         chartName: chartName
      }).then(response => {
         delete config.charts[chartName];
         // Get the first chart in the list of charts.
         const firstChart = Object.keys(config.charts)[0];

         this.setActiveChart({
            value: needNewActiveChart ? firstChart : activeChart,
            charts: config.charts
         });
      })
   }

   getUserConfig = () => {
      const username = this.state.user.config.username;
      let needsChartUpdate = false;

      UserManager.getUserConfig(username).then((config) => {
         this.setState(state => {
            state.user.config = config;
            if (state.currentChart.name != config['active_chart']) {
               needsChartUpdate = true;
            }
            return state;
         }, () => {
            if (needsChartUpdate) {
               this.getActiveChart();
            }
         });
      }).catch(e => {
         console.error("Unable to get user config: ", e);
      });
   }

   updateUserConfig = (config) => {
      console.log(config);
      this.setState(state => {
         state.config = config;
         state.user.isLoggedIn = true;
         return state;
      }, () => {
         this.getActiveChart(config);
      });
   }

   canShowFlowchart = () => {
      return !this.state.isLoading && this.state.user.config &&
         (this.state.user.isLoggedIn || !this.state.user.requireAuth) &&
         (this.state.currentChart.data || this.state.currentChart.isBuilding) &&
         this.state.user.config['active_chart'];
   }

   getActiveChart = newConfig => {
      const config = newConfig || this.state.user.config;

      UserManager.getActiveChart(config).then(response => {
         this.setState(state => {
            state.currentChart = {
               name: config['active_chart'],
               data: response
            };
            state.isLoading = false;
            return state;
         });
      }).catch(e => {
         console.error("Unable to load chart: ", e);
      });
   }

   componentDidMount() {
      const config = localStorage.flowChampConfig
         ? JSON.parse(localStorage.flowChampConfig) : null;

      if (config) {
         UserManager.getUserConfig(config.username).then(config => {
            this.setState(state => {
               state.user.config = config;
               state.user.isLoggedIn = true;
               return state;
            });
            if (config['active_chart']) {
               this.getActiveChart(config);
            }
         }).catch(e => {
            // User most likely isn't logged in anymore
            console.error('Error: You need to log in again');
         });
      }
   }

   render() {
      return (
         <div className={`app-contents ${this.state.modal.isOpen ? 'no-scroll' : ''}`}>
            <UserManager
               user={this.state.user}
               onEvent={this.handleEvent} />
            <Header
               currentChart={this.state.currentChart}
               user={this.state.user}
               name={this.state.user.isLoggedIn ? this.state.currentChart.name : "Welcome"}
               onEvent = {this.handleEvent} />
            <Sidebar
               isOpen = {this.state.sidebar.isOpen}
               isClosing={this.state.sidebar.isClosing}
               user={this.state.user}
               currentChart={this.state.currentChart}
               onEvent = {this.handleEvent} />
            {this.state.modal.data && this.state.modal.isOpen
               ? <CourseModal
                  data={this.state.modal.data}
                  onEvent={this.handleEvent} />
               : ''
            }
            {this.canShowFlowchart()
               ? <Flowchart
                  user={this.state.user}
                  noScroll={this.state.sidebar.isOpen}
                  currentChart={this.state.currentChart}
                  onEvent={this.handleEvent} />
               : <Welcome
                  isLoggedIn={this.state.user.isLoggedIn &&
                     this.state.user.config && this.state.user.config['active_chart']}
                  fadeOut={this.state.sidebar.isOpen && !this.state.sidebar.isClosing}/> }
         </div>
      );
   }
}
