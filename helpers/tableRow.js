const { issueRow } = require('./issueRow');
const { receiptRow } = require('./receiptRow');
const { emptyRow } = require('./emptyRow');
const { tableRowHeader } = require('./tableRowHeader');
const { ROWS_PER_PAGE } = require('../constants');

exports.tableRows = (item) => {
  // It handles receipt and issue for the same item
  const itemsOrder = item.orders.flatMap((order) => {
    return [receiptRow(order), ...issueRow(order)];
  });

  return [
    ...tableRowHeader(),
    ...itemsOrder,
    // Fill the remained space with empty rows
    ...Array.from({ length: ROWS_PER_PAGE - itemsOrder.length }, () =>
      emptyRow()
    ),
  ];
};
