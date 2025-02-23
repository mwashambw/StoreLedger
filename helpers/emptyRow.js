const { TableRow } = require('docx');
const { writeCell } = require('./writeCell');

exports.emptyRow = () => {
  return new TableRow({
    children: [
      // DATE
      writeCell({}),
      // RECEIPT OR ISSUE VOUCHER No.
      writeCell({}),
      // RECEIVED FROM OR ISSUE TO
      writeCell({}),
      // RECEIPTS
      writeCell({}),
      writeCell({}),
      writeCell({}),
      // ISSUES
      writeCell({}),
      writeCell({}),
      writeCell({}),
      // BALANCE
      writeCell({}),
      writeCell({}),
    ],
    height: { value: `${0.8}cm` },
  });
};
