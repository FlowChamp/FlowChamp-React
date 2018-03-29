import React, { Component } from 'react';
import Block from './Block';

export default class Quarter extends Component {
	constructor(props) {
		super(props);
      this.state = {
         data: props.data,
         unitCount: 0,
      }
	}

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   getBlockComponents = () => {
      const data = this.state.data;
      const courseData = data.course_data;
      let blockComponents = data.map(meta => {
         return (
            <Block
               key={meta.block_metadata._id}
               data={meta}
               onEvent={this.handleEvent}
            />
         )
      });
      return blockComponents;
   }

   getUnitCount = () => {
      const data = this.state.data;
      const courseData = data.course_data;
      let unitCount = 0;

      data.map(meta => {
         unitCount += courseData && !courseData.length ? courseData.units : 4;
      });
      this.setState(state => {
         state.unitCount = unitCount;
         return state;
      })
   }

   componentDidMount() {
      this.getUnitCount();
   }

   render() {
      return (
         <div className="quarter">
            <div className="quarter-head">
               <h3 className="quarter-season">
                  {this.props.title}
               </h3>
               <h3 className="quarter-units">
                  {this.state.unitCount} Units
               </h3>
            </div>
            <div className="block-container">
               {this.getBlockComponents()}
            </div>
         </div>
      );
   }
}
