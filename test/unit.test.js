const _ = require('../toolkit.js');
var expect = require('chai').expect;

describe('queryStr:', () => {
    it('test-1', () => {
        expect(_.queryStr({ name: "daguo", age: "22" })).to.be.equal('?name=daguo&age=22');
    });
    it('test-2', () => {
        expect(_.queryStr({ name: true, age: 22 })).to.be.equal('?name=true&age=22');
        // expect(_.queryStr({name:["daguo","shudery"],age:"22"})).to.be.equal('?name=daguo&age=22');
    });

});
describe('queryPrase:', () => {
    it('test-1', () => {
        expect(_.queryPrase("http://hello/?name=true&age=22")).to.deep.equal({ name: "true", age: "22" });
    });
});
describe('injection:', () => {
    it('test-1', () => {
        _.injection('fs')
        expect(typeof fs === 'object');
    });
    it('test-2', () => {
        _.injection('fs', ['http', 'hp'])
        expect(typeof fs === require('fs') && typeof hp === require('http'));
    });
});
describe('clone:', () => {
    let obj = { age: 21, girls: false, name: ['baby', 'guy'] };
    let newObj = _.clone(obj);
    it('test-1', () => {
        expect(newObj).to.deep.equal(obj);
    });
    it('test-2', () => {
        newObj.age++
            expect(obj.age === 21 && newObj.age === 22);
    });
    it('test-3', () => {
        newObj.name[0] = 'newbaby'
        expect(obj.name[0] === 'baby');
    });
});
describe('extend:', () => {
    let obj = { age: 21, girls: false, name: ['baby', 'guy'] };
    let extObj = { girls: true, skill: function() {} };
    it('test-1', () => {
        let newObj = _.extend(obj, extObj);
        obj.age = 22;
        expect(newObj.girls === false && typeof newObj.skill === 'function' && newObj === 22);
    });
    it('test-2', () => {
        let newObj = _.extend(obj, extObj, true);
        expect(newObj.girls === true && typeof newObj.skill === 'function');
    });
    it('test-3', () => {
        let newObj = _.extend(obj, extObj, true, true);
        obj.age = 22;
        expect(newObj === 21);
    });
});
