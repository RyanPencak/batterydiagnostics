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
              Header: "Serial Number",
              accessor: "serial_number",
              aggregate: (values, rows) => values[0]
            },
            {
              Header: "Rated Capacity",
              accessor: "rated_capacity",
              aggregate: (values, rows) => values[0]
            },
            {
              Header: "Measured Capacity",
              accessor: "measured_capacity",
              aggregate: (values, rows) => values[0]
            },
            {
              Header: "Cycle Count",
              accessor: "cycle_count",
              aggregate: (values, rows) => values[0]
            },
            {
              Header: "Log Date",
              accessor: "log_date",
              aggregate: (values, rows) => values[0]
            }
          ]}
          pivotBy={['serial_number']}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />

      </div>
    );
  }
}
