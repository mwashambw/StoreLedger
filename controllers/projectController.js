// const { projects } = require('../sampleData');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({});
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: { projects },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id)?.populate('items');

  if (!project) {
    return next(new AppError('Project is not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  // 1) Create project
  const newProject = await Project.create(req.body);
  const projectId = newProject._id;

  // 2) Get user based on id
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User is not found', 404));
  }
  user.projects.push(projectId);
  await user.save({ validateBeforeSave: false });

  // Add the project id to the user who created the project

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProject) {
    return next(new AppError('Project is not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { project: updatedProject },
  });
});

exports.deleteProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Delete project
  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    return next(new AppError('Project is not found', 404));
  }

  // Remove the id of the project from the User
  const user = User.findById(userId);
  if (!user) {
    return next(new AppError('User is not found', 404));
  }

  await User.updateMany(
    {
      projects: id,
    },
    { $pull: { projects: id } }
    // { validateBeforeSave: false }
  );

  // const { itemId } = req.params;

  // // Delete item from items collection
  // const deletedItem = await Item.findByIdAndDelete(itemId);

  // if (!deletedItem) {
  //   return next(new AppError('Item not found', 404));
  // }

  // // Remove the id of item in project.
  // await Project.updateMany(
  //   {
  //     items: itemId,
  //   },
  //   { $pull: { items: itemId } }
  // );
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
