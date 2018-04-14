var server   = require('../server'),
    chai     = require('chai'),
    chaiHTTP = require('chai-http'),
    should   = chai.should();

chai.use(chaiHTTP);
var expect = chai.expect;

reqServer = process.env.HTTP_TEST_SERVER || server

describe('Basic routes tests', function() {

    it('Get to /pagecount should return \'Hello there!\'', function(done){
        chai.request(reqServer)
        .get('/pagecount')
        .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.text).to.be.eql('Hello there!');
            done();
        })

    })

})
