import React, { Component } from 'react';
import MainView from './views/MainView';
import ChartSelectView from './views/ChartSelectView';

const views = {
   main: <MainView />,
   chartSelect : <ChartSelectView />
}

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
      this.state = {
         viewStack: [{
            view: 'main', props: {}
          }, {
            view: 'chartSelect',
            props: {onEvent: this.handleEvent}
         }],
      };
	}

   handleEvent = (options) => {
      if (options.closeMenu) {
         //this.emptySidebarViews();
      }
      this.props.onEvent(options);
   }

   popViewStack = () => {
      this.setState(state => {
         if (state.viewStack.length > 1) {
            state.viewStack.pop();
         }
         return state;
      });
   }

   emptySidebarViews = () => {
      let viewStack = this.state.viewStack;
      console.log(viewStack);
      while (viewStack.length > 1) {
         viewStack.pop();
      }
      this.setState(state => {
         state.viewStack = viewStack;
         return state;
      });
   }

   closeSidebar = () => {
      this.handleEvent({
         type: 'sidebar',
         action: 'toggle'
      });
   }

   BackButton = () => {
      return this.state.viewStack.length > 1 ?
         <h3 onClick={this.popViewStack}>Back</h3> : '';
   }

   getSidebarView = () => {
      let stack = this.state.viewStack;
      var stackItem = stack[stack.length-1];
      let view = views[stackItem.view];

      // If a view has saved data, add that memoized data before returning
      // element.
      try {
         return React.cloneElement(view, stackItem.props);
      } catch(e) {
         console.error("This view seems to have issues :/");
         console.log("View: ", view);
         console.log("Props: ",stackItem.props);
         console.error(e);
      }
   }

   render() {
      return (
         <div className="sidebar-container" style={{display: `${this.props.isOpen ? 'block' : 'none'}`}}>
            <div className="background-cover"
             onClick = {this.closeSidebar}></div>
            <div className="sidebar">
               <div className="sidebar-nav-container">
                  <h3 onClick={this.closeSidebar}>Close</h3>
                  {this.BackButton()}
               </div>
               <div className="sidebar-view-container">
                  {this.getSidebarView()}
               </div>
            </div>
         </div>
      );
   }
}
