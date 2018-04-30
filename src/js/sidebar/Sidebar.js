import React, { Component } from 'react';
import SidebarNav from './components/SidebarNav';
import MainView from './views/MainView';
import ChartSelectView from './views/ChartSelectView';
import ChartNameView from './views/ChartNameView';
import YearSelectView from './views/YearSelectView';
import LoginView from './views/LoginView';
import PinView from './views/PinView';
import SettingsView from './views/SettingsView';

const views = {
   main: <MainView />,
   chartSelect : <ChartSelectView header="New Flowchart"/>,
   chartName : <ChartNameView header="Give it a name"/>,
   yearSelect : <YearSelectView header="Starting Year"/>,
   login : <LoginView header="Cal Poly Login"/>,
   pin : <PinView header="Enter Pin"/>,
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
	   switch(options.type) {
         case 'change-view':
            this.changeView(options);
            break;
         case 'route':
            this.changeView(options);
            break;
         case 'pop-view':
            this.popViewStack();
            break;
         case 'empty-views':
            this.mainMenu();
            break;
         default:
            this.props.onEvent(options);
            break;
      }
   }

   mainMenu = () => {
      this.setState(state => {
         state.isEnteringOldView = true;
         return state;
      });
      setTimeout(() => {
         this.setState(state => {
            state.isEnteringOldView = false;
            state.viewStack = [{
               view: 'main',
               props: {isEnteringOldView: true}
             }];
            return state;
         });
      }, 190);
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
                  data: options.data,
                  route: options.route,
                  onEvent: this.handleEvent
               }
            });
            return state;
         });
      }, 190);
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
      }, 190);
   }

   emptyViews = () => {
      this.setState(state => {
         state.viewStack =  [{
            view: 'main', props: {}
          }];
          return state;
      });
   }

   closeSidebar = () => {
      this.handleEvent({
         type: 'sidebar',
         action: 'toggle'
      });
   }

   getSidebarView = () => {
      let stack = this.state.viewStack;
      var stackItem = stack[stack.length-1];
      let view = views[stackItem.view];
      stackItem.props.user = this.props.user;
      stackItem.props.onEvent = this.handleEvent;
      stackItem.props.isEnteringNewView = stackItem.props.isEnteringOldView ? false : this.state.isEnteringNewView;
      stackItem.props.isEnteringOldView = stackItem.props.isEnteringOldView ? false :  this.state.isEnteringOldView;

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
