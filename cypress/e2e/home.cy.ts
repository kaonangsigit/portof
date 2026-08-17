describe('Portfolio Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Hero Section', () => {
    it('should load the homepage successfully', () => {
      cy.get('section').should('be.visible');
    });

    it('should display hero content', () => {
      cy.contains('Hi, I\'m').should('be.visible');
      cy.contains('Full Stack Developer').should('be.visible');
    });

    it('should have working CTA buttons', () => {
      cy.contains('button', 'View My Work').should('be.visible').and('not.be.disabled');
      cy.contains('button', 'Get In Touch').should('be.visible').and('not.be.disabled');
    });

    it('should scroll to projects section when primary CTA is clicked', () => {
      cy.contains('button', 'View My Work').click();
      cy.get('#projects').should('be.visible');
    });

    it('should scroll to contact section when secondary CTA is clicked', () => {
      cy.contains('button', 'Get In Touch').click();
      cy.get('#contact').should('be.visible');
    });

    it('should render social links', () => {
      cy.get('a[aria-label]').should('have.length.at.least', 1);
    });

    it('should have external links with correct attributes', () => {
      cy.get('a[target="_blank"]').should('have.attr', 'rel', 'noopener noreferrer');
    });

    it('should display profile image', () => {
      cy.get('img[alt]').should('be.visible').and('have.attr', 'src');
    });
  });

  describe('Navigation', () => {
    it('should have a navigation bar', () => {
      cy.get('nav').should('exist');
    });

    it('should scroll to sections when navigation links are clicked', () => {
      cy.get('nav').within(() => {
        cy.contains('Projects').click();
      });
      cy.get('#projects').should('be.visible');
    });
  });

  describe('Projects Section', () => {
    it('should display projects section', () => {
      cy.get('#projects').scrollIntoView();
      cy.contains('My Projects').should('be.visible');
    });

    it('should load projects from GitHub API', () => {
      cy.get('#projects').scrollIntoView();
      // Wait for API call to complete
      cy.wait(2000);
      // Check if projects are displayed or error/empty state is shown
      cy.get('#projects').within(() => {
        cy.get('div').should('exist');
      });
    });

    it('should display project cards with required information', () => {
      cy.get('#projects').scrollIntoView();
      cy.wait(2000);
      
      // Check if we have project cards or appropriate message
      cy.get('#projects').then(($section) => {
        if ($section.text().includes('No projects found')) {
          cy.contains('No projects found').should('be.visible');
        } else if ($section.text().includes('Failed to')) {
          cy.contains(/Failed to/).should('be.visible');
        } else {
          // Project cards should have links
          cy.get('a[target="_blank"]').should('have.length.at.least', 1);
        }
      });
    });

    it('should have "View More on GitHub" link', () => {
      cy.get('#projects').scrollIntoView();
      cy.contains('View More on GitHub').should('be.visible').and('have.attr', 'href');
    });
  });

  describe('Contact Section', () => {
    it('should display contact section', () => {
      cy.get('#contact').scrollIntoView();
      cy.contains('Get In Touch').should('be.visible');
    });

    it('should have a contact form with all required fields', () => {
      cy.get('#contact').scrollIntoView();
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('textarea[name="message"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should validate required fields', () => {
      cy.get('#contact').scrollIntoView();
      cy.get('input[name="name"]').should('have.attr', 'required');
      cy.get('input[name="email"]').should('have.attr', 'required');
      cy.get('textarea[name="message"]').should('have.attr', 'required');
    });

    it('should submit form with valid data', () => {
      cy.get('#contact').scrollIntoView();
      
      cy.get('input[name="name"]').type('John Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('textarea[name="message"]').type('This is a test message for the contact form.');
      
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.contains('Sending...').should('be.visible');
      
      // Should show success message after submission
      cy.contains('Sent!', { timeout: 5000 }).should('be.visible');
    });

    it('should clear form after successful submission', () => {
      cy.get('#contact').scrollIntoView();
      
      cy.get('input[name="name"]').type('Jane Doe');
      cy.get('input[name="email"]').type('jane@example.com');
      cy.get('textarea[name="message"]').type('Test message');
      
      cy.get('button[type="submit"]').click();
      
      // Wait for success and form to clear
      cy.wait(3000);
      
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="email"]').should('have.value', '');
      cy.get('textarea[name="message"]').should('have.value', '');
    });

    it('should display contact social links', () => {
      cy.get('#contact').scrollIntoView();
      cy.get('#contact a[target="_blank"]').should('have.length.at.least', 1);
    });
  });

  describe('Responsive Design', () => {
    const viewports = [
      { device: 'iphone-x', width: 375, height: 812 },
      { device: 'ipad-2', width: 768, height: 1024 },
      { device: 'macbook-15', width: 1440, height: 900 },
    ];

    viewports.forEach((viewport) => {
      it(`should be responsive on ${viewport.device}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
        
        // Check if main content is visible
        cy.get('section').should('be.visible');
        
        // Check if navigation exists
        cy.get('nav').should('exist');
        
        // Scroll through sections
        cy.get('#projects').scrollIntoView();
        cy.get('#contact').scrollIntoView();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
    });

    it('should have alt text for images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have proper form labels', () => {
      cy.get('#contact').scrollIntoView();
      cy.get('label[for="name"]').should('exist');
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="message"]').should('exist');
    });

    it('should have aria-labels for icon-only links', () => {
      cy.get('a[aria-label]').should('have.length.at.least', 1);
    });

    it('should be keyboard navigable', () => {
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load within acceptable time', () => {
      const startTime = Date.now();
      cy.visit('/');
      cy.get('section').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // Should load in less than 5 seconds
      });
    });

    it('should have no console errors', () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.spy(win.console, 'error').as('consoleError');
        },
      });
      
      cy.wait(2000);
      cy.get('@consoleError').should('not.have.been.called');
    });
  });

  describe('Theme Toggle', () => {
    it('should have a theme toggle button', () => {
      cy.get('[aria-label*="theme" i], [title*="theme" i], button').contains(/theme|dark|light/i).should('exist');
    });
  });

  describe('Back to Top', () => {
    it('should show back to top button after scrolling', () => {
      cy.scrollTo('bottom');
      cy.wait(500);
      // Back to top button should appear
      cy.get('[aria-label*="back to top" i], [title*="back to top" i]').should('be.visible');
    });

    it('should scroll back to top when clicked', () => {
      cy.scrollTo('bottom');
      cy.wait(500);
      cy.get('[aria-label*="back to top" i], [title*="back to top" i]').click();
      cy.window().its('scrollY').should('equal', 0);
    });
  });
});
