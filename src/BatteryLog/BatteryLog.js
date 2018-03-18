import './BatteryLog.css';
import React, { Component } from 'react';
import { Table, Button, Glyphicon } from 'react-bootstrap';
import DeleteBatteryModal from '../DeleteBatteryModal/DeleteBatteryModal.js';
import Report from '../Report/Report.js';
import axios from 'axios';

export default class BatteryLog extends Component {

  constructor() {
    super();

    this.state = {
      batteryData: [],
      deleteBatteryModalOpen: false,
      reportSectionDisplayed: false,
      selectedBatteryId: '',
      selectedSerialNumber: '',
      selectedLaptopId: 0,
      selectedRatedCapacity: 0,
      selectedMeasuredCapacity: [],
      selectedDischargingVoltage: [],
      selectedDischargingCurrent: [],
      selectedDischargingCapacity: []
    };

    this.getBatteryData = this.getBatteryData.bind(this);
    this.getBatteryDataById = this.getBatteryDataById.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.toggleDeleteBatteryModal = this.toggleDeleteBatteryModal.bind(this);
    this.toggleBatteryReport = this.toggleBatteryReport.bind(this);
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

  getBatteryDataById(batteryId) {
    axios.get('/api/battery/' + batteryId)
      .then(({data}) => {
        this.setState({
          selectedSerialNumber: data.serialNum,
          selectedLaptopId: data.laptopId,
          selectedRatedCapacity: data.rCap,
          selectedMeasuredCapacity: data.mCap,
          selectedDischargingVoltage: data.dcVol,
          selectedDischargingCurrent: data.dcCur,
          selectedDischargingCapacity: data.dcCap
        });
        // console.log(this.state);
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
    // var hour_temp = parseInt(hour, 10);
    // hour_temp = hour_temp - 5;
    // hour = hour_temp.toString();
    var minute = d.charAt(14) + d.charAt(15);
    var second = d.charAt(17) + d.charAt(18);

    return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
  }

  toggleDeleteBatteryModal(batteryId) {
    this.setState({
      deleteBatteryModalOpen: !this.state.deleteBatteryModalOpen,
      selectedBatteryId: batteryId
    });
  }

  toggleBatteryReport(batteryId) {
    if(batteryId === this.state.selectedBatteryId) {
      this.setState({
        reportSectionDisplayed: !this.state.reportSectionDisplayed
      })
    }
    else {
      this.getBatteryDataById(batteryId);
      this.setState({
        reportSectionDisplayed: true,
        selectedBatteryId: batteryId
      });
    }
  }

  render() {

    return (
      <div className="BatteryLog">

        <div className="header">
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
                <th>Delete</th>
                <th>Generate Report</th>
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
                      <Button bsStyle="danger" bsSize="small" onClick={() => {this.toggleDeleteBatteryModal(battery._id)}}><Glyphicon glyph="trash" /></Button>
                    </td>
                    <td className="center">
                      <Button bsStyle="primary" bsSize="small" onClick={() => {this.toggleBatteryReport(battery._id)}}><Glyphicon glyph="tasks" /></Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>

        {
          this.state.deleteBatteryModalOpen
          ?
          <DeleteBatteryModal
            selectedBatteryId={this.state.selectedBatteryId}
            toggleDeleteBatteryModal={this.toggleDeleteBatteryModal}
            getBatteryData={this.getBatteryData}
          />
          : null
        }

        {
          this.state.reportSectionDisplayed
          ?
          <Report
            serialNum={this.state.selectedSerialNumber}
            laptopId={this.state.selectedLaptopId}
            rCap={this.state.selectedRatedCapacity}
            mCap={this.state.selectedMeasuredCapacity}
            dcVol={this.state.selectedDischargingVoltage}
            dcCur={this.state.selectedDischargingCurrent}
            dcCap={this.state.selectedDischargingCapacity}
          />
          : null
        }

      </div>
    );
  }
}
