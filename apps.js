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


