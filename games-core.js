/* Original game rules by Morteza Rajabi. MIT. */
(function(root){
const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function winner(board){for(const [a,b,c] of lines)if(board[a]&&board[a]===board[b]&&board[a]===board[c])return board[a];return board.every(Boolean)?'draw':null}
function bestMove(board){function score(turn,depth){const win=winner(board);if(win)return win==='O'?10-depth:win==='X'?depth-10:0;let best=turn==='O'?-Infinity:Infinity;for(let i=0;i<9;i++){if(board[i])continue;board[i]=turn;const value=score(turn==='O'?'X':'O',depth+1);board[i]='';best=turn==='O'?Math.max(best,value):Math.min(best,value)}return best}let move=-1,best=-Infinity;for(let i=0;i<9;i++){if(board[i])continue;board[i]='O';const value=score('X',0);board[i]='';if(value>best){best=value;move=i}}return move}
function snakeStep(body,direction,food,size){const head={x:body[0].x+direction.x,y:body[0].y+direction.y};const grows=head.x===food.x&&head.y===food.y;const occupied=grows?body:body.slice(0,-1);if(head.x<0||head.y<0||head.x>=size||head.y>=size||occupied.some(p=>p.x===head.x&&p.y===head.y))return {body,dead:true,ate:false};return {body:[head,...(grows?body:body.slice(0,-1))],dead:false,ate:grows}}
const api={winner,bestMove,snakeStep};if(typeof module!=='undefined')module.exports=api;else root.PortfolioGames=api;
})(typeof window!=='undefined'?window:this);
