// cypress/support/commands.js
import { faker } from '@faker-js/faker';

Cypress.Commands.add('registerUser', () => {
  //Os campos de usuário foram criados em sua maioria fixos, porque na documentação disponibilizada não tinha todos os requisitos a serem cumpridos, o que estava deixando o teste instável
  const userData = {
    accountType: "ADMIN",
    address: "Rua Eurico Hummig 89",
    allowOffersPromotion: true,
    aobUser: true,
    cityName: "Londrina",
    country: faker.helpers.arrayElement["AUSTRALIA_AU", "AUSTRIA_AT", "BRAZIL_BR", "CANADA_CA", "CHINA_CN", "CROATIA_HR", "DENMARK_DK", "EGYPT_EG", "ENGLAND_UK", "FRANCE_FR", "GERMANY_DE", "GREECE_GR", "INDIA_IN", "ISRAEL_IL", "ITALY_IT", "JAPAN_JP", "MEXICO_MX", "NETHERLAND_NL", "NORWAY_NO", "NEW_ZEALAND_NZ", "SPAIN_ES", "SOUTH_KOREA_KR", "NORTH_KOREA_KP", "PORTUGAL_PT", "QATAR_QA", "ROMANIA_RO", "RUSSIA_RU", "SOUTH_AFRICA_ZA", "SWEDEN_SE", "SWITZERLAND_CH", "THAILAND_TH", "TUNISIA_TN", "TURKEY_TR", "UKRAINE_UA", "UNITED_KINGDOM_UK", "UNITED_STATES_US", "YEMEN_YE"],
    email: faker.internet.email(),
    firstName: "Teste",
    lastName: "API ",
    loginName: generateRandomString(5, 15),
    password: "Teste123*",
    phoneNumber: "9987358208",
    stateProvince: "Parana",
    zipcode: "86050464",
  };
  cy.api({
      method: 'POST',
      url: '/accountservice/accountrest/api/v1/register',
      body: userData
  }).then((registerResponse) => {
      expect(registerResponse.status).to.eq(200);
      Cypress.env('userData', userData); 
  });
});

Cypress.Commands.add('loginUser', () => {
  const userData = Cypress.env('userData');
  if (!userData) throw new Error('User data not found for login');
  cy.api({
      method: 'POST',
      url: '/accountservice/accountrest/api/v1/login',
      body: {
          email: userData.email,
          loginPassword: userData.password,
          loginUser: userData.loginName
      }
  }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200);
      Cypress.env('authToken', loginResponse.body.statusMessage.token);
      Cypress.env('userId', loginResponse.body.statusMessage.userId);
  });
});

function generateRandomString(minLength, maxLength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength; 
  let result = '';

  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}