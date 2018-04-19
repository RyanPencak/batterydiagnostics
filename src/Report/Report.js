/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

import './Report.css';
import React, { Component } from 'react';
import { Button, Glyphicon, Grid, Row, Col } from 'react-bootstrap';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Label, LabelList, ReferenceLine } from 'recharts';

export default class Report extends Component {

  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    return (
      <div className="Report" id="dropLocation">

        <h1>Battery Report</h1>

        {/* Disable Report Button */}
        <div className="up">
          <a href="#topOfPage"><Button id="upBtn" bsStyle="default" bsSize="small" onClick={() => {this.props.disableBatteryReport()}}><Glyphicon glyph="chevron-up" /></Button></a>
        </div>

        {/* React Bootstrap Grid */}
        <Grid>
          <Row className="show-grid">
            {/* Basic Battery Metrics */}
            <Col xs={12} md={8}>
              <div className="batterySpecs">
                <h4>Serial Number: {this.props.serialNum}</h4>
                <h4>Laptop ID: {this.props.laptopId}</h4>
                {/* Mac vs. Windows Report Ternary: Windows uses mWh while Mac and hardware testing uses mAh */}
                {
                  this.props.isWindows
                  ?
                  <h4>Manufacturer Rated Maximum Capacity: {this.props.rCap} mWh</h4>
                  :
                  <h4>Manufacturer Rated Maximum Capacity: {this.props.rCap} mAh</h4>
                }
                {
                  this.props.isWindows
                  ?
                  <h4>Immediate Maximum Capacity: {this.props.mCap[this.props.mCap.length-1]} mWh</h4>
                  :
                  <h4>Immediate Maximum Capacity: {this.props.mCap[this.props.mCap.length-1]} mAh</h4>
                }
              </div>
            </Col>
            {/* Battery Capacity Animation */}
            <Col xs={12} md={4}>
              <div className="batteryCapacity">
                {
                  (this.props.mCap[this.props.mCap.length - 1] / this.props.rCap) < .4
                  ?
                  <CircularProgressbar initialAnimation={true} className="progressbar-red" percentage={((this.props.mCap[this.props.mCap.length - 1] / this.props.rCap) * 100).toFixed(2)} />
                  :
                  <CircularProgressbar initialAnimation={true} className="progressbar-green" percentage={((this.props.mCap[this.props.mCap.length - 1] / this.props.rCap) * 100).toFixed(2)} />
                }
              </div>
            </Col>
          </Row>

          <Row className="show-grid">
            {/* Display Capacity Plot if there is more than 1 data point and it is Windows */}
            {
              this.props.capPlotData.length > 1 && this.props.isWindows
              ?
              <LineChart width={1200} height={600} data={this.props.capPlotData} margin={{ top: 50, right: 20, bottom: 100, left: 0 }}>
                <Line name= "Measured Maximum Capacity" dot={{ stroke: 'red', strokeWidth: 2 }} type="linear" dataKey="measured_capacity" stroke="#8884d8" strokeWidth= {4} height={50} >
                  <LabelList dataKey="measured_capacity" position="bottom" />
                </Line>
                <ReferenceLine y={this.props.capPlotData[0].rated_capacity} label={{ position: 'top',  value: 'Rated Maximum Capacity', fill: 'black', fontSize: 14 }} stroke="green" strokeDasharray="3 3" strokeWidth= {4}/>
                <ReferenceLine y={0.4 * this.props.capPlotData[0].rated_capacity} label={{ position: 'bottom',  value: '40% Capacity', fill: 'black', fontSize: 14 }} stroke="red" strokeDasharray="3 3" strokeWidth= {4}/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="dates">
                  <Label value="Test Date" height={1} position="insideBottom" offset={-6} />
                </XAxis>
                <YAxis domain={[(0.4 * this.props.capPlotData[0].rated_capacity) - 100, this.props.capPlotData[0].rated_capacity + 100]}>
                  <Label value="Capacity (mWh)" angle={-90} position="insideLeft" />
                </YAxis>
                {/* Optional Tooltip Animation */}
                {/* <Tooltip animationEasing="ease" cursor={false} /> */}
                <Legend verticalAlign="middle" layout="vertical" align="right" iconSize={26} height={36}/>
              </LineChart>
              : null
            }

            {/* Display Capacity Plot if there is more than 1 data point and it is Mac or Hardware test */}
            {
              this.props.capPlotData.length > 1 && !this.props.isWindows
              ?
              <div className="capacityPlot">
                <h3>Capacity History</h3>
                <LineChart width={1200} height={600} data={this.props.capPlotData} margin={{ top: 0, right: 20, bottom: 20, left: 0 }}>
                  <Line name= "Measured Maximum Capacity" dot={true} type="linear" dataKey="measured_capacity" stroke="#8884d8" strokeWidth= {4} height={50}>
                    <LabelList dataKey="measured_capacity" position="bottom" />
                  </Line>
                  <ReferenceLine y={this.props.capPlotData[0].rated_capacity} label={{ position: 'top',  value: 'Rated Maximum Capacity', fill: 'black', fontSize: 14 }} stroke="green" strokeDasharray="3 3" strokeWidth= {4}/>
                  <ReferenceLine y={0.4 * this.props.capPlotData[0].rated_capacity} label={{ position: 'bottom',  value: '40% Capacity', fill: 'black', fontSize: 14 }} stroke="red" strokeDasharray="3 3" strokeWidth= {4}/>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="dates">
                    <Label value="Test Date" height={1} position="insideBottom" offset={-6} />
                  </XAxis>
                  <YAxis domain={[(0.4 * this.props.capPlotData[0].rated_capacity) - 100, this.props.capPlotData[0].rated_capacity + 100]}>
                    <Label value="Capacity (mAh)" angle={-90} position="insideLeft" />
                  </YAxis>
                  {/* Optional Tooltip Animation */}
                  {/* <Tooltip active={true} animationEasing="ease" cursor={false} animationDuration={50000} /> */}
                  <Legend verticalAlign="middle" layout="vertical" align="right" iconSize={26} height={36}/>
                </LineChart>
              </div>
              : null
            }
          </Row>
          <Row>
            {/* Display Discharging Plot if there is available data */}
            {
              this.props.dcPlotData.length > 0
              ?
              <div className="dischargingPlot">
                <h3>Discharging Curves</h3>
                <LineChart width={1200} height={600} data={this.props.dcPlotData} margin={{ top: 100, right: 20, bottom: 20, left: 0 }}>
                  <Line name= "Discharging Voltage" yAxisId="voltage" dot={true} type="linear" dataKey="discharging_voltage" stroke="#8884d8" strokeWidth= {4} height={50}>
                    <LabelList dataKey="discharging_voltage" position="top" />
                  </Line>
                  <Line name= "Discharging Current" yAxisId="current" dot={true} type="linear" dataKey="discharging_current" stroke="#82ca9d" strokeWidth= {4} height={50}>
                    <LabelList dataKey="discharging_current" position="top" />
                  </Line>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="discharging_capacity">
                    <Label value="Capacity (mAh)" height={1} position="insideBottom" offset={-6} />
                  </XAxis>
                  <YAxis yAxisId="voltage" orientation="left" domain={["auto", "auto"]}>
                    <Label value="Voltage (V)" angle={-90} position="insideLeft" />
                  </YAxis>
                  <YAxis yAxisId="current" orientation="right" domain={["auto", "auto"]}>
                    <Label value="Current (mA)" angle={-90} position="insideRight" />
                  </YAxis>
                  {/* Optional Tooltip Animation */}
                  {/* <Tooltip active={true} animationEasing="ease" cursor={false} animationDuration={50000} /> */}
                  <Legend verticalAlign="middle" layout="vertical" align="right" iconSize={26} height={36}/>
                </LineChart>
              </div>
              : null
            }
          </Row>

        </Grid>

      </div>
    );
  }
}
