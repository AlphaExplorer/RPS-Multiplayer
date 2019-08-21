// VARIABLE DEFINITIONS----------------------------------------------------------------------

// Get elements to update
const yourImgToUpdate = $('#yourChoiceImg');
const yourTextToUpdate = $('#yourChoiceText');
const myImgToUpdate = $('#myChoiceImg');
const myTextToUpdate = $('#myChoiceText');
const alertResult = $('#alertResult');
const alertModal = $('#resultModal');
const alertSignIn = $('#signInModal');
const alertYourScore = $('#yourScore');
const alertMyScore = $('#myScore');
const recordYourScore = $('#yourScore span');
const recordMyScore = $('#myScore span');
const startOver = $('#startOver');
const letsPlay = $('#letsPlay');
const signIn = $('#sign-in')
const chooseOpponent = $("#chooseOpponent")
const chooseBtns = $('#chooseBtns')
var userName = "";
var Id = "";
var userId = "";
var userChoice = "";
var userMessages = "";
var usersArray = [];

// Store images in object
let images = {
	rock: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/201958/Rock-Paper-Scissors-01.png",
	paper: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/201958/Rock-Paper-Scissors-02.png",
	scissors: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/201958/Rock-Paper-Scissors-03.png",
	question: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/201958/Rock-Paper-Scissors-04-04.png"
};

// Store alert components in object
let alertDiv = {
	loose: '<div class="alert alert-danger" role="alert"><strong>Loser!</strong> HaHaHa you looseee!</div>',
	win: '<div class="alert alert-success" role="alert"><strong>Wahoo you win!</strong> Lets play again!</div>',
	draw: '<div class="alert alert-info" role="alert"><strong>Close!</strong> it was a draw, please reset and try again.</div>'
};

// Track player score
let yourScore = 0;
let myScore = 0;
//********************************************************************************************


// DATABASE SET UP----------------------------------------------------------------------------

// Firebase configuration
var config = {
	apiKey: "AIzaSyB8UEfppJBc5GzYJi53GXt4ew0y4XZkjo0",
	authDomain: "rps-multiplayer-35078.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-35078.firebaseio.com/",
	projectId: "rps-multiplayer-35078",
	storageBucket: "",
	messagingSenderId: "922964639093",
	appId: "1:922964639093:web:37433af3d8a48cfa"
};

// Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();
//********************************************************************************************

// FUNCTION DEVELOPEMENT---------------------------------------------------------------------
//function that writes to the database

function writeUserData(userId) 
{
	firebase.database().ref('users/' + userId).set(
	{
	  userName: userName,
	  Id: Id,
	  userChoice: userChoice,
	});
  }

function opponentListCreator()
{
	database.ref("/users").once("value", function(snapshot) 
	{
		var userdata = snapshot.val()
		console.log(userdata)
		for(var i=0;i<=userdata.lenght;i++)
		{
			console.log(Object.keys(users))
		}
	})
};

// Function to update images
const updateImg = (img, val) => {
	switch(val){
		case "Rock":
			img.attr('src', images.rock);
			break;
		case "Paper":
			img.attr('src', images.paper);
			break;
		case "Scissors":
			img.attr('src', images.scissors);
			break;
		default:
			img.attr('src', images.question);
	}
};

// Reset image to question mark
const resetImg = () => {
	myImgToUpdate.attr("src", images.question);
	myTextToUpdate.text("");
	yourImgToUpdate.attr("src", images.question);
	yourTextToUpdate.text("");
};

// Function to update the alert content
const updateAlert = (alert) => {
	alertResult.append(alert);
	alertModal.modal('toggle');
};

// Function that tiggers sign in form
const signInAlert = (alert) => {
	alertSignIn.modal('toggle');

};

// Function to update the score
const updateScore = (score) => {
	(score === "yourScore") ? yourScore += 1 : myScore += 1;
};

// Combine alert and score functions
const alertScore = (theAlert, theScore) => {
	updateAlert(theAlert);
	updateScore(theScore);
};

// Disable the choose opponent button function until a user has signed in
const disableChoseOpponent = () => {
	(signIn.text() === "Sign in") ? chooseOpponent.attr('disabled', true) : chooseOpponent.attr('disabled', false);
};


// Disable the user choice button function until a user has selected an opponent
const disableUserChoice = () => {
	(chooseOpponent.text() === "Pick an Opponent") ? chooseBtns.attr('disabled', true) : chooseBtns.attr('disabled', false);
};

// Disable the play button function until an option is chosen
const disablePlay = () => {
	(yourTextToUpdate.text() === "") ? letsPlay.attr('disabled', true) : letsPlay.attr('disabled', false);
};

const resetPlayBtn = () => {
	$('#alertResult').children().remove();
	$('#letsPlay').text("Play");
};
//****************************************************************************************

// GAME LOGIC---------------------------------------------------------------------------
$(document).ready( function() {
	opponentListCreator()
	// disableChoseOpponent();
	$('#sign-in').click( function() {
		signInAlert();
	});

	$('#signInSubmit').click(function(){
		userName = $("#playerName").val();
		Id = Date.now().toString();
		userId = userName+"-"+Id;
		writeUserData(userId);
		$("#sign-in").html(userName);
		$("#sign-in").prop("disabled",true);
		disableChoseOpponent();
	});


	// Disable buttons on page load.
	$('#chooseOpponent').attr('disabled', true);
	$('#letsPlay').attr('disabled', true);
	$('#chooseBtns').attr('disabled', true);

	// Reset the choices, images and play
	// button state back to default.
	$('#closeReset').click( function() {
		resetImg();
		resetPlayBtn();
		disablePlay();
		disableChoseOpponent();
	});

	// Capture user choice info and enable
	// play button.
	$('.btn-choice').click( function() {

		userChoice = $(this).text();
		yourTextToUpdate.text(userChoice);
		updateImg(yourImgToUpdate, userChoice);
		disablePlay();
		database.ref("/users/"+userId).update(
			{
				userChoice:userChoice,
			})

	});

	// Capture comp choice info and start
	// to play the game.
	$('#letsPlay').click( function() {

		if ($(this).text() === "Reset") {

			resetImg();
			resetPlayBtn();
			disablePlay();

		} else {

			var userChoice = $('#yourChoiceText').text();
			var computerChoice = Math.random();

			if (computerChoice < 0.34) {
				computerChoice = "Rock";
			} else if (computerChoice <= 0.67) {
				computerChoice = "Paper";
			} else {
				computerChoice = "Scissors";
			};

			myTextToUpdate.text(computerChoice);
			updateImg(myImgToUpdate, computerChoice);

			if (userChoice === computerChoice) 
			{
				updateAlert(alertDiv.draw);
			} 
			else if (userChoice === "Rock") 
			{
				if (computerChoice === "Scissors") 
				{
					alertScore(alertDiv.win, "yourScore");
				} else 
				{
					alertScore(alertDiv.loose, "myScore");
				}
			} 
			else if (userChoice === "Paper") {
				if (computerChoice === "Rock") {
					alertScore(alertDiv.win, "yourScore");
				} else {
					alertScore(alertDiv.loose, "myScore");
				}
			} 
			else if (userChoice === "Scissors") {
				if (computerChoice === "Rock") {
					alertScore(alertDiv.loose, "myScore");
				} else {
					alertScore(alertDiv.win, "yourScore");
				}
			}

			$(this).text("Reset");

			recordMyScore.text(myScore);
			recordYourScore.text(yourScore);

			if (myScore > yourScore) {
				alertMyScore.removeClass('alert-info alert-danger').addClass('alert-success');
				alertYourScore.removeClass('alert-info alert-success').addClass('alert-danger');
			} else if (myScore < yourScore) {
				alertMyScore.removeClass('alert-info alert-success').addClass('alert-danger');
				alertYourScore.removeClass('alert-info alert-danger').addClass('alert-success');
			} else {
				alertMyScore.removeClass('alert-success alert-danger').addClass('alert-info');
				alertYourScore.removeClass('alert-danger alert-success').addClass('alert-info');
			}

		};

	});

	$('#startOver').click( function() {

		resetImg();
		resetPlayBtn();
		
		yourScore = 0;
		myScore = 0;

		recordMyScore.text(myScore);
		recordYourScore.text(yourScore);

		alertMyScore.removeClass('alert-success alert-danger');
		alertYourScore.removeClass('alert-success alert-danger');
		alertMyScore.addClass('alert-info');
		alertYourScore.addClass('alert-info');

	});

});