describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
    cy.get('*[data-testid=home]').should('exist')
  })
})
