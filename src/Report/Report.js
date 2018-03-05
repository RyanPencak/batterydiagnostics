import './Report.css';
import React, { Component } from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';

const data = {
  // labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Rated Maximum Capacity',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
      // data: [4327, 4326, 4311, 4293, 4290, 4302, 4302, 4286, 4305, 4312, 4301, 4301, 4301, 4306, 4303, 4303, 4303]
    },
    {
      label: 'Measured Maximum Capacity',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
      // data: [4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315, 4315]
    }
  ]
};

export default class BatteryLog extends Component {

  constructor() {
    super();

    this.state = {
      batteryData: []
    };
  }

  componentDidMount() {
    axios.get('/api/battery')
    .then(({data}) => {
      this.setState({batteryData: data.reverse()});
    });
  }

  render() {
    return (
      <div>
        <h2>Battery Report</h2>
        <Line data={data} />
      </div>
    );
  }
}
