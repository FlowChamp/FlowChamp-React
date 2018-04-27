import React, { Component } from 'react';
import Year from './Year';
import { DragDropContext } from 'react-beautiful-dnd';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

export default class Flowchart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         name: props.currentChart.name,
         data: props.currentChart.data
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

   onDragEnd = (result) => {
      console.log(result);
   }

   render() {
      return (
         <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="flowchart">
               <div className="year-container">
                  {this.getYearComponents()}
               </div>
            </div>
			</DragDropContext>
      );
   }
}
