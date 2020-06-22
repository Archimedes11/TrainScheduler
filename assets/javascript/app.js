$(document).ready(function(){

    //Initialize Firebase
  
        var firebaseConfig = {
            apiKey: "AIzaSyD8Sn_Pf09Hbu2N-G5Bz6LahmMht51fLFo",
            authDomain: "train-scheduler-3f0f6.firebaseapp.com",
            databaseURL: "https://train-scheduler-3f0f6.firebaseio.com",
            projectId: "train-scheduler-3f0f6",
            storageBucket: "train-scheduler-3f0f6.appspot.com",
            messagingSenderId: "773453488796",
            appId: "1:773453488796:web:0dda6439bde6d401214359",
            measurementId: "G-H1V2DK38HG"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        //firebase.analytics();
    var database = firebase.database();
        //Initializing the variables .....................
        var trainName = "";
        var trainDestination = "";
        var trainFrequency = 0;
        var trainTime = "";
        var clickCounter = 1;
        //Capturing the add train button click.................
        $("#add-train").on("click", function(event){
            event.preventDefault();
            if ($("#train-input").val(),$("#destination-input").val(),$("#time-input").val(), $("#frequency-input").val() === "") {
                alert("All input fields are mandatory. Enter data in all fields and click the submit button.");
            } else if ($("#time-input").val() > 24) {
                //An alert is displayed when the user enters a time more than 24.........................
                alert("Pls enter the 24 hr time format and time cannot be greater than 24.");
            } else {
                //Declaring the variables that will hold the user input values..............................
                trainName = $("#train-input").val().trim();
                trainDestination = $("#destination-input").val().trim();
                trainTime = $("#time-input").val().trim();
                trainFrequency = $("#frequency-input").val().trim(); 
                //Console log to see if the variables are holding the user input values........................
                console.log("Input Values");
                console.log(trainName);
                console.log(trainDestination);
                console.log(trainTime);
                console.log(trainFrequency);
                //Creating a local temporary object for holding train details..................
                var trainDetail = {
                    name : trainName,
                    destination : trainDestination,
                    frequency : trainFrequency,
                    time : trainTime
                };
                //Upload the train data to the database.........................
                database.ref().push(trainDetail);
                //Console log.....................
                console.log("Temporary object train values");
                console.log(trainDetail.name);
                console.log(trainDetail.destination);
                console.log(trainDetail.frequency);
                console.log(trainDetail.time);      
                //Alerts............................
                alert("A new train details has been added..");        
                //Clearing all the values from the input area when the submit button is clicked.
                $("#train-input").val("");
                $("#destination-input").val("");
                $("#time-input").val("");
                $("#frequency-input").val("");
            }
        });
        //Creating a firebase event for adding train to the database and a row to the html.................
        database.ref().on("child_added", function(childSnapshot, prevChildKey){
            console.log("Hello2");
            console.log(childSnapshot.val());
            //added remove button
           // var updateButton = $("<button>").html("<span class='glyphicon glyphicon-edit'></span>").addClass("updateButton").attr("data-index", index).attr("data-key", childSnapshot.key);
           // var removeButton = $("<button>").html("<span class='glyphicon glyphicon-remove'></span>").addClass("removeButton").attr("data-index", index).attr("data-key", childSnapshot.key);
            //adding function for option to remove row
             /* */
            //Store to a variable.......
            var trainNumber = clickCounter++;
            var trainName = childSnapshot.val().name;
            var trainDestination = childSnapshot.val().destination;
            var trainTime = childSnapshot.val().time;
            var trainFrequency = childSnapshot.val().frequency;
            //console log.................
            console.log("database train value");
            console.log(trainName);
            console.log(trainDestination);
            console.log(trainTime);
            console.log(trainFrequency);
            //Use moment.js to convert the first train arrival time to ........
            var trainTimeConvert = moment(trainTime, "HH:mm").subtract(1, "years");
            console.log("trainTimeConvert", + trainTimeConvert);
            //Use moment.js to show current time.............
            var currentTime = moment();
            //Use moment.js to show the difference in time between the first train arrival and the current time...............
            var diffTime  = moment().diff(trainTimeConvert, "minutes");
            console.log(diffTime);
            var remainder = diffTime % trainFrequency;
            console.log("Remainder: " + remainder);
            //Use moment.js to calculate the time remaining for the train to arrive.........
            var timeRemain = trainFrequency - remainder;
            console.log("Time Remain: " + timeRemain);
            //Use moment.js to calculate the next train arrival time...............
            var newTrainTime = moment().add(timeRemain, "minutes");
            var newTrainTimeFormat = moment(newTrainTime).format("HH:mm");
            //Declaring a variable that will hold the dynamically created rows and table data elements with its values.......
            var row = $(("<tr class = 'tableRow'><td>" + trainNumber + "</td><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainTime + "</td><td>" + trainFrequency  + "</td><td>" + newTrainTimeFormat  + "</td><td>" + timeRemain + "</td></td>" + removeRow + "</td></tr>" ));
            $("<td>").html("<button>").on("click", function() {
                $(this).row.remove();
            })
            //Appending the row to the table body...........................
            $(".tableBody").append(row);
        });  
        function removeRow () {
            $(".row-" + $(this).attr("data-index")).empty();
            database.ref().child($(this).attr("data-key")).empty();
          };
          function editRow () {
            $(".row-" + $(this).attr("data-index")).children().eq(1).html("<textarea class='newName'></textarea>");
            $(".row-" + $(this).attr("data-index")).children().eq(2).html("<textarea class='newDestination'></textarea>");
            $(".row-" + $(this).attr("data-index")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
            $(this).toggleClass("updateButton").toggleClass("submitButton");
          };
          $(document).on("click", "Button", editRow);
          $(document).on("click", "Button", removeRow); 
    });