const request = require('supertest');
const { expect } = require('chai');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const baseUrl = 'https://reqres.in/api';

describe('API Automation Testing - Reqres.in', () => {

    it('Harus berhasil mendapatkan single user (GET) dan schema sesuai', async () => {
        const getSchema = {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        email: { type: "string", format: "email" },
                        first_name: { type: "string" },
                        last_name: { type: "string" },
                        avatar: { type: "string" }
                    },
                    required: ["id", "email", "first_name", "last_name"]
                },
                support: {
                    type: "object",
                    properties: {
                        url: { type: "string" },
                        text: { type: "string" }
                    }
                }
            },
            required: ["data", "support"]
        };
        const response = await request(baseUrl)
            .get('/users/2')
            .expect(200);

        expect(response.body.data.id).to.equal(2);
        expect(response.body.data.first_name).to.equal('Janet');

        const validate = ajv.compile(getSchema);
        const valid = validate(response.body);
        
        if (!valid) {
            console.log("Schema Error Details:", validate.errors);
        }
        expect(valid).to.be.true;
    });
});