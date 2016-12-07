var DEBUG = false;

function get_params(search_string) {

	function parse(params, pairs) {
		var pair = pairs[0];
		var parts = pair.split('=');
		var key = decodeURIComponent(parts[0]);
		var value = decodeURIComponent(parts.slice(1).join('='));

	    // Handle multiple parameters of the same name
	    if (typeof params[key] === "undefined") {
	      params[key] = value;
	    } else {
	      params[key] = [].concat(params[key], value);
	    }

	    return pairs.length == 1 ? params : parse(params, pairs.slice(1))
	}

  // Get rid of leading ?
  return search_string.length == 0 ? {} : parse({}, search_string.substr(1).split('&'));
}

var params = get_params(location.search);

//set value of symbol
var symbol;
assignSymbol(params.player);

DEBUG && console.log(symbol);

//for firebase get params for url
var db = firebase.database();

var retrieved_board_pos = [];
dbboardref = db.ref('games/'+params.board);
//get realtime data from firebase
dbboardref.on('value', function(snap){
	var items = [];
	snap.forEach(function(itemSnap){
		checkQuitStatus(itemSnap.val());
		console.log(itemSnap.val());
		retrieved_board_pos = itemSnap.val().boardpos;
		moves = itemSnap.val().moves;
		turnof = itemSnap.val().turnof;
		checkturn(turnof, symbol);
		board = retrieved_board_pos;
		var i = 0;
		var newsymbol = '';
		for(i=0;i<9;i++){
			if(retrieved_board_pos[i] == 0){
				newsymbol = '';
			}
			else if(retrieved_board_pos[i] == 1){
				newsymbol = 'X';
				$('#'+i).addClass('filledX');
			}
			else{
				newsymbol = 'O';
				$('#'+i).addClass('filledO');
			}
			$('#'+i).text(newsymbol);
		}
	})
	result = checkwin();
});	

function checkQuitStatus(boardStatus){
	console.log("checking quit status");
	if(boardStatus.endgame == true){
		$('.end-game').show();
		if(!haveQuit){
			$('.msg').hide();
			$('.quitNotif').show();
		}
		
		setTimeout(redirectToHome, 5000);
	}
}



//activate and deactivate boards when other player's turn
function checkturn(turnof, symbol){
	console.log("checked");
	if((turnof == "X" && symbol == "X")||(turnof == "O" && symbol == "O")){
		$('.board').css("pointer-events","all");
		DEBUG && console.log("board active");
	}
	else{
		$('.board').css("pointer-events","none");
		DEBUG && console.log("board inactive");
	}
}

//assign symbol to each player
function assignSymbol(player){
	if(player == 1){
		symbol = "X";
	}
	else{
		symbol = "O";
	}
}

//check if win achieved
function checkwin(){
	var sum = 0;
	for(var combo in winning_combos){
		for(var element in winning_combos[combo]){
			sum = sum + board[winning_combos[combo][element]];
		}
		if(sum == 3){
			$('.end-game').show();
			$('.msg').show();
			$('.msg > h1').text("X wins");
			return 1;
		}
		else if(sum == -3){
			$('.end-game').show();
			$('.msg').show();
			$('.msg > h1').text("O wins");
			return 1;
		}
		sum = 0;
	}
	//draw condition
	if(moves == 9){
		$('.end-game').css("display","block");
		$('.msg > h1').text("Draw");
	}
}

function fillBoard(player, event){
	//update move count
	moves++
	//get target
	var $id = $(event.target);
	//add symbol
	$id.text(symbol);
	//make board unresponsive
	$id.unbind("click");

	if(player == 1){
		$id.addClass('filledX');
		board[parseInt(event.target.id)] = 1;
		DEBUG && console.log(board);

	}
	else{
		$id.addClass('filledO');
		board[parseInt(event.target.id)] = -1;
		DEBUG && console.log(board);
	}
}

function toggleTurn(){
	if(turnof == "X"){
		turnof = "O";
	}
	else{
		turnof = "X";
	}
}

function updateBoardAtFirebase(){
	db.ref('games/'+params.board+'/gameprops').set({
		boardpos : board,
		moves : moves,
		turnof : turnof,
		endgame: false,
		Xscore: 0,
		Oscore: 0
	});
}

function resetBoardAtFirebase(){
	db.ref('games/'+params.board+'/gameprops').set({
		boardpos : [0,0,0,0,0,0,0,0,0],
		moves : 0,
		turnof : turnof,
		endgame: false,
		Xscore: 0,
		Oscore: 0
	});
}

function sendQuitNotif(){
	db.ref('games/'+params.board+'/gameprops').set({
		boardpos : [0,0,0,0,0,0,0,0,0],
		moves : 0,
		turnof : turnof,
		endgame: true,
		Xscore: 0,
		Oscore: 0
	});
}

function deleteBoardAtFirebase(){
	db.ref('games/'+params.board+'/gameprops').remove();
}

function redirectToHome(){
	var redirectLink = "file:///home/envy/work/tictactoe/index.html"
	window.location.href = redirectLink;
}

//define constants
var haveQuit = false;
var min_moves_required = 5;
var moves = 0;
var board = [0,0,0,0,0,0,0,0,0];
var winning_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var turnof = params.turnof;
checkturn(turnof, symbol);



//registering clicks and changing the board
$('.cell').click(function(event){
	fillBoard(params.player, event);
	toggleTurn();
	updateBoardAtFirebase();
	checkwin();
})

//hover effect mouse on cell
$('.cell').mouseenter(function(e){
	var $id = $(e.target);
	if(!($id.hasClass("filledX") || $id.hasClass("filledO"))){
		$id.text(symbol);
	}
})

//remove effect as soon as mouse moves away
$('.cell').mouseleave(function(e){
	var $id = $(e.target);
	if(!($id.hasClass("filledX") || $id.hasClass("filledO"))){
		$id.text("");	
	}
})

$('.retry').click(function(){
	//reset data at firebase
	resetBoardAtFirebase();
	//reload page
	location.reload();
})

$('.quit').click(function(){
	haveQuit = true;
	sendQuitNotif();
	//clear data at firebase
	deleteBoardAtFirebase();
	//redirect to main page
	redirectToHome();
})


//redirecting to different page
// var myParam = location.search.split('board=')[1];
// console.log(myParam);
