const T = require("tesseract.js")

T.recognize('./ex1.png', 'eng')
    .then(function(result){console.log('result is: ', result.data.text)})