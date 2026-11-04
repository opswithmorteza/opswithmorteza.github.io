const assert=require('node:assert/strict');const {winner,bestMove,snakeStep}=require('./games-core.js');
assert.equal(winner(['X','X','X','','','','','','']),'X');assert.equal(winner(['X','O','X','X','O','O','O','X','X']),'draw');
assert.equal(bestMove(['O','O','','X','X','','','','']),2);assert.equal(bestMove(['X','X','','','O','','','','']),2);
assert.equal(snakeStep([{x:0,y:0}],{x:-1,y:0},{x:3,y:3},12).dead,true);
assert.equal(snakeStep([{x:1,y:1},{x:0,y:1}],{x:1,y:0},{x:2,y:1},12).body.length,3);
assert.equal(snakeStep([{x:1,y:1},{x:1,y:2},{x:0,y:2},{x:0,y:1}],{x:-1,y:0},{x:8,y:8},12).dead,false);
console.log('7 game rule checks passed');

let paths=0;function verify(board){const result=winner(board);if(result){assert.notEqual(result,"X");paths++;return}for(let i=0;i<9;i++){if(board[i])continue;const next=board.slice();next[i]="X";if(!winner(next)){const move=bestMove(next);next[move]="O"}verify(next)}}verify(Array(9).fill(""));console.log("Computer never loses across",paths,"complete human move paths");
