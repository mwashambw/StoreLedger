const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  recieveDate: {
    type: Date,
    default: new Date(),
    required: [true, 'Provide the date of recieving the item'],
  },
  receiptVoucherNumber: { type: Number, required: true },
  receivedFrom: {
    type: String,
    required: true,
  },
  receivedQuantity: { type: Number, required: true },
  currentQuantity: { type: Number, required: true },
  unitPrice: {
    type: Number,
  },

  usageRecords: [
    {
      dateTaken: {
        type: Date,
        required: true,
        // default: new Date(),
        // default: () => {
        //   const now = new Date();
        //   now.setDate(now.getDate() - 1);
        //   return now;
        // },
      },
      issueVoucherNumber: {
        type: Number,
        required: true,
      },
      quantityTaken: {
        type: Number,
        required: true,
      },
      balance: {
        type: Number,
        required: true,
      },

      takenBy: {
        type: String,
        required: true,
      },

      description: {
        type: String,
      },
    },
  ],
});

const ItemSchema = mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  itemName: {
    type: String,
    required: [true, 'Item should have a name'],
  },
  unit: { type: String },
  orders: [OrderSchema],
  // extraOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
});

const Item = mongoose.model('Item', ItemSchema);
// Make unique item within same project
ItemSchema.index(
  { itemName: 1, projectId: 1 },
  { unique: [true, 'The item name already exist in this project'] }
);

// itemSchema.pre('save', async function (next) {
//   const item = await this.constructor.findOne({
//     itemName: this.itemName,
//     projectId: this.projectId,
//   });

//   if (item && item._id.toString() !== this._id.toString()) {
//     throw new Error('Item with same name already exists in this project.');
//   }

//   next();
// });

module.exports = Item;
