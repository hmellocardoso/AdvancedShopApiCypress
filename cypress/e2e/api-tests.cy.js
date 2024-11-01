import { faker } from '@faker-js/faker';

describe('API Tests with Cypress and cypress-plugin-api', () => {
    before(() => {
      cy.registerUser();
      cy.loginUser();
    });
    it('GET - Validar lista de produtos', () => {
      cy.api({
        method: 'GET',
        url: '/catalog/api/v1/products',
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.fixture('schemas/getProductsSchema.json').then((schema) => {
            expect(response.body).to.be.jsonSchema(schema);
          });
        Cypress.env('productId', response.body.products[0].productId); 
        Cypress.env('codeColor', response.body.products[0].colors[0].code);
      });
    });

    it('POST - Criar um carrinho para o usuário', () => {
      const qsData = {
        hasWarranty: faker.datatype.boolean(),
        quantity: 1
      }
      cy.api({
        method: 'POST',
        url: '/order/api/v1/carts/' + Cypress.env('userId') + '/product/' + Cypress.env('productId') + '/color/' + Cypress.env('codeColor'),
        headers: {
            Authorization: 'Bearer ' + Cypress.env('authToken')
          },
          qs: qsData
        }).then((response) => {
        expect(response.status).to.eq(201);
        cy.fixture('schemas/postCartSchema.json').then((schema) => {
            expect(response.body).to.be.jsonSchema(schema);
          });
        Cypress.env('qsData', qsData); 
      });
    });

    it ('PUT - Atualizar carrinho do usuário', () => {
      cy.api({
        method: 'PUT',
        url: '/order/api/v1/carts/' + Cypress.env('userId'),
        headers: {
          Authorization: 'Bearer ' + Cypress.env('authToken')
        },
        body:{
          hasWarranty: Cypress.env('qsData').hasWarranty,
          hexColor: Cypress.env('codeColor'),
          productId: Cypress.env('productId'),
          quantity: Cypress.env('qsData').quantity += 1
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.fixture('schemas/putCartSchema.json').then((schema) => {
          expect(response.body).to.be.jsonSchema(schema);
        });
      });
    });

    it ('DELETE - Apagar carrinho criado', () => {
      cy.api({
        method: 'DELETE',
        url: '/order/api/v1/carts/' + Cypress.env('userId'),
        headers: {
          Authorization: 'Bearer ' + Cypress.env('authToken')
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.fixture('schemas/deleteCartSchema.json').then((schema) => {
          expect(response.body).to.be.jsonSchema(schema);
        });
      });
    })
});
  