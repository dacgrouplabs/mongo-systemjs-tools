'use strict'

var rewire = require('rewire');
var helper = rewire('../lib/helper');
var expect = require('chai').expect;
var fs = require('fs');

describe('module helper loaded correctly', function () {
  it('should have all the function defined', function () {
    expect(helper.log).not.be.a('null');
    expect(helper.config).not.be.a('null');
    expect(helper.format).not.be.a('null');
    expect(helper.writeFile).not.be.a('null');

    expect(helper.log).not.be.a('undefined');
    expect(helper.config).not.be.a('undefined');
    expect(helper.format).not.be.a('undefined');
    expect(helper.writeFile).not.be.a('undefined');
  });
});

describe('module helper.writeFile', function () {

  it('should create a file at the path in config.json', function (done){
    var fileName = 'test.txt';
    var path = helper.config.outDir + fileName;
    helper.writeFile(fileName, 'test_content');
    done();
    //clean the test
    expect(fs.existsSync(path)).to.equal(true);
    fs.unlinkSync(path);
  });
  
});
