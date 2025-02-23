const {
  TableRow,
  TableCell,
  Paragraph,
  AlignmentType,
  WidthType,
  VerticalAlign,
} = require('docx');
const { getCommonCells } = require('./commonCells');

exports.tableRowHeader = () => {
  return [
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: 'DATE',
              style: 'generalStyle',
              alignment: AlignmentType.CENTER,
              // indent: { left: `${1}cm`, hanging: `${0.8}cm` },
              indent: { left: `${0.4}cm`, right: `${0.4}cm` },
            }),
          ],
          width: {
            size: `${1.6}cm`,
            type: WidthType.DXA,
          },
          verticalAlign: VerticalAlign.CENTER,
          rowSpan: 2,
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'RECEIPT OR ISSUE VOUCHER No.',
              style: 'generalStyle',
              alignment: AlignmentType.CENTER,
              indent: { left: `${0.4}cm`, right: `${0.4}cm` },
            }),
          ],

          width: {
            size: `${2.8}cm`,
            type: WidthType.DXA,
          },
          verticalAlign: VerticalAlign.CENTER,
          rowSpan: 2,
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'RECEIVED FROM OR ISSUE TO',
              style: 'generalStyle',
              alignment: AlignmentType.CENTER,
              // indent: { left: `${0.}cm`, right: `${0.4}cm` },
            }),
          ],
          width: {
            size: `${3.8}cm`,
            type: WidthType.DXA,
          },
          verticalAlign: VerticalAlign.CENTER,
          rowSpan: 2,
        }),

        new TableCell({
          children: [
            new Paragraph({
              text: 'RECEIPTS',
              style: 'generalStyle',
              alignment: AlignmentType.CENTER,
            }),
          ],
          width: {
            size: `${6}cm`,
            type: WidthType.DXA,
          },
          verticalAlign: VerticalAlign.CENTER,
          columnSpan: 3,
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'ISSUES',
              style: 'generalStyle',
              alignment: AlignmentType.CENTER,
            }),
          ],
          width: {
            size: `${6}cm`,
            type: WidthType.AUTO,
          },
          verticalAlign: VerticalAlign.CENTER,
          columnSpan: 3,
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: 'BALANCE',
              style: 'generalStyle',
              alignment: AlignmentType.CENTER,
            }),
          ],
          width: {
            size: `${4}cm`,
            type: WidthType.DXA,
          },
          verticalAlign: VerticalAlign.CENTER,
          columnSpan: 2,
        }),
      ],
      height: { value: `${0.8}cm` },
    }),
    new TableRow({
      children: [
        ...getCommonCells(),
        ...getCommonCells(),
        ...getCommonCells(false),
      ],
      height: { value: `${1.6}cm` },
    }),
  ];
};
