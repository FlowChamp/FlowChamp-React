import React, { Component } from 'react';
import MainView from './views/MainView';
import ChartSelectView from './views/ChartSelectView';
import LoginView from './views/LoginView';
import { ArrowLeft, Menu } from 'react-feather';

const views = {
   main: <MainView />,
   chartSelect : <ChartSelectView header="New Flowchart"/>,
   login : <LoginView header="Cal Poly Login"/>,
}

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
      this.state = {
         viewStack: [{
            view: 'main', props: {}
          }],
      };
	}

   handleEvent = (options) => {
      if (options.type === 'change-view') {
         this.changeView(options);
      } else {
         this.props.onEvent(options);
      }
   }

   changeView = (options) => {
      this.setState(state => {
         state.viewStack[state.viewStack.length-1].props.isPrevView = true;
         state.viewStack.push({
            view: options.value,
            props: {onEvent: this.handleEvent}
         });
         return state;
      });
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
         <ArrowLeft className="back-icon"
            onClick={this.popViewStack} /> : '';
   }

   getSidebarView = () => {
      let stack = this.state.viewStack;
      var stackItem = stack[stack.length-1];
      let view = views[stackItem.view];
      stackItem.props.user = this.props.user;
      stackItem.props.onEvent = this.handleEvent;

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
                  <Menu className="menu-icon" onClick={this.closeSidebar}/>
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
