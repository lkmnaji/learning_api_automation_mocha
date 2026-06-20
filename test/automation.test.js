const request = require('supertest');
const { expect } = require('chai');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const baseUrl = 'https://api.iluma.ai/v1.1';

describe('sampel automation method get', () => {

    it('sampel get data single dan sesuai', async () => {
        const getSchema = {
            type: "object",
            properties: {
                id: { type: "string" },
                status: { type: "string" },
                reference_id: { type: "string" },
                bank_code: { type: "string" },
                bank_account_number: { type: "string" },
                account_holder_name: { type: "string" }
            },
            required: ["id", "status", "bank_code", "bank_account_number"]
        };
        const response = await request(baseUrl)
            .get('/identity/bank_account_data_requests/bknv_6a341b6e2471702471a92c6f')
            .set('Authorization', 'Basic aWx1bWFfZGV2ZWxvcG1lbnRfRlg0ZjBNNXN4RGdrNXFGeVpuazYwWmVuZ0FmQTlvMzF4M2VjZDI5dmloamM0Vmh5SjhGY2xaaEhqanc6')
            .expect(200);

        console.log("Cek hasil get disini:", response.body)

        expect(response.body.id).to.equal('bknv_6a341b6e2471702471a92c6f');
        expect(response.body.bank_code).to.equal('BCA');

        const validate = ajv.compile(getSchema);
        const valid = validate(response.body);
        
        if (!valid) {
            console.log("Error GET Details:", validate.errors);
        }
        expect(valid).to.be.true;
    });

    it('cek method post', async () => {
        const postSchema = {
            type: "object",
            properties: {
                id: { type: "string" },
                status: { type: "string" },
                reference_id: { type: "string" },
                bank_code: { type: "string" },
                bank_account_number: { type: "string" },
                account_holder_name: { type: "string" } 
            },
            required: ["reference_id", "status", "bank_code", "bank_account_number"]
        };

        const requestBody = {
            "bank_account_number": "84392849",
            "bank_code": "MANDIRI",
            "given_name": "Saptono",
            "surname": "Saptono",
            "reference_id" : "testing123-456"
        };

        const response = await request(baseUrl)
            .post('/identity/bank_account_data_requests')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Basic aWx1bWFfZGV2ZWxvcG1lbnRfRlg0ZjBNNXN4RGdrNXFGeVpuazYwWmVuZ0FmQTlvMzF4M2VjZDI5dmloamM0Vmh5SjhGY2xaaEhqanc6') 
            .send(requestBody)
            .expect(200);

        console.log("Cek hasil post disini:", response.body)

        expect(response.body.reference_id).to.equal(requestBody.reference_id);
        expect(response.body.bank_code).to.equal(requestBody.bank_code);
        expect(response.body.bank_account_number).to.equal(requestBody.bank_account_number);

        const validate = ajv.compile(postSchema);
        const valid = validate(response.body);
        
        if (!valid) {
            console.log("Error POST Details:", validate.errors);
        }
        expect(valid).to.be.true;
    });
});