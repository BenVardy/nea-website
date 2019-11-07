import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';

import server from '../server/server';

const expect = chai.expect;

chai.use(chaiHttp);

describe('/GET api', () => {

    /**
     * Adding things together
     */
    describe('Addition', () => {
        it('it should perform 1+3=4', (done) => {
            chai.request(server)
                .get('/api?calc=1%2B2')
                .end((err, res) => {
                    expect(res.status).to.be.eq(200);
                    done();
                });
        });
    });
});
