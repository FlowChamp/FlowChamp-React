import React, { Component } from 'react';
import NavButton from '../components/NavButton';

export default class ChartSelectView extends Component {
	constructor(props) {
		super(props);
      this.state = {
         viewStack: [],
         data: [],
      };
      this.handleEvent = this.handleEvent.bind(this);
	}

   handleEvent(options) {
      this.props.onEvent(options);
   }

   getStockChartButtons() {
      const departments = this.state.data;
      let buttons = [];

      for (let department in departments) {
         const deptObj = departments[department];
         const name = Object.keys(deptObj)[0];
         const dept = deptObj[Object.keys(deptObj)[0]];
         const text = name.split('_').join(' ');

         buttons.push(
            <NavButton
               key={text}
               name={name}
               dept={dept}
               action={{
                  type: 'change-chart',
                  value: name,
                  closeMenu: true,
               }}
               onEvent={this.handleEvent}
               text={text} />
         );
      }
      return buttons;
   }

   componentDidMount() {
      this.fetchStockCharts();
   }

   fetchStockCharts = () => {
		fetch('https://flowchamp.org/api/cpslo/stock_charts/15-17')
			.then(response => {
			 	response.json().then((data) => {
					this.setState({
						 data: data.charts,
					});
			  });
		 });
   }

   render() {
      return (
         <div className="sidebar-view sidebar-chart-select-view">
            <h1>Charts</h1>
            {this.state.data ? this.getStockChartButtons() : <h3>Loading...</h3>}
         </div>
      );
   }
}
