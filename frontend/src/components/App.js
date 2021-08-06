import { Component } from 'react';
import Graph from './Graph';
import InfoBox from './InfoBox';
import Settings from './Settings';
import './App.scss';

import { io } from 'socket.io-client';

export default class App extends Component {
  constructor() {
    super();
    this.state = { info: null, settingsOpen: false, maxValues: 400 };
    this.socket = io('http://localhost:3001');
  }

  resetData() {
    this.setState((state) => state.data = []);
  }

  startRecording() {
    this.socket.emit('start');
  }

  stopRecording() {
    this.socket.emit('stop');
  }

  openSettings() {
    console.log(this.state.settingsOpen)

    this.setState((state) => state.settingsOpen = true);
  }

  closeSettings({ maxValues }) {
    console.log(maxValues)
    this.setState((state) => {
      state.settingsOpen = false;
      state.maxValues = maxValues;
    });
  }

  infoChange(info) {
    this.setState((state) => state.info = info);
  }

  render() {
    return (
      <div className='App'>
        <div style={{ filter: this.state.settingsOpen ? 'blur(7px)' : 'none' }}>
          <div className='container'>
            <h1 className='header'>Results</h1>

            <div className='buttons'>
              <button onClick={this.openSettings.bind(this)}>Settings</button>
              <button onClick={this.startRecording.bind(this)}>Start</button>
              <button onClick={this.stopRecording.bind(this)}>Stop</button>
            </div>
          </div>

          <Graph onInfoChange={this.infoChange.bind(this)} socket={this.socket} maxValues={this.state.maxValues} />
          <InfoBox info={this.state.info} />
        </div>
      
        <Settings open={this.state.settingsOpen} closeSettings={this.closeSettings.bind(this)} maxValues={this.state.maxValues} />
      </div>
    );
  }
}
