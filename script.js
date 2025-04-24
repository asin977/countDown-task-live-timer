const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const startEl = document.getElementById('startTime');
const endEl = document.getElementById('endTime');
const elapsedEl = document.getElementById('elapsedTime');
const recordsList = document.getElementById('recordsList'); 

let startTime;
let endTime;
let timerId;
let elapsedSeconds = 0; 

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function timeFormatting(sec) {
    const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function recordList() {
    const records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
    recordsList.innerHTML = '';

    if (records.length === 0) {
        recordsList.innerHTML = '<p>No timer records yet.</p>';
        return;
    }

    records.forEach((data, index) => {
        recordsList.innerHTML += `
            <div class="record">
                <div class="head"><strong>TIMER ${index + 1}</strong></div>
                <div>Start: ${data.start}</div>
                <div>End: ${data.end}</div>
                <div>Duration: ${data.elapsed}</div>
                <button class="clear" onclick="deleteRecord(${index})">Delete</button>
                <button class="resume" onclick=resumeTimer(${index})>Resume</button>
            </div>
        `;
    });
}

function saveRecord(start, end, elapsed) {
    const record = { start, end, elapsed};
    const records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
    records.push(record);
    localStorage.setItem("timerRecords", JSON.stringify(records));
    recordList();
}

startBtn.addEventListener('click', () => {
    startTime = new Date();
    elapsedSeconds = 0;

    startEl.textContent = formatTime(startTime);
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = timeFormatting(0);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;

    clearInterval(timerId);
    timerId = setInterval(() => {
        elapsedSeconds++;
        elapsedEl.textContent = timeFormatting(elapsedSeconds);
    }, 1000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(timerId);
    stopBtn.disabled = true;
    startBtn.disabled = false; 

    endTime = new Date();
    endEl.textContent = formatTime(endTime);

    saveRecord(
        formatTime(startTime),
        formatTime(endTime),
        timeFormatting(elapsedSeconds)
    );
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);

    startEl.textContent = '--:--:--';
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = '00:00:00';

    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
});

function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
    records.splice(index, 1);
    localStorage.setItem("timerRecords", JSON.stringify(records));
    recordList();
}

function resumeTimer(index) {
    const records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
    const record = records[index];

    
    const [h, m, s] = record.elapsed.split(":").map(Number);
    elapsedSeconds = h * 3600 + m * 60 + s;

    startTime = new Date();
    resumeIndex = index;

    startEl.textContent = formatTime(startTime);
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = timeFormatting(elapsedSeconds);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;

    clearInterval(timerId);
    timerId = setInterval(() => {
        elapsedSeconds++;
        elapsedEl.textContent = timeFormatting(elapsedSeconds);
    }, 1000);
}

document.getElementById('clearAll').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all the records?")) {
        localStorage.removeItem("timerRecords");
        recordList();
    }
});

recordList(); 


