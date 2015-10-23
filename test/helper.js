'use strict'

var rewire = require('rewire');
var helper = rewire('../lib/helper');
var expect = require('chai').expect;

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
