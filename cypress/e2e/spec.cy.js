/** @format */

describe('template spec', () => {
	it('Start the app', () => {
		cy.visit('localhost:5000');
		cy.intercept(
			'GET',
			'https://retro-shop-v2-0-mern.onrender.com/api?pageNumber=1&nPerPage=6'
		).as('productGet');
		cy.wait('@productGet').then((xhr) => {
			const productArr = xhr.response.body.products;
			cy.get(productArr).should('have.length', 4);
		});
	});
});
