const Item = require('../models/itemModel');
const Project = require('../models/projectModel');
const { isSameDay } = require('date-fns');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createItem = catchAsync(async (req, res, next) => {
  // 1) Add the id to the parent project
  const { id } = req.params;
  // 2) Save the item to the db

  const order = { ...req.body, currentQuantity: req.body.receivedQuantity };
  const item = await Item.create({
    projectId: id,
    itemName: req.body.itemName,
    unit: req.body.unit,
    orders: [order],
  });

  // 3) Get the id of the item
  const { _id } = item;

  const parentItemProject = await Project.findById(id);

  if (!parentItemProject) {
    return next(new AppError('Project not found', 404));
  }
  parentItemProject.items.push(_id);
  await parentItemProject.save();

  // Respond
  res.status(200).json({
    status: 'success',
    item,
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  let item = await Item.findById(itemId);
  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  const currentOrder = item.orders.at(-1);
  if (req.body.usageRecord) {
    const { currentQuantity } = currentOrder;
    const { quantityTaken } = req.body.usageRecord;

    // const { dateTaken = new Date() } = req.body.usageRecord;
    const {
      dateTaken = (() => {
        const now = new Date();
        now.setDate(now.getDate() - 0);
        return now;
      })(),
    } = req.body.usageRecord;
    if (+currentQuantity < +quantityTaken) {
      return next(new AppError('Not enough stock available', 400));
    }
    if (
      currentOrder.usageRecords.some((rec) =>
        isSameDay(rec.dateTaken, dateTaken)
      )
    ) {
      currentOrder.usageRecords = currentOrder.usageRecords.map((rec) => {
        if (isSameDay(rec.dateTaken, dateTaken)) {
          return {
            ...rec,
            quantityTaken: +rec.quantityTaken + +quantityTaken,
            balance: rec.balance - +quantityTaken,
            dateTaken,
          };
        }
        return rec;
      });
    } else {
      currentOrder.usageRecords.push({
        ...req.body.usageRecord,
        balance: +currentQuantity - +quantityTaken,
        dateTaken,
      });
    }
    currentOrder.currentQuantity = +currentQuantity - +quantityTaken;
  } else {
    const {
      itemName,
      recieveDate,
      receiptVoucherNumber,
      receivedFrom,
      receivedQuantity,
      unit,
      unitPrice,
      isOrder: isNewOrder,
    } = req.body;

    // Create new Order
    if (isNewOrder && currentOrder.currentQuantity === 0) {
      const newOrder = { ...req.body, currentQuantity: receivedQuantity };
      const updatedOne = await Item.updateOne(
        { _id: itemId },
        {
          $push: {
            orders: newOrder,
          },
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          item: updatedOne,
        },
      });
      return;
    }

    const oldReceivedQuantity = currentOrder.receivedQuantity;

    item.itemName = itemName;
    item.unit = unit;
    currentOrder.recieveDate = recieveDate;
    currentOrder.receiptVoucherNumber = receiptVoucherNumber;
    currentOrder.receivedFrom = receivedFrom;
    currentOrder.receivedQuantity = receivedQuantity;
    currentOrder.unitPrice = unitPrice;
    currentOrder.currentQuantity =
      currentOrder.currentQuantity + (receivedQuantity - oldReceivedQuantity);

    if (currentOrder.usageRecords.length > 0) {
      const lastRecord = currentOrder.usageRecords.at(-1);
      const updatedLastRecord = {
        ...lastRecord,
        balance: currentOrder.currentQuantity,
      };

      currentOrder.usageRecords = [
        ...currentOrder.usageRecords.slice(
          0,
          currentOrder.usageRecords.length - 1
        ),
        updatedLastRecord,
      ];
    }
  }

  item.orders = [...item.orders.slice(0, item.orders.length - 1), currentOrder];
  const updatedItem = await item.save();

  res.status(200).json({
    status: 'success',
    data: {
      item: updatedItem,
    },
  });
});

exports.getAllItems = catchAsync(async (req, res, next) => {
  // Get project
  const { id } = req.params;
  const populatedProject = await Project.findById(id)?.populate('items');
  if (!populatedProject) {
    return next(new AppError('Project is not found', 404));
  }

  const { items } = populatedProject;
  res.status(200).json({
    status: 'success',
    data: {
      items,
    },
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId);
  if (!item) {
    return next(new AppError('Item not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      item,
    },
  });
});

exports.deleteItem = catchAsync(async (req, res) => {
  const { itemId } = req.params;

  // Delete item from items collection
  const deletedItem = await Item.findByIdAndDelete(itemId);

  if (!deletedItem) {
    return next(new AppError('Item not found', 404));
  }

  // Remove the id of item in project.
  await Project.updateMany(
    {
      items: itemId,
    },
    { $pull: { items: itemId } }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
