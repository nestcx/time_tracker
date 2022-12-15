// global vars
var displayTimeInMs;
var tickInterval;



// doc elements
var startButtonElem;
var stopButtonElem;
var resetButtonElem;
var timerDisplayElem;
var foxElem;



function init_elems() {
    startButtonElem = document.querySelector(".start_btn");
    stopButtonElem = document.querySelector(".stop_btn");
    resetButtonElem = document.querySelector(".reset_btn");
    timerDisplayElem = document.querySelector(".timer_display");
    foxElem = document.querySelector(".fox");
}


function init_app() {
    if (localStorage.getItem("total_time") == null) {
        localStorage.setItem("total_time", 0);
    }

    if (is_active() == true){
        disable_button(startButtonElem);
    } else {
        disable_button(stopButtonElem);
    }
}


window.onload = function () {
    init_elems();
    init_app();
    load_current_state();

    startButtonElem.addEventListener("click", startButtonClicked);
    stopButtonElem.addEventListener("click", stopButtonClicked);
    resetButtonElem.addEventListener("click", resetButtonClicked);
}


function load_current_state() {
    realign_timer_display();
    if (is_active() == true) {
        tick();
    }
}


function realign_timer_display() {

    // 1)  get the accurate live total time

    displayTimeInMs = parseInt(localStorage.getItem("total_time"));

    if (is_active() == true) {
        displayTimeInMs += get_current_elapsed_time();
    }


    // 2)  update clock display

    refresh_timer_display();
}


// use the display_time_in_ms global var to set the time in the timer display

function refresh_timer_display() {

    // take display_time_in_ms and convert to HH:MM:SS string.

    let seconds = Math.floor(displayTimeInMs / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    seconds = seconds.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    hours = hours.toString().padStart(2, '0');

    let time = `${hours}:${minutes}:${seconds}`;

    // inject value into timer display

    timerDisplayElem.innerText = time;
}


// visually increment the timer by 1 second every second.

function tick() {
    // increment display_time_ms every second
    tickInterval = setInterval(() => {
        displayTimeInMs += 1000;
        refresh_timer_display();
        console.log(displayTimeInMs);
    }, 1000);
}



// button event functions

function startButtonClicked() {
    if (is_active() == true) { return }

    localStorage.setItem("last_start_timestamp", Date.now());
    realign_timer_display();
    tick();
    disable_button(startButtonElem);

    foxElem.classList.add("show_fox");
    foxElem.classList.remove("hide_fox");
}

function stopButtonClicked() {
    if (is_active() == false) { return }

    // stop ticking
    clearInterval(tickInterval);

    // set the updated total_time in ls
    old_tt = parseInt(localStorage.getItem("total_time"));
    new_tt = old_tt + get_current_elapsed_time();
    localStorage.setItem("total_time", new_tt);

    // remove last_start_timestamp from ls
    localStorage.removeItem("last_start_timestamp");

    refresh_timer_display();

    disable_button(stopButtonElem);

    foxElem.classList.add("hide_fox");
    foxElem.classList.remove("show_fox");
}

function resetButtonClicked() {
    localStorage.setItem("total_time", 0);
    localStorage.removeItem("last_start_timestamp");
    realign_timer_display();
    clearInterval(tickInterval);
    disable_button(stopButtonElem);
}


// helper functions

function disable_button(btn) {
    startButtonElem.classList.remove("disabled");
    stopButtonElem.classList.remove("disabled");

    btn.classList.add("disabled");
}

function is_active() {
    if (localStorage.getItem("last_start_timestamp") == null) {
        return false;
    } else {
        return true;
    }
}

function get_current_elapsed_time() {
    if (is_active() == true) {
        return (Date.now() - localStorage.getItem("last_start_timestamp"));
    } else {
        return 0;
    }
}

