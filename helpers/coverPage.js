const fs = require('fs');
const { Paragraph, TextRun, AlignmentType } = require('docx');

exports.coverPage = ({ projectName, year }) => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: 'STORE LEDGER BOOK',
          size: 72,
        }),
      ],
      style: 'coverPage',
      alignment: AlignmentType.CENTER,
      spacing: {
        after: `${2}cm`,
      },
    }),
    new Paragraph({
      children: [new TextRun({ text: projectName.toUpperCase(), size: 50 })],
      style: 'coverPage',
      alignment: AlignmentType.CENTER,
      spacing: {
        after: `${1.5}cm`,
      },
    }),
    // new Paragraph({ text: 'IYOGWE SECONDARY SCHOOL' }),
    new Paragraph({
      children: [new TextRun({ text: year, size: 56 })],
      style: 'coverPage',
      alignment: AlignmentType.CENTER,
      spacing: {
        before: `${1.5}cm`,
        // after: `${1.5}cm`,
      },
    }),
  ];
};
