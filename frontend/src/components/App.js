import { Component } from 'react';
import Graph from './Graph';
import InfoBox from './InfoBox';
import './App.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = { info: null };
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
            <button>Start</button>
            <button>Stop</button>
          </div>
        </div>

        <Graph onInfoChange={this.infoChange.bind(this)} />
        <InfoBox info={this.state.info} />
      </div>
    );
  }
}
