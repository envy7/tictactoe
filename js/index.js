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
	db.ref('games/'+newPostKey+'/gameprops').set({
		boardpos : [0,0,0,0,0,0,0,0,0],
		moves : 0,
		turnof : turn
	});
	alert("First turn of "+turn);
	window.location.href = "file:///home/envy/work/tictactoe/board.html?board="+newPostKey+"&player=1&turnof="+turn;
})

