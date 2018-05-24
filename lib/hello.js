var argv = require('optimist').argv;
var fs = require('fs'),
    xml2js = require('xml2js');
 
var parser = new xml2js.Parser();
fs.readFile('demo.dnn', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result.dotnetnuke.packages[0].package[0].$.name);
        console.log('Done');
    });
});

console.log('Hello ' + (argv.name || 'World') + '!');

