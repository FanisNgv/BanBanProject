const {Schema, model, Types} = require('mongoose');

const developerSchema = new Schema({
    startTime: {type: Date, required:true},
    endTime: {type: Date}
});
const Task = new Schema({
    taskName:{type:String, unique: true, required: true},
    status:{type: String, required: true},
    developers: [{type: Types.ObjectId, ref: 'User'}],
    deadline:{type:Date, required: true},
    description:{type:String}
})

module.exports = model('Task', Task)