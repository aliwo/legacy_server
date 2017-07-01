/**
 * http://usejsdoc.org/
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var config = require('./config'); // 포트 정보, 라우팅 정보들을 다 config에 담았습니다.
var database = require('./database/database'); // database 연결
var route = require('./routes/route');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
// var question = require('./routes/question');


var app = express();

//서버 변수 설정
app.set('port', config.server_port);

//미들웨어 사용 설정
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:false,
	saveUninitialized:true
}));


//라우팅, 시작할때 database를 req에 추가해서, 다른 라우팅 함수들이 database를 쓸 수 있도록 함.
app.use(function(req, res, next){
	req.database = database;
	next();
});
route.init(app);

//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
	 static: {
	   '404': './public/404.html'
	 }
	});
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//서버 시작
var server = http.createServer(app).listen(app.get('port'), function()
		{
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
	database.init(app, config);


});

module.exports =app;
