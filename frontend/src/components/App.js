import { Component } from 'react';
import Graph from './Graph';
import InfoBox from './InfoBox';
import './App.scss';

import { io } from 'socket.io-client';

export default class App extends Component {
  constructor() {
    super();
    this.state = { info: null };
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

  infoChange(info) {
    this.setState({ info });
  }

  render() {
    return (
      <div className='App'>
        <div className='container'>
          <h1 className='header'>Results</h1>

          <div className='buttons'>
            <button onClick={this.startRecording.bind(this)}>Start</button>
            <button onClick={this.stopRecording.bind(this)}>Stop</button>
          </div>
        </div>

        <Graph onInfoChange={this.infoChange.bind(this)} socket={this.socket} />
        <InfoBox info={this.state.info} />
      </div>
    );
  }
}
