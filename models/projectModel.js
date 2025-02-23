const { mongoose } = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Please provide the name of the project'],
      unique: [true, 'The project name already exists.'],
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    status: {
      type: String,
      enum: ['awaiting', 'building', 'completed'],
      default: 'building',
    },
    year: {
      type: String,
      required: true,
      default: new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
