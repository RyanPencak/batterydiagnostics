import './BatteryLog.css';
import React, { Component } from 'react';
import { Table, Button, Glyphicon, MenuItem, FormGroup, InputGroup, DropdownButton, Pagination } from 'react-bootstrap';
import DeleteBatteryModal from '../DeleteBatteryModal/DeleteBatteryModal.js';
import Report from '../Report/Report.js';
import axios from 'axios';

export default class BatteryLog extends Component {

  constructor() {
    super();

    this.state = {
      batteryData: [],
      capPlotData: [],
      dcPlotData: [],
      isUpdated: false,

      dataLength: 0,

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
      selectedIsWindows: false
    };

    this.getInitialBatteryData = this.getInitialBatteryData.bind(this);
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
  }

  componentDidMount() {
    this.getInitialBatteryData();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {
    if(this.state.dataLength !== 0) {
      this.getBatteryData();
      if(this.state.batteryData.length > this.state.dataLength) {
        this.setState({
          dataLength: this.state.batteryData.length
        }, this.sendEmail(this.state.batteryData[0]));
      }
      else if (this.state.isUpdated === true) {
        axios.patch('/api/battery/' + this.state.batteryData[0]._id)
          .then(() => {
            this.setState({
              isUpdated: false
            }, this.sendEmail(this.state.batteryData[0]));
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  getInitialBatteryData() {
    axios.get('/api/battery')
    .then(({data}) => {
      this.setState({
        batteryData: data,
        dataLength: data.length
      });
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    });
  }

  getBatteryData() {
    if(! this.state.isUpdated) {
      axios.get('/api/battery')
      .then(({data}) => {
        this.setState({
          batteryData: data,
          isUpdated: data[0].isUpdated
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
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
          selectedDischargingCapacity: data.dcCap,
          selectedIsWindows: data.is_windows
        },
        this.getCapPlotData
        );
      })
    .catch(err => {
      console.log(err);
    });
  }

  getCapPlotData() {
    this.getDischargingPlotData();
    let capData = [];

    for (let i = 0; i < this.state.selectedMeasuredCapacity.length; i++) {
      capData.push(
        {
          test_number: `Test ${i+1}`,
          measured_capacity: this.state.selectedMeasuredCapacity[i],
          rated_capacity: this.state.selectedRatedCapacity
        }
      );
    }
    this.setState({ capPlotData: capData });
  }

  getDischargingPlotData() {
    let dcData = [];

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

  handleScroll() {
    if (this.state.reportSectionDisplayed && (document.body.scrollTop > 650 || document.documentElement.scrollTop > 650)) {
      document.getElementById("upBtn").style.display = "block";
    } else if (this.state.reportSectionDisplayed) {
      document.getElementById("upBtn").style.display = "none";
    }
  }

  sendEmail(battery) {
    axios.post('/api/email', battery);
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

  disableBatteryReport() {
    this.setState({
      reportSectionDisplayed: false
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
      reportSectionDisplayed: false,
      selectedBatteryId: batteryId
    });
  }

  onSearchTermChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  changePlaceholder() {
    if(this.state.searchOnSerial) {
      return "Search by Battery Serial Number"
    }
    else {
      return "Search by Laptop ID"
    }
  }

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

  searchBySerial() {
    this.setState({
      searchOnSerial: true
    })
  }

  searchByLaptop() {
    this.setState({
      searchOnSerial: false
    })
  }

  sortByDate() {
    this.setState({
      isSortedByCapacity: false
    });
  }

  sortByCapacity() {
    this.setState({
      isSortedByCapacity: true
    });
  }

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

  firstPage() {
    this.setState({
      pageCounter: 1,
      firstRow: 0,
      lastRow: 9
    })
  }

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

  render() {

    return (
      <div className="BatteryLog">

        <div className="header">
          <h1>Battery Log</h1>
        </div>

        <div className="tableOptions">
          <div className="sortDropdown">
            <DropdownButton title="Sort" id="sortDropdown">
              <MenuItem eventKey="1" onClick={() => {this.sortByDate()}}>Date</MenuItem>
              <MenuItem eventKey="2" onClick={() => {this.sortByCapacity()}}>Capacity</MenuItem>
            </DropdownButton>
          </div>

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
        </div>
        <div className="pagination">
          <Pagination>
            <Pagination.First onClick={() => {this.firstPage()}} />
            <Pagination.Prev onClick={() => {this.decrementPage()}} />
            <Pagination.Next onClick={() => {this.incrementPage()}} />
            <Pagination.Last onClick={() => {this.lastPage()}} />
          </Pagination>
        </div>

        <div className="bootstrapTable">
          {
            this.state.isSortedByCapacity
            ?
            <Table striped bordered condensed hover responsive >
              <thead>
                <tr>
                  <th id="_id">Post ID (BatteryId)</th>
                  <th>Battery Serial Number</th>
                  <th>Laptop ID</th>
                  <th>% Capacity</th>
                  <th className="date">Log Date</th>
                  <th className="center">Battery Quality</th>
                  <th className="function">Display Data</th>
                  <th className="function">Delete</th>
                </tr>
              </thead>
              <tbody>
                {this.state.batteryData.filter(this.isSearched).sort((a, b) => (a.mCap[a.mCap.length - 1] / a.rCap) > (b.mCap[b.mCap.length - 1] / b.rCap)).map((battery,index) => {
                  if (index >= this.state.firstRow && index <= this.state.lastRow) {
                    return (
                      <tr key={battery._id}>
                        <td id="_id">{battery._id}</td>
                        <td>{battery.serialNum}</td>
                        <td>{battery.laptopId}</td>
                        <td>{((battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100).toFixed(2)} %</td>
                        <td className="date">{this.formatDate(battery.log_date)}</td>
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
                  <th className="date">Log Date</th>
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
                        {/* <td><FormGroup><Radio name={`${battery._id}`}></Radio></FormGroup></td> */}
                        <td>{battery.serialNum}</td>
                        <td>{battery.laptopId}</td>
                        <td>{((battery.mCap[battery.mCap.length - 1] / battery.rCap) * 100).toFixed(2)} %</td>
                        <td className="date">{this.formatDate(battery.log_date)}</td>
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
            // batteryId={this.state.selectedBatteryId}
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
