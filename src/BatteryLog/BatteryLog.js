/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

import './BatteryLog.css';
import loading from './loading.svg';
import React, { Component } from 'react';
import { Table, Button, Glyphicon, MenuItem, FormGroup, InputGroup, DropdownButton, Pagination } from 'react-bootstrap';
import DeleteBatteryModal from '../DeleteBatteryModal/DeleteBatteryModal.js';
import Report from '../Report/Report.js';
import axios from 'axios';

export default class BatteryLog extends Component {

  constructor() {
    super();

    // Declare state attributes
    this.state = {
      batteryData: [],
      capPlotData: [],
      dcPlotData: [],

      isSortedByCapacity: false,

      searchTerm: '',
      searchOnSerial: true,

      pageCounter: 1,
      firstRow: 0,
      lastRow: 9,

      deleteBatteryModalOpen: false,
      reportSectionDisplayed: false,

      selectedBatteryId: '',
      selectedSerialNumber: '',
      selectedLaptopId: 0,
      selectedRatedCapacity: 0,
      selectedMeasuredCapacity: [],
      selectedDischargingVoltage: [],
      selectedDischargingCurrent: [],
      selectedDischargingCapacity: [],
      selectedIsWindows: false,
      selectedDate: null,

      date: Date.now() - 1000
    };

    // Bind all functions for this class
    this.handleEmails = this.handleEmails.bind(this);
    this.willEmail = this.willEmail.bind(this);
    this.getBatteryData = this.getBatteryData.bind(this);
    this.getBatteryDataById = this.getBatteryDataById.bind(this);
    this.getCapPlotData = this.getCapPlotData.bind(this);
    this.getDischargingPlotData = this.getDischargingPlotData.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.toggleBatteryReport = this.toggleBatteryReport.bind(this);
    this.disableBatteryReport = this.disableBatteryReport.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.toggleDeleteBatteryModal = this.toggleDeleteBatteryModal.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
    this.changePlaceholder = this.changePlaceholder.bind(this);
    this.isSearched = this.isSearched.bind(this);
    this.searchBySerial = this.searchBySerial.bind(this);
    this.searchByLaptop = this.searchByLaptop.bind(this);
    this.sortByDate = this.sortByDate.bind(this);
    this.sortByCapacity = this.sortByCapacity.bind(this);
    this.incrementPage = this.incrementPage.bind(this);
    this.decrementPage = this.decrementPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.capacitySort = this.capacitySort.bind(this);
  }

  componentDidMount() {
    // load data for page on mount
    this.getBatteryData();

    // handle scrolling for responsive button
    window.addEventListener('scroll', this.handleScroll);

    /* working alternate for email sending*/
    // setInterval(this.getBatteryData, 1000);
    // setInterval(this.handleEmails, 60000);
  }

  componentDidUpdate() {
    // Batch emails to send every 20 seconds
    if ((Date.now() - this.state.date) > 20000) {
      this.setState({
        date: Date.now() - 1000
      }, this.handleEmails);
    }

    // Update data on page every second
    if ((Date.now() - this.state.date) > 1000) {
      this.getBatteryData();
    }
  }

  // handleEmails Function: check for new or updated batteries for potential email alerts
  handleEmails() {
    let batteries = this.state.batteryData;
    for (let i=0; i<batteries.length; i+=1) {
      if(batteries[i].isUpdated) {
        console.log("found updated battery");
        axios.patch('/api/battery/' + batteries[i]._id);
        this.willEmail(batteries[i]);
      }
    }
  }

  // willEmail Function: send an email if the battery was tested with hardware or if the capacity is less than 40%
  willEmail(battery) {
    if(battery.is_software === false) {
      console.log("found test battery");
      this.sendEmail(battery);
    }
    else if ((battery.mCap[battery.mCap.length - 1] / battery.rCap) < 0.40) {
      console.log("found bad battery");
      this.sendEmail(battery);
    }
  }

  // getBatteryData Function: load battery data from server
  getBatteryData() {
    axios.get('/api/battery')
      .then(({data}) => {
        this.setState({
          batteryData: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // getBatteryDataById Function: load battery data for a particular battery
  getBatteryDataById(batteryId) {
    let dates = [];
    axios.get('/api/battery/' + batteryId)
      .then(({data}) => {
        // convert dates into plotting format
        for(let d=0; d<data.log_date.length; d+=1) {
          dates.push(data.log_date[d].substring(0,10));
        }

        // setState for all selected battery data and get capacity plot data only after state is set
        this.setState({
          selectedSerialNumber: data.serialNum,
          selectedLaptopId: data.laptopId,
          selectedRatedCapacity: data.rCap,
          selectedMeasuredCapacity: data.mCap,
          selectedDischargingVoltage: data.dcVol,
          selectedDischargingCurrent: data.dcCur,
          selectedDischargingCapacity: data.dcCap,
          selectedIsWindows: data.is_windows,
          selectedDate: dates
        }, this.getCapPlotData);
      })
    .catch(err => {
      console.log(err);
    });
  }

  // getCapPlotData Function: store capacity data for plotting
  getCapPlotData() {
    // call function to get discharging plot data
    this.getDischargingPlotData();

    let capData = [];

    // insert all necessary data for capacity plot in state
    for (let i = 0; i < this.state.selectedMeasuredCapacity.length; i++) {
      capData.push(
        {
          test_number: `Test ${i+1}`,
          measured_capacity: this.state.selectedMeasuredCapacity[i],
          rated_capacity: this.state.selectedRatedCapacity,
          dates: this.state.selectedDate
        }
      );
    }
    this.setState({ capPlotData: capData });
  }

  // getDischargingPlotData Function: store data for discharging plot
  getDischargingPlotData() {
    let dcData = [];

    // insert all necessary data for discharging plot in state
    for (let i = 0; i < this.state.selectedDischargingVoltage.length; i++) {
      dcData.push(
        {
          discharging_voltage: this.state.selectedDischargingVoltage[i],
          discharging_current: this.state.selectedDischargingCurrent[i],
          discharging_capacity: this.state.selectedDischargingCapacity[i]
        }
      );
    }
    this.setState({ dcPlotData: dcData });
  }

  // handleScroll Function: only display button to return from battery report if below the battery data table
  handleScroll() {
    if (this.state.reportSectionDisplayed && (document.body.scrollTop > 420 || document.documentElement.scrollTop > 420)) {
      document.getElementById("upBtn").style.display = "block";
    }
    else if (this.state.reportSectionDisplayed) {
      document.getElementById("upBtn").style.display = "none";
    }
  }

  // sendEmail Function: post to email route with battery data for email
  sendEmail(battery) {
    axios.post('/api/email', battery);
  }

  // toggleBatteryReport Function: toggles the battery report section on the page
  toggleBatteryReport(batteryId) {
    // if you click the button for the battery currently displayed, toggle the report display
    if(batteryId === this.state.selectedBatteryId) {
      this.setState({
        reportSectionDisplayed: !this.state.reportSectionDisplayed
      })
    }
    // else get the newly selected battery data and display the report for that battery
    else {
      this.getBatteryDataById(batteryId);
      this.setState({
        reportSectionDisplayed: true,
        selectedBatteryId: batteryId
      });
    }
  }

  // disableBatteryReport Function: toggle battery report display off
  disableBatteryReport() {
    this.setState({
      reportSectionDisplayed: false
    });
  }

  // formatData Function: format Date.now standard to a more readable data and time for the battery table
  formatDate(date) {
    var d = date.toString();
    var day = d.charAt(8) + d.charAt(9);
    var month = d.charAt(5) + d.charAt(6);
    var year = d.charAt(0) + d.charAt(1) + d.charAt(2) + d.charAt(3);
    var hour = d.charAt(11) + d.charAt(12);
    /* potentially convert to EST, but must account for daylight savings*/
    // var hour_temp = parseInt(hour, 10);
    // hour_temp = hour_temp - 5;
    // hour = hour_temp.toString();
    var minute = d.charAt(14) + d.charAt(15);
    var second = d.charAt(17) + d.charAt(18);

    return month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
  }

  // toggleDeleteBatteryModal Function: toggle the modal for deleting a battery
  toggleDeleteBatteryModal(batteryId) {
    this.setState({
      deleteBatteryModalOpen: !this.state.deleteBatteryModalOpen,
      reportSectionDisplayed: false,
      selectedBatteryId: batteryId
    });
  }

  // onSearchTermChange Function: when the search term changes, setState for searchTerm to the inputted value
  onSearchTermChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  // changePlaceholder Function: changes the search bar to display serial number or laptop id placeholder for search bar
  changePlaceholder() {
    if(this.state.searchOnSerial) {
      return "Search by Battery Serial Number"
    }
    else {
      return "Search by Laptop ID"
    }
  }

  // isSearched Function: filter search results for table
  isSearched(battery) {
    const newSearchTerm = this.state.searchTerm.toLowerCase();

    if (this.state.searchOnSerial) {
      return battery.serialNum.toLowerCase().includes(newSearchTerm);
    }
    else {
      if(battery.laptopId) {
        return battery.laptopId.toLowerCase().includes(newSearchTerm);
      }
      else {
        return null;
      }
    }
  }

  // searchBySerial Function: setState to true for searchOnSerial (default)
  searchBySerial() {
    this.setState({
      searchOnSerial: true
    })
  }

  // searchByLaptop Function: setState to false for searchOnSerial
  searchByLaptop() {
    this.setState({
      searchOnSerial: false
    })
  }

  // sortByDate Function: setState boolean to false for sorted by capacity (default)
  sortByDate() {
    this.setState({
      isSortedByCapacity: false
    });
  }

  // sortByDate Function: setState boolean to true for sorted by capacity
  sortByCapacity() {
    this.setState({
      isSortedByCapacity: true
    });
  }

  // incrementPage Function: pagination function for next page
  incrementPage() {
    let currentPage = this.state.pageCounter;
    if (currentPage < (Math.ceil(this.state.batteryData.length / 10))) {
      currentPage += 1;
    }

    this.setState({
      pageCounter: currentPage,
      firstRow: (10*currentPage) - 10,
      lastRow: (10*currentPage) - 1
    })
  }

  // decrementPage Function: pagination function for previous page
  decrementPage() {
    let currentPage = this.state.pageCounter;
    if (currentPage > 1) {
      currentPage -= 1;
    }

    this.setState({
      pageCounter: currentPage,
      firstRow: (10*currentPage) - 10,
      lastRow: (10*currentPage) - 1
    })
  }

  // firstPage Function: pagination function for first page
  firstPage() {
    this.setState({
      pageCounter: 1,
      firstRow: 0,
      lastRow: 9
    })
  }

  // lastPage Function: pagination function for last page
  lastPage() {
    let currentPage = Math.ceil(this.state.batteryData.length / 10);
    let endRow = this.state.batteryData.length;
    endRow -= 1;
    let startRow = 0;

    if (((this.state.batteryData.length % 10) === 0) && (this.state.batteryData.length > 10)) {
      startRow = endRow - 10;
    }
    else if (this.state.batteryData.length > 10){
      startRow = endRow - (this.state.batteryData.length % 10 - 1);
    }

    this.setState({
      pageCounter: currentPage,
      firstRow: startRow,
      lastRow: endRow
    })
  }

  // capacitySort Function: sorting function for capacity from low to high
  capacitySort(battery1, battery2) {
    if((battery1.mCap[battery1.mCap.length - 1] / battery1.rCap) > (battery2.mCap[battery2.mCap.length - 1] / battery2.rCap)) return 1;
    if((battery1.mCap[battery1.mCap.length - 1] / battery1.rCap) < (battery2.mCap[battery2.mCap.length - 1] / battery2.rCap)) return -1;
    return 0;
  }

  render() {

    return (

      <div className="BatteryLog">

        <div className="header">
          <h1>Battery Log</h1>
        </div>

        {/* Sort Option Bar */}
        <div className="tableOptions">
          <div className="sortDropdown">
            <DropdownButton title="Sort" id="sortDropdown">
              <MenuItem eventKey="1" onClick={() => {this.sortByDate()}}>Date</MenuItem>
              <MenuItem eventKey="2" onClick={() => {this.sortByCapacity()}}>Capacity</MenuItem>
            </DropdownButton>
          </div>

          {/* Search Bar */}
          <div className="searchBar">
            <input type="search" className="form-control search-form" placeholder={this.changePlaceholder()} onChange={this.onSearchTermChange}/>

            <FormGroup>
              <InputGroup>
                <DropdownButton
                  id="search-dropdown"
                  title=""
                >
                  <MenuItem key="1" onClick={() => {this.searchBySerial()}}>Serial #</MenuItem>
                  <MenuItem key="2" onClick={() => {this.searchByLaptop()}}>Laptop ID</MenuItem>
                </DropdownButton>
              </InputGroup>
            </FormGroup>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <Pagination>
              <Pagination.First onClick={() => {this.firstPage()}} />
              <Pagination.Prev onClick={() => {this.decrementPage()}} />
              <Pagination.Next onClick={() => {this.incrementPage()}} />
              <Pagination.Last onClick={() => {this.lastPage()}} />
            </Pagination>
          </div>
        </div>


        {/* Battery Data Table */}
        <div className="bootstrapTable">
          {/* Ternary for Loading Data Image */}
          {
            this.state.batteryData.length !== 0
            ?
            <div>
              {
                // If the table is sorted by capacity, display the table with capacitySort; else display with date sort
                this.state.isSortedByCapacity
                ?
                <Table striped bordered condensed hover responsive >
                  <thead>
                    <tr>
                      <th id="_id">Post ID (BatteryId)</th>
                      <th>Battery Serial Number</th>
                      <th>Laptop ID</th>
                      <th>% Capacity</th>
                      <th className="date">Log Date (UTC)</th>
                      <th className="center">Battery Quality</th>
                      <th className="function">Display Data</th>
                      <th className="function">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.batteryData.filter(this.isSearched).sort(this.capacitySort).map((battery,index) => {
                      if (index >= this.state.firstRow && index <= this.state.lastRow) {
                        return (
                          <tr key={battery._id}>
                            <td id="_id">{battery._id}</td>
                            <td>{battery.serialNum}</td>
                            <td>{battery.laptopId}</td>
                            <td>{((battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100).toFixed(2)} %</td>
                            <td className="date">{this.formatDate(battery.log_date[battery.log_date.length - 1])}</td>
                            <td className="center">
                              {(battery.mCap[battery.mCap.length - 1] / battery.rCap) > 0.4 ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}
                            </td>
                            <td className="function">
                              <a href="#dropLocation"><Button bsStyle="default" bsSize="small" onClick={() => {this.toggleBatteryReport(battery._id)}}><Glyphicon glyph="tasks" /></Button></a>
                            </td>
                            <td className="function">
                              <Button bsStyle="default" bsSize="small" onClick={() => {this.toggleDeleteBatteryModal(battery._id)}}><Glyphicon glyph="trash" /></Button>
                            </td>
                          </tr>
                        )
                      }
                      else return null
                    })}
                  </tbody>
                </Table>
                :
                <Table striped bordered condensed hover responsive >
                  <thead>
                    <tr>
                      <th id="_id">Post ID (BatteryId)</th>
                      <th>Battery Serial Number</th>
                      <th>Laptop ID</th>
                      <th>% Capacity</th>
                      <th className="date">Log Date (UTC)</th>
                      <th className="center">Battery Quality</th>
                      <th className="function">Display Data</th>
                      <th className="function">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.batteryData.filter(this.isSearched).map((battery,index) => {
                      if (index >= this.state.firstRow && index <= this.state.lastRow) {
                        return (
                          <tr key={battery._id}>
                            <td id="_id">{battery._id}</td>
                            <td>{battery.serialNum}</td>
                            <td>{battery.laptopId}</td>
                            <td>{((battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100).toFixed(2)} %</td>
                            <td className="date">{this.formatDate(battery.log_date[battery.log_date.length - 1])}</td>
                            <td className="center">
                              {(battery.mCap[battery.mCap.length - 1] / battery.rCap) > 0.4 ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}
                            </td>
                            <td className="function">
                              <a href="#dropLocation"><Button bsStyle="default" bsSize="small" onClick={() => {this.toggleBatteryReport(battery._id)}}><Glyphicon glyph="tasks" /></Button></a>
                            </td>
                            <td className="function">
                              <Button bsStyle="default" bsSize="small" onClick={() => {this.toggleDeleteBatteryModal(battery._id)}}><Glyphicon glyph="trash" /></Button>
                            </td>
                          </tr>
                        )
                      }
                      else return null
                    })}
                  </tbody>
                </Table>
              }
            </div>
            :
            <div className="loading">
              <img src={loading} alt="loading"/>
            </div>
          }
        </div>

        {/* Delete Battery Modal Ternary */}
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

        {/* Display Battery Report Ternary */}
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
            isWindows={this.state.selectedIsWindows}
            capPlotData={this.state.capPlotData}
            dcPlotData={this.state.dcPlotData}
            disableBatteryReport={this.disableBatteryReport}
          />
          : null
        }

      </div>
    );
  }
}
