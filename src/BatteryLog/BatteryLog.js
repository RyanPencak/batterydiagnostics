import './BatteryLog.css';
import React, { Component } from 'react';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';
import { Table, Pager, Glyphicon } from 'react-bootstrap';
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

  formatDate(date) {
    var d = date.toString();
    var day = d.charAt(8) + d.charAt(9);
    var month = d.charAt(5) + d.charAt(6);
    var year = d.charAt(0) + d.charAt(1) + d.charAt(2) + d.charAt(3);
    var hour = d.charAt(11) + d.charAt(12);
    var hour_temp = parseInt(hour, 10);
    hour_temp = hour_temp - 5;
    hour = hour_temp.toString();
    var minute = d.charAt(14) + d.charAt(15);
    var second = d.charAt(17) + d.charAt(18);

    return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
  }

  render() {

    return (
      <div className="Container">

        <div className="BatteryLog">
          <h2>Battery Log</h2>
        </div>

        <div className="BootstrapTable">
          <Pager>
            <Table striped bordered condensed hover responsive >
              <thead>
                <tr>
                  <th id="_id">Post ID (BatteryId)</th>
                  <th>Battery Serial Number</th>
                  <th>Laptop ID</th>
                  <th>% Capacity</th>
                  <th>Battery Quality</th>
                  <th>Log Date</th>
                </tr>
              </thead>
              <tbody>
                {this.state.batteryData.map(battery => {
                  return (
                    <tr key={battery._id}>
                      <td id="_id">{battery._id}</td>
                      <td>{battery.serialNum}</td>
                      <td>{battery.laptopId}</td>
                      <td>{(battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100} %</td>
                      <td>
                        {(battery.mCap[battery.mCap.length - 1] / battery.rCap) > 0.4 ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}
                      </td>
                      <td>{this.formatDate(battery.log_date)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Pager>
        </div>

      </div>
    );
  }
}
