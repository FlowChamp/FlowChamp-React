import React, { Component } from 'react';

export default class CourseModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         hasCourseData: props.data.hasOwnProperty('course_data'),
         data: props.data,
      }
   }

   handleEvent = (options) => {
      this.props.onEvent(options);
   }

   handleClose = () => {
      this.props.onEvent({
         type: 'close-course-modal'
      });
   }

   handleClick = (e) => {
      e.stopPropagation();
   }

   setupModalWithoutCourseData = () => {
      const blockMetadata = this.state.data.block_metadata;
      const courseType = blockMetadata.course_type.toLowerCase().split(' ').join('-');
      return (
         <div className={`modal-contents ${courseType}`}>

         </div>
      );
   }

   setupModal = () => {
      const courseData = this.state.data.course_data;
      const blockMetadata = this.state.data.block_metadata;
      const courseType = blockMetadata.course_type.toLowerCase().split(' ').join('-');

      if (!courseData.length) {
         return (
            <div className={`modal-contents ${courseType}`}>
               <ModalHeader
                  type={courseType}
                  title={`${courseData.dept} ${courseData.course_number}`}
                  subtitle={courseData.title}
                  units={courseData.units}
                  onEvent={this.handleEvent}
               />
            </div>
         )
      } else {
         return (
            <div className={`modal-contents ${courseType}`}>

            </div>
         );
      }
   }

   render() {
      console.log(this.props.data);
      return (
         <div className="modal-cover" onClick={this.handleClose}>
            <div className="modal course-modal" onClick={this.handleClick}>
               {this.state.hasCourseData ? this.setupModal() : this.setupModalWithoutCourseData()}
            </div>
         </div>
      );
   }
}

class ModalHeader extends Component {
   handleCloseClick = () => {
      this.props.onEvent({
         type: 'close-course-modal'
      });
   }

   render() {
      return (
         <div className={`modal-header ${this.props.type}`}>
            <div className="modal-title-container">
               <h3 className="modal-title">{this.props.title}</h3>
               <h3 className="modal-subtitle">{this.props.subtitle}</h3>
            </div>
            <div className="modal-nav-container">
               <h3 className="modal-close-button"
                onClick={this.handleCloseClick}>&times;</h3>
               <h3 className="unit-count">{this.props.units} Units</h3>
            </div>
         </div>
      );
   }
}
