import React, { Component } from 'react';
import Block from './Block';
import { /*DragDropContext,*/ Droppable, Draggable } from 'react-beautiful-dnd';

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

   getBlockComponents = (provided) => {
      const data = this.state.data;
      let blockComponents = data.map((meta, index) => {
         return (
            <Block
               key={meta.block_metadata._id}
               _key={meta.block_metadata._id}
               provided={provided}
               index={index}
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
         return null;
      });
      this.setState(state => {
         state.unitCount = unitCount;
         return state;
      })
   }

   componentDidMount() {
      this.getUnitCount();
   }

  	onDragEnd(result) {
    	// dropped outside the list
    	if (!result.destination) {
      	return;
    	}
		console.log("REORDERED");
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
            <Droppable droppableId={`droppable-${this.props.index}`}>
               {(provided, snapshot) => (
                  <div className="block-container"
                     ref={provided.innerRef}>
                     {this.state.data.map((item, index) => (
                        <Draggable key={item.block_metadata._id} draggableId={item.block_metadata._id} index={index}>
                           {(provided, snapshot) => (
                              <Block
                                 key={item.block_metadata._id}
                                 _key={item.block_metadata._id}
                                 provided={provided}
                                 index={index}
                                 data={item}
                                 onEvent={this.handleEvent}
                              />
                           )}
                        </Draggable>
                     ))}
                  </div>
               )}
            </Droppable>
         </div>
      );
   }
}
