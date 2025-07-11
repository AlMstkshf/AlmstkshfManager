describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset any previous state
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should allow a user to register', () => {
    cy.visit('/register');
    
    // Fill out the registration form
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type(`test-user-${Date.now()}@example.com`);
    cy.get('input[name="password"]').type('Test@123456');
    cy.get('input[name="confirmPassword"]').type('Test@123456');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard or login page
    cy.url().should('include', '/dashboard');
  });

  it('should show validation errors for invalid registration', () => {
    cy.visit('/register');
    
    // Submit without filling the form
    cy.get('button[type="submit"]').click();
    
    // Check for validation errors
    cy.contains('required').should('be.visible');
    
    // Fill with invalid data
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="password"]').type('weak');
    cy.get('button[type="submit"]').click();
    
    // Check for specific validation errors
    cy.contains('valid email').should('be.visible');
    cy.contains('password policy').should('be.visible');
  });

  it('should allow a user to login', () => {
    // Assuming we have a test user
    const testEmail = 'test@example.com';
    const testPassword = 'Test@123456';
    
    cy.visit('/login');
    
    // Fill out the login form
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type(testPassword);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify redirect to dashboard
    cy.url().should('include', '/dashboard');
    
    // Verify user is logged in
    cy.contains('Dashboard').should('be.visible');
  });

  it('should show error for invalid login credentials', () => {
    cy.visit('/login');
    
    // Fill out the login form with invalid credentials
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('WrongPassword@123');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.contains('Invalid email or password').should('be.visible');
    
    // Verify we're still on the login page
    cy.url().should('include', '/login');
  });

  it('should allow a user to request password reset', () => {
    cy.visit('/request-password-reset');
    
    // Fill out the form
    cy.get('input[name="email"]').type('test@example.com');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('reset link').should('be.visible');
  });

  it('should allow a user to logout', () => {
    // Login first
    cy.login('test@example.com', 'Test@123456');
    
    // Verify we're logged in
    cy.url().should('include', '/dashboard');
    
    // Click logout button (adjust selector based on your UI)
    cy.get('[data-testid="logout-button"]').click();
    
    // Verify redirect to login page
    cy.url().should('include', '/login');
  });
});