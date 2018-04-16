import React, { Component } from 'react';
import SidebarNav from './components/SidebarNav';
import MainView from './views/MainView';
import ChartSelectView from './views/ChartSelectView';
import LoginView from './views/LoginView';
import SettingsView from './views/SettingsView';

const views = {
   main: <MainView />,
   chartSelect : <ChartSelectView header="New Flowchart"/>,
   login : <LoginView header="Cal Poly Login"/>,
   settings : <SettingsView header="Settings"/>,
}

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
      this.state = {
         isChangingView: false,
         viewStack: [{
            view: 'main', props: {}
          }],
      };
	}

   handleEvent = (options) => {
      if (options.type === 'change-view') {
         this.changeView(options);
      } else if (options.type === 'pop-view') {
         this.popViewStack();
      } else {
         this.props.onEvent(options);
      }
   }

   changeView = (options) => {
      this.setState(state => {
         state.isEnteringNewView = true;
         return state;
      });
      setTimeout(() => {
         this.setState(state => {
            state.isEnteringNewView = false;
            state.viewStack[state.viewStack.length-1].props.isPrevView = true;
            state.viewStack.push({
               view: options.value,
               props: {
                  isEnteringNewView: this.state.isEnteringNewView,
                  isDemo: !this.props.user.requireAuth,
                  onEvent: this.handleEvent}
            });
            return state;
         });
      }, 250);
   }

   popViewStack = () => {
      this.setState(state => {
         state.isEnteringOldView = true;
         return state;
      });
      setTimeout(() => {
         this.setState(state => {
            state.isEnteringOldView = false;
            if (state.viewStack.length > 1) {
               state.viewStack.pop();
            }
            return state;
         });
      }, 250);
   }

   closeSidebar = () => {
      this.handleEvent({
         type: 'sidebar',
         action: 'toggle'
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

   getSidebarView = () => {
      let stack = this.state.viewStack;
      var stackItem = stack[stack.length-1];
      let view = views[stackItem.view];
      stackItem.props.user = this.props.user;
      stackItem.props.onEvent = this.handleEvent;
      stackItem.props.isEnteringNewView = this.state.isEnteringNewView;
      stackItem.props.isEnteringOldView = this.state.isEnteringOldView;

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
            <div className={`background-cover ${this.props.isClosing ? 'cover-closing' : ''}`}
             onClick = {this.closeSidebar}></div>
            <div className={`sidebar ${this.props.isClosing ? 'closing' : ''}`}>
               <SidebarNav {...this.props}
                  viewStack={this.state.viewStack}
                  onEvent={this.handleEvent}/>
               <div className="sidebar-view-container">
                  {this.getSidebarView()}
               </div>
            </div>
         </div>
      );
   }
}
