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
let resumeIndex = null;

function startTimer(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function timeFormatting(sec) {
    const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

function recordTimerList() {
    const records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
    recordsList.innerHTML = '';

    if (records.length === 0) {
        recordsList.innerHTML = '<p>No timer records yet.</p>';
        return;
    }

    records.forEach((data, index) => {
        recordsList.innerHTML += `
            <div class="record">
                <div class="head"><strong>📓 TIMER ${index + 1}</strong></div>
                <div>Start: ${data.start}</div>
                <div>End: ${data.end}</div>
                <div>Duration: ${data.elapsed}</div>
                <div>Start Date: ${data.startDate}</div>
                <div>End Date: ${data.endDate}</div>
                <button class="clear" onclick="deleteRecord(${index})">Delete</button>
                <button class="resume" onclick="resumeTimer(${index})">Resume</button>
            </div>
        `;
    });
}

function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem("timerRecords") || '[]');
    records.splice(index, 1);
    localStorage.setItem("timerRecords", JSON.stringify(records));
    recordTimerList();
}

function saveRecord(start, end, startDate, endDate, elapsed, index = null) {
    const records = JSON.parse(localStorage.getItem("timerRecords") || '[]');

    if (index !== null) {
        records[index].end = end;
        records[index].endDate = endDate;
        records[index].elapsed = elapsed;
    } else {
        const record = { start, end, startDate, endDate, elapsed };
        records.push(record);
    }

    localStorage.setItem("timerRecords", JSON.stringify(records));
    recordTimerList();
}

startBtn.addEventListener("click", () => {
    startTime = new Date();
    elapsedSeconds = 0;
    resumeIndex = null;

    startEl.textContent = startTimer(startTime);
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

stopBtn.addEventListener("click", () => {
    endTime = new Date();
    clearInterval(timerId);
    endEl.textContent = startTimer(endTime);

    stopBtn.disabled = true;
    startBtn.disabled = false;

    const formattedElapsed = timeFormatting(elapsedSeconds);
    const formattedStart = startTimer(startTime);
    const formattedEnd = startTimer(endTime);
    const formattedStartDate = new Date(startTime).toLocaleDateString();
    const formattedEndDate = new Date(endTime).toLocaleDateString();

    const records = JSON.parse(localStorage.getItem('timerRecords') || '[]');

    if (resumeIndex !== null) {
        const existingRecord = records[resumeIndex];
        saveRecord(
            existingRecord.start,
            formattedEnd,
            existingRecord.startDate,
            formattedEndDate,
            formattedElapsed,
            resumeIndex
        );
    } else {
        saveRecord(
            formattedStart,
            formattedEnd,
            formattedStartDate,
            formattedEndDate,
            formattedElapsed
        );
    }

    resumeIndex = null;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);

    startEl.textContent = '--:--:--';
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = '00:00:00';

    startBtn.disabled = false;
    stopBtn.disabled = true;
    resetBtn.disabled = true;
    resumeIndex = null;
});

function resumeTimer(index) {
    const records = JSON.parse(localStorage.getItem('timerRecords') || '[]');
    const record = records[index];

    const [endHour, endMinute, endSecond] = record.end.split(':').map(Number);
    const now = new Date();
    startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, endSecond);

    const [h, m, s] = record.elapsed.split(':').map(Number);
    elapsedSeconds = h * 3600 + m * 60 + s;

    resumeIndex = index;

    startEl.textContent = record.start;
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

recordTimerList();
