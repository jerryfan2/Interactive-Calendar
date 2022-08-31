const date = new Date();

const renderCalendar = () => {
    date.setDate(1);

    const monthDays = document.querySelector(".days");
    
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    const firstDayIndex = date.getDay();
    
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    
    const nextDays = 7 - lastDayIndex - 1;
    
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    
    document.querySelector('.date h1').innerHTML = months[date.getMonth()];
    
    document.querySelector('.date p').innerHTML = new Date().toDateString();
    
    let days = "";
    
    for(let x = firstDayIndex; x > 0; x--){
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`
    }
    
    for(let i = 1; i <= lastDay; i++){
        if(i === new Date().getDate() && date.getMonth() === new Date().getMonth()){
            checkDayEvents(i, true);
        }else{
            checkDayEvents(i);}
    }
    
    for(let j = 1; j <= nextDays; j++){
        days += `<div class="next-date">${j}</div>`
    }
    
    monthDays.innerHTML = days;

    
    function checkDayEvents(day, today=false){
        for (var ev in {...localStorage}) {
            if ({...localStorage}[ev].substring(0, 8) === `${date.toISOString().split('T')[0].substring(0, 8)}` &&
            parseInt({...localStorage}[ev].substring(8, 10)) === day){
                if (today) {
                    days += `<div class="today" onclick="togglePopup('.day-popup-container', ${day})">${day}</div>`;
                }else{
                    days += `<div id="${String(day).padStart(2, '0')}" onclick="togglePopup('.day-popup-container', ${day})">${day}</div>`;
                }
                return;
            }
        }
        if (today){
            days += `<div class="today">${day}</div>`;
        }else{
            days += `<div id="${String(day).padStart(2, '0')}">${day}</div>`;
        }
    }
}



document.querySelector(".prev").addEventListener("click", () => {date.setMonth(date.getMonth() - 1);
    renderCalendar();})

document.querySelector(".next").addEventListener("click", () => {date.setMonth(date.getMonth() + 1);
    renderCalendar();})
renderCalendar();

function togglePopup(pop, day){
    if (day){
        let popups = "";
        for (var ev in {...localStorage}) {
            const event_lst = {...localStorage}[ev].split("~");
            if (parseInt(event_lst[0].substring(8, 10)) === day){
                if (!popups){
                    popups += `<div class="day-popup">
                        <div>${ev}</div>
                        <div>${event_lst[0].substring(8, 10)}/${event_lst[0].substring(5, 7)}/${event_lst[0].substring(0, 4)} 
                        ⋅ ${event_lst[0].substring(11, 16)} - ${event_lst[1].substring(11, 16)}</div>
                        <div>${event_lst[2]}</div>
                        <div>${event_lst[3]}</div>
                        <i class="fas fa-times exit" onclick="togglePopup('.day-popup-container')"></i>
                        <i class="fas fa-trash-alt" onclick="localStorage.removeItem('${ev}');togglePopup('.day-popup-container')"></i>
                    </div>`;
                }else{
                    popups += `<div class="day-popup">
                    <div>${ev}</div>
                    <div>${event_lst[0].substring(8, 10)}/${event_lst[0].substring(5, 7)}/${event_lst[0].substring(0, 4)} 
                    ⋅ ${event_lst[0].substring(11, 16)} - ${event_lst[1].substring(11, 16)}</div>
                    <div>${event_lst[2]}</div>
                    <div>${event_lst[3]}</div>
                    <i class="fas fa-trash-alt" onclick="localStorage.removeItem('${ev}');togglePopup('.day-popup-container')"></i>
                </div>`;
                }
            }
        }
        document.querySelector(".day-popup-container").innerHTML = popups;
    }
    const popup = document.querySelector(pop);
    popup.classList.toggle("popup-show");
}

function createEv(){
    const ename = document.getElementById("ename").value;
    const stime = document.getElementById("stime").value;
    const etime = document.getElementById("etime").value;
    const location = document.getElementById("location").value;
    const desc = document.getElementById("desc").value;
    if (!ename || !stime || !etime || !location || !desc){
        // do nothing
    }else{
        localStorage.setItem(ename, `${stime}~${etime}~${location}~${desc}`);
        if (parseInt(stime.substring(8, 10)) === new Date().getDate() && parseInt(stime.substring(5, 7)) === new Date().getMonth() + 1) {
            document.querySelector(".today").addEventListener("click", togglePopup('.day-popup-container', stime.substring(8, 10)));
        }else{
            document.getElementById(stime.substring(8, 10)).addEventListener("click", togglePopup('.day-popup-container', stime.substring(8, 10)));
        }
        renderCalendar();
        document.getElementById("createForm").reset();
        togglePopup('.create-popup');
        togglePopup('.day-popup-container');
    }
}

