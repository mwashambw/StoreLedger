const { AlignmentType } = require('docx');
// const { tableRows } = require('../helpers/tableRow');
// const { writeSheetHeader } = require('../helpers/sheetHeader');
// const { coverPage } = require('../helpers/coverPage');

exports.generalDocumentStyle = {
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
