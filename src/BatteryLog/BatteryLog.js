import './BatteryLog.css';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';

export default class BatteryLog extends Component {

  constructor() {
    super();

    this.state = {
      // batteryData: [{
      //   "log_date": '',
      //   "_id": '',
      //   "serial_number": '',
      //   "rated_capacity": null,
      //   "measured_capacity": null,
      //   "cycle_count": null,
      //   "__v": null
      // }]
      batteryData: []
    };
  }

  componentDidMount() {
    axios.get('/api/battery')
    .then(({data}) => {
      // const batteryData = data.map(obj => ({log_data: obj.log_date, _id: obj._id, serial_number: obj.serial_number, rated_capacity: obj.rated_capacity, measured_capacity: obj.measured_capacity, cycle_count: obj.cycle_count, __v: obj.__v}));

      // use this?
      // this.setState({
      //   batteryData: data
      // });

      // works!
      this.setState({batteryData: data});

      // this.setState({
      //   log_date: data.log_date,
      //   _id: data._id,
      //   serial_number: data.serial_number,
      //   rated_capacity: data.rated_capacity,
      //   measured_capacity: data.measured_capacity,
      //   cycle_count: data.cycle_count,
      //   __v: data.__v
      // });
    });
  }

  // componentDidMount() {
  //   // axios.get('https://bucknellbatterydiagnostics.herokuapp.com/batterydata', {
  //   //   responseType: 'json'
  //   // }).then(response => {
  //   //     this.setState({ batteryData: response.data });
  //   //   });
  //
    // axios
    //   .get('/api/battery', {responseType: 'json'})
    //   .then(({ data }) => {
        // const batteryData = response.data.map(obj => ({log_data: obj.log_date, _id: obj._id, serial_number: obj.serial_number, rated_capacity: obj.rated_capacity, measured_capacity: obj.measured_capacity, cycle_count: obj.cycle_count, __v: obj.__v}));
        // this.setState({ batteryData });
      	// this.setState({
        //   log_data: data.log_date,
        //   _id: data._id,
        //   serial_number: data.serial_number,
        //   rated_capacity: data.rated_capacity,
        //   measured_capacity: data.measured_capacity,
        //   cycle_count: data.cycle_count,
        //   __v: data.__v
        // });
        // this.setState({
        //   batteryData: response.data
        // })
        // this.setState({
        //   batteryData = response.data.map(obj => ({log_data: obj.log_date, _id: obj._id, serial_number: obj.serial_number, rated_capacity: obj.rated_capacity, measured_capacity: obj.measured_capacity, cycle_count: obj.cycle_count, __v: obj.__v}));
        // })
      // })
  // }


  render() {
    // const batteryData = this.state;
    // const { log_date, _id, serial_number, rated_capacity, measured_capacity, cycle_count, __v } = this.state;

    // var log_date;
    // var _id;
    // var serial_number = this.state.batteryData.serial_number;
    // var rated_capacity = this.state.batteryData.rated_capacity;
    // var measured_capacity;
    // var cycle_count;
    // var __v;
    //
    // {this.state.batteryData.map(function(item, key) {
    //   log_date = item.log_date;
    //   _id = item._id;
    //   serial_number = item.serial_number;
    //   rated_capacity = item.rated_capacity;
    //   measured_capacity = item.measured_capacity;
    //   cycle_count = item.cycle_count;
    //   __v = item.__v;
    // })};

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
              accessor: "serial_number"
            },
            {
              Header: "Rated Capacity",
              accessor: "rated_capacity"
            },
            {
              Header: "Measured Capacity",
              accessor: "measured_capacity"
            },
            {
              Header: "Cycle Count",
              accessor: "cycle_count"
            },
            {
              Header: "Log Date",
              accessor: "log_date"
            }
          ]}
          // manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          // sn={this.state.batteryData.serial_number}
          // rated_capacity={this.state.batteryData.rated_capacity}
          // measured_capacity={this.state.batteryData.measured_capacity}
          // cycle_count={this.state.batteryData.cycle_count}
          // log_date={this.state.batteryData.log_date}
          // _id={this.state.batteryData._id}
          // __v={this.state.batteryData.__v}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />

      </div>
    );
  }
}
