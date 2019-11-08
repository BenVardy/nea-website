import chai from 'chai';
import chaiHttp from 'chai-http';
import { after, describe, it } from 'mocha';

import {server, stop} from '../server/server';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/GET api', () => {

    /**
     * Adding things together
     */
    describe('Addition', () => {
        it('should add two numbers', done => {
            chai.request(server)
                // 1 + 3
                .get('/api?calc=1%2B3')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);

                    // Assert Body - Must be a deep assertion
                    expect(res.body).to.be.eql([{
                        type: 'no',
                        data: '4'
                    }]);
                    done();
                });
        });

        it('should add two matrices', done => {
            chai.request(server)
                // [[1, 2], [3, 4]] + [[2, 2], [1, 4]]
                .get('/api?calc=%5B%5B1%2C2%5D%2C%5B3%2C4%5D%5D%2B%5B%5B2%2C2%5D%2C%5B1%2C4%5D%5D')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.eql([{
                        type: 'matrix',
                        data: '[[3,4],[4,8]]'
                    }]);
                    done();
                });
        });

        it('should add two vectors', done => {
            chai.request(server)
                // [1, 2] + [5, 3]
                .get('/api?calc=%5B%5B1%5D%2C%5B2%5D%5D%2B%5B%5B5%5D%2C%5B3%5D%5D')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.eql([{
                        type: 'vector',
                        data: '[[6],[5]]'
                    }]);
                    done();
                });
        });

        it('should fail to add a matrix and a number', done => {
            chai.request(server)
                // 1 + [[3, 2], [4, 2]]
                .get('/api?calc=1%2B%5B%5B3%2C2%5D%2C%5B4%2C2%5D%5D')
                .end((err, res) => {
                    expect(res.status).to.be.eq(400);
                    expect(res.body).to.haveOwnProperty('message');
                    done();
                });
        });
    });

    /**
     * Multiplying Things
     */
    describe('Multiplication', () => {
        it('should explicitly multiply two numbers', done => {
            chai.request(server)
                // 4 * 5
                .get('/api?calc=4*5')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.eql([{
                        type: 'no',
                        data: '20'
                    }]);
                    done();
                });
        });

        it('should explicitly multiply two matrices', done => {
            chai.request(server)
                // [[2, 3], [4, 1]] * [[2, 5], [4, 1]]
                .get('/api?calc=%5B%5B2%2C3%5D%2C%5B4%2C1%5D%5D*%5B%5B2%2C5%5D%2C%5B4%2C1%5D%5D')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    expect(res.body).to.be.eql([{
                        type: 'matrix',
                        data: '[[16,13],[12,21]]'
                    }]);
                    done();
                });
        });
    });

    after(() => {
        stop();
    });
});
