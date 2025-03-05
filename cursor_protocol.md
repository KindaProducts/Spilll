# Spilll Development Protocol

## Purpose
This document outlines the protocols and guidelines for making changes to critical components of the Spilll application, particularly those related to user authentication, checkout processes, and payment flows.

## Critical Components

### 1. Authentication Flow
- `src/pages/CreateAccount.tsx`
- `src/api/create-account.js`
- `src/pages/Login.tsx`

### 2. Payment Processing
- `src/components/Pricing.tsx`
- Any files handling Lemon Squeezy integration

## Change Protocol

### 1. Documentation Requirement
Before making changes to any critical component, developers must:
- Document the proposed changes
- Explain the rationale behind the changes
- Identify potential impacts on other parts of the application

### 2. Checkout Process Guidelines
- **NO automatic redirects** should be added to Lemon Squeezy checkout URLs
- Each product must use its unique Lemon Squeezy checkout URL
- The manual redirect button after successful payment must be preserved
- The flow from checkout to account creation must remain user-initiated

### 3. Authentication Guidelines
- The `order_id` parameter should remain optional in the account creation process
- Users should be able to create accounts with or without an `order_id`
- No redirects should be forced on users who don't have an `order_id`

### 4. Review Process
All changes to critical components must be:
- Reviewed by at least one other team member
- Tested in a staging environment before deployment
- Verified against this protocol document

### 5. Environment Variables
- Changes to environment variables must be documented
- The `window.__env__` object in `public/index.html` must be updated consistently
- All environment-dependent URLs must be properly configured for each environment

## Deployment Checklist
Before deploying changes to production:
- Verify that checkout URLs are correctly configured
- Ensure authentication flows work with and without `order_id`
- Confirm that no unauthorized redirects have been added
- Test the complete user journey from payment to account creation

## Violation Handling
If unauthorized changes are discovered:
1. Immediately revert to the last known good state
2. Document the unauthorized changes and their impact
3. Review the deployment process to prevent similar issues 