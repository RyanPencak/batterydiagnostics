import './BatteryLog.css';
import React, { Component } from 'react';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';
import { Table } from 'react-bootstrap';
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
      this.setState({batteryData: data});
    });
  }

  render() {

    return (
      <div className="Container">

        <div className="BatteryLog">
          <h2>Battery Log</h2>
        </div>

        <div className="BootstrapTable">
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th id="_id">Post ID (BatteryId)</th>
                <th>Battery Serial Number</th>
                <th>Laptop ID</th>
                <th>% Capacity</th>
                <th>Battery Quality</th>
              </tr>
            </thead>
            <tbody>
              {this.state.batteryData.map(battery => {
                return (
                  <tr>
                    <td id="_id">{battery._id}</td>
                    <td>{battery.serialNum}</td>
                    <td>{battery.laptopId}</td>
                    <td></td>
                    <td></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>

      </div>
    );
  }
}
