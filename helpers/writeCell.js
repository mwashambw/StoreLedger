const { TableCell, Paragraph, VerticalAlign } = require('docx');
const { getAlignmentType } = require('../utils/alignmentType');

exports.writeCell = ({
  textValue = '',
  alignmentType = 'center',
  isShade = false,
}) => {
  return new TableCell({
    children: [
      new Paragraph({
        text: `${textValue}`,
        style: 'textStyle',
        ...getAlignmentType(alignmentType),
        indent: { left: `${0.1}cm`, right: `${0.1}cm` },
      }),
    ],
    verticalAlign: VerticalAlign.CENTER,
    ...(isShade
      ? {
          shading: {
            fill: '#F0F0F0',
          },
        }
      : {}),
  });
};
