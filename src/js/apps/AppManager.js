import React, { Component } from 'react';
import SplitPane from 'react-split-pane';
import Flowchart from './flowchart/Flowchart';
import AppSelector from './app_selector/AppSelector';
import { X } from 'react-feather';
import UserManager from '../UserManager';

const apps = {
   'Flowchart': <Flowchart />,
   'App Selector': <AppSelector />
}

export default class AppManager extends Component {
   constructor(props) {
      super(props);
      this.state = {
         splitPane: props.splitPane,
         layout: {
            pane1: [{title: 'Flowchart', props: {}}],
            pane2: [{title: 'Flowchart', props: {}}],
         },
         currentChart: {
            name: "Welcome",
            data: null,
         }
      }
   }

   handleEvent = options => {
      switch(options.type) {
         case 'swap-panes':
            this.swapPanes();
            break;
         case 'close-tab':
            this.closeTab(options);
            break;
         default:
            this.props.onEvent(options);
            break;
      }
   }

   swapPanes() {
      this.setState(state => {
         const temp = state.layout.pane1;
         state.layout.pane1 = state.layout.pane2;
         state.layout.pane2 = temp;
         return state;
      });
   }

   closeTab = options => {
      this.setState(state => {
         state.layout[`pane${options.value}`].pop();
         return state;
      });
   }

   getAppLayout = () => {
      const split = this.state.splitPane;
      const layout = this.state.layout;
      const pane1 = layout.pane1[layout.pane1.length-1];
      const pane2 = layout.pane2[layout.pane2.length-1];

      if (split) {
         return (
            <SplitPane split="vertical" defaultSize="50%" minSize="200">
               <PaneContainer
                  {...this.props}
                  index={1}
                  app={pane1}
                  currentChart={this.state.currentChart}
                  onEvent={this.handleEvent}
                  />
               <PaneContainer
                  {...this.props}
                  index={2}
                  app={pane2}
                  currentChart={this.state.currentChart}
                  onEvent={this.handleEvent}
                  />
            </SplitPane>
         );
      } else {
         return (
            <PaneContainer
               {...this.props}
               index={1}
               app={pane1}
               currentChart={this.state.currentChart}
               hideTabs
               onEvent={this.handleEvent}
               />
         );
      }
   }

   getActiveChart(config) {
      if (config.active_chart !== this.state.currentChart.name) {
         this.setState(state => {
            state.currentChart.name = config.active_chart;
            return state;
         }, () => {
            this.getChartData(config);
         });
      }
   }

   getChartData = (config) => {
      UserManager.getActiveChart(config).then(response => {
         this.setState(state => {
            state.currentChart.data = response;
            return state;
         });
      }).catch(e => {
         console.error("Unable to get chart data:", e);
      });
   }

   componentWillReceiveProps(nextProps) {
      this.setState({
         splitPane: nextProps.splitPane
      });
      if (nextProps.user.isLoggedIn) {
         this.getActiveChart(nextProps.user.config);
      }
   }

   render() {
      return (
         <div className="app-container">
            {this.getAppLayout()}
         </div>
      );
   }
}

class PaneContainer extends Component {
   constructor(props) {
      super(props);
      this.state = {
         currentChart: props.currentChart,
         currentApp: null
      }
   }

   closeTab = () => {
      this.props.onEvent({
         type: 'close-tab',
         value: this.props.index
      });
   }

   swapPanes = () => {
      this.props.onEvent({
         type: 'swap-panes'
      });
   }

   getCurrentApp = () => {
      let appItem = this.props.app ? this.props.app : {
         title: 'App Selector',
         props: {}
      };
      let app = apps[appItem.title];
      const currentChart = this.state.currentChart;

      appItem.props = {
         user: this.props.user,
         onEvent: this.handleEvent,
         currentChart: currentChart
      }

      try {
         this.setState(state => {
            state.currentApp = React.cloneElement(app, appItem.props);
            return state;
         });
      } catch(e) {
         console.error("This app seems to have issues :/");
         console.log("App View: ", app);
         console.log("Props: ",appItem.props);
         console.error(e);
      }
   }

   componentDidMount() {
      this.getCurrentApp()
   }

   componentWillReceiveProps(nextProps) {
      this.setState(state => {
         state.currentChart = nextProps.currentChart;
         return state;
      }, () => {
         this.getCurrentApp();
      });
   }

   render() {
      return (
         <div className="pane-container">
            {this.props.app &&
               <div className="tab-container" style={{display: this.props.hideTabs ? 'none' : 'flex'}}>
                  <div className="tab">
                     <h3>{this.props.app.title}</h3>
                  </div>
                  <div className="tab-action-container">
                     <img className="img-icon" onClick={this.swapPanes}
                        src={`images/icons/swap-${this.props.index === 1 ? 'right' : 'left'}.svg`} />
                     <X className="icon" onClick={this.closeTab}/>
                  </div>
               </div>}
            {this.state.currentApp}
         </div>
      );
   }
}
