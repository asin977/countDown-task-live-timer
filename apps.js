const recordsList = document.getElementById('recordsList');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const startEl = document.getElementById('startTime');
const endEl = document.getElementById('endTime');
const elapsedEl = document.getElementById('elapsedTime');

function startCount(date) {
    const hours = String(date.getHours()).padStart(2,'0');
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const seconds = String(date.getSeconds()).padStart(2,'0');
    return `${hours}:${minutes}:${seconds};
`;
};
 
function formatTime(sec) {
    const hours = Math.floor(sec/3600).padStart(2,'0');
    const minutes = Math.floor((sec % 3600)/60).padStart(2,"0");
    const seconds = Math.floor(sec % 60).padStart(2,'0');
    return `${hours}:${minutes}:${seconds}`;
};

function recordTimerList(data,index) {
    const records = JSON.parse(localStorage.getItem('timerRecords')|| '[]');
    recordsList.innerHTML = '';

    if(records.length == 0) {
        recordsList.innerHTML='<p>No timer records yet.</p>';
        return;
    }
    records.forEach((index,data)=>{
        recordsList.innerHTML = `
            <div class="records">
                <div class="head"><strong>Timer:${index+1};</strong></div>
                <div>Start:${data.start}</div>
                <div>End:${data.end}</div>
                <div>Duration:${data.elapsed}</div>
                <div>Start Date:${data.startDate}</div>
                <div>End Date:${data.endDate}</div>
                <button class="clear"onclick="deleteRecord(${index})">Delete</button>
                <button class="resume" onclick="resumeTimer(${index})">Resume</button>
            </div>
        `;
    });
};

function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem('timerRecords')|| '[]');
    records.splice(index,1);

    localStorage.setItem("timerRecords",JSON.stringify(records));
    recordTimerList();
}

function saveRecord(start,end,startDate,endDate,elapsed,index= null) {
    const records = JSON.parse(localStorage.getItem("timerRecords")|| '[]');

    if(index !== null) {
        records[index].end = end;
        records[index].endDate = endDate;
        records[index].elapsed = elapsed;
    }else {
        const record = {start,end,startDate,endDate,elapsed };
        records.push(record);
    }
    localStorage.setItem('timerRecords',JSON.stringify(records));
    recordTimerList();
}
startBtn.addEventListener('click',()=>{
    startTime = new Date();
    elapsedSeconds = 0;
    resumeTimer = null;

    startEl.textContent = startTimer(startTime);
    endEl.textContent = '--:--:--';
    elapsedEl.textContent = timeFormatting(0);

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resetBtn.disabled = false;

    clearInterval(timerId);
    timerId = setInterval(()=>{
        elapsedSeconds++;
        elapsedEl.textContent = timeFormatting(elapsedSeconds);
    },1000)
});

stopBtn.addEventListener('click',()=>{
    endTime = new Date();
    clearInterval(timerId);
    endEl.textContent = startTimer(endDate);

    stopBtn.disabled = true;
    
})