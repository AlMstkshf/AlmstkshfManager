describe('Project Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'Test@123456');
    
    // Navigate to projects page
    cy.visit('/dashboard');
  });

  it('should allow creating a new project', () => {
    // Click on create project button
    cy.contains('button', 'New Project').click();
    
    // Fill out the project form
    const projectName = `Test Project ${Date.now()}`;
    cy.get('input[name="name"]').type(projectName);
    cy.get('textarea[name="description"]').type('This is a test project created by Cypress');
    cy.get('input[name="startDate"]').type('2023-01-01');
    cy.get('input[name="endDate"]').type('2023-12-31');
    cy.get('input[name="budget"]').type('10000');
    
    // Select a color (adjust based on your UI)
    cy.get('[data-testid="color-picker"] button').first().click();
    
    // Submit the form
    cy.contains('button', 'Create Project').click();
    
    // Verify project was created
    cy.contains(projectName).should('be.visible');
  });

  it('should display project details', () => {
    // Click on an existing project
    cy.get('[data-testid="project-item"]').first().click();
    
    // Verify project details are displayed
    cy.url().should('include', '/project/');
    cy.get('[data-testid="project-name"]').should('be.visible');
    cy.get('[data-testid="project-description"]').should('be.visible');
    cy.get('[data-testid="project-dates"]').should('be.visible');
  });

  it('should allow editing a project', () => {
    // Click on an existing project
    cy.get('[data-testid="project-item"]').first().click();
    
    // Click edit button
    cy.get('[data-testid="edit-project-button"]').click();
    
    // Update project details
    const updatedName = `Updated Project ${Date.now()}`;
    cy.get('input[name="name"]').clear().type(updatedName);
    cy.get('input[name="budget"]').clear().type('15000');
    
    // Submit the form
    cy.contains('button', 'Update Project').click();
    
    // Verify project was updated
    cy.get('[data-testid="project-name"]').should('contain', updatedName);
    cy.get('[data-testid="project-budget"]').should('contain', '15000');
  });

  it('should allow archiving a project', () => {
    // Click on an existing project
    cy.get('[data-testid="project-item"]').first().click();
    
    // Click archive button
    cy.get('[data-testid="archive-project-button"]').click();
    
    // Confirm archive action
    cy.get('[data-testid="confirm-archive-button"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Verify project is not in the active list
    cy.get('[data-testid="active-projects-list"]')
      .should('not.contain', cy.get('[data-testid="project-item"]').first().text());
  });

  it('should display project timeline', () => {
    // Click on an existing project
    cy.get('[data-testid="project-item"]').first().click();
    
    // Navigate to timeline view
    cy.get('[data-testid="timeline-tab"]').click();
    
    // Verify timeline is displayed
    cy.get('[data-testid="project-timeline"]').should('be.visible');
    cy.get('[data-testid="timeline-task"]').should('exist');
  });

  it('should filter projects by search term', () => {
    // Get the text of the first project
    cy.get('[data-testid="project-item"]').first().invoke('text').then((projectText) => {
      // Type part of the project name in the search box
      cy.get('[data-testid="project-search"]').type(projectText.substring(0, 5));
      
      // Verify the project is still visible
      cy.get('[data-testid="project-item"]').should('contain', projectText);
      
      // Clear the search and type a non-matching term
      cy.get('[data-testid="project-search"]').clear().type('NonExistentProject12345');
      
      // Verify no projects are shown
      cy.get('[data-testid="project-item"]').should('not.exist');
      cy.contains('No projects found').should('be.visible');
    });
  });
});