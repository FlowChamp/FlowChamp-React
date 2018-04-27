import React, { Component } from 'react';
import Quarter from './Quarter';

const quarters = ['Fall', 'Winter', 'Spring'];

export default class Year extends Component {
	constructor(props) {
		super(props);
      this.state = {
         data: props.data
      };
	}

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   getQuarterComponents = () => {
      const data = this.state.data;
      let quarterComponents = [];

      for (let i in quarters) {
         const quarter = quarters[i];
         let quarterData = [];

         for (let item in data) {
            const meta = data[item];

            if (meta.block_metadata.time[1] === quarter) {
               quarterData.push(meta);
            }
         }
         quarterComponents.push(
            <Quarter
               key={quarter}
               index={i}
               data={quarterData}
               title={quarter}
               onEvent={this.handleEvent}
            />
         );
      }
      return quarterComponents;
   }

   render() {
      return (
         <div className="year">
            <h2 className="year-title">{this.props.title}</h2>
            <div className="quarter-container">
               {this.getQuarterComponents()}
            </div>
         </div>
      );
   }
}
