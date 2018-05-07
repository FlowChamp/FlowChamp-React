import React, { Component } from 'react';
import Year from './Year';
import { DragDropContext } from 'react-beautiful-dnd';
import CourseModal from './CourseModal';
import Welcome from './Welcome';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

export default class Flowchart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isLoading: false,
         animateClose: false,
         modal: {
            isOpen: false,
            data: null,
         },
         currentChart: props.currentChart
      }
   }

   handleEvent = (options) => {
      switch(options.type) {
         case 'open-course-modal':
            this.setModalData(options);
            break;
         case 'close-course-modal':
            this.closeModal();
            break;
         case 'delete-chart':
            this.deleteChart(options);
            break;
         default:
            this.props.onEvent(options);
            break;
      }
   }


   /* Modal Functions */

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

   getYearComponents = () => {
      const data = this.state.currentChart.data;
      let yearComponents = [];

      for (let i in years) {
         const year = years[i];
         let yearData = [];

         for (let item in data) {
            const meta = data[item];
            const currentYear = parseInt(i, 10)+1;

            if (meta.block_metadata.time[0] === currentYear) {
               yearData.push(meta);
            }
         }
         yearComponents.push(
            <Year
               key={year}
               index={year}
               data={yearData}
               title={year}
               onEvent={this.handleEvent}
            />
         );
      }
      return yearComponents;
   }

   componentDidMount() {
      /*
      const data = this.state.data;
      this.sortData();
     */
   }

   componentWillReceiveProps(nextProps) {
      console.log(this.props, nextProps);
      if (this.props.currentChart.name !== nextProps.currentChart.name) {
         this.setState({ currentChart: null });
         setTimeout(() => {
            this.setState(state => {
               state.currentChart = nextProps.currentChart
               console.log(state);
               return state;
            });
         });
      }
   }

   onDragEnd = (result) => {
      console.log(result);
   }

   canShowFlowchart = () => {
      return (this.state.currentChart && this.state.currentChart.data !== null);
   }

   render() {
      const {
         animateClose
      } = this.state;
      const classNames = `${animateClose ? 'animate-close' : ''} ${this.state.modal.isOpen ? 'no-scroll' : ''}`;

      return (
         <DragDropContext onDragEnd={this.onDragEnd}>
            {this.state.currentChart && this.state.currentChart.data
               ?  <div className={`flowchart ${classNames}`}>
                     <div className="year-container">
                        {this.getYearComponents()}
                     </div>
                  </div>
               :  <Welcome user={this.props.user} />
            }
            {this.state.modal.data && this.state.modal.isOpen
               ? <CourseModal
                  data={this.state.modal.data}
                  onEvent={this.handleEvent} />
               : ''
            }
			</DragDropContext>
      );
   }
}
