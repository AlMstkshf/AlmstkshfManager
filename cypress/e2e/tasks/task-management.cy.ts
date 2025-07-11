describe('Task Management', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'Test@123456');
    
    // Navigate to a project detail page
    cy.visit('/dashboard');
    cy.get('[data-testid="project-item"]').first().click();
  });

  it('should allow creating a new task', () => {
    // Click on create task button
    cy.contains('button', 'New Task').click();
    
    // Fill out the task form
    const taskName = `Test Task ${Date.now()}`;
    cy.get('input[name="name"]').type(taskName);
    cy.get('textarea[name="description"]').type('This is a test task created by Cypress');
    
    // Select assignee
    cy.get('select[name="assigneeId"]').select(1); // Select the first user in the dropdown
    
    // Set due date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="dueDate"]').type(formattedDate);
    
    // Select priority
    cy.get('select[name="priority"]').select('High');
    
    // Submit the form
    cy.contains('button', 'Create Task').click();
    
    // Verify task was created
    cy.contains(taskName).should('be.visible');
  });

  it('should display task details', () => {
    // Click on an existing task
    cy.get('[data-testid="task-item"]').first().click();
    
    // Verify task details are displayed in a modal or detail view
    cy.get('[data-testid="task-detail-modal"]').should('be.visible');
    cy.get('[data-testid="task-name"]').should('be.visible');
    cy.get('[data-testid="task-description"]').should('be.visible');
    cy.get('[data-testid="task-assignee"]').should('be.visible');
    cy.get('[data-testid="task-due-date"]').should('be.visible');
    cy.get('[data-testid="task-priority"]').should('be.visible');
    cy.get('[data-testid="task-status"]').should('be.visible');
  });

  it('should allow editing a task', () => {
    // Click on an existing task
    cy.get('[data-testid="task-item"]').first().click();
    
    // Click edit button
    cy.get('[data-testid="edit-task-button"]').click();
    
    // Update task details
    const updatedName = `Updated Task ${Date.now()}`;
    cy.get('input[name="name"]').clear().type(updatedName);
    
    // Change status
    cy.get('select[name="status"]').select('In Progress');
    
    // Submit the form
    cy.contains('button', 'Update Task').click();
    
    // Verify task was updated
    cy.get('[data-testid="task-name"]').should('contain', updatedName);
    cy.get('[data-testid="task-status"]').should('contain', 'In Progress');
  });

  it('should allow changing task status via drag and drop', () => {
    // Get the first task in the To Do column
    cy.get('[data-testid="status-column-To Do"] [data-testid="task-item"]').first().as('todoTask');
    
    // Get the task name
    cy.get('@todoTask').invoke('text').then((taskText) => {
      // Drag to In Progress column
      cy.get('@todoTask').drag('[data-testid="status-column-In Progress"]');
      
      // Verify task is now in In Progress column
      cy.get('[data-testid="status-column-In Progress"]').should('contain', taskText);
    });
  });

  it('should allow adding comments to a task', () => {
    // Click on an existing task
    cy.get('[data-testid="task-item"]').first().click();
    
    // Add a comment
    const comment = `Test comment ${Date.now()}`;
    cy.get('textarea[name="comment"]').type(comment);
    cy.contains('button', 'Add Comment').click();
    
    // Verify comment was added
    cy.get('[data-testid="task-comments"]').should('contain', comment);
  });

  it('should filter tasks by assignee', () => {
    // Click on filter dropdown
    cy.get('[data-testid="task-filter-dropdown"]').click();
    
    // Select filter by assignee
    cy.contains('Filter by Assignee').click();
    
    // Select a specific assignee
    cy.get('[data-testid="assignee-filter-option"]').first().click();
    
    // Verify filtered tasks
    cy.get('[data-testid="task-item"]').each(($task) => {
      cy.wrap($task).find('[data-testid="task-assignee-name"]').invoke('text').then((assigneeName) => {
        // The assignee name should match the selected filter
        cy.get('[data-testid="current-filter"]').should('contain', assigneeName);
      });
    });
  });

  it('should filter tasks by priority', () => {
    // Click on filter dropdown
    cy.get('[data-testid="task-filter-dropdown"]').click();
    
    // Select filter by priority
    cy.contains('Filter by Priority').click();
    
    // Select High priority
    cy.contains('High').click();
    
    // Verify filtered tasks
    cy.get('[data-testid="task-item"]').each(($task) => {
      cy.wrap($task).find('[data-testid="task-priority-badge"]').should('contain', 'High');
    });
  });
});