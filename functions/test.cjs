const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { signUpUser } = require('./lib/index');

const req = {
    data: {
        email: 'ceo@almstkshf.com',
        password: 'P@ssword!123',
        fullName: 'Tamer Gad',
        mode: 'create',
        organizationName: 'Almstkshf'
    }
};

const res = {
    send: (val) => {
        console.log(val);
        process.exit(0);
    },
    status: (code) => {
        return res;
    }
};

signUpUser(req, res);
