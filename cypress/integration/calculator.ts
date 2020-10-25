context('Calculator', () => {
  it('correctly calculates the values when using the form', () => {
    cy.visit('/');

    cy.findByLabelText(/informe o valor da venda/i).type('15000');
    cy.findByLabelText(/em quantas parcelas/i).type('3');
    cy.findByLabelText(/informe o percentual de MDR/i).type('4');

    cy.findByTestId('day-1').contains('R$ 13267');
    cy.findByTestId('day-15').contains('R$ 13536');
    cy.findByTestId('day-30').contains('R$ 13824');
    cy.findByTestId('day-90').contains('R$ 14400');
  });
});
