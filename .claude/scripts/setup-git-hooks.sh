#!/bin/bash
# Git Hooks Setup for Multi-Agent Workspace
# Integrates dead code detection and architecture linting into git workflow

set -e

HOOKS_DIR=".git/hooks"
WORKSPACE_ROOT="$(pwd)"

function setup_pre_commit() {
    local hook_file="$HOOKS_DIR/pre-commit"

    echo "🔧 Setting up pre-commit hook..."

    # Create hooks directory if it doesn't exist
    mkdir -p "$HOOKS_DIR"

    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Multi-Agent Workspace Pre-Commit Hook
# Runs dead code detection and architecture linting

set -e

echo "🔍 Running pre-commit checks..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Get the workspace root (where .git is)
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
cd "$WORKSPACE_ROOT"

# Track if any checks failed
CHECKS_FAILED=0

# Run dead code detection if script exists
if [[ -x "scripts/dead-code-check.sh" ]]; then
    echo "⚰️  Checking for dead code..."
    if ! ./scripts/dead-code-check.sh --cache --quiet; then
        echo "❌ Dead code detected! Run './scripts/dead-code-check.sh' to see details"
        CHECKS_FAILED=1
    else
        echo "✅ No dead code found"
    fi
else
    echo "⚠️  Dead code check script not found (scripts/dead-code-check.sh)"
fi

# Check staged files for common issues
echo "📁 Checking staged files..."

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [[ -n "$STAGED_FILES" ]]; then
    # Check for merge conflict markers
    if echo "$STAGED_FILES" | xargs grep -l "^<<<<<<< \|^======= \|^>>>>>>> " 2>/dev/null; then
        echo "❌ Merge conflict markers found in staged files!"
        CHECKS_FAILED=1
    fi

    # Check for TODO/FIXME in staged changes
    TODO_COUNT=$(echo "$STAGED_FILES" | xargs grep -n "TODO\|FIXME\|XXX\|HACK" 2>/dev/null | wc -l)
    if [[ $TODO_COUNT -gt 0 ]]; then
        echo "⚠️  Found $TODO_COUNT TODO/FIXME markers in staged files"
        echo "Consider addressing these before committing:"
        echo "$STAGED_FILES" | xargs grep -n "TODO\|FIXME\|XXX\|HACK" 2>/dev/null | head -5
    fi

    # Check for console.log/print statements in staged changes
    DEBUG_COUNT=$(echo "$STAGED_FILES" | xargs grep -n "console\.log\|print(\|debugger\|pdb\.set_trace" 2>/dev/null | wc -l)
    if [[ $DEBUG_COUNT -gt 0 ]]; then
        echo "⚠️  Found $DEBUG_COUNT debug statements in staged files"
        echo "Consider removing debug code before committing:"
        echo "$STAGED_FILES" | xargs grep -n "console\.log\|print(\|debugger\|pdb\.set_trace" 2>/dev/null | head -3
    fi

    # Language-specific checks
    TS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(ts|tsx|js|jsx)$' || true)
    if [[ -n "$TS_FILES" && -f "package.json" ]]; then
        echo "🔧 Running TypeScript/JavaScript checks..."

        # Run ESLint if available
        if command -v npx >/dev/null 2>&1 && npx eslint --version >/dev/null 2>&1; then
            if ! echo "$TS_FILES" | xargs npx eslint --quiet; then
                echo "❌ ESLint errors found!"
                CHECKS_FAILED=1
            fi
        fi

        # Run Prettier check if available
        if command -v npx >/dev/null 2>&1 && npx prettier --version >/dev/null 2>&1; then
            if ! echo "$TS_FILES" | xargs npx prettier --check; then
                echo "❌ Code formatting issues found! Run 'npx prettier --write <files>'"
                CHECKS_FAILED=1
            fi
        fi
    fi

    PY_FILES=$(echo "$STAGED_FILES" | grep -E '\.py$' || true)
    if [[ -n "$PY_FILES" ]]; then
        echo "🐍 Running Python checks..."

        # Run black formatting check if available
        if command -v black >/dev/null 2>&1; then
            if ! echo "$PY_FILES" | xargs black --check --quiet; then
                echo "❌ Python formatting issues found! Run 'black <files>'"
                CHECKS_FAILED=1
            fi
        fi

        # Run flake8 if available
        if command -v flake8 >/dev/null 2>&1; then
            if ! echo "$PY_FILES" | xargs flake8; then
                echo "❌ Python linting errors found!"
                CHECKS_FAILED=1
            fi
        fi
    fi

    GO_FILES=$(echo "$STAGED_FILES" | grep -E '\.go$' || true)
    if [[ -n "$GO_FILES" ]]; then
        echo "🔷 Running Go checks..."

        # Run go fmt check
        if command -v go >/dev/null 2>&1; then
            UNFORMATTED=$(echo "$GO_FILES" | xargs gofmt -l)
            if [[ -n "$UNFORMATTED" ]]; then
                echo "❌ Go formatting issues found! Run 'gofmt -w <files>'"
                echo "$UNFORMATTED"
                CHECKS_FAILED=1
            fi

            # Run go vet
            if ! go vet ./...; then
                echo "❌ Go vet errors found!"
                CHECKS_FAILED=1
            fi
        fi
    fi
else
    echo "ℹ️  No staged files to check"
fi

# Update state tracking
if [[ -f ".claude/state.md" ]]; then
    echo "📝 Updating state tracking..."
    echo "" >> ".claude/state.md"
    echo "## Commit $(date '+%Y-%m-%d %H:%M')" >> ".claude/state.md"
    echo "- Pre-commit checks: $([ $CHECKS_FAILED -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")" >> ".claude/state.md"
    echo "- Staged files: $(echo "$STAGED_FILES" | wc -l | tr -d ' ')" >> ".claude/state.md"
    if [[ -n "$TS_FILES" ]]; then
        echo "- TypeScript files: $(echo "$TS_FILES" | wc -l | tr -d ' ')" >> ".claude/state.md"
    fi
    if [[ -n "$PY_FILES" ]]; then
        echo "- Python files: $(echo "$PY_FILES" | wc -l | tr -d ' ')" >> ".claude/state.md"
    fi
    if [[ -n "$GO_FILES" ]]; then
        echo "- Go files: $(echo "$GO_FILES" | wc -l | tr -d ' ')" >> ".claude/state.md"
    fi
fi

# Final result
if [[ $CHECKS_FAILED -eq 0 ]]; then
    echo "✅ All pre-commit checks passed!"
    exit 0
else
    echo "❌ Pre-commit checks failed! Fix the issues above before committing."
    echo "To bypass these checks (not recommended), use: git commit --no-verify"
    exit 1
fi
EOF

    chmod +x "$hook_file"
    echo "✅ Pre-commit hook installed at $hook_file"
}

function setup_post_commit() {
    local hook_file="$HOOKS_DIR/post-commit"

    echo "🔧 Setting up post-commit hook..."

    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Multi-Agent Workspace Post-Commit Hook
# Updates patterns and state after successful commits

set -e

# Get the workspace root
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
cd "$WORKSPACE_ROOT"

echo "📝 Post-commit processing..."

# Get commit info
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B "$COMMIT_HASH")
CHANGED_FILES=$(git diff-tree --no-commit-id --name-only -r "$COMMIT_HASH")

# Update patterns.json if it exists
if [[ -f ".claude/patterns.json" ]]; then
    echo "🔍 Analyzing commit patterns..."

    # Extract file types
    FILE_TYPES=$(echo "$CHANGED_FILES" | grep -o '\.[^.]*$' | sort | uniq -c | sort -nr)

    # Extract commit type from message (conventional commits)
    COMMIT_TYPE="other"
    if echo "$COMMIT_MESSAGE" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: "; then
        COMMIT_TYPE=$(echo "$COMMIT_MESSAGE" | sed -E 's/^([^:(]+)(\(.+\))?: .*/\1/')
    fi

    # Update patterns using jq if available
    if command -v jq >/dev/null 2>&1; then
        # Create temporary pattern data
        TEMP_PATTERN=$(mktemp)
        cat > "$TEMP_PATTERN" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commit": "$COMMIT_HASH",
  "type": "$COMMIT_TYPE",
  "files_changed": $(echo "$CHANGED_FILES" | wc -l | tr -d ' '),
  "message_length": $(echo "$COMMIT_MESSAGE" | wc -c | tr -d ' ')
}
EOF

        # Append to patterns array
        jq --argjson new_pattern "$(cat "$TEMP_PATTERN")" '.commit_patterns += [$new_pattern] | .commit_patterns |= .[-50:]' ".claude/patterns.json" > ".claude/patterns.json.tmp"
        mv ".claude/patterns.json.tmp" ".claude/patterns.json"
        rm "$TEMP_PATTERN"

        echo "✅ Updated commit patterns"
    fi
fi

# Update state.md
if [[ -f ".claude/state.md" ]]; then
    echo "📊 Updating workspace state..."

    # Add commit summary
    echo "" >> ".claude/state.md"
    echo "## Commit $COMMIT_HASH ($(date '+%Y-%m-%d %H:%M'))" >> ".claude/state.md"
    echo "- Type: $COMMIT_TYPE" >> ".claude/state.md"
    echo "- Files changed: $(echo "$CHANGED_FILES" | wc -l | tr -d ' ')" >> ".claude/state.md"
    echo "- Message: $(echo "$COMMIT_MESSAGE" | head -1)" >> ".claude/state.md"

    # Keep only last 20 commit entries
    if command -v tail >/dev/null 2>&1; then
        tail -100 ".claude/state.md" > ".claude/state.md.tmp"
        mv ".claude/state.md.tmp" ".claude/state.md"
    fi

    echo "✅ Updated workspace state"
fi

# Cache invalidation for changed files
if [[ -d ".claude/cache" ]]; then
    echo "🗑️  Invalidating relevant caches..."

    # Clear dead code cache if code files changed
    if echo "$CHANGED_FILES" | grep -qE '\.(ts|tsx|js|jsx|py|go)$'; then
        rm -f ".claude/cache/dead-code-*"
        echo "✅ Cleared dead code cache"
    fi

    # Clear architecture cache if config files changed
    if echo "$CHANGED_FILES" | grep -qE '\.(json|yaml|yml|toml)$'; then
        rm -f ".claude/cache/arch-*"
        echo "✅ Cleared architecture cache"
    fi
fi

echo "✅ Post-commit processing complete"
EOF

    chmod +x "$hook_file"
    echo "✅ Post-commit hook installed at $hook_file"
}

function setup_commit_msg() {
    local hook_file="$HOOKS_DIR/commit-msg"

    echo "🔧 Setting up commit-msg hook..."

    cat > "$hook_file" << 'EOF'
#!/bin/bash
# Multi-Agent Workspace Commit Message Hook
# Validates and enhances commit messages

set -e

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Skip if this is a merge commit
if [[ "$COMMIT_MSG" =~ ^Merge\ (branch|pull\ request) ]]; then
    exit 0
fi

# Skip if this is a revert commit
if [[ "$COMMIT_MSG" =~ ^Revert ]]; then
    exit 0
fi

# Validate commit message format (conventional commits)
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: .{1,50}"; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "Expected format: <type>[optional scope]: <description>"
    echo ""
    echo "Types:"
    echo "  feat:     A new feature"
    echo "  fix:      A bug fix"
    echo "  docs:     Documentation changes"
    echo "  style:    Code style changes (formatting, etc.)"
    echo "  refactor: Code refactoring"
    echo "  perf:     Performance improvements"
    echo "  test:     Adding or updating tests"
    echo "  chore:    Maintenance tasks"
    echo "  build:    Build system changes"
    echo "  ci:       CI/CD changes"
    echo ""
    echo "Examples:"
    echo "  feat: add user authentication"
    echo "  fix(api): handle null response"
    echo "  docs: update installation guide"
    echo ""
    echo "Your message:"
    echo "  $COMMIT_MSG"
    exit 1
fi

# Check message length
if [[ ${#COMMIT_MSG} -gt 72 ]]; then
    echo "⚠️  Commit message is quite long (${#COMMIT_MSG} chars). Consider shortening to 50-72 characters."
fi

# Enhance commit message with file context
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)
if [[ -n "$STAGED_FILES" ]]; then
    FILE_COUNT=$(echo "$STAGED_FILES" | wc -l | tr -d ' ')

    # Get file extensions
    EXTENSIONS=$(echo "$STAGED_FILES" | grep -o '\.[^.]*$' | sort | uniq | tr '\n' ' ' | sed 's/ $//')

    # Add metadata comment
    echo "" >> "$COMMIT_MSG_FILE"
    echo "# Files: $FILE_COUNT ($EXTENSIONS)" >> "$COMMIT_MSG_FILE"
    echo "# Changed:" >> "$COMMIT_MSG_FILE"
    echo "$STAGED_FILES" | head -10 | sed 's/^/#   /' >> "$COMMIT_MSG_FILE"

    if [[ $FILE_COUNT -gt 10 ]]; then
        echo "#   ... and $((FILE_COUNT - 10)) more files" >> "$COMMIT_MSG_FILE"
    fi
fi

exit 0
EOF

    chmod +x "$hook_file"
    echo "✅ Commit-msg hook installed at $hook_file"
}

function install_all_hooks() {
    echo "🚀 Installing all git hooks for multi-agent workspace..."

    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Not in a git repository. Initialize git first:"
        echo "   git init"
        exit 1
    fi

    setup_pre_commit
    setup_post_commit
    setup_commit_msg

    echo ""
    echo "✅ All git hooks installed successfully!"
    echo ""
    echo "The following hooks are now active:"
    echo "  📋 pre-commit:  Dead code detection, linting, formatting checks"
    echo "  📝 commit-msg:  Conventional commit format validation"
    echo "  📊 post-commit: Pattern tracking and state updates"
    echo ""
    echo "To test the setup:"
    echo "  1. Stage some files: git add ."
    echo "  2. Try committing: git commit -m 'test: verify hook setup'"
    echo ""
    echo "To bypass hooks (not recommended): git commit --no-verify"
}

function uninstall_hooks() {
    echo "🗑️  Removing multi-agent workspace git hooks..."

    for hook in "pre-commit" "post-commit" "commit-msg"; do
        local hook_file="$HOOKS_DIR/$hook"
        if [[ -f "$hook_file" ]]; then
            rm "$hook_file"
            echo "✅ Removed $hook hook"
        fi
    done

    echo "✅ All hooks removed"
}

function show_status() {
    echo "📊 Git Hooks Status"
    echo "=================="

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Not in a git repository"
        exit 1
    fi

    for hook in "pre-commit" "post-commit" "commit-msg"; do
        local hook_file="$HOOKS_DIR/$hook"
        if [[ -f "$hook_file" && -x "$hook_file" ]]; then
            echo "✅ $hook (executable)"
        elif [[ -f "$hook_file" ]]; then
            echo "⚠️  $hook (not executable)"
        else
            echo "❌ $hook (not installed)"
        fi
    done
}

# Main command handling
case "${1:-install}" in
    "install")
        install_all_hooks
        ;;
    "uninstall")
        uninstall_hooks
        ;;
    "status")
        show_status
        ;;
    "pre-commit")
        setup_pre_commit
        ;;
    "post-commit")
        setup_post_commit
        ;;
    "commit-msg")
        setup_commit_msg
        ;;
    *)
        echo "🔗 Git Hooks Setup for Multi-Agent Workspace"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  install     Install all git hooks (default)"
        echo "  uninstall   Remove all git hooks"
        echo "  status      Show installation status"
        echo "  pre-commit  Install only pre-commit hook"
        echo "  post-commit Install only post-commit hook"
        echo "  commit-msg  Install only commit-msg hook"
        echo ""
        echo "Features:"
        echo "  📋 Pre-commit: Dead code detection, linting, formatting"
        echo "  📝 Commit-msg: Conventional commit validation"
        echo "  📊 Post-commit: Pattern tracking and state updates"
        ;;
esac
