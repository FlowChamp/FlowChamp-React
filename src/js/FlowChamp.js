import React, { Component } from 'react';
import Flowchart from './flowchart/Flowchart';
import UserManager from './UserManager';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import CourseModal from './CourseModal';
import Welcome from './flowchart/Welcome';

export default class FlowChamp extends Component {
   constructor() {
      super();
      this.state = {
         user: {
            isLoggedIn: false,
            username: null,
            password: null,
            config: {},
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
            _name: null,
            name: "Welcome",
            data: null,
         }
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
         case 'open-course-modal':
            this.setModalData(options);
            break;
         case 'close-course-modal':
            this.closeModal();
            break;
         case 'login':
            this.setUserCredentials(options);
            break;
         case 'user-update':
            this.updateUserConfig(options.value);
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
      }, 340);
   }

   setModalData = (options) => {
      console.log(options);
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

   setCurrentChart = (options) => {
	   fetch(`https://flowchamp.org/api/cpslo/users/${options.username}/charts/${options.chart}`)
		   .then(response => {
			   response.json().then((data) => {
               if (data.message === 'Internal Server Error') {
                  console.error("Couldn't load that chart.");
                  return;
               }
               // Required to refresh the blocks
					this.setState(state => {
						state.currentChart = {
                     data: null,
                     _name: null,
                     name: null,
                  };
                  return state;
               });
					this.setState(state => {
						state.currentChart = {
                     _name: options.value,
                     name: options.value,
                     data: data
                  }
                  return state;
               });
			   })
      });
   }

   setUserCredentials = (options) => {
      const username = options.value.username.toLowerCase();
      const password = options.value.password;

      this.setState(state => {
         state.user.username = username;
         state.user.password = password;
         return state;
      });
   }

   updateUserConfig = (user) => {
      const config = user.config;
      this.setState(state => {
         state.config = config;
         return state;
      });
      this.setCurrentChart({
         username: this.state.user.username,
         chart: config.active_chart,
      });
   }

   render() {
      return (
         <div className={`app-contents ${this.state.modal.isOpen ? 'no-scroll' : ''}`}>
            <UserManager
             user={this.state.user}
             onEvent={this.handleEvent} />
            <Header
               currentChart={this.state.currentChart}
               name={this.state.user.isLoggedIn ? this.state.currentChart.name : "Welcome"}
               onEvent = {this.handleEvent}
            />
            <Sidebar
               isOpen = {this.state.sidebar.isOpen}
               isClosing={this.state.sidebar.isClosing}
               user={this.state.user}
               currentChart={this.state.currentChart}
               onEvent = {this.handleEvent}
             />
            {this.state.modal.data && this.state.modal.isOpen ?
               <CourseModal
                  data={this.state.modal.data}
                  onEvent={this.handleEvent}
               /> : ''
            }
            {this.state.user.isLoggedIn ?
               <Flowchart
                  scroll={!this.state.modal.isOpen}
                  currentChart={this.state.currentChart}
                  onEvent={this.handleEvent}
               /> :
               <Welcome
                  fadeOut={this.state.sidebar.isOpen && !this.state.sidebar.isClosing}/>
            }
         </div>
      );
   }
}
