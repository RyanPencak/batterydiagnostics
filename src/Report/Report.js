import './Report.css';
import React from 'react';
// import { LineChart } from 'react-d3-basic';

export default function BatteryLog(props) {

  const batteryData = props;

  return (
    <div>
      <h2>Battery Report</h2>
      <h4>Serial Number: {batteryData.serialNum}</h4>
      <h4>Laptop ID: {batteryData.laptopId}</h4>
      <h4>Manufacturer Rated Maximum Capacity: {batteryData.rCap} mAh</h4>
      <h4>Immediate Maximum Capacity: {batteryData.mCap[batteryData.mCap.length-1]} mAh</h4>
    </div>
  );
}
