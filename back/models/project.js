const {Schema, model, Types} = require('mongoose')

const Project = new Schema({
    teamLeadID:{type: Types.ObjectId, required: true},
    projectName:{type: String, required: true},
    description: {type: String },
    members: [{ type: Types.ObjectId, ref: 'User' }],
    tasks: [{ type: Types.ObjectId, ref: 'Task' }]
})

module.exports = model('Project', Project)