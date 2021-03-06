$(document).ready(function () {
    // Defining object for hours in the schedule
    var hoursObj = {
        8: "8AM",
        9: "9AM",
        10: "10AM",
        11: "11AM",
        12: "12PM",
        13: "1PM",
        14: "2PM",
        15: "3PM",
        16: "4PM",
        17: "5PM",
        18: "6PM",
        19: "7PM",
        20: "8PM",
        21: "9PM",
        22: "10PM",
        23: "11PM",
        24: "12AM",
    }

    // Grabbing current time with moment.js
    var now = moment();

    // Grabbing any calender event data in local storage
    var eventsObj = {};
    if( localStorage.getItem("eventsString") ){
        eventsObj = JSON.parse(localStorage.getItem("eventsString"));
    }

    // Display today's date in header
    $("#currentDay").html(now.format("dddd, D MMMM"))

    // Creating timeblock divs for each hour in hoursObj
    $.each(hoursObj, function(key, value) {
        var newRow = $(`<div class="row" id="`+key+`">`);
        newRow.append($(`<div class="col col-2 col-md-1 hour">`+value+`</div>`));
        var newForm = $(`<div class="col col-8 col-md-10">`);
        newForm.append($(`<form class="eventForm"><textarea class="eventArea">`));

        // For each form, add styling based on whether it is the present/a past/a future hour
        if( key == now.hours() ){
            $(newForm).addClass("present");
        } else if( key < now.hours() ) {
            $(newForm).addClass("past");
        } else if( key > now.hours() ) {
            $(newForm).addClass("future");
        }

        // Adding any existing event data for this timeblock from local storage
        var thisHour = now.format("YYYY-MM-DD") + "-" + key;
        if( eventsObj[thisHour]) {
            $(newForm).find(".eventArea").html(eventsObj[thisHour]);
        }

        newRow.append(newForm);

        // Create Save buttons
        var saveBtn = $(`<div class="col col-2 col-md-1 saveBtn"></div>`);
        saveBtn.append($('<i class="far fa-save"></i>'));
        newRow.append(saveBtn);

        // Display the timeblock
        $(".container").append($(newRow));
    })

    // When save buttons are clicked, the value of the forms are saved to local storage
    var handleSaveBtn = function(e) {
        if( $(e.target).hasClass("saveBtn")) {
            var newEvent = $(e.currentTarget).find(".eventArea").val();
            var newEventDate = now.format("YYYY-MM-DD") + "-" + e.currentTarget.getAttribute("id");
            eventsObj[newEventDate] = newEvent;
            localStorage.setItem("eventsString", JSON.stringify(eventsObj));
        }
    }

    // Listen for click event on save buttons
    $(".row").on("click", handleSaveBtn);

    // Create button for clearing the day's schedule
    $("body").append($("<div id='clearBtnDiv'><button type='button' class='btn btn-secondary' id='clearBtn'>Clear this day's events</button></div>"))

    // When clear button is clicked, erase local storage events for the day
    $("#clearBtn").on("click", function(){
        // Clear events from DOM
        $(".eventArea").empty();

        // Clear events from local storage
        for( i=1; i<25; i++){
            var thisHour = now.format("YYYY-MM-DD") + "-" + i;
            if( eventsObj[thisHour] || eventsObj[thisHour]==="") {
                delete eventsObj[thisHour];
            }
        }
        localStorage.setItem("eventsString", JSON.stringify(eventsObj));
    });
});