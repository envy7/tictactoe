var DEBUG = false;

//set value of symbol
var symbol = "X";
var player1 = true;

var min_moves_required = 5;
var moves = 0;
var board = [0,0,0,0,0,0,0,0,0];
var winning_combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkwin(){
	var sum = 0;
	for(var combo in winning_combos){
		for(var element in winning_combos[combo]){
			sum = sum + board[winning_combos[combo][element]];
		}
		if(sum == 3){
			$('.end-game').css("display","block");
			$('.msg > h1').text("X wins");
			return 1;
		}
		else if(sum == -3){
			$('.end-game').css("display","block");
			$('.msg > h1').text("O wins");
			return 1;
		}
		sum = 0;
	}
	return 0;
}

//registering clicks and changing the board
$('.cell').click(function(e){
	moves++
	var $id = $(e.target);
	$id.text(symbol);
	$id.unbind("click");
	//change value of symbol
	if(player1){
		$id.addClass('filledX');
		symbol = "O";
		player1 = !player1;
		board[parseInt(e.target.id)] = 1;
		DEBUG && console.log(board);

	}
	else{
		$id.addClass('filledO');
		symbol = "X";
		player1 = !player1;
		board[parseInt(e.target.id)] = -1;
		DEBUG && console.log(board);
	}

	result = checkwin();
	//condition for draw
	if(moves == 9 && result == 0){
		$('.end-game').css("display","block");
		$('.msg > h1').text("Draw");
	}
})

//hover effects on cells
$('.cell').mouseenter(function(e){
	var $id = $(e.target);
	if(!($id.hasClass("filledX") || $id.hasClass("filledO"))){
		$id.text(symbol);
	}
})

$('.cell').mouseleave(function(e){
	var $id = $(e.target);
	if(!($id.hasClass("filledX") || $id.hasClass("filledO"))){
		$id.text("");	
	}
})

$('.retry').click(function(){
	location.reload();
})


//redirecting to different page
var myParam = location.search.split('myParam=')[1];
console.log(myParam);