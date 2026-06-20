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

        console.log("Cek hasil disini:", response.body)

        expect(response.body.id).to.equal('bknv_6a341b6e2471702471a92c6f');
        expect(response.body.bank_code).to.equal('BCA');

        const validate = ajv.compile(getSchema);
        const valid = validate(response.body);
        
        if (!valid) {
            console.log("Error Details:", validate.errors);
        }
        expect(valid).to.be.true;
    });

    // it('cek method post', async () => {
    //     const postSchema = {
    //         type: "object",
    //         properties: {
    //             name: { type: "string" },
    //             job: { type: "string" },
    //             id: { type: "string" },
    //             createdAt: { type: "string" }
    //         },
    //         required: ["name", "job", "id", "createdAt"]
    //     };

    //     const requestBody = {
    //         name: "jerry",
    //         job: "Quality Assurance"
    //     };

    //     const response = await request(baseUrl)
    //         .post('/users')
    //         .send(requestBody)
    //         .expect(201);

    //     expect(response.body.name).to.equal(requestBody.name);
    //     expect(response.body.job).to.equal(requestBody.job);

    //     const validate = ajv.compile(postSchema);
    //     const valid = validate(response.body);
        
    //     if (!valid) {
    //         console.log("Error Details:", validate.errors);
    //     }
    //     expect(valid).to.be.true;
    // });
});