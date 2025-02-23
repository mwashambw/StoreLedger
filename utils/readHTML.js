// const { path } = require('../app');
const path = require('path');
const fs = require('fs');

exports.readHtmlFile = (fileName, { firstName, subject, resetURL }) => {
  const filePath = path.join(__dirname, '../views', `${fileName}.html`);

  const data = fs.readFileSync(filePath, 'utf8');

  let htmlcontent = data.replace('{{name}}', firstName);
  htmlcontent = htmlcontent.replace('{{subject}}', subject);
  htmlcontent = htmlcontent.replace('{{resetURL}}', resetURL);
  // htmlcontent = htmlcontent.replace('{{url}}', url);

  return htmlcontent;
};
