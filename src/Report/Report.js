import './Report.css';
import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label, LabelList } from 'recharts';

export default class Report extends Component {

  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    return (
      <div className="Report" id="dropLocation">

        <h1>Battery Report</h1>

        <Grid>

          <Row className="show-grid">
            <Col xs={12} md={8}>
              <div className="batterySpecs">
                <h4>Serial Number: {this.props.serialNum}</h4>
                <h4>Laptop ID: {this.props.laptopId}</h4>
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
            {
              this.props.capPlotData.length > 1 && this.props.isWindows
              ?
              <LineChart width={1200} height={600} data={this.props.capPlotData} margin={{ top: 100, right: 20, bottom: 20, left: 0 }}>
                <Line name= "Measured Maximum Capacity" dot={{ stroke: 'red', strokeWidth: 2 }} type="monotone" dataKey="measured_capacity" stroke="#8884d8" strokeWidth= {4} height={50} />
                <Line name= "Rated Maximum Capacity" dot={{ stroke: 'red', strokeWidth: 2 }} type="monotone" dataKey="rated_capacity" stroke="#82ca9d" strokeWidth= {4} height={50} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="test_number">
                  <Label value="Test Number" height={1} position="insideBottom" offset={-6} />
                </XAxis>
                <YAxis domain={["auto", "auto"]}>
                  <Label value="Capacity (mWh)" angle={-90} position="insideLeft" />
                </YAxis>
                {/* <Tooltip animationEasing="ease" cursor={false} /> */}
                <Legend verticalAlign="middle" layout="vertical" align="right" iconSize={26} height={36}/>
              </LineChart>
              : null
            }
            {
              this.props.capPlotData.length > 1 && !this.props.isWindows
              ?
              <LineChart width={1200} height={600} data={this.props.capPlotData} margin={{ top: 100, right: 20, bottom: 20, left: 0 }}>
                <Line name= "Measured Maximum Capacity" dot={true} type="monotone" dataKey="measured_capacity" stroke="#8884d8" strokeWidth= {4} height={50}>
                  <LabelList dataKey="measured_capacity" position="top" />
                </Line>
                <Line name= "Rated Maximum Capacity" dot={true} type="monotone" dataKey="rated_capacity" stroke="#82ca9d" strokeWidth= {4} height={50} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="test_number">
                  <Label value="Test Number" height={1} position="insideBottom" offset={-6} />
                </XAxis>
                <YAxis domain={["auto", "auto"]}>
                  <Label value="Capacity (mAh)" angle={-90} position="insideLeft" />
                </YAxis>
                {/* <Tooltip active={true} animationEasing="ease" cursor={false} animationDuration={50000} /> */}
                <Legend verticalAlign="middle" layout="vertical" align="right" iconSize={26} height={36}/>
              </LineChart>
              : null
            }
          </Row>
          <Row>
            {
              this.props.dcPlotData.length >= 0
              ?
              <LineChart width={1200} height={600} data={this.props.dcPlotData} margin={{ top: 100, right: 20, bottom: 20, left: 0 }}>
                <Line name= "Discharging Voltage" yAxisId="voltage" dot={true} type="monotone" dataKey="discharging_voltage" stroke="#8884d8" strokeWidth= {4} height={50}>
                  <LabelList dataKey="discharging_voltage" position="top" />
                </Line>
                <Line name= "Discharging Current" yAxisId="current" dot={true} type="monotone" dataKey="discharging_current" stroke="#82ca9d" strokeWidth= {4} height={50}>
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
                <Tooltip active={true} animationEasing="ease" cursor={false} animationDuration={50000} />
                <Legend verticalAlign="middle" layout="vertical" align="right" iconSize={26} height={36}/>
              </LineChart>
              : null
            }
          </Row>

        </Grid>

      </div>
    );
  }
}
