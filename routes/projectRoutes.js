const express = require('express');

const projectController = require('../controllers/projectController');
const itemController = require('../controllers/itemController');
const storeLedgerController = require('../controllers/storeLedgerController');
const authController = require('../controllers/authController');

const router = express.Router();

// PROTECT ALL ROUTES
router.use(authController.protect);

// Project
router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.createProject);
router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);
router
  .route('/:id/items')
  .get(itemController.getAllItems)
  .post(itemController.createItem);

// Items
router
  .route('/items/:itemId')
  .get(itemController.getItem)
  .patch(itemController.updateItem)
  .delete(itemController.deleteItem);

// Storeledger
router.route('/:id/storeledgers').get(storeLedgerController.getStoreLedger);
// IssueVoucher
router
  .route('/:id/issueVoucher')
  .get(storeLedgerController.getIssueVoucherHelper);
// router
//   .route('/:id/storeledgers/download')
//   .get(storeLedgerController.downloadStoreLedger);

module.exports = router;
