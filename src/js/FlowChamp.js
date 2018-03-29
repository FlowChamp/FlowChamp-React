import React, { Component } from 'react';
import Flowchart from './flowchart/Flowchart';
import Sidebar from './sidebar/Sidebar';
import Header from './Header';
import CourseModal from './CourseModal';

export default class FlowChamp extends Component {
   constructor() {
      super();
      this.state = {
         sidebar: {
            isOpen: false,
         },
         modal: {
            isOpen: false,
            data: null,
         },
         currentChart: {
            name: localStorage.currentChart || "No Chart Selected",
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
            this.setCurrentChart(options);
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
         default:
            console.log("Empty event: ", options);
         break;
      }
   }

   toggleSidebar = (options) => {
      this.setState(state => {
         if (options.action === 'toggle') {
            state.sidebar.isOpen = !state.sidebar.isOpen;
         } else {
            state.sidebar.isOpen = options.value;
         }
         return state;
      });
   }

   setCurrentChart = (options) => {
	   fetch(`https://flowchamp.org/api/cpslo/stock_charts/15-17/${options.value}`)
		   .then(response => {
			   response.json().then((data) => {
               // Required to refresh the blocks
               if (data.message === 'Internal Server Error') {
                  console.error("Couldn't load that chart.");
                  return;
               }
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
                     name: options.value.split('_').join(' '),
                     data: data
                  }
                  return state;
               });
               localStorage.currentChart = options.value;
			   })
      });
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

   componentWillMount() {
      if (this.state.name !== "No Chart Selected") {
         this.setCurrentChart({
            value: localStorage.currentChart,
         });
      }
   }

   render() {
      return (
         <div className={`app-contents ${this.state.modal.isOpen ? 'no-scroll' : ''}`}>
            <Header
               currentChart={this.state.currentChart}
               name={this.state.currentChart.name}
               onEvent = {this.handleEvent}
            />
            <Sidebar
               isOpen = {this.state.sidebar.isOpen}
               currentChart={this.state.currentChart}
               onEvent = {this.handleEvent}
             />
            {this.state.modal.data && this.state.modal.isOpen ?
               <CourseModal
                  data={this.state.modal.data}
                  onEvent={this.handleEvent}
               /> : ''
            }
            {this.state.currentChart.data ?
               <Flowchart
                  scroll={!this.state.modal.isOpen}
                  currentChart={this.state.currentChart}
                  onEvent={this.handleEvent}
               /> :
               <h1>No Chart Selected</h1>
            }
         </div>
      );
   }
}
