import './Report.css';
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function Report(props) {

  const battery = props;
  const data = [
    {
      "rCap": battery.rCap,
      "mCap": battery.mCap[0]
    },
    {
      "rCap": 1000,
      "mCap": battery.mCap[1]
    },
    {
      "rCap": 1000,
      "mCap": battery.mCap[2]
    },
    {
      "rCap": 1000,
      "mCap": battery.mCap[3]
    },
  ]

  return (
    <div className="Report">

      <h1>Battery Report</h1>

      <Grid>

        <Row className="show-grid">
          <Col xs={12} md={8}>
            <div className="batterySpecs">
              <h4>Serial Number: {battery.serialNum}</h4>
              <h4>Laptop ID: {battery.laptopId}</h4>
              {
                props.isWindows
                ?
                <h4>Manufacturer Rated Maximum Capacity: {battery.rCap} mWh</h4>
                :
                <h4>Manufacturer Rated Maximum Capacity: {battery.rCap} mAh</h4>
              }
              {
                props.isWindows
                ?
                <h4>Immediate Maximum Capacity: {battery.mCap[battery.mCap.length-1]} mWh</h4>
                :
                <h4>Immediate Maximum Capacity: {battery.mCap[battery.mCap.length-1]} mAh</h4>
              }
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="batteryCapacity">
              {
                (battery.mCap[battery.mCap.length - 1] / battery.rCap) < .4
                ?
                <CircularProgressbar initialAnimation={true} className="progressbar-red" percentage={((battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100).toFixed(2)} />
                :
                <CircularProgressbar initialAnimation={true} className="progressbar-green" percentage={((battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100).toFixed(2)} />
              }
            </div>
          </Col>
        </Row>

        <Row className="show-grid">
          <Col xs={12} md={6}>
            <LineChart width={400} height={400} data={data}>
              <Line type="monotone" dataKey="mCap" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Col>
          <Col xs={12} md={6}>

          </Col>
        </Row>

      </Grid>

    </div>
  );
}
