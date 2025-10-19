# GitHub Copilot Workspace Instructions (Paraphrased from Enhanced EBNF)

**Version:** 2.0.0
**Format:** Human-readable narrative derived from formal grammar
**Source:** instructions.enhanced.ebnf

---

## Workspace Overview

This is the **GitHub Copilot Workspace** designed to enhance GitHub Copilot capabilities with automation tools and consistent development patterns.

---

## Engineering Protocol

### How to Classify Task Complexity

Every task should be evaluated based on:

-   **Lines changed** (Δlines)
-   **Files affected** (Δfiles)
-   **Unknowns in the solution**
-   **Perspectives needed to understand it**

**Choose your path:**

#### Fast Path (Simple Changes)

Use when: Changes affect **fewer than 10 lines**, modify **1 file or less**, and the solution is **clear**.

**Process:** Search → Match → Apply → Verify

-   **Time budget:** Maximum 30 seconds
-   **Example:** Fix a typo in a single function
-   **Tool calls:** Expect 1-3 tool invocations
-   **Complexity:** O(1) - constant time

#### Full Protocol (Complex Changes)

Use when: Changes affect **10+ lines**, modify **multiple files**, impact architecture, or have **more than 2 unknowns**.

**Process:** Read State → Analyze → Plan → Implement → Verify

-   **Time budget:** Maximum 300 seconds (5 minutes)
-   **Example:** Refactor multi-module architecture
-   **Tool calls:** Expect 5-20 tool invocations
-   **Complexity:** O(n) - scales with problem size

---

### Core Loop (Execute Up to 50 Iterations)

**Stop when:** Drift from goals is less than 5%

#### 1. Perspective Scale

**Goal:** Use the minimum number of perspectives that reveal all necessary boundaries.

-   **Algorithm:** Greedy set cover
-   **Target:** 100% coverage with minimal perspectives
-   **Example:** Use 3 perspectives (user + system + reference) instead of 5
-   **Enforcement:** Recommended

#### 2. Assumption Audit (MANDATORY)

**Goal:** Identify what you're assuming, what's hidden, and what might change.

**Checklist:**

-   What am I assuming about user intent?
-   What constraints aren't explicitly stated?
-   What state might change during execution?

**Examples:**

-   _Assumption:_ "User wants TypeScript (but might want JavaScript)"
-   _Hidden constraint:_ "Must maintain backward compatibility"
-   _Mutable state:_ "File contents may change during multi-step edit"

#### 3. Search Before Build (MANDATORY)

**Goal:** Check for existing solutions before creating new ones.

-   **Search order:** semantic_search → grep_search → list_code_usages
-   **Time limit:** Maximum 60 seconds
-   **Rationale:** Avoid reinventing existing solutions

#### 4. Context Compression (Recommended)

**Goal:** Reduce accumulated context to minimal invariants.

-   **Maximum context size:** 2,000 lines
-   **Target compression ratio:** 10-30% of original
-   **Algorithm:** Extract invariants, discard derivable facts
-   **Update trigger:** When compression ratio drops below 50%
-   **Output:** Update `.claude/state.md`

#### 5. Boundary Verification (MANDATORY)

**Goal:** Validate that all boundaries are properly defined.

**Checks (all cause errors if violated):**

-   **Type safety:** No 'any' types at public interfaces
-   **Layer isolation:** No business logic in UI components
-   **Async consistency:** All I/O operations are async
-   **Goals alignment:** Changes serve stated objectives

#### 6. Type Safety (MANDATORY)

**Goal:** Make invalid states unrepresentable at boundaries.

**Techniques:**

-   **Sum types:** Use discriminated unions
-   **Phantom types:** Encode state in type system
-   **Builder pattern:** Prevent incomplete construction

**Example:**

-   ❌ Before: `status: string // could be anything`
-   ✅ After: `status: 'draft' | 'published' | 'archived'`

---

### Meta-Operations (Recommended, Aggressive Mode)

#### Offload Repetitive Tasks

**Trigger:** When a task repeats more than 3 times

**Targets:** Scripts, MCP servers, CI/CD, webhooks

**Example:** Create a script instead of repeating manual steps

#### Automate Patterns

**Trigger:** When a pattern occurs 5+ times with 80%+ confidence

**Example:** Auto-format on save if format violations happen 5+ times

#### Remove Unused Artifacts (Aggressive Mode)

**Targets:** Dead code, unused imports, deprecated dependencies, empty files

**Safety:** Run tests after removal

**Enforcement:** Recommended

---

### Anti-Patterns (FORBIDDEN - Causes Errors)

These patterns are strictly prohibited:

-   **Reinventing solutions** (high time cost)
-   **Logic loops** (detected via cycle detection)
-   **Circular dependencies** (detected via static analysis)
-   **Unvalidated assumptions** (correctness risk)
-   **Dead code retention** (maintenance cost)
-   **Over-analysis of simple tasks** (time > 2× fast path budget)
-   **Under-analysis of complex tasks** (time < 0.5× full protocol budget)

---

### State Persistence (UTF-8 Markdown)

#### `.claude/state.json`

-   **Contains:** Decisions, patterns, invariants, technical debt
-   **Update frequency:** Per architectural change
-   **Maximum size:** 10,000 lines
-   **Mechanism:** use jq for JSON manipulation

#### `.claude/goals.json`

-   **Contains:** Objectives, constraints, success criteria
-   **Update frequency:** Per project phase
-   **Immutable:** No (can be updated)
-   **Mechanism:** use jq for JSON manipulation

#### `.claude/patterns.json`

-   **Contains:** Pattern history
-   **Format:** JSON
-   **Schema version:** 1.0

#### `.claude/cache/`

-   **Contains:** Analysis results
-   **TTL:** 24 hours
-   **Maximum size:** 100 MB

#### Update Trigger (Quantified)

Update state files when **architectural impact score > 7.0** (on a 0-10 scale).

**Impact scoring:**

-   Layer boundary change: **9**
-   API signature change: **8**
-   New dependency: **7**
-   Internal refactor: **3**
-   Documentation update: **1**

**Examples:**

-   ✅ Trigger update: "Changed from REST to GraphQL"
-   ❌ Don't update: "Renamed a variable"
-   ⚠️ Maybe update: "Refactored 3 modules"

---

### Conflict Resolution (MANDATORY)

#### Precedence Order (Highest to Lowest)

1. **Clarity** (Priority 10)
2. **Correctness** (Priority 9)
3. **Maintainability** (Priority 8)
4. **Security** (Priority 7)
5. **Verification** (Priority 6)
6. **Performance** (Priority 5)

**Example:** Security checks override performance optimizations

-   Use bcrypt (slow) over MD5 (fast) for passwords
-   Use precise algorithm even if complex
-   Prefer readable code over micro-optimizations
-   Do not optimize at the cost of correctness
-   Favor clear error messages over terse ones
-   Write maintainable code over clever tricks
-   Do not optimize to obscure intent or when code is not tested

#### Override Mechanism

When you need to break a rule:

**Syntax:** `@override(rule: <rule_name>, reason: <string>)`

**Requirements:**

-   Human approval required
-   Mandatory documentation
-   Required in PR review

**Examples:**

-   ✅ OK: `@override(rule: 'max_function_length', reason: 'Generated code from protocol buffer')`
-   ❌ Bad: `@override(rule: 'security_check', reason: 'too slow')`

---

## Code Quality Standards

### Maintainability (MANDATORY)

-   **Cyclomatic complexity:** Less than 10
-   **Function length:** Less than 50 lines
-   **Nesting depth:** Less than 4 levels
-   **Tools:** eslint, pylint, gocyclo

### Documentation (MANDATORY)

-   **Public APIs:** 100% documented
-   **README:** Must exist and be current
-   **CHANGELOG:** Must be maintained
-   **Format:** JSDoc, docstrings, GoDoc

### Readability Over Cleverness (MANDATORY)

-   Prefer explicit over clever code
-   Avoid code golf and obfuscation

**Example:**

-   ❌ Bad: `x=lambda y:y and y[0]or''`
-   ✅ Good: `def get_first_or_empty(items): return items[0] if items else ''`

---

## Architecture & Design

### SOLID Principles (Recommended)

#### 1. Single Responsibility (Recommended)

**Definition:** Each class/function does one thing

**Metric:** Reasons to change ≤ 1

**Example:**

-   ❌ Violation: `class UserManagerAndLogger { saveUser(); logMessage(); }`
-   ✅ Fix: Split into `UserManager` and `Logger`

#### 2. Open/Closed (Preferred)

**Definition:** Open for extension, closed for modification

**Patterns:** Strategy, Decorator, Plugin architecture

**Example:**

-   ❌ Violation: Modify existing class to add new behavior
-   ✅ Fix: Extend via interface implementation

#### 3. Liskov Substitution (MANDATORY)

**Definition:** Subtypes must be substitutable for base types

**Test:** If T extends S, then S's properties must hold for T

**Example:**

-   ❌ Violation: `Square extends Rectangle` (violates width=height invariant)
-   ✅ Fix: Use `Shape` interface instead

#### 4. Interface Segregation (Recommended)

**Definition:** Many specific interfaces > one general interface

**Metric:** Interface methods ≤ 5

**Example:**

-   ❌ Violation: `interface IWorker { work(); eat(); sleep(); manage(); }`
-   ✅ Fix: Split into `IWorker`, `IEater`, `ISleeper`, `IManager`

#### 5. Dependency Inversion (Recommended)

**Definition:** Depend on abstractions, not concretions

**Pattern:** Dependency injection

**Example:**

-   ❌ Violation: `class Service { db = new MySQLDatabase(); }`
-   ✅ Fix: `class Service { constructor(db: IDatabase) { this.db = db; } }`

### Composition Over Inheritance (PREFERRED)

**Rule:** Prefer composition over inheritance when it's NOT a genuine "is-a" relationship.

**Exception:** Inherit only for genuine is-a relationships

**Examples:**

-   ✅ Prefer: "Car has-a Engine" (composition)
-   ❌ Avoid: "Car is-a Engine" (inheritance)
-   ✅ OK: "SportsCar is-a Car" (inheritance)

---

## Error Handling (MANDATORY)

### Exception Handling Rules

-   Always handle errors gracefully ✅ MANDATORY
-   Provide meaningful error messages ✅ MANDATORY
-   Use appropriate error types/classes ✅ MANDATORY
-   Validate inputs at boundaries ✅ MANDATORY

### Exception Swallowing (CRITICAL RULE)

**Rule:** Never silently swallow exceptions

-   ❌ **FORBIDDEN:** Swallow without logging
-   ✅ **PERMITTED:** Swallow with logging
-   ✅ **BEST:** Catch specific exceptions and handle appropriately

**Examples:**

-   ❌ Forbidden: `try: risky() except: pass`
-   ✅ Permitted: `try: risky() except Exception as e: logger.error(f'Failed: {e}')`
-   ✅ Best: `try: risky() except SpecificError as e: handle(e)`

### Meaningful Error Messages

**Template:** `{what_failed}: {why_failed}. {how_to_fix}`

**Example:** "Database connection failed: timeout after 30s. Check network or increase timeout."

---

## Testing (MANDATORY)

### Test Requirements

-   **Unit tests:** Required for business logic
-   **Integration tests:** Required for critical paths
-   **Naming:** Descriptive names that explain the scenario
-   **Pattern:** AAA (Arrange, Act, Assert)

### Test Coverage (QUANTIFIED)

**Core functionality:** Minimum **80% coverage**
**All code:** Minimum **60% coverage**

**Tools:** jest, pytest, go test

**Exemptions:** Generated code, trivial getters

**Example:** Business logic requires 80% coverage, utilities need 60%

### Usage Examples

**Required when:** Public API count > 3

**Formats:** Code blocks, runnable examples, test cases

**Locations:** README, dedicated examples directory, inline docs

---

## Documentation (MANDATORY)

-   Document public APIs and interfaces ✅
-   Keep README files up to date ✅
-   Include usage examples for complex features ✅
-   Document dependencies and setup requirements ✅
-   Maintain a CHANGELOG for version history ✅

---

## Security (PRIORITY 10 - HIGHEST)

### Never Do (FORBIDDEN - Causes Errors)

-   ❌ Commit secrets or credentials
-   ❌ Trust unsanitized user inputs

**Detection:** Regex patterns + entropy analysis
**Pre-commit hook:** Required
**Tools:** gitleaks, trufflehog

### Always Do (MANDATORY)

-   ✅ Sanitize user inputs (HTML, SQL, shell, LDAP)
-   ✅ Use parameterized queries for databases
-   ✅ Follow principle of least privilege
-   ✅ Keep dependencies updated

**Libraries:** DOMPurify, parameterized queries, shlex
**Validation:** Whitelist > Blacklist

---

## Performance (Recommended)

### Priority

**Clarity first, performance second**

### Process

1. Profile before optimizing
2. Consider time and space complexity
3. Use appropriate data structures
4. Cache expensive computations **when beneficial**

### When to Cache (QUANTIFIED)

Cache when **ALL** of these conditions are met:

-   Computation cost > **100 milliseconds**
-   Result reusability > **50%**
-   Function is **NOT non-deterministic**

**Examples:**

-   ✅ Cache: "Fibonacci(n) called 1000 times"
-   ❌ Don't cache: "random() calls"
-   ⚠️ Maybe cache: "API call with 10% reuse rate"

---

## Workspace Automation Tools

### Available Scripts

#### `scripts/dead-code-check.sh`

-   **Purpose:** Detect unused code
-   **Languages:** TypeScript, Python, Go
-   **Tools:** knip, vulture, staticcheck
-   **Output:** JSON format
-   **Exit codes:** 0 (clean) or 1 (dead code found)

#### `scripts/setup-arch-linting.sh`

-   **Purpose:** Enforce architecture boundaries
-   **Rules:** Layer violations, forbidden imports
-   **Config:** `.arch-lint.json`

#### `scripts/mcp-cache.sh`

-   **Purpose:** Cache Model Context Protocol server registry
-   **Commands:** update, search, stats
-   **Cache location:** `.claude/cache/mcp-registry.json`
-   **TTL:** 7 days

#### `scripts/setup-git-hooks.sh`

-   **Purpose:** Install pre-commit validation
-   **Hooks:** pre-commit, commit-msg, post-commit

#### `scripts/pattern-extract.sh`

-   **Purpose:** Analyze git patterns and workspace structure
-   **Output:** `.claude/patterns.json`

### VS Code Tasks

Access via: Command Palette → "Tasks: Run Task"

1. **🚀 Full Workspace Setup** - Complete initialization (runs all other tasks)
2. **🔍 Check Dead Code** - Scan for unused code
3. **📊 Workspace Status** - Show automation status
4. **🧪 Run All Tests** - Execute tests for all languages

### Git Hooks

#### Pre-commit Hook

-   **Validations:** Code quality, dead code, linters
-   **Blocking:** Yes (commit will fail if checks don't pass)
-   **Timeout:** 60 seconds
-   **Example commands:** `npm run lint`, `black --check .`, `go fmt ./...`

#### Commit-msg Hook (MANDATORY)

-   **Enforcement:** Conventional commits format
-   **Format:** `<type>(<scope>): <subject>`
-   **Types:** feat, fix, docs, style, refactor, test, chore, perf, ci
-   **Max length:** 72 characters

**Examples:**

-   ✅ Valid: "feat(auth): add login", "fix(db): resolve connection leak"
-   ❌ Invalid: "Added feature", "fix: Fix bug", "FEAT: something"

#### Post-commit Hook

-   **Actions:** Update pattern tracking
-   **Blocking:** No (doesn't prevent commit)
-   **Output:** `.claude/patterns.json`

---

## Language-Specific Guidelines

### Python (Version 3.9+, MANDATORY)

**Standards:**

-   Follow PEP 8 style guide ✅
-   Use type hints for function signatures ✅
-   Prefer f-strings for formatting ✅
-   Use context managers (`with` statements) ✅

#### List Comprehensions (PREFERRED)

**Use for simple transformations only**

**"Simple" means:**

-   Conditions ≤ 2
-   Nesting level = 1
-   Line length < 80 characters

**Examples:**

-   ✅ Simple: `[x*2 for x in nums if x > 0]`
-   ❌ Complex (use loop): `[f(x) for x in items if x.validate() for y in x.children if y.active]`

### TypeScript (Version 4.5+, MANDATORY)

**Standards:**

-   Use modern ES6+ features ✅
-   Use `const` (default) or `let` (if reassignment needed) ✅
-   Use async/await for type safety ✅
-   Follow functional programming patterns ✅
-   Use interfaces for object shapes ✅
-   Leverage destructuring and spread operators ✅

#### Never Use `var` (FORBIDDEN - Causes Errors)

**Rationale:** Function-scoped `var` causes subtle bugs
**Replacement:** Use `const` (default) or `let` (if reassignment needed)

#### Prefer async/await Over Raw Promises (PREFERRED)

**Exception:** `Promise.all` for parallelism is acceptable

**Examples:**

-   ✅ Prefer: `const data = await fetch(url); const json = await data.json();`
-   ❌ Avoid: `fetch(url).then(r => r.json()).then(data => ...)`
-   ✅ OK: `await Promise.all([fetch(url1), fetch(url2)])`

### Go (Version 1.19+, MANDATORY)

**Standards:**

-   Follow effective Go guidelines ✅
-   Use `gofmt` for formatting ✅
-   Use `defer` for cleanup ✅
-   Prefer struct composition over embedding ✅
-   Write table-driven tests ✅

#### Handle Errors Explicitly (FORBIDDEN to Ignore)

**Never ignore errors**

**Examples:**

-   ❌ Forbidden: `result, _ := riskyFunc()`
-   ✅ Required: `result, err := riskyFunc(); if err != nil { return err }`

### Bash (Version 4.0+, Recommended)

#### Script Header (MANDATORY)

**Required:** `set -euo pipefail`

**Rationale:** Exit on error, undefined vars, pipe failures

**Other standards:**

-   Quote variables to prevent word splitting ✅
-   Use `[[ ]]` over `[ ]` for conditionals ✅
-   Provide usage/help messages ✅
-   Use functions for reusable logic ✅
-   Add comments for complex operations ✅

### Java (Version 11+, Recommended)

-   Follow Java naming conventions ✅
-   Use streams API for collections ✅
-   Prefer immutability ✅
-   Use Optional for nullable values ✅
-   Follow standard project structure (Maven/Gradle) ✅

### C# (.NET 6.0+, Recommended)

-   Follow Microsoft naming conventions ✅
-   Use LINQ for collection operations ✅
-   Leverage async/await properly ✅
-   Use nullable reference types ✅
-   Follow .NET standard patterns ✅

---

## Best Practices

### Design Patterns

#### Use These Patterns (Recommended)

-   Factory
-   Strategy
-   Observer
-   Decorator
-   Repository

**When:** Pattern solves a recurring design problem

#### Avoid These Patterns (FORBIDDEN)

**God Objects** (Detected via static analysis)

-   **Metric:** Methods > 20 OR Fields > 10
-   **Alternative:** Split into smaller, focused classes

**Deep Inheritance** (Discouraged)

-   **Metric:** Class hierarchy depth > 3
-   **Alternative:** Use composition

**Circular Dependencies** (FORBIDDEN)

-   **Detection:** Static analysis
-   **Alternative:** Restructure dependencies

---

## File Organization

### Directory Structure

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

### Organization Principles

-   **Colocation:** Keep related files close together
-   **Separation of concerns:** business_logic ⊥ UI ⊥ data_access
-   **Feature folders:** Group by feature, not by type

---

## Naming Conventions

### File Names

-   **Python:** `snake_case.py`
-   **TypeScript:** `kebab-case.ts`
-   **Java:** `PascalCase.java`
-   **Test files:** `{name}.test.{ext}` or `{name}.spec.{ext}`

### Identifiers

-   **Classes:** `PascalCase`
-   **Functions:**
    -   Python: `snake_case`
    -   TypeScript: `camelCase`
    -   Java: `camelCase`
-   **Constants:** `UPPER_SNAKE_CASE`
-   **Private members:**
    -   Python: `_leading_underscore`
    -   TypeScript: `private` keyword or `#privateField`
    -   Java: `private` modifier

### Semantic Rules

-   **Booleans:** Use prefixes like `is*`, `has*`, `should*`, `can*`
-   **Collections:** Use plural nouns
-   **Functions:** Use verb phrases
-   **Classes:** Use nouns

---

## Git & Version Control (MANDATORY)

### Commit Messages

-   Write clear, descriptive commit messages ✅
-   Follow conventional commits format ✅
-   Format: `<type>(<scope>): <subject>`

### Commits

-   Keep commits atomic (one logical change) ✅
-   **Metric:** Files changed < 10 OR conceptually related
-   **Test:** "Can you describe the commit in one sentence?"

### Branches

-   **Feature branches:** `feature/*`
-   **Bug fixes:** `bugfix/*`
-   **Hotfixes:** `hotfix/*`

### Pull Requests

-   Write meaningful PR descriptions ✅
-   **Minimum length:** 50 characters
-   **Template:**
    -   **What:** What does this PR change?
    -   **Why:** Why is this change needed?
    -   **How:** How does it work?
    -   **Testing:** How was it tested?

### Pre-commit Checklist

-   Run tests ✅
-   Format code with project's formatter ✅
-   Check for linting errors ✅
-   Update documentation with code changes ✅

---

## Workflow Preferences (Recommended)

-   Organize code by feature/domain, NOT by type ✅
-   Keep related files close together ✅
-   Separate concerns (business logic, UI, data access) ✅
-   Use clear folder naming conventions ✅
-   Maintain consistent file naming patterns ✅

### State Management

-   **Check `.claude/state.md`** for workspace patterns and decisions
-   **Check `.claude/goals.md`** for project objectives
-   **Pattern history** tracked in `.claude/patterns.json`
-   **Cache directory:** `.claude/cache/` for analysis results (TTL: 24 hours, max 100MB)

---

## Communication Style (Recommended)

### Style

-   Be **concise** but **complete** in explanations
-   Use **technical prose** (no fluff, no unnecessary emojis)
-   Word count ≤ necessary

### Format

-   Use **Markdown** formatting for clarity
    -   Use `##`, `###` for headings, not bold
    -   Always specify language in code blocks
    -   Use `-` for bullets, `1.` for ordered lists
    -   Use `*italic*` for emphasis, `**bold**` for strong

### Content

-   Provide **code examples** when helpful
-   Link to **relevant documentation**
-   Ask **clarifying questions** when needed
-   **State assumptions** explicitly

---

## Enforcement Levels Summary

| Level           | Priority | Action               | Violation |
| --------------- | -------- | -------------------- | --------- |
| **FORBIDDEN**   | 10       | Never allow          | Error     |
| **MANDATORY**   | 9        | Always enforce       | Error     |
| **RECOMMENDED** | 7        | Warn if violated     | Warning   |
| **PREFERRED**   | 5        | Hint if not followed | Info      |
| **OPTIONAL**    | 1        | No enforcement       | None      |

---

## Version History

### Version 2.0 (Current)

**Changes:**

-   Added quantitative thresholds
-   Defined predicate semantics
-   Added conflict resolution system
-   Included executable specifications
-   Added inline examples throughout
-   Resolved all ambiguities from v1.0

**Breaking Changes:**

-   Exception handling: Now permits logging before swallowing (was unclear)
-   Test coverage: Now requires 80% for core functionality (was undefined as "high")
-   Caching: "When beneficial" now quantified as computation > 100ms (was ambiguous)

### Version 1.0

**Changes:**

-   Initial release

---

**License:** MIT
**Author:** Workspace Engineering Team
**Parseable:** Yes
**Executable:** Yes
**Complete:** Yes
