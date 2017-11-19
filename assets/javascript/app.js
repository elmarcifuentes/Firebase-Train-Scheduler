var config = {
    apiKey: "AIzaSyAFoMsL5g-1kMJSQ3pcr27W1N_UGFUJTh4",
    authDomain: "fir-train-scheduler-4bee2.firebaseapp.com",
    databaseURL: "https://fir-train-scheduler-4bee2.firebaseio.com",
    projectId: "fir-train-scheduler-4bee2",
    storageBucket: "fir-train-scheduler-4bee2.appspot.com",
    messagingSenderId: "893791044440"
};
firebase.initializeApp(config);

var database = firebase.database();

//********** Adding train onClick **********\\
$("#add-train").on("click", function(event) {
    event.preventDefault();

    //********** Obtain User input **********\\
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var trainTime = $("#train-time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    //********** Temporary Object to hold train data **********\\
    var newTrain = {
        name: trainName,
        dest: destination,
        time: trainTime,
        freq: frequency,
    };
    //********** push input to firebase **********\\
    database.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.freq);

    alert("Train successfully added");

    //********** clear input **********\\
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#train-time-input").val("");
    $("#frequency-input").val("");

});


//********** Firebase Snapshot **********\\
database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());

    var trainName = snapshot.val().name;
    var destination = snapshot.val().dest;
    var trainTime = snapshot.val().time;
    var frequency = snapshot.val().freq;


    //********** convert time using Moment.js **********\\
    var trainTimeConversion = moment(trainTime, 'HH:mm').subtract(1, 'years');

    //---------- moment().diff | difference Between Times ----------\\
    var timeDifference = moment().diff(moment(trainTimeConversion), 'minutes');

    // divide time diference by train frequency
    var timeRemainder = timeDifference % frequency;

    // frequency minus time remaining
    var minutesAway = frequency - timeRemainder;

    // next arrival
    var nextArrival = moment().add(minutesAway, 'minutes');
    console.log(moment(nextArrival).format('HH:mm A'));


    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextArrival).format('HH:mm A') + "</td><td>" + minutesAway + "</td></tr>");

});