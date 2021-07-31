import { Component } from 'react';
import Graph from './Graph';
import './App.scss';

export default class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='App'>
        <h1>Results</h1>
        <Graph></Graph>
        <button>Start</button>
        <button>Stop</button>
      </div>
    );
  }
}
