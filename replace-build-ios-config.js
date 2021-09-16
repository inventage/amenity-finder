module.exports = {
  files: 'ios/App/App/public/index.html',
  from: /width=device-width,initial-scale=1,viewport-fit=cover/g,
  to: 'width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no',
};
