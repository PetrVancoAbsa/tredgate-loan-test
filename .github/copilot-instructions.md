# Copilot Instructions for Tredgate Loan

This repository contains a simple loan application management demo app built with Vue 3, TypeScript, and Vite.

## Project Context

Tredgate Loan is a frontend-only demo application used for training on GitHub Copilot features. There is no backend server or external database - all data is stored in localStorage.

## Coding Guidelines

### General Principles

- **KISS**: Keep it simple. Avoid over-engineering or introducing unnecessary complexity.
- **Small, focused changes**: Make atomic commits with clear, descriptive messages.
- **Readable code**: Prioritize clarity over cleverness.

### Technical Standards

- Use TypeScript types and interfaces for all domain objects.
- Keep functions small and focused on a single responsibility.
- Follow existing patterns in the codebase when making changes.

### Testing

- Always add or update tests when business logic changes.
- Tests should be easy to read and focused on behavior, not implementation.
- Use Vitest for unit testing.

### Architecture Constraints

- No external backend or database connections.
- All data persistence uses localStorage.
- Keep state management simple (Vue refs and reactivity).
- No heavy state management libraries (no Vuex, Pinia unless absolutely necessary).

### UI/Styling

- Use plain CSS, no CSS frameworks.
- Keep styles simple and consistent.
- Use scoped styles in Vue components.

## File Structure

- `src/types/` - TypeScript type definitions
- `src/services/` - Business logic (pure functions)
- `src/components/` - Vue components
- `tests/` - Unit tests

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint
