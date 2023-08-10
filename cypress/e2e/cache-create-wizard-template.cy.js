describe('Cache Creation Wizard', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
  });

  it('successfully creates with a template', () => {
    const cacheName = 'aCache';
    //go to create cache page
    cy.get('[data-cy=createCacheButton]').click();
    cy.get('#edit').click();
    //Checking that the Next button is disabled until the cache name is entered
    cy.get('[data-cy=wizardNextButton]').should('be.disabled');

    cy.get('#cache-name').click();
    cy.get('#cache-name').type(cacheName);

    cy.get('[data-cy=wizardNextButton]').click();

    cy.get('#template-selector').click();
    cy.contains('e2e-test-template').parent().find('button').click();
    cy.get('[data-cy=wizardNextButton]').click();
    cy.contains('Cache ' + cacheName + ' successfully created with e2e-test-template.');
    // Once the cache created, redirection to main page is done and the cache should be visible
    //Is redirected to Data Container page
    cy.get('#cluster-manager-header').should('exist');
    cy.get('[data-cy=cacheManagerStatus]').should('exist');
    cy.get('[data-cy=rebalancingSwitch]').should('exist');
    cy.contains(cacheName);
  });

  it('successfully creates without a template a JSON config', () => {
    //go to create cache page
    cy.get('[data-cy=createCacheButton]').click();
    cy.get('#cache-name').click();
    cy.get('#cache-name').type('aSimpleCache');
    cy.get('#edit').click();
    cy.get('[data-cy=wizardNextButton]').click();
    cy.get('[data-cy=provideConfigArea] > button').click();

    cy.get('.pf-v5-c-code-editor__code textarea:first').click({force: true}).focused().type( '{downArrow}' )
      .type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}")
      .type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}")
      .type("{shift}{end}").type("{del}{del}").type("{enter}{upArrow}").type('"distributed-cache": {{}"mode": "ASYNC", "statistics": true }{del}');

    cy.get('[data-cy=wizardNextButton]').click();
    cy.contains('Cache aSimpleCache created with the provided configuration.');
    // Once the cache created, redirection to main page is done and the cache should be visible
    cy.get('#cluster-manager-header').should('exist');
    cy.get('[data-cy=cacheManagerStatus]').should('exist');
    cy.get('[data-cy=rebalancingSwitch]').should('exist');
    cy.contains('aSimpleCache');
  });

  it('successfully creates without a template a XML config', () => {
    //go to create cache page
    cy.get('[data-cy=createCacheButton]').click();
    cy.get('#cache-name').click();
    cy.get('#cache-name').type('aSimpleXmlCache');
    cy.get('#edit').click();
    cy.get('[data-cy=wizardNextButton]').click();
    cy.get('[data-cy=provideConfigArea] > button').click();

    cy.get('.pf-v5-c-code-editor__code textarea:first').click({force: true}).focused().type( '{downArrow}' )
      .type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}")
      .type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}").type("{shift}{end}").type("{del}{del}")
      .type("{shift}{end}").type("{del}{del}").type("{enter}{upArrow}")
      .type(
        '<local-cache name="local">\
        <expiration interval="500" lifespan="60000" max-idle="1000" touch="ASYNC"/>\
        <memory storage="OFF_HEAP" max-size="200 MB" when-full="MANUAL" />\
    </local-cache>',
        { parseSpecialCharSequences: false }
      ).type("{del}{del}").type("{upArrow}{backspace}");
    cy.get('[data-cy=wizardNextButton]').click();
    cy.contains('Cache aSimpleXmlCache created with the provided configuration.');
    // Once the cache created, redirection to main page is done and the cache should be visible
    cy.get('#cluster-manager-header').should('exist');
    cy.get('[data-cy=cacheManagerStatus]').should('exist');
    cy.get('[data-cy=rebalancingSwitch]').should('exist');
    cy.contains('aSimpleXmlCache');
  });
});
