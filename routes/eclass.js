/**
 * http://usejsdoc.org/
 */

//EClassActivity에서 서버에 접근할때 이 라우팅 파일로 들어오게 됩니다.

var database;
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
 
var eclassQuestion = function (req, res, next)
{
	database = req.database;
	console.log('eclass 모듈 안의 eclassQuestion 작동.');
	var board = database.db.collection('board');

	//세션이 있는지 확인하는 if문, 만약 없으면 return한다.
    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); }
	
	var questionList; // 질문 목록을 담을 변수
	board.find({category:req.param('Class')}).toArray(function(err,docs){ //카테고리를 검색
		if (err) {throw err;}
		res.send(docs);
	});
};


var eclassSubnote = function(req, res, next)
{
	database = req.database;
	console.log('eclass 모듈 안의 eclassSubnote 작동.');

    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); }


};

module.exports.eclassQuestion = eclassQuestion;
module.exports.eclassSubnote = eclassSubnote;
