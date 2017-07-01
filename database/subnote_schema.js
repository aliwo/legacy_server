var Schema = {};

Schema.createSchema = function(mongoose)
{
	var SubnoteSchema = mongoose.Schema({
		chapter: {type: Number, required: true}
		, title: {type: String, required: true, unique: false, 'default':''}
		, body: {type: String, required: true, 'default':''}
		, student_id: {type: String, required: true}
	    , student_nickname: {type: String}
	    , created_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	    , category: {type: String}
	});
	
	mongoose.model('subnote', SubnoteSchema);
};

module.exports = Schema;