/**
 * 사용자 관련 기능을 담당하는 모듈입니다.
 */

var database;
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var uuidV1 = require('uuid/v1');


var login = function(req, res) // 
{
	console.log('user 모듈 안에 있는 login 작동.');
	database = req.database;
	
	//req객체에서 학번과 암호 가져오기
	var StudentID = req.param('StudentID');
	var Password = req.param('Password');
	
	if(database)
		{
			console.log(StudentID+'가 로그인을 시도했습니다.\n'+'비밀번호: '+Password);
			authUser(database, StudentID, Password, function(err, docs)
			{
				if (err) {throw err;}
				
				if (docs) //로그인 성공 처리, 여기서 세션을 생성하도록 구현하면 됨
				{
					console.dir(docs);
					var username = docs[0].name;

					//세션 생성
					if(req.session.user)
						{
							res.write('이미 로그인 되어 있습니다. (세션)');
						}
					else // 세션이 없다면 만듭니다.
						{
						req.session.user = StudentID; // 견주형 코드에서 그냥 이렇게 되어 있었음...
						}

                    res.write("성공");
                    //res.write(username + '님 환영합니다.');

					res.end();
				} 
				else // 로그인 실패
				{
                    res.write("실패");
					res.end();
				}
			});
		} 
	else // 아예 DB랑 연결도 못하는 경우 
		{
			res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
			res.write('<h2>데이터베이스 연결 실패</h2>');
			res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
			res.end();

		}
};

var logout = function(req, res, next)
{
	console.log('user의 logout 작동');
	
	if (req.session.user) // 로그인된 상태라면
	{
        console.log('세션 삭제 시작');
		req.session.destroy(
				function(err)
				{
					if (err) {console.log('삭제중 에러 발생'); throw err;}
					else {console.log('세션을 삭제하고 로그아웃 하였습니다.');
                        res.send('로그아웃 완료');
                        res.end();}
				});
		//단순히 get 요청을 처리하고 누가 logout 요청을 했는지 정보가 전달되지 않음에도, 
		//서버가 누가 로그아웃했는지 어떻게 알게 되는지 모르겠음.
		//그러나 견주형 예제를 비롯하여 인터넷에서도 대부분이 단순하게 req.session.destroy만 호출
		//하기 때문에 나도 똑같이 구현했다. 나중에 문제가 생기면 고치자 *?
	}
	else
	{
		console.log('logout이 작동했지만 삭제할 세션이 없습니다.');
		res.send('삭제할 세션이 없습니다.');
		res.end();
	}
};

var authUser = function(database, StudentID, Password, callback) 
{
	console.log('user.js 안의 authUser 호출됨.');
	var users = database.db.collection('users');
	
	// 2017-01-10 클라이언트에서 hashed_password를 바로 전송하도록 짰다. 추후에 계정이 db에 다 들어오면 그냥 Password로 바꿀 것.
	users.find({"student_id" : StudentID, "hashed_password" : Password}).toArray(
			function(err, docs){
				if(err) { callback(err, null); return;}
				if(docs.length > 0) 
				{
					console.log('학번 [%s], 비밀번호[%s]가 일치하는 사용자 찾음.', StudentID, Password);
					addPoint(database, StudentID);
					callback(null, docs);
				}
				else 
					{
					console.log("일치하는 사용자를 찾지 못했습니다.");
					callback(null, null);
					}
			});
};

var addPoint = function (database, StudentID)
{
    console.log('user.js 안의 addPoint 호출됨.');
    var users = database.db.collection('users');

    users.update({'student_id':StudentID}
    ,{$inc: {'point': 10}} // 로그인 할 때 마다 정상적으로 10씩 포인트 상승
    , function (err)
		{
			if(err) {console.log('포인트를 올리는 도중 서버 오류');}
			console.log('포인트 10점 상승');
        });
};

var registerUser = function(req, res)
{
    console.log('user.js 안의 registerUser 호출됨.');
    database = req.database;
    var users = database.db.collection('users');
    //req객체에서 학번과 암호 가져오기
    var StudentID = req.param('StudentID');
    var Password = req.param('Password');
    var NickName = req.param('NickName');
    var Major = req.param('Major');

    users.insert({
        "_id" : uuidV1()
        , "student_id": StudentID
        , "hashed_password": Password
        , "name": NickName
        , "major": Major
        , "created_at": Date.now()
    });

    res.send('회원가입 완료');
    console.log('회원가입:'+StudentID);
    res.end();

};

var requestAccountInfo = function (req, res)
{
    console.log('user 모듈 안에 있는 requestAccountInfo 작동.');
    database = req.database;
    var users = database.db.collection('users');

    var StudentID = req.param('StudentID');

    if(database)
    {
        users.find({"student_id" : StudentID}).toArray(function (err, Student)
        {
            if (err) console.log('requestAccountInfo에서 에러 발생');
            res.send(Student);
        }); // 문서 안의 특정 정보만 보내도록 옵션을 넣는다.)
    }
    else
	{
        res.send('데이터베이스 연결 실패');
	}

};


module.exports.login = login;
module.exports.logout = logout;
module.exports.registerUser = registerUser;
module.exports.requestAccountInfo = requestAccountInfo;
