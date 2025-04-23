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

function startTimer() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2,"0");
    const minutes = String(now.getMinutes()).padStart(2,"0"); 
    const seconds = String(now.getSeconds()).padStart(2,"0");
    return `${hours}:${minutes}:${seconds}`;
};

function timeFormatting(sec) {
    const hours = String(Math.floor(sec / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const seconds = String(sec % 60).padStart(2, '0');
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
                <div class="head"><strong>TIMER ${index + 1}</strong></div>
                <div>Start: ${data.start}</div>
                <div>End: ${data.end}</div>
                <div>Duration: ${data.elapsed}</div>
                <button class="clear" onclick="deleteRecord(${index})">Delete</button>
            </div>
        `;
    });

};

function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem('timerRecords') || '[]');
    records.splice(index,1);
    localStorage.setItem('timerRecords',JSON.stringify(records));
};

function saveRecord(start,end,elapsed) {
      const record = {start,end,elapsed};
      const records = JSON.parse(localStorage.getItem("timerRecords") || "[]");
      records.push(record);
      localStorage.setItem("timerRecords",JSON.stringify(records));
      recordTimerList();
}

startBtn.addEventListener('click',()=>{
    startTime = new Date();
    elapsedSeconds = 0;

    startEl.textContent = startTimer(startTime);
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = timeFormatting(0);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;

    clearInterval(timerId);
    timerId = setInterval(()=>{
        elapsedSeconds++;
        elapsedEl.textContent = timeFormatting(elapsedSeconds)
    },1000);
});

stopBtn.addEventListener('click',()=>{
    endTime = new Date();

    clearInterval(timerId);
    endEl.textContent = startTimer(endTime);

    startBtn.disabled = false;
    stopBtn.disabled = true;

    saveRecord(
        startTimer(startTime),
        startTimer(endTime),
        timeFormatting(elapsedSeconds)

    );

});

resetBtn.addEventListener('click',()=>{
    clearInterval(timerId);

    startEl.textContent = '--:--:--';
    endEl.textContent='--:--:--';
    elapsedEl.textContent = '00:00:00';

    startBtn.disabled = false;
    stopBtn.disbaled = true;
    stopBtn.disabled = true;
});

document.getElementById('clearAll').addEventListener('click',()=>{
    if(confirm("Are you sure that you to delete all the records?")) {
        localStorage.removeItem('timerRecords');
        recordTimerList();
    }
})
recordTimerList();
