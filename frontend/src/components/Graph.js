import { Component, createRef } from 'react';
import './Graph.scss';

const themeWhite = '#FFFFFF';
const themeGrey = '#444444';
const themeGreen = '#31CB00';

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.cnv = createRef();
    this.updateCanvas = true;
    this.lineSpacing = 70;
    this.rawData = { timeStamps: [], values: [] };
    this.data = { timeStamps: [], values: [] };
  }

  prepData() {
    if (this.rawData.timeStamps.length > this.props.maxValues) {
      this.rawData.timeStamps.shift();
      this.rawData.values.shift();
    }

    // Figuring out some key metrics
    const startTime = this.rawData.timeStamps[0];
    const stopTime = this.rawData.timeStamps[this.rawData.timeStamps.length - 1];
    const totalTime = stopTime - startTime;

    this.maxValue = Math.max(...this.rawData.values);
    this.minValue = Math.min(...this.rawData.values);
    const valueSpread = this.maxValue - this.minValue;

    this.average = this.rawData.values
      .reduce((accumulator, value) => accumulator + value) / this.rawData.values.length;

    // Resetting the data object
    this.data = { timeStamps: [], values: [] };

    // Filling the data object with adjusted data
    for (let i = 0; i < this.rawData.timeStamps.length; i++) {
      this.data.timeStamps[i] = (this.rawData.timeStamps[i] - startTime) / totalTime;
      this.data.values[i] = (this.rawData.values[i] - this.minValue) / valueSpread;
    }

    const round = this.round;

    this.props.onInfoChange({
      maxValue: round(this.maxValue, 4),
      minValue: round(this.minValue, 4),
      average: round(this.average, 4)
    });
  }

  round(number, digits) {
    const factor = Math.pow(10, digits);
    return Math.round(number * factor) / factor;
  }

  mouseMove(e) {
    const x = e.offsetX;
    const y = e.offsetY;

    const timeStampIndex = ((x / this.width) * this.data.timeStamps.length) | 0;
    const valueIndex = ((y / this.height) * this.data.values.length) | 0;

    const timeStamp = this.rawData.timeStamps[timeStampIndex];
    const value = this.rawData.values[valueIndex];

    const ctx = this.ctx;

    this.draw();

    ctx.beginPath();
    ctx.fillStyle = themeGreen;
    ctx.arc(x, this.data.values[timeStampIndex] * this.height, 5, 0, 8);
    ctx.fill();

    const round = this.round;

    const info = {
      maxValue: round(this.maxValue, 4),
      minValue: round(this.minValue, 4),
      average: round(this.average, 4),
      timeStamp,
      value: round(value, 4)
    };

    this.props.onInfoChange(info);
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
    this.cnv.current.addEventListener('mousemove', this.mouseMove.bind(this));

    this.props.socket.on('data', (dataPoint) => {
      this.rawData.timeStamps.push(dataPoint.timeStamp);
      this.rawData.values.push(dataPoint.value);

      this.prepData();
      this.draw();
    });

    this.draw();
  }

  draw() {
    if (!this.updateCanvas) return;

    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.beginPath();
    ctx.strokeStyle = themeGrey;
    ctx.lineWidth = 1;

    for (let i = this.lineSpacing; i < this.width; i += this.lineSpacing) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);
    }

    for (let i = this.lineSpacing; i < this.height; i += this.lineSpacing) {
      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
    }

    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = themeWhite;
    ctx.lineWidth = 1;
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
      <canvas className='graph' ref={this.cnv}></canvas>
    );
  }
}