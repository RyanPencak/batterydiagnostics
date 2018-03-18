import './Report.css';
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// import { LineChart } from 'react-d3-basic';

export default function Report(props) {

  const batteryData = props;

  return (
    <div className="Report">

      <h2>Battery Report</h2>

      <Grid>

        <Row className="show-grid">
          <Col xs={12} md={8}>
            <div className="batterySpecs">
              <h4>Serial Number: {batteryData.serialNum}</h4>
              <h4>Laptop ID: {batteryData.laptopId}</h4>
              <h4>Manufacturer Rated Maximum Capacity: {batteryData.rCap} mAh</h4>
              <h4>Immediate Maximum Capacity: {batteryData.mCap[batteryData.mCap.length-1]} mAh</h4>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <div className="batteryCapacity">
              <CircularProgressbar initialAnimation={true} percentage={((batteryData.mCap[batteryData.mCap.length - 1] / batteryData.rCap) * 100).toFixed(2)} />
            </div>
          </Col>
        </Row>

      </Grid>

    </div>
  );
}
