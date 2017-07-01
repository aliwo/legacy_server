/**
 * http://usejsdoc.org/
 */
var database;
var uuidV1 = require('uuid/v1');


var newAnswer = function(req, res)
{
    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); }
	database = req.database;
    var board = database.db.collection('board');
	console.log('answer 모듈 안의 newAnswer 작동. 새 답변이 올라왔습니다.');

	//답변 내용, 작성자를 긁어 와서 답변 객체를 만듭니다.
	var AnswerTitle = req.param('AnswerTitle');
	var AnswerBody = req.param('AnswerBody');
	var AnswerAuthor = req.param('AnswerAuthor');
	var NewAnswer = {answer_id: uuidV1(), contents: AnswerBody, writer: AnswerAuthor, title: AnswerTitle, created_at: Date.now()};

	//어떤 질문인지 찾아 냅니다.
    var QuestionID = req.param('QuestionID');
    console.log('전달 받은 QuestionID는'+QuestionID);

    //질문을 찾아서 답변을 달아줍니다.
    board.update({_id:QuestionID}
    , {$push: {answer: NewAnswer}}
    , function(err, answer)
		{
			if (err) {res.send('답변을 추가하는 도중 서버 오류'); console.log('답변이 추가되지 못했습니다.')}
			res.send('답변을 추가했습니다.');
		});
};

var chooseAnswer = function (req, res)
{
    if(req.session.user) {} else {res.send('session이 닫혔습니다.'); res.end(); }

    database = req.database;
    var board = database.db.collection('board');
    console.log('answer 모듈 안의 chooseAnswer 작동. 답변을 채택합니다.');

    //어떤 질문인지 찾아 냅니다.
    var QuestionID = req.param('QuestionID');
    console.log('전달 받은 QuestionID는'+QuestionID);

    //어떤 답변을 채택했는지 정보를 받습니다.
	var AnswerID = req.param('AnswerID');

    board.update({_id:QuestionID, 'answer.$.AnswerID': AnswerID}
        , {$set: {'answer.$.is_choosed': true}}
        , function(err, answer)
        {
            if (err) {res.send('채택하는 도중 서버 오류'); console.log('채택되지 못했습니다.')}
            res.send('채택하였습니다.');
        });
};

module.exports.newAnswer = newAnswer;
module.exports.chooseAnswer = chooseAnswer;
