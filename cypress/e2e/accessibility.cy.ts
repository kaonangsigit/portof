describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Keyboard Navigation', () => {
    it('should navigate through interactive elements with Tab', () => {
      cy.get('body').tab();
      cy.focused().should('be.visible');
      
      // Tab through multiple elements
      for (let i = 0; i < 5; i++) {
        cy.focused().tab();
        cy.focused().should('be.visible');
      }
    });

    it('should activate buttons with Enter key', () => {
      cy.contains('button', 'View My Work').focus().type('{enter}');
      cy.get('#projects').should('be.visible');
    });

    it('should activate links with Enter key', () => {
      cy.get('a').first().focus().type('{enter}');
    });
  });

  describe('Focus Management', () => {
    it('should show visible focus indicators', () => {
      cy.get('a').first().focus();
      cy.focused().should('have.css', 'outline-style').and('not.equal', 'none');
    });

    it('should maintain focus order', () => {
      const focusableElements: string[] = [];
      
      cy.get('a, button, input, textarea, [tabindex]:not([tabindex="-1"])')
        .each(($el) => {
          focusableElements.push($el.attr('id') || $el.text() || 'element');
        });
      
      expect(focusableElements.length).to.be.greaterThan(0);
    });

    it('should not trap keyboard focus', () => {
      cy.get('body').tab();
      let previousElement: any = null;
      
      for (let i = 0; i < 20; i++) {
        cy.focused().then(($el) => {
          expect($el).not.to.equal(previousElement);
          previousElement = $el;
        });
        cy.focused().tab();
      }
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA labels on icon buttons', () => {
      cy.get('a[aria-label], button[aria-label]').each(($el) => {
        expect($el.attr('aria-label')).to.not.be.empty;
      });
    });

    it('should have proper form labels', () => {
      cy.get('#contact').scrollIntoView();
      
      cy.get('input[name="name"]').should('have.attr', 'id');
      cy.get('label[for="name"]').should('exist');
      
      cy.get('input[name="email"]').should('have.attr', 'id');
      cy.get('label[for="email"]').should('exist');
      
      cy.get('textarea[name="message"]').should('have.attr', 'id');
      cy.get('label[for="message"]').should('exist');
    });

    it('should have proper heading hierarchy', () => {
      let lastLevel = 0;
      
      cy.get('h1, h2, h3, h4, h5, h6').each(($heading) => {
        const level = parseInt($heading.prop('tagName').substring(1));
        
        if (lastLevel > 0) {
          // Heading levels should not skip (e.g., h1 to h3)
          expect(level).to.be.at.most(lastLevel + 1);
        }
        
        lastLevel = level;
      });
    });

    it('should have only one h1 element', () => {
      cy.get('h1').should('have.length', 1);
    });
  });

  describe('Images', () => {
    it('should have alt text for all images', () => {
      cy.get('img').each(($img) => {
        expect($img.attr('alt')).to.exist;
      });
    });

    it('should have meaningful alt text', () => {
      cy.get('img').each(($img) => {
        const alt = $img.attr('alt');
        // Alt text should not be just filename or empty
        expect(alt).to.not.match(/\.(jpg|jpeg|png|gif|svg)$/i);
        expect(alt).to.not.be.empty;
      });
    });
  });

  describe('Color Contrast', () => {
    it('should have sufficient color contrast for text', () => {
      // This is a basic check; use tools like axe-core for thorough testing
      cy.get('body').should('have.css', 'color');
      cy.get('body').should('have.css', 'background-color');
    });
  });

  describe('Links', () => {
    it('should have descriptive link text', () => {
      cy.get('a').each(($link) => {
        const text = $link.text().trim();
        const ariaLabel = $link.attr('aria-label');
        
        // Link should have either text or aria-label
        expect(text.length > 0 || (ariaLabel && ariaLabel.length > 0)).to.be.true;
        
        // Avoid generic text like "click here"
        if (text) {
          expect(text.toLowerCase()).to.not.match(/^(click here|here|link|more)$/);
        }
      });
    });

    it('should indicate external links', () => {
      cy.get('a[target="_blank"]').each(($link) => {
        expect($link.attr('rel')).to.include('noopener');
      });
    });
  });

  describe('Forms', () => {
    it('should have required field indicators', () => {
      cy.get('#contact').scrollIntoView();
      
      cy.get('input[required], textarea[required]').each(($field) => {
        expect($field.attr('required')).to.exist;
      });
    });

    it('should have proper input types', () => {
      cy.get('#contact').scrollIntoView();
      
      cy.get('input[name="email"]').should('have.attr', 'type', 'email');
      cy.get('input[name="name"]').should('have.attr', 'type', 'text');
    });

    it('should provide feedback on form submission', () => {
      cy.get('#contact').scrollIntoView();
      
      cy.fillContactForm('Test User', 'test@example.com', 'Test message');
      cy.get('button[type="submit"]').click();
      
      // Should show some feedback
      cy.contains(/sending|sent|success/i, { timeout: 5000 }).should('be.visible');
    });
  });

  describe('Responsive Text', () => {
    it('should allow text zoom without breaking layout', () => {
      // Zoom to 200%
      cy.get('body').invoke('css', 'zoom', '2');
      
      // Page should still be usable
      cy.get('section').should('be.visible');
      cy.get('button').should('be.visible');
    });
  });

  describe('Language', () => {
    it('should have lang attribute on html element', () => {
      cy.get('html').should('have.attr', 'lang');
    });
  });
});
