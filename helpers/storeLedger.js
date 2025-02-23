const fs = require('fs');
const {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  NumberFormat,
  Footer,
  PageNumber,
  PageOrientation,
  Table,
  WidthType,
  PageBreak,
} = require('docx');
const { tableRows } = require('../helpers/tableRow');
const { writeSheetHeader } = require('../helpers/sheetHeader');
const { coverPage } = require('../helpers/coverPage');

const generalDocumentStyle = {
  styles: {
    paragraphStyles: [
      {
        id: 'generalStyle',
        name: 'General style',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,

        run: {
          size: 24,
          // size: this.fontSize * 2,
          color: '000000',
          font: 'Arial',
        },

        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      {
        id: 'textStyle',
        name: 'Text style',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,

        run: {
          size: 20,
          // size: this.fontSize * 2,
          color: '000000',
          font: 'Arial',
        },

        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      {
        id: 'heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 40,
          bold: true,
          // size: this.fontSize * 2 + 2,
          color: '000000',
          // color: '888888',
          font: 'Arial',
        },
      },
      {
        id: 'heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 32,
          // size: this.fontSize * 2 + 1,
          bold: true,
          color: '000000',
          font: 'Arial',
          // font: this.fontStyle,
        },
      },
      {
        id: 'coverPage',
        name: 'Cover Page',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: {
          size: 40,
          // size: this.fontSize * 2 + 1,
          bold: true,
          color: '000000',
          font: 'Arial',
          // font: this.fontStyle,
        },
      },
    ],
  },
};

const generalSectionStyle = {
  properties: {
    page: {
      margin: {
        top: `${1}cm`,
        left: `${1.8}cm`,
        bottom: `${1}cm`,
        right: `${0.5}cm`,
        header: `${0.7}cm`,
        footer: `${0.7}cm`,
        // top: `${1.8}cm`,
        // left: `${2}cm`,
        // bottom: `${1.6}cm`,
        // right: `${1.97}cm`,
      },
      size: {
        orientation: PageOrientation.LANDSCAPE,
      },
      pageNumbers: {
        start: 1,
        formatType: NumberFormat.DECIMAL,
      },
    },
  },

  footers: {
    default: new Footer({
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ children: ['Page ', PageNumber.CURRENT] }),
            // new TextRun({ children: [' of ', PageNumber.TOTAL_PAGES] }),
          ],
        }),
      ],
    }),
  },
};

exports.generateStoreLedger = async (project) => {
  try {
    const { items } = project;
    const doc = new Document({
      ...generalDocumentStyle,
      sections: [
        {
          properties: {
            titlePage: true,

            page: {
              margin: {
                top: `${4}cm`,
                left: `${2}cm`,
                bottom: `${4}cm`,
                right: `${2}cm`,
                header: `${2}cm`,
                footer: `${2}cm`,
                // top: `${1.8}cm`,
                // left: `${2}cm`,
                // bottom: `${1.6}cm`,
                // right: `${1.97}cm`,
              },
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
            },
          },
          children: [
            // SHEET COVER PAPER
            ...coverPage({
              projectName: project.projectName,
              year: project.year,
            }),
          ],
        },
        {
          ...generalSectionStyle,
          children: [
            ...items.flatMap((item, i, arr) => {
              return [
                // SHEET HEADER
                ...writeSheetHeader(item, i + 1),
                // ITEM INFO (RECEIPTS & ISSUES)
                new Table({
                  rows: tableRows(item),
                  width: {
                    // size: `${30}cm`,
                    size: `${27}cm`,
                    type: WidthType.AUTO,
                  },
                }),
                // BREAK THE PAGE (Does not break for last item)
                ...(i + 1 === arr.length
                  ? []
                  : [new Paragraph({ children: [new PageBreak()] })]),
              ];
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(
      `./storeLedgers/${project.projectName.toUpperCase()}.docx`,
      buffer
    );
  } catch (error) {
    throw new Error(error);
  }
};
