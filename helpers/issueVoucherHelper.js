const {
  Paragraph,
  Document,
  PageOrientation,
  Packer,
  TextRun,
  AlignmentType,
} = require('docx');
const fs = require('fs');
const { formatDate } = require('../utils/formatDate');
const { generalDocumentStyle } = require('../utils/generalDocxStyle');

// [
//   {
//     'mbao 2 X 2': [
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object],
//       [Object], [Object]
//     ]
//   },
//   { 'junction box plastic': [ [Object] ] },
//   { 'Light bulbs 10 W': [ [Object], [Object] ] },
//   { 'Snake wire': [ [Object] ] },
//   { 'Angle lamp holder (Tronic)': [ [Object] ] },
//   { 'Switch Socket (1 gang 1 way)': [ [Object] ] },
//   { 'test item 1': [ [Object], [Object] ] },
//   {
//     'test item 3': [ [Object], [Object], [Object], [Object], [Object] ]
//   }
// ]

// [{ '17/10/2024': [ { 'mbao 2 X 2': 24 } ] },
// { '18/10/2024': [ { 'mbao 2 X 2': 150 } ] },
// { '21/10/2024': [ { 'mbao 2 X 2': 150 } ] },
// { '23/10/2024': [ { 'mbao 2 X 2': 65 } ] },
// { '25/10/24': [ { 'mbao 2 X 2': 39 } ] },
// { '26/10/2024': [ { 'mbao 2 X 2': 15 } ] },
// { '27/10/2024': [ { 'mbao 2 X 2': 35 } ] },
// { '02/11/2024': [ { 'mbao 2 X 2': 52 } ] }]

exports.generateIssueVoucherHelper = async (project) => {
  try {
    const { items } = project;

    // Get items usage
    const itemsWithUsage = items.map((item) => {
      const { orders } = item;
      const allUsageRecords = orders.flatMap((order) => order.usageRecords);
      return { [item.itemName]: allUsageRecords };
    });

    const allItemsWithDates = itemsWithUsage.reduce((acc, cur) => {
      const itemUsage = Object.values(cur)[0];

      return [
        ...acc,
        ...itemUsage.map((usage) => {
          return {
            [formatDate(usage.dateTaken)]: [
              { [Object.keys(cur)[0]]: usage.quantityTaken },
            ],
          };
        }),
      ];
    }, []);

    const issueVoucherHelper = allItemsWithDates.reduce((acc, cur, i) => {
      const matchedDate = acc.find((el) => {
        // console.log(Object.keys(el)[0] === Object.keys(cur)[0]);
        return Object.keys(el)[0] === Object.keys(cur)[0];
      });

      if (matchedDate) {
        return acc.map((accItem) => {
          if (JSON.stringify(matchedDate) === JSON.stringify(accItem)) {
            return {
              [Object.keys(cur)[0]]: [
                ...Object.values(matchedDate)[0],
                ...Object.values(cur)[0],
              ],
            };
          }

          return accItem;
        });
      }

      return [...acc, cur];
    }, []);

    const sortedIssueVoucher = issueVoucherHelper.sort(
      (a, b) => new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0])
    );

    const doc = new Document({
      ...generalDocumentStyle,
      sections: [
        {
          // ...generalSectionStyle,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `ISSUE VOUCHER ITEMS FOR ${project.projectName.toUpperCase()} PROJECT`,
                  bold: true,
                }),
              ],
              style: 'heading1',
              alignment: AlignmentType.CENTER,
              spacing: {
                // before: `${1.5}cm`,
                // before: this.isTwoLogo() ? `${0.9}cm` : `${1.5}cm`,
                before: `${0.4}cm`,
                after: `${0.1}cm`,
              },
            }),
            ...sortedIssueVoucher.flatMap((item, i, arr) => {
              const date = Object.keys(item)[0];
              const itemsTaken = Object.values(item)[0];

              return [
                new Paragraph({
                  children: [new TextRun({ text: date, bold: true })],
                  style: 'textStyle',
                  spacing: {
                    // before: `${1.5}cm`,
                    // before: this.isTwoLogo() ? `${0.9}cm` : `${1.5}cm`,
                    before: `${0.4}cm`,
                    after: `${0.1}cm`,
                  },
                }),
                ...itemsTaken.map((tkn) => {
                  return new Paragraph(
                    {
                      children: [
                        new TextRun({
                          text: `${Object.keys(tkn)[0].toUpperCase()}`,
                        }),
                        new TextRun({
                          text: `      ${Object.values(tkn)[0]}`,
                          bold: true,
                        }),
                      ],
                    }
                    // `${Object.keys(tkn)[0].toUpperCase()} ${
                    //   Object.values(tkn)[0]
                    // }`
                  );
                }),
              ];
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(
      `./storeLedgers/VOUCHER-${project.projectName.toUpperCase()}.docx`,
      buffer
    );
  } catch (error) {
    throw new Error(error);
  }
};

// try {
//   const { items } = project;

// const doc = new Document({
//   ...generalDocumentStyle,
//   sections: [
//     {
//       properties: {
//         titlePage: true,

//         page: {
//           margin: {
//             top: `${4}cm`,
//             left: `${2}cm`,
//             bottom: `${4}cm`,
//             right: `${2}cm`,
//             header: `${2}cm`,
//             footer: `${2}cm`,
//             // top: `${1.8}cm`,
//             // left: `${2}cm`,
//             // bottom: `${1.6}cm`,
//             // right: `${1.97}cm`,
//           },
//           size: {
//             orientation: PageOrientation.LANDSCAPE,
//           },
//         },
//       },
//       children: [
//         // SHEET COVER PAPER
//         ...coverPage({
//           projectName: project.projectName,
//           year: project.year,
//         }),
//       ],
//     },
//     {
//       ...generalSectionStyle,
//       children: [
//         ...items.flatMap((item, i, arr) => {
//           return [
//             // SHEET HEADER
//             ...writeSheetHeader(item, i + 1),
//             // ITEM INFO (RECEIPTS & ISSUES)
//             new Table({
//               rows: tableRows(item),
//               width: {
//                 // size: `${30}cm`,
//                 size: `${27}cm`,
//                 type: WidthType.AUTO,
//               },
//             }),
//             // BREAK THE PAGE (Does not break for last item)
//             ...(i + 1 === arr.length
//               ? []
//               : [new Paragraph({ children: [new PageBreak()] })]),
//           ];
//         }),
//       ],
//     },
//   ],
// });

// const buffer = await Packer.toBuffer(doc);
// fs.writeFileSync(
//   `./storeLedgers/${project.projectName.toUpperCase()}.docx`,
//   buffer
// );
// } catch (error) {
//   throw new Error(error);
// }
