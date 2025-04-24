const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const stopEl = document.getElementById('startTime');
const endEl = document.getElementById('endTime');
const elapsedEl = document.getElementById('elapsedTime');
const resetBtn = document.getElementById('reset');
const recordsList = document.getElementById('recordsList');

let startTime;
let endTime;
let elapsedSeconds = 0;
let timerId;
let resumeIndex = null;

