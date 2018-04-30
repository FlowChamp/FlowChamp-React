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
         case 'change-chart':
            if (options.value !== this.state.currentChart._name) {
               this.setCurrentChart(options);
            }
            if (options.closeMenu) {
               this.toggleSidebar({value: false});
            }
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
         case 'chart-builder':
            this.toggleChartBuilder(options);
            break;
         default:
            console.log("Empty event: ", options);
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

   setCurrentChart = (options) => {
      console.log(options);
      const url = options.demo
         ? `/api/cpslo/stock_charts/15-17/${options.value}`
         : `/api/cpslo/users/${options.username}/charts/${options.chart}`;
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

      UserManager.updateConfig({
         config: config,
         field: 'active_chart',
         value: chartName
      }).then(() => {
         this.setState(state => {
            state.user.config = config;
            return state;
         }, () => {
            this.getActiveChart();
         });
      }).catch(e => {
         console.log("Error: unable to set active chart: ", e);
      });
   }

   getActiveChart = () => {
      const config = this.state.user.config;

      UserManager.getActiveChart(config).then(response => {
         this.setState(state => {
            state.currentChart.name = config['active_chart'];
            state.currentChart.data = response;
            return state;
         });
      }).catch(e => {
         console.log("Error: unable to retrieve chart: ", e);
      });
   }

   updateUserConfig = (config) => {
      console.log(config);
      this.setState(state => {
         state.config = config;
         state.user.isLoggedIn = true;
         console.log(this.state);
         return state;
      });
   }

   canShowFlowchart = () => {
      return (this.state.user.isLoggedIn || !this.state.user.requireAuth) &&
         (this.state.currentChart.data || this.state.currentChart.isBuilding);
   }

   componentDidMount() {
      const config = localStorage.flowChampConfig
         ? JSON.parse(localStorage.flowChampConfig) : null;

      if (config) {
         console.log(config);
         UserManager.getUserConfig(config.username).then(config => {
            this.setState(state => {
               state.user.config = config;
               state.user.isLoggedIn = true;
               return state;
            });
            UserManager.getActiveChart(config).then(response => {
               this.setState(state => {
                  state.currentChart = {
                     name: config['active_chart'],
                     data: response
                  };
                  console.log(config['active_chart']);
                  return state;
               });
            }).catch(e => {
               console.log("Unable to load chart: ", e);
            });
         }).catch(e => {
            // User most likely isn't logged in anymore
            console.log
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
                  currentChart={this.state.currentChart}
                  onEvent={this.handleEvent} />
               : <Welcome
                  isLoggedIn={this.state.user.isLoggedIn}
                  fadeOut={this.state.sidebar.isOpen && !this.state.sidebar.isClosing}/> }
         </div>
      );
   }
}
