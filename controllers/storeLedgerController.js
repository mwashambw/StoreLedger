const path = require('path');
const fs = require('fs');

const { generateStoreLedger } = require('../helpers/storeLedger');
const { generateIssueVoucherHelper } = require('../helpers/issueVoucherHelper');
const Project = require('../models/projectModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getStoreLedger = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id)?.populate('items');
  if (!project) {
    return next(new AppError('Project is not found', 404));
  }

  // Generate store ledger
  await generateStoreLedger(project);

  // File (store ledger) path
  const filePath = path.join(
    __dirname,
    '../storeLedgers',
    `${project.projectName.toUpperCase()}.docx`
  );

  // Send file as a response
  if (fs.existsSync(filePath)) {
    res.download(
      filePath,
      `${project.projectName.toUpperCase()}.docx`,
      (err) => {
        if (err) {
          return next(new AppError('Could not download the file.', 500));
        }
      }
    );
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'File not found',
    });
  }
});
exports.getIssueVoucherHelper = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id)?.populate('items');
  if (!project) {
    return next(new AppError('Project is not found', 404));
  }

  // Generate store ledger
  await generateIssueVoucherHelper(project);

  // File (store ledger) path
  const filePath = path.join(
    __dirname,
    '../storeLedgers',
    `VOUCHER-${project.projectName.toUpperCase()}.docx`
  );

  // Send file as a response
  if (fs.existsSync(filePath)) {
    res.download(
      filePath,
      `VOUCHER-${project.projectName.toUpperCase()}.docx`,
      (err) => {
        if (err) {
          return next(new AppError('Could not download the file.', 500));
        }
      }
    );
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'File not found',
    });
  }

  // res.status(200).json({
  //   status: 'success',
  // });
});
