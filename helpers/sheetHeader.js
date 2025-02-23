const {
  AlignmentType,
  UnderlineType,
  Paragraph,
  TextRun,
  TabStopType,
} = require('docx');

exports.writeSheetHeader = ({ itemName, unit }, index) => {
  return [
    new Paragraph({
      text: 'GAIRO DISTRICT COUNCIL',
      style: 'heading1',
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: 'STORES LEDGER',
      style: 'heading2',

      alignment: AlignmentType.CENTER,
      spacing: {
        // before: `${1.5}cm`,
        // before: this.isTwoLogo() ? `${0.9}cm` : `${1.5}cm`,
        before: `${0.3}cm`,
      },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'ARTICLE: ' }),
        new TextRun({
          // text: ' CEMENT 42.5N',
          text: ` ${itemName.toUpperCase()}`,
          bold: true,
          underline: {
            type: UnderlineType.DOTTED,
          },
        }),
        new TextRun({ text: '\tUNIT OF ISSUE / RECEIPTS: ' }),
        new TextRun({
          // text: ' BAG',
          text: ` ${unit.toUpperCase()}`,
          bold: true,
          underline: {
            type: UnderlineType.DOTTED,
          },
        }),
        new TextRun({ text: '\tFOLIO NO: ' }),
        new TextRun({
          // text: ' 124',
          text: ` ${index}`,
          bold: true,
          underline: {
            type: UnderlineType.DOTTED,
          },
        }),
      ],

      style: 'generalStyle',
      // alignment: AlignmentType.CENTER,
      spacing: {
        before: `${0.3}cm`,
      },
      tabStops: [
        {
          type: TabStopType.LEFT,
          position: `${0}cm`,
        },
        {
          type: TabStopType.CENTER,
          position: `${13}cm`,
        },
        {
          type: TabStopType.RIGHT,
          position: `${26}cm`,
        },
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'LOCATION' }),
        new TextRun({
          text: '......................................',
        }),
        new TextRun({ text: ' BIN LOCATION' }),
        new TextRun({
          text: '....................................',
        }),
        new TextRun({ text: ' STOCK SHEET NO' }),
        new TextRun({
          text: '...................................',
        }),
        new TextRun({
          text: ' PRINCING METHOD',
        }),
      ],

      style: 'generalStyle',
      // alignment: AlignmentType.CENTER,
      spacing: {
        before: `${0.3}cm`,
      },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'PART NO. OR MODEL' }),
        new TextRun({
          text: '.............................................',
        }),
      ],

      style: 'generalStyle',
      // alignment: AlignmentType.CENTER,
      spacing: {
        before: `${0.3}cm`,
        after: `${0.3}cm`,
      },
    }),
  ];
};
