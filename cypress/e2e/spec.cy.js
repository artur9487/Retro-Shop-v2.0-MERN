/** @format */

describe('Loading the products on start page ', () => {
	it('Start the app', () => {
		cy.visit('http://localhost:3000');
		cy.intercept(
			'GET',
			'http://localhost:5000/api?pageNumber=1&nPerPage=6'
		).as('productGet');
		cy.wait('@productGet').then((xhr) => {
			cy.wrap('[data-cy=singleProduct]').should('have.lengthOf', 23);
		});
	});

	it.only('Getting the filter option', () => {
		cy.visit('http://localhost:3000');
		cy.get('[data-cy=filterBar]')
			.find('[data-cy=filterOption]')
			.should('have.lengthOf', 3)
			.then((item) => {
				cy.wrap(item)
					.eq(0)
					.should('contain', 'Set Category')
					.click()
					.find('[data-cy=optionData]')
					.should('have.lengthOf', 3)
					.should('contain', 'Electronics')
					.contains('Electronics')
					.click();

				cy.wrap(item)
					.eq(1)
					.should('contain', 'Set price range')
					.click()
					.find('[data-cy=optionSlider]')
					.find('[data-index=0]')
					.find('input')
					.invoke('val', 30)
					.trigger('change', { force: true });

				cy.wrap(item)
					.eq(2)
					.should('contain', 'Set Rating')
					.click()
					.find('[data-cy=optionData]')
					.should('have.lengthOf', 4)
					.should('contain', 'Above 3 stars')
					.contains('Above 3 stars')
					.click();
			});
		//	.contains('Submit Filter');
	});
});
