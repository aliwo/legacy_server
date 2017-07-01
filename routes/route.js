/**
 * http://usejsdoc.org/
 */

var router = {};
var config = require('../config');

router.init = function(app)
{
	console.log('router 초기화');
	var numRouters = config.router.length;
	console.log('라우팅 모듈은 총 %d 개 입니다.', numRouters);
	
	for (var i = 0; i < numRouters; i++) 
	{
		var curItem = config.router[i];
		
		//모듈을 불러 옵니다.
		var curModule = require(curItem.file);
		console.log('%s 모듈 파일을 읽어왔습니다.', curItem.file);
		
		//  라우팅 처리. get요청이면 get(패스 이름, 쓰일 메소드 이름); 으로 app객체에 함수를 추가해준다.
		//curItem.init();
		if (curItem.type == 'get') {
			app.get(curItem.path, curModule[curItem.method]);} 
		else if (curItem.type == 'post') {
			app.post(curItem.path, curModule[curItem.method]);} 
		else {
			app.post(curItem.path, curModule[curItem.method]);}
		
		console.log('라우팅 메소드 [%s]를 설정했습니다.', curItem.method);
		
	}
};

module.exports = router;