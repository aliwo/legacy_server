var Schema = {};

Schema.createSchema = function(mongoose)
{
	var BoardSchema = mongoose.Schema({
	    title: {type: String, required: true, unique: false, 'default':''}
	    , body: {type: String, required: true, 'default':''}
	    , student_id: {type: String, required: true}
	    , student_nickname: {type: String}
	    , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , category: {type: String}
	    , num_thumbs_up: {type: Number, 'default': 0}
	    , answer: [{		// 답변 배열
			answer_id: {type: String, unique: true},
            is_choosed: {type: Boolean, 'default': false},
			contents: {type: String, 'default': ''},
			title: {type: String, 'default': '제목 없음'},
            writer: {type: String },
            created_at: {type: Date, 'default': Date.now} }]
			});

	
	mongoose.model('board', BoardSchema);
};


module.exports = Schema;


