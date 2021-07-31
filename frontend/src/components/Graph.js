import { Component, createRef } from 'react';
import './Graph.scss';

const themeWhite = '#FFFBFC';
// const themeGreen = '#31CB00';
// const themeDarkGreen = '#1E441E';

export default class Graph extends Component {
  constructor() {
    super();
    this.cnv = createRef();
    this.updateCanvas = true;
    
    const rawData = { timeStamps: [], values: [] }

    for (let i = 0; i < Math.random() * 1000 + 400; i++) {
      const value = Math.random() * 5 + 2;
      
      rawData.timeStamps.push(i);
      rawData.values.push(value);
    }
    
    const startTime = rawData.timeStamps[0];
    const stopTime = rawData.timeStamps[rawData.timeStamps.length - 1];
    const totalTime = stopTime - startTime;

    const maxValue = Math.max(...rawData.values);
    const minValue = Math.min(...rawData.values);

    this.data = { timeStamps: [], values: [] };

    for (let i = 0; i < rawData.timeStamps.length; i++) {
      this.data.timeStamps[i] = (rawData.timeStamps[i] - startTime) / totalTime;
      this.data.values[i] = (rawData.values[i] - minValue) / maxValue;
    }
  }

  resize() {
    this.width = this.cnv.current.parentElement.clientWidth;
    this.height = this.cnv.current.parentElement.clientHeight;
    this.cnv.current.width = this.width;
    this.cnv.current.height = this.height;
  }

  componentDidMount() {
    this.ctx = this.cnv.current.getContext('2d');

    this.resize();
    window.addEventListener('resize', this.resize.bind(this));

    // Start rendering loop
    this.draw();
  }

  draw() {
    if (!this.updateCanvas) return;
    requestAnimationFrame(this.draw.bind(this));

    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.beginPath();
    ctx.strokeStyle = themeWhite;
    ctx.moveTo(0, 0);

    for (let i = 0; i < this.data.timeStamps.length; i++) {
      const x = this.data.timeStamps[i] * this.width;
      const y = this.data.values[i] * this.height;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  render() {
    return (
      <div className='graph'>
        <canvas ref={this.cnv}></canvas>
      </div>
    );
  }
}