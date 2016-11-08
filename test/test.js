const _ = require('../toolkit.js');
var expect = require('chai').expect;

describe('test queryStr:', function() {
    it('demo-1', function() {
        expect(_.queryStr({ name: "daguo", age: "22" })).to.be.equal('?name=daguo&age=22');
    });
    it('demo-2', function() {
        expect(_.queryStr({ name: true, age: 22 })).to.be.equal('?name=true&age=22');
        // expect(_.queryStr({name:["daguo","shudery"],age:"22"})).to.be.equal('?name=daguo&age=22');
    });
   
});
describe('test queryPrase:', function() {
     it('demo-1', function() {
        expect(_.queryPrase("http://hello/?name=true&age=22")).to.deep.equal({ name: "true", age: "22" });
    });
});
