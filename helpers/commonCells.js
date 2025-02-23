const {
  TableCell,
  TextRun,
  AlignmentType,
  VerticalAlign,
  WidthType,
  Paragraph,
} = require('docx');

exports.getCommonCells = (unitPriceCell = true) => {
  return [
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'QUANTITY',
              size: 20,
            }),
          ],
          style: 'generalStyle',

          alignment: AlignmentType.CENTER,
          indent: { left: `${0.1}cm`, right: `${0.1}cm` },
          // run: {
          //   size: 20,
          // },
        }),
      ],
      width: {
        size: `${2}cm`,
        type: WidthType.DXA,
      },
      verticalAlign: VerticalAlign.CENTER,
    }),
    ...(unitPriceCell
      ? [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'UNIT PRICE',
                    size: 20,
                  }),
                ],
                style: 'generalStyle',
                alignment: AlignmentType.CENTER,
                indent: { left: `${0.1}cm`, right: `${0.1}cm` },
              }),
            ],
            width: {
              size: `${2}cm`,
              type: WidthType.PERCENTAGE,
            },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ]
      : []),
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'VALUE',
              size: 20,
            }),
          ],
          style: 'generalStyle',
          alignment: AlignmentType.CENTER,
          indent: { left: `${0.1}cm`, right: `${0.1}cm` },
        }),
      ],
      width: {
        size: `${2}cm`,
        type: WidthType.DXA,
      },
      verticalAlign: VerticalAlign.CENTER,
    }),
  ];
};
