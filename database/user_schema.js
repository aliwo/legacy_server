var crypto = require('crypto');

var Schema = {};

Schema.createSchema = function(mongoose)
{
	var UserSchema = mongoose.Schema({
	    student_id: {type: String, required: true, unique: true, 'default':''}
	    , hashed_password: {type: String, required: true, 'default':''}
	    , name: {type: String, index: 'hashed', 'default':''}
	    , salt: {type:String}
	    , major: {type: String}
		, point: {type:Number}
	    , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
			});
	
	//password 값을 가상으로 정의합니다. 이제부터 password가 들어오면 이 메소드에서 hashed_password로 바꿔서 저장합니다.
	UserSchema
	  .virtual('password')
	  .set(function(password) {
	    this._password = password;
	    this.salt = this.makeSalt();
	    this.hashed_password = this.encryptPassword(password);
	    console.log('virtual password 호출됨 : ' + this.hashed_password);
	  })
	  .get(function() { return this._password });
	
	// 비밀번호 암호화 메소드
	UserSchema.method('encryptPassword', function(plainText, inSalt) {
		if (inSalt) {
			return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
		} else {
			return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
		}
	});
	
	// salt 값 만들기 메소드
	UserSchema.method('makeSalt', function() 
		{
		return Math.round((new Date().valueOf() * Math.random())) + '';
	});
	
	// 인증 메소드 - 입력된 비밀번호와 비교 (true/false 리턴)
	UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
		if (inSalt) {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
			return this.encryptPassword(plainText, inSalt) === hashed_password;
		} else {
			console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
			return this.encryptPassword(plainText) === this.hashed_password;
		}
	});
	

	UserSchema.method('checkValidation', function() {
	    return (this.provider == '');
	});
	
	// 값이 유효한지 확인하는 함수 정의
	var validatePresenceOf = function(value) {
		return value && value.length;
	};
		
	// 저장 시의 트리거 함수 정의 (password 필드가 유효하지 않으면 에러 발생)
	UserSchema.pre('save', function(next) 
		{
		if (!this.isNew) return next();
	
		if (!validatePresenceOf(this.password) && this.checkValidation()) {
			next(new Error('유효하지 않은 password 필드입니다.'));
		} else {
			next();
		}
	});
	
	// 스키마에 static 메소드 추가
	UserSchema.static('findById', function(id, callback) {
		return this.find({id:id}, callback);
	});
	
	UserSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	// 입력된 칼럼의 값이 있는지 확인
	UserSchema.path('student_id').validate(function (student_id) 
			{
		if (!this.checkValidation()) return true;
		return student_id.length;
	}, 'email 칼럼의 값이 없습니다.');
	
	UserSchema.path('hashed_password').validate(function (hashed_password) 
			{
		if (!this.checkValidation()) return true;
		return hashed_password.length;
	}, 'hashed_password 칼럼의 값이 없습니다.');
	
	mongoose.model('users', UserSchema);
	
	return UserSchema;
	
};

module.exports = Schema;
