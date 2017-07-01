/**
 * http://usejsdoc.org/
 */

var database;
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var uuidV1 = require('uuid/v1'); // v1은 시간에 기반한 unique id를 생성한다.
var FCM = require('fcm-push');

//FCM 사용설정
var serverKey = 'AAAAK4lE3xg:APA91bHpXtumOlwhADqnIZh_eBTWMQAhHKSO_Etqws5jHp78L7fa3FzBhvVMmnuNwypuQxQWYu2RTEoXrHlrnw4_2-ho6-jfaiaLAZZPdrOdzBm1EcSryuRKn-3LbfiH87WkPexNeYNW';
var fcm = new FCM(serverKey);

var newQuestion = function (req, res, next)
{
	database = req.database;
	
	// if() 세션이 있는지 확인하는 if문, 만약 없으면 응답을 종료한다.
	if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); }
	
	console.log('question 모듈 안의 newQuestion 작동. 새 질문이 올라왔습니다.');
	var Title = req.param('QuestionTitle');
	var Body = req.param('QuestionBody');
	var StudentID = req.param('UserStudentID');
	var StudentNickName = req.param('UserNickName');
	var Category = req.param('Category');
	var IsEmergency = req.param('IsEmergency');
	var PushCategory = req.param('PushCategory');
	
	if(database)
	{
		var board = database.db.collection('board');
		board.insert({
			"_id" : uuidV1(),
			"title" : Title, "body" : Body, "student_id":StudentID,
			"student_nickname":StudentNickName, "category":Category,
			"created_at": Date.now(), "updated_at": Date.now()
		});
		
		res.send('질문이 등록되었습니다.');
		console.log('질문 등록자:'+StudentID);
		res.end();
	}

	if(IsEmergency)
	{
		sendPushMessage(Title, Body, Category, PushCategory, function(err, result){
			if(err) {console.log('푸쉬 메시지 요청에서 에러 발생');}
			if(result) {console.log('푸쉬 메시지 보냄');}
		})
	}
	
};

var myQuestion = function(req, res, next)
{
	database = req.database;
	var board = database.db.collection('board');
	console.log('question 모듈 안의 myQuestion 작동');
    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); console.log('session 닫힘'); res.end(); }
	var questionList; // 질문 목록을 담을 변수
	
	//StudentID로 해당 학번이 했던 질문을 조회
	board.find({student_id:req.param("StudentID")}).limit(3).toArray(function(err,docs){
		if (err) {throw err;}
		res.send(docs);
	});
};

var waitingQuestion = function (req, res)
{
    database = req.database;
    var board = database.db.collection('board');
    console.log('question 모듈 안의 waitingQuestion 작동');
    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); } // 세션 확인

	// user의 랜덤 관심 수업을 하나 받아서 해당 카테고리로 검색한 후 정보를 전송합니다,
    var Interest = req.param('Interest');
    console.log("관심 수업 "+Interest);

    board.find({category:req.param("Interest")}).limit(4).toArray(function(err,docs){
        if (err) {throw err;}
        res.send(docs);
    });
};

var FindQuestion = function (req, res)
{
    database = req.database;
    var board = database.db.collection('board');
    console.log('question 모듈 안의 findQuestion 작동');
    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); } // 세션 확인

	var QuestionID = req.param('QuestionID');
	console.log('전달 받은 ID는'+QuestionID);

    board.find({_id:QuestionID}).toArray(function(err,docs)
	{
        if (err) {console.log('에러 발생'); throw err;}

        if(docs)
		{
            res.send(docs);
		}
        else
        	{
        		res.send('찾지 못했습니다.');
			}
    });

};

var sendPushMessage = function (Title, Body, Category, PushCategory, callback)
{
    console.log("question 파일 안의 sendPushMessage 동작");
	var Topic = '/topics/'+PushCategory;
    console.log("주제는"+Topic);

    //보낼 메시지를 만듭니다.
    var message = {
        //to에는 기기의 token 값을 넣습니다.
        //여러명에게 보낼때에는 기기 ID 대신 topic을 to: 에 넣으면 됨.
        to: //'/topics/news',
        //'e_dV-nNqlrk:APA91bHafkb10pzqo9qxDArqGlXrOa7_0-Xi347ta4tYmTBkXxfXoYlQmEyS3ViwjrFPLhY3X7EAidKC8esIF_luHkFZLgCd4CnFyohvtAAMIvQQZ8HzlIYYr2nlceaZ2H8U56D_5XkQ',
		Topic,
		//collapse_key: 'your_collapse_key',
        //data: {your_custom_data_key: 'your_custom_data_value'},
        notification:
            {
                title:'긴급히 답변 부탁드립니다: '+Title.toString(),
                body: Body.toString()
            }
    };

    //메시지 전송
    fcm.send(message, function(err, response)
    {
        if (err)
        {
            console.log("Something has gone wrong!");
            callback(err, null);
        }
        else
        {
            console.log("Successfully sent with response: ", response);
            callback(null, true);
        }
    });

};


module.exports.newQuestion = newQuestion;
module.exports.myQuestion = myQuestion;
module.exports.waitingQuestion = waitingQuestion;
module.exports.FindQuestion = FindQuestion;