/**
 * http://usejsdoc.org/
 */

module.exports = {
		server_port: 3000,
		db_url: 'mongodb://localhost:27017/board',
		db_schemas:[ 
			{file: './board_schema', collection:'board', schemaName:'BoardSchema', modelName:'BoardModel'} 
			, {file:'./user_schema', collection:'users', schemaName:'UserSchema', modelName:'UserModel'}
			, {file:'./subnote_schema', collection:'subnote', schemaName:'SubnoteSchema', modelName:'SubnoteModel'}
			],
		router: [
			{file: './test', path:'/test', method:'test', type:'get'}
			, {file:'./user', path:'/login', method:'login', type:'post'}
			, {file:'./user', path:'/logout', method:'logout', type:'get'}
            , {file:'./user', path:'/register', method:'registerUser', type:'post'}
            , {file:'./user', path:'/request_account_info', method:'requestAccountInfo', type:'post'}
			, {file:'./question', path:'/new_question', method:'newQuestion', type:'post'}
			, {file:'./question', path:'/my_question', method:'myQuestion', type:'post'}
			, {file:'./question', path:'/find_a_question', method:'FindQuestion', type:'post'} // 질문 하나를 id로 검색
            , {file:'./question', path:'/waiting_question', method:'waitingQuestion', type:'post'} //랜덤한 질문을 응답하는 메소드
			, {file:'./eclass', path:'/e_class_question', method:'eclassQuestion', type: 'post'} // 특정 카테고리의 질문들을 응답하는 메소드
			, {file:'./eclass', path:'/e_class_subnote', method:'eclassSubnote', type: 'post'}
            , {file:'./answer', path:'/new_answer', method:'newAnswer', type: 'post'}
            , {file:'./answer', path:'/choose_answer', method:'chooseAnswer', type: 'post'}
		]
};