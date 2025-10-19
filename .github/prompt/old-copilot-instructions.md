# GitHub Copilot Workspace Instructions

This workspace template enhances GitHub Copilot capabilities with automation tools and consistent development patterns.

## Engineering Protocol

### Complexity Classification

-   **Fast path** (Δlines < 10, Δfiles ≤ 1, solution clear): Search → Match → Apply → Verify
-   **Full protocol** (complex changes): Read state → Analyze → Plan → Implement → Verify

### Core Loop

1. **Perspective scale**: Minimum perspectives revealing necessary boundaries
2. **Assumption audit**: Identify assumptions, hidden constraints, mutable state
3. **Search before build**: Check codebase, patterns, existing solutions
4. **Context compression**: Reduce to minimal invariants, update `.claude/state.md`
5. **Boundary verification**: Validate types, layers, async patterns, goals alignment
6. **Type safety**: Make invalid states unrepresentable at boundaries

### Meta-Operations

-   **Offload**: Repetitive tasks → scripts, MCP servers, CI/CD
-   **Automate**: Patterns → declarative tools, webhooks
-   **Remove**: Unused code, files, frameworks, dependencies (aggressive cleanup)

### Anti-Patterns to Avoid

-   Reinventing existing solutions
-   Logic loops and circular dependencies
-   Unvalidated assumptions
-   Dead code retention
-   Over-analysis of simple tasks
-   Under-analysis of complex tasks

### State Persistence

-   `.claude/state.md`: Decisions, patterns, invariants, technical debt
-   `.claude/goals.md`: Objectives, constraints, success criteria
-   Update trigger: Architectural changes beyond threshold

## Core Principles

### Code Quality Standards

-   Write clean, maintainable, and well-documented code
-   Follow language-specific best practices and idioms
-   Prioritize readability over cleverness
-   Use meaningful variable and function names
-   Add comments for complex logic, not obvious code

### Architecture & Design

-   Follow SOLID principles for object-oriented code
-   Use composition over inheritance where appropriate
-   Keep functions small and focused (single responsibility)
-   Prefer explicit over implicit behavior
-   Design for testability

### Error Handling

-   Always handle errors gracefully
-   Provide meaningful error messages
-   Use appropriate error types/classes
-   Never swallow exceptions without logging
-   Validate inputs at boundaries

### Testing

-   Write unit tests for business logic
-   Include integration tests for critical paths
-   Aim for high test coverage on core functionality
-   Use descriptive test names that explain the scenario
-   Follow AAA pattern: Arrange, Act, Assert

### Documentation

-   Document public APIs and interfaces
-   Keep README files up to date
-   Include usage examples for complex features
-   Document dependencies and setup requirements
-   Maintain a CHANGELOG for version history

### Security

-   Never commit secrets or credentials
-   Sanitize user inputs
-   Use parameterized queries for databases
-   Follow principle of least privilege
-   Keep dependencies updated

### Performance

-   Optimize for clarity first, performance second
-   Profile before optimizing
-   Consider time and space complexity
-   Use appropriate data structures
-   Cache expensive computations when beneficial

## Workspace Automation Tools

This workspace includes automated quality checks and pattern extraction:

### Available Scripts (in `scripts/`)

-   **dead-code-check.sh** - Detect unused code (TypeScript/knip, Python/vulture, Go/staticcheck)
-   **setup-arch-linting.sh** - Enforce architecture boundaries (layer violations, forbidden imports)
-   **mcp-cache.sh** - Cache Model Context Protocol server registry for offline discovery
-   **setup-git-hooks.sh** - Install pre-commit validation (dead code, linting, formatting)
-   **pattern-extract.sh** - Analyze git patterns and workspace structure for AI context

### VS Code Tasks

Access automation via Command Palette → "Tasks: Run Task":

-   🚀 Full Workspace Setup - Complete initialization
-   🔍 Check Dead Code - Scan for unused code
-   📊 Workspace Status - Show automation status
-   🧪 Run All Tests - Execute tests for all languages

### Git Hooks

After running `./scripts/setup-git-hooks.sh install`:

-   **Pre-commit**: Validates code quality, checks for dead code, runs linters
-   **Commit-msg**: Enforces conventional commit format (feat:, fix:, docs:, etc.)
-   **Post-commit**: Updates pattern tracking in `.claude/state.md`

## Language-Specific Guidelines

### Python

-   Follow PEP 8 style guide
-   Use type hints for function signatures
-   Prefer f-strings for formatting
-   Use list comprehensions for simple transformations
-   Leverage context managers (`with` statements)

### TypeScript

-   Use modern ES6+ features
-   Prefer `const` over `let`, avoid `var`
-   Use async/await over raw promises
-   Leverage TypeScript for type safety
-   Follow functional programming patterns where appropriate
-   Use interfaces for object shapes
-   Leverage destructuring and spread operators

### Go

-   Follow effective Go guidelines
-   Use gofmt for formatting
-   Handle errors explicitly, never ignore them
-   Use defer for cleanup
-   Prefer struct composition over embedding
-   Write table-driven tests

### Bash

-   Use `set -e` for error handling
-   Quote variables to prevent word splitting
-   Use `[[ ]]` over `[ ]` for conditionals
-   Provide usage/help messages
-   Use functions for reusable logic
-   Add comments for complex operations

### Java

-   Follow Java naming conventions
-   Use streams API for collections
-   Prefer immutability
-   Use Optional for nullable values
-   Follow standard project structure (Maven/Gradle)

### C#

-   Follow Microsoft naming conventions
-   Use LINQ for collection operations
-   Leverage async/await properly
-   Use nullable reference types
-   Follow .NET standard patterns

## Best Practices

### SOLID Principles

1. **Single Responsibility**: Each class/function does one thing
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable for base types
4. **Interface Segregation**: Many specific interfaces > one general interface
5. **Dependency Inversion**: Depend on abstractions, not concretions

### Design Patterns

-   **Use**: Factory, Strategy, Observer, Decorator, Repository
-   **Avoid**: God objects, circular dependencies, deep inheritance hierarchies

### File Organization

```
src/
├── core/      # Core business logic
├── api/       # API/interface layer
├── utils/     # Utility functions
└── models/    # Data models
tests/         # Test files (mirror src structure)
docs/          # Documentation
config/        # Configuration files
scripts/       # Build/deployment scripts
```

### Naming Conventions

-   Files: `snake_case.py`, `kebab-case.ts`, `PascalCase.java`
-   Classes: `PascalCase`
-   Functions/Methods: `snake_case` (Python), `camelCase` (JS/TS/Java)
-   Constants: `UPPER_CASE`
-   Private members: `_leading_underscore` (Python), private fields (JS/TS)

## Git & Version Control

-   Write clear, descriptive commit messages (follow conventional commits)
-   Keep commits atomic (one logical change)
-   Create feature branches for new work
-   Write meaningful PR descriptions
-   Review your own code before requesting review
-   Use meaningful branch names (feature/, bugfix/, hotfix/)
-   Run tests before committing
-   Format code with project's formatter
-   Check for linting errors
-   Update documentation with code changes

## Workflow Preferences

-   Organize code by feature/domain, not by type
-   Keep related files close together
-   Separate concerns (business logic, UI, data access)
-   Use clear folder naming conventions
-   Maintain consistent file naming patterns

### State Management

-   Check `.claude/state.md` for workspace patterns and decisions
-   Check `.claude/goals.md` for project objectives
-   Pattern history tracked in `.claude/patterns.json`
-   Cache directory: `.claude/cache/` for analysis results

## Communication Style

-   Be concise but complete in explanations
-   Use markdown formatting for clarity
-   Provide code examples when helpful
-   Link to relevant documentation
-   Ask clarifying questions when needed
