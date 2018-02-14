import './BatteryLog.css';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';

export default class BatteryLog extends Component {

  constructor() {
    super();

    this.state = {
      batteryData: [{
        log_date: '',
        _id: '',
        serial_number: '',
        rated_capacity: null,
        measured_capacity: null,
        cycle_count: null,
        __v: null
      }]
    };
  }

  componentDidMount() {
    axios.get('/api/battery')
    .then(({data}) => {
      // const batteryData = data.map(obj => ({log_data: obj.log_date, _id: obj._id, serial_number: obj.serial_number, rated_capacity: obj.rated_capacity, measured_capacity: obj.measured_capacity, cycle_count: obj.cycle_count, __v: obj.__v}));
      this.setState({
        batteryData: data
      });
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
    const { log_date, _id, serial_number, rated_capacity, measured_capacity, cycle_count, __v } = this.state;

    return (
      <div className="Container">

        <div className="BatteryLog">
          <h2>Battery Log</h2>
          <p>{this.state.serial_number}</p>
        </div>

        <ReactTable
          columns={[
            {
              Header: "Serial Number",
              accessor: "serial_number"
            },
            {
              Header: "Rated Capacity",
              id: "rated_capacity",
              accessor: d => d.rated_capacity
            },
            {
              Header: "Measured Capacity",
              id: "measured_capacity",
              accessor: d => d.measured_capacity
            },
            {
              Header: "Cycle Count",
              id: "cycle_count",
              accessor: d => d.cycle_count
            },
            {
              Header: "Log Date",
              id: "log_date",
              accessor: d => d.log_date
            }
          ]}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          serial_number={serial_number}
          rated_capacity={rated_capacity}
          measured_capacity={measured_capacity}
          cycle_count={cycle_count}
          log_date={log_date}
          _id={_id}
          __v={__v}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
        />

      </div>
    );
  }
}
