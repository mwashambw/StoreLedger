const { TableRow } = require('docx');
const { formatDate } = require('../utils/formatDate');
const { formatCurrency } = require('../utils/formatCurrency');
const { writeCell } = require('./writeCell');

exports.receiptRow = (item) => {
  const {
    recieveDate,
    receiptVoucherNumber,
    receivedFrom,
    receivedQuantity,
    unitPrice,
  } = item;

  const itemValue = +unitPrice * +receivedQuantity;

  return new TableRow({
    children: [
      // DATE
      writeCell({ textValue: formatDate(recieveDate), isShade: true }),
      // RECEIPT OR ISSUE VOUCHER No.
      writeCell({ textValue: receiptVoucherNumber, isShade: true }),
      // RECEIVED FROM OR ISSUE TO
      writeCell({ textValue: receivedFrom, isShade: true }),
      // RECEIPTS
      writeCell({ textValue: receivedQuantity, isShade: true }),
      writeCell({
        textValue: formatCurrency(unitPrice),
        alignmentType: 'right',
        isShade: true,
      }),
      writeCell({
        textValue: formatCurrency(itemValue),
        alignmentType: 'right',
        isShade: true,
      }),
      // ISSUES
      writeCell({ isShade: true }),
      writeCell({ isShade: true }),
      writeCell({ isShade: true }),
      // BALANCE
      writeCell({ textValue: receivedQuantity, isShade: true }),
      writeCell({
        textValue: formatCurrency(itemValue),
        alignmentType: 'right',
        isShade: true,
      }),
    ],

    height: { value: `${0.8}cm` },
  });
};
