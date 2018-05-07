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
         animateClose: false,
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
      const data = this.state.data;
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

   componentWillReceiveProps(nextProps) {
      if (this.canShowFlowchart() && nextProps.currentChart.name !== this.state.name) {
         this.setState({
            animateClose: true
         });
         setTimeout(() => {
            this.setState({
               name: nextProps.currentChart.name,
               data: nextProps.currentChart.data,
               animateClose: false
            });
         }, 340);
      }
   }

   componentDidMount() {
      /*
      const data = this.state.data;
      this.sortData();
     */
   }

   onDragEnd = (result) => {
      console.log(result);
   }

   canShowFlowchart = () => {
      return !this.state.isLoading && this.props.user.config &&
         (this.props.user.isLoggedIn && this.state.currentChart.data) &&
         this.props.user.config['active_chart'];
   }

   render() {
      const {
         animateClose
      } = this.state;
      const classNames = `${animateClose ? 'animate-close' : ''} ${this.state.modal.isOpen ? 'no-scroll' : ''}`;

      return (
         <DragDropContext onDragEnd={this.onDragEnd}>
            {this.canShowFlowchart()
            ? <div className={`flowchart ${classNames}`}>
               <div className="year-container">
                  {this.state.data ? this.getYearComponents() : null}
               </div>
            </div>
            : <Welcome user={this.props.user} />
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
