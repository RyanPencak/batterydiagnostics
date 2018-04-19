import React, { Component } from 'react';
import Header from '../Header/Header.js';
import BatteryLog from '../BatteryLog/BatteryLog.js';

class App extends Component {

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
