/**
 * http://usejsdoc.org/
 */

var database = require('../database/database');



var test = function(req, res)
{
	console.log('Connection Affirmative at: '+Date.now());
	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	res.write('서버와 연결 확인되었습니다.');
	if (database)
	{  
		res.write('데이터베이스 확인되었습니다.');
	}
	else 
		{
		console.log('Could not find database');
		 res.write('데이터베이스를 찾지 못했습니다.');
		}
	res.end();
};

module.exports.test = test;