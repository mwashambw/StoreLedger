const { AlignmentType } = require('docx');

exports.getAlignmentType = (type) => {
  if (type === 'left') return { alignment: AlignmentType.LEFT };
  if (type === 'center') return { alignment: AlignmentType.CENTER };
  if (type === 'right') return { alignment: AlignmentType.RIGHT };
};
