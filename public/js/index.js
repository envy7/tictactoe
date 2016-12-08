var db = firebase.database();

$('.multiplayer').click(function(){
	//console.log("Noel");
	var newPostKey = db.ref().child('games').push().key;
	//console.log(newPostKey);
	var random = Math.floor((Math.random() * 10) + 1);
	var turn;
	if(random > 5){
		turn = "X"
	}
	else{
		turn = "O"
	}

	var shareLink = "https://tictactoe-c48e5.firebaseapp.com/board.html?board="+newPostKey+"&player=-1&turnof="+turn
	//alert("First turn of "+turn);
	$('.end-game').css("display","block");
	$('.shareurl').val(shareLink);

	$('#start').click(function(){
		db.ref('games/'+newPostKey+'/gameprops').set({
			boardpos : [0,0,0,0,0,0,0,0,0],
			moves : 0,
			turnof : turn,
			endgame: false,
			Xscore: 0,
			Oscore: 0
		});
		var redirectLink = "https://tictactoe-c48e5.firebaseapp.com/board.html?board="+newPostKey+"&player=1&turnof="+turn
		window.location.href = redirectLink;
	})
})

