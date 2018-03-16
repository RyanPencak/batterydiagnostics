import './BatteryLog.css';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';

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
      <div className="Container">

        <div className="BatteryLog">
          <h2>Battery Log</h2>
        </div>

        <ReactTable
          data = {this.state.batteryData}
          columns={[
            {
              Header: "Laptop ID",
              accessor: "laptopId"
            },
            {
              Header: "Serial Number",
              accessor: "serialNum"
            },
            {
              Header: "Rated Capacity",
              accessor: "rCap"
            },
            {
              Header: "Measured Capacity",
              accessor: "mCap"
            },
            {
              Header: "Cycle Count",
              accessor: "cycles"
            },
            {
              Header: "Date Logged",
              accessor: "log_date"
            }
          ]}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />


      </div>
    );
  }
}
