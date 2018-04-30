import React, { Component } from 'react';
import Year from './Year';
import { DragDropContext } from 'react-beautiful-dnd';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

export default class Flowchart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         name: props.currentChart.name,
         data: props.currentChart.data,
         animateClose: false,
      }
   }

   handleEvent = (options) => {
      this.props.onEvent(options);
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
      if (nextProps.currentChart.name !== this.state.name) {
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

   onDragEnd = (result) => {
      console.log(result);
   }

   render() {
      const {
         animateClose
      } = this.state;
      const classNames = `${animateClose ? 'animate-close' : ''} ${this.props.noScroll ? 'no-scroll' : ''}`;

      return (
         <DragDropContext onDragEnd={this.onDragEnd}>
            <div className={`flowchart ${classNames}`}>
               <div className="year-container">
                  {this.state.data ? this.getYearComponents() : null}
               </div>
            </div>
			</DragDropContext>
      );
   }
}
