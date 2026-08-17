describe('Projects API', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should fetch GitHub repositories', () => {
    cy.intercept('GET', '/api/github/repos').as('getRepos');
    
    cy.get('#projects').scrollIntoView();
    
    cy.wait('@getRepos').then((interception) => {
      expect(interception.response?.statusCode).to.be.oneOf([200, 304]);
    });
  });

  it('should display loading state while fetching', () => {
    cy.intercept('GET', '/api/github/repos', {
      delay: 1000,
      statusCode: 200,
      body: [],
    }).as('getRepos');
    
    cy.get('#projects').scrollIntoView();
    
    // Should show loader
    cy.get('#projects').within(() => {
      cy.get('[class*="animate-spin"]').should('exist');
    });
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', '/api/github/repos', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('getReposError');
    
    cy.get('#projects').scrollIntoView();
    cy.wait('@getReposError');
    
    cy.contains(/failed/i).should('be.visible');
  });

  it('should display repositories when API returns data', () => {
    const mockRepos = [
      {
        id: 1,
        name: 'test-repo',
        description: 'Test description',
        html_url: 'https://github.com/test/repo',
        homepage: null,
        stargazers_count: 10,
        forks_count: 5,
        language: 'TypeScript',
        topics: ['react', 'nextjs'],
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];

    cy.intercept('GET', '/api/github/repos', {
      statusCode: 200,
      body: mockRepos,
    }).as('getRepos');
    
    cy.get('#projects').scrollIntoView();
    cy.wait('@getRepos');
    
    cy.contains('test-repo').should('be.visible');
    cy.contains('Test description').should('be.visible');
  });
});
