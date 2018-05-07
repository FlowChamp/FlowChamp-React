import React, { Component } from 'react';
//import { Draggable } from 'react-beautiful-dnd';

export default class Block extends Component {
   constructor(props) {
      super(props);
      this.state = {
         hasCourseData: props.data.hasOwnProperty('course_data'),
         data: props.data,
      }
   }

   handleClick = () => {
      this.props.onEvent({
         type: 'open-course-modal',
         value: this.state.data
      })
   }

   setupBlockWithoutCourseData = () => {
      const blockMetadata = this.state.data.block_metadata;
      const courseType = blockMetadata.course_type.toLowerCase().split(' ').join('-');
      return (
         <div className={`block-contents ${courseType}`}>
            <h3 className="block-title">
               Generic Course
            </h3>
            <div className="block-subtitle">
               Course
            </div>
            <h5 className="block-units">4 Units</h5>
         </div>
      );
   }

   setupBlock = () => {
      const courseData = this.state.data.course_data;
      const blockMetadata = this.state.data.block_metadata;
      const courseType = blockMetadata.course_type.toLowerCase().split(' ').join('-');

      if (!courseData.length) {
         return (
            <div className={`block-contents ${courseType}`}>
               <h3 className="block-title">
                  {`${courseData.dept} ${courseData.course_number}`}
               </h3>
               <div className="block-subtitle">
                  {courseData.title}
               </div>
               <h5 className="block-units">{courseData.units} Units</h5>
            </div>
         )
      } else {
         return (
            <div className={`block-contents ${courseType}`}>
               <h3 className="block-title">
                  Multi Course
               </h3>
               <div className="block-subtitle">
                  Course
               </div>
               <h5 className="block-units">4 Units</h5>
            </div>
         );
      }
   }

   render() {
      return (
         <div className="block"
            ref={this.props.provided.innerRef}
            {...this.props.provided.draggableProps}
            {...this.props.provided.dragHandleProps}>
            {this.state.hasCourseData ? this.setupBlock() : this.setupBlockWithoutCourseData()}
         </div>
      );
   }
}
