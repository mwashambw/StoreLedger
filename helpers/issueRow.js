const { TableRow } = require('docx');
const { formatDate } = require('../utils/formatDate');
const { formatCurrency } = require('../utils/formatCurrency');
const { writeCell } = require('./writeCell');

exports.issueRow = (item) => {
  const { usageRecords, receivedQuantity, unitPrice } = item;
  // Sorting by date
  const usageRecordsDateSorted = [...usageRecords].sort(
    (a, b) => new Date(a.dateTaken) - new Date(b.dateTaken)
  );

  // Sorting by balance
  const usageRecordsBalanceSorted = [...usageRecords].sort(
    (a, b) => b.balance - a.balance
  );

  // console.log(usageRecordsBalanceSorted);

  // Creating new usage records with corrected dates variations
  const sortedUsageRecords = usageRecordsDateSorted.map((record, i) => {
    // Strips out mongoose internal fields
    const cleanObj = record.toObject();
    return {
      ...cleanObj,
      balance: usageRecordsBalanceSorted[i].balance,
      quantityTaken: usageRecordsBalanceSorted[i].quantityTaken,
    };
  });
  // console.log(sortedUsageRecords);
  // Write usage records in the word
  return sortedUsageRecords.map((record) => {
    const {
      dateTaken,
      issueVoucherNumber = '',
      quantityTaken,
      takenBy,
      balance,
    } = record;
    // const balance = receivedQuantity - quantityTaken;

    return new TableRow({
      children: [
        // DATE
        writeCell({ textValue: formatDate(dateTaken) }),
        // RECEIPT OR ISSUE VOUCHER No.
        writeCell({ textValue: issueVoucherNumber }),
        // RECEIVED FROM OR ISSUE TO
        writeCell({ textValue: takenBy }),
        // RECEIPTS
        writeCell({}),
        writeCell({}),
        writeCell({}),
        // ISSUES
        writeCell({ textValue: quantityTaken }),
        writeCell({
          textValue: formatCurrency(unitPrice),
          alignmentType: 'right',
        }),
        writeCell({
          textValue: formatCurrency(unitPrice * quantityTaken),
          alignmentType: 'right',
        }),
        // BALANCE
        writeCell({ textValue: balance === 0 ? '-' : balance }),
        writeCell({
          textValue: balance === 0 ? '-' : formatCurrency(unitPrice * balance),
          alignmentType: balance === 0 ? 'center' : 'right',
        }),
      ],
      height: { value: `${0.8}cm` },
    });
  });

  // const itemValue = +unitPrice * +receivedQuantity;

  // return new TableRow({
  //   children: [
  //     writeCell(formatDate(recieveDate)),
  //     writeCell(receiptVoucherNumber),
  //     writeCell(receivedFrom),
  //     writeCell(receivedQuantity),
  //     writeCell(formatCurrency(unitPrice)),
  //     writeCell(formatCurrency(itemValue, 'right')),
  //     writeCell(),
  //     writeCell(),
  //     writeCell(),
  //     writeCell(receivedQuantity),
  //     writeCell(formatCurrency(itemValue, 'right')),
  //   ],
  //   height: { value: `${0.8}cm` },
  // });
};
