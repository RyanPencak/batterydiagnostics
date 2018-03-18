import React, { Component } from 'react';
import Header from '../Header/Header.js';
import BatteryLog from '../BatteryLog/BatteryLog.js';
// import Report from '../Report/Report.js';
// import axios from 'axios';

class App extends Component {

  componentDidMount() {

    document.title = "Battery Diagnostics"

    // axios.get('/api/battery')
    // .then(({data}) => {console.log(data)})
    // .catch(err => {console.log(err)});
  }

  render() {
    return (
      <div className="App">
        <Header />
        <BatteryLog />
      </div>
    );
  }
}

export default App;
