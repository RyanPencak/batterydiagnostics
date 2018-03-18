import './BatteryLog.css';
import React, { Component } from 'react';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';
import { Table, Button, Glyphicon } from 'react-bootstrap';
import axios from 'axios';

export default class BatteryLog extends Component {

  constructor() {
    super();

    this.state = {
      batteryData: [],
    };

    this.getBatteryData = this.getBatteryData.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.deleteBattery = this.deleteBattery.bind(this);
    this.generateReport = this.generateReport.bind(this);
  }

  componentDidMount() {
    this.getBatteryData();
  }

  getBatteryData() {
    axios.get('/api/battery')
      .then(({data}) => {
        this.setState({batteryData: data});
      })
      .catch(err => {
        console.log(err);
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

  deleteBattery(batteryId) {
    axios.delete('/api/battery/' + batteryId)
      .then(() => {
        this.getBatteryData();
      })
      .catch(err => {
        console.log(err);
      });
  }

  generateReport(batteryId) {
    console.log(batteryId);
  }

  render() {

    return (
      <div className="container">

        <div className="batteryLog">
          <h2>Battery Log</h2>
        </div>

        <div className="bootstrapTable">
          <Table striped bordered condensed hover responsive >
            <thead>
              <tr>
                <th id="_id">Post ID (BatteryId)</th>
                <th>Battery Serial Number</th>
                <th>Laptop ID</th>
                <th>% Capacity</th>
                <th>Battery Quality</th>
                <th>Log Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.batteryData.map(battery => {
                return (
                  <tr key={battery._id}>
                    <td id="_id">{battery._id}</td>
                    {/* <td><FormGroup><Radio name={`${battery._id}`}></Radio></FormGroup></td> */}
                    <td>{battery.serialNum}</td>
                    <td>{battery.laptopId}</td>
                    <td>{(battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100} %</td>
                    <td>
                      {(battery.mCap[battery.mCap.length - 1] / battery.rCap) > 0.4 ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}
                    </td>
                    <td>{this.formatDate(battery.log_date)}</td>
                    <td className="center">
                      <Button bsStyle="danger" bsSize="small" onClick={() => {this.deleteBattery(battery._id)}}>Delete</Button>
                    </td>
                    <td className="center">
                      <Button bsStyle="primary" bsSize="small" onClick={() => {this.generateReport(battery._id)}}>Diagnostics</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
{/*
      <div className="TableButtons">
        <Button bsStyle="danger" bsSize="small" onClick={this.deleteBattery()}>Delete Battery</Button>
        <Button bsStyle="primary" bsSize="small" onClick={this.generateReport()}>Diagnostics Report</Button>
      </div> */}

      </div>
    );
  }
}
