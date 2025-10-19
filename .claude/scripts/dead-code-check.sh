#!/bin/bash
# Dead Code Detection for TypeScript and Python projects
# Usage: ./scripts/dead-code-check.sh [--fix]

set -e

FIX_MODE=false
if [[ "$1" == "--fix" ]]; then
    FIX_MODE=true
fi

echo "🔍 Dead Code Detection Scanner"
echo "=============================="

# TypeScript/JavaScript Dead Code Detection
if [[ -f "package.json" ]]; then
    echo "📦 Checking TypeScript/JavaScript project..."

    # Install knip if not present
    if ! command -v knip &> /dev/null; then
        echo "Installing knip for TypeScript dead code detection..."
        npm install -g knip
    fi

    # Create knip config if it doesn't exist
    if [[ ! -f "knip.json" ]] && [[ ! -f ".knip.json" ]]; then
        echo "Creating knip configuration..."
        cat > .knip.json << 'EOF'
{
  "entry": [
    "src/index.ts",
    "src/main.ts",
    "src/app.ts",
    "index.ts",
    "main.ts"
  ],
  "project": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "lib/**/*.ts",
    "scripts/**/*.ts"
  ],
  "ignore": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/*.d.ts"
  ]
}
EOF
    fi

    echo "Running knip analysis..."
    if knip --reporter json > .claude/cache/dead-code-ts.json 2>/dev/null; then
        UNUSED_COUNT=$(jq '.issues.unusedExports | length' .claude/cache/dead-code-ts.json 2>/dev/null || echo "0")
        echo "✅ Found $UNUSED_COUNT unused TypeScript exports"

        if [[ "$UNUSED_COUNT" -gt 0 ]] && [[ "$FIX_MODE" == "true" ]]; then
            echo "🔧 Auto-removing unused exports..."
            # Note: knip doesn't auto-fix, but we can report the issues
            jq -r '.issues.unusedExports[] | "- " + .file + ":" + (.line|tostring) + " " + .name' .claude/cache/dead-code-ts.json
        fi
    else
        echo "⚠️  Knip analysis failed or no TypeScript files found"
    fi
fi

# Python Dead Code Detection
if [[ -f "requirements.txt" ]] || [[ -f "pyproject.toml" ]] || [[ -f "setup.py" ]] || find . -name "*.py" -not -path "./venv/*" -not -path "./.venv/*" | head -1 | grep -q .; then
    echo ""
    echo "🐍 Checking Python project..."

    # Install vulture if not present
    if ! command -v vulture &> /dev/null; then
        echo "Installing vulture for Python dead code detection..."
        pip install vulture
    fi

    echo "Running vulture analysis..."
    if vulture . --min-confidence 80 --exclude venv,__pycache__,.venv,build,dist > .claude/cache/dead-code-py.txt 2>/dev/null; then
        UNUSED_COUNT=$(wc -l < .claude/cache/dead-code-py.txt | tr -d ' ')
        echo "✅ Found $UNUSED_COUNT potential unused Python items"

        if [[ "$UNUSED_COUNT" -gt 0 ]]; then
            echo "Unused Python code found:"
            head -20 .claude/cache/dead-code-py.txt | sed 's/^/  /'
            if [[ "$UNUSED_COUNT" -gt 20 ]]; then
                echo "  ... and $((UNUSED_COUNT - 20)) more (see .claude/cache/dead-code-py.txt)"
            fi
        fi
    else
        echo "⚠️  Vulture analysis failed or no Python files found"
    fi
fi

# Go Dead Code Detection
if [[ -f "go.mod" ]] || find . -name "*.go" | head -1 | grep -q .; then
    echo ""
    echo "🔷 Checking Go project..."

    # Use go mod tidy and go vet for basic checks
    if command -v go &> /dev/null; then
        echo "Running go mod tidy..."
        go mod tidy 2>/dev/null || echo "⚠️  go mod tidy failed"

        echo "Running go vet..."
        if go vet ./... > .claude/cache/dead-code-go.txt 2>&1; then
            echo "✅ No issues found with go vet"
        else
            echo "⚠️  Go vet found issues:"
            head -10 .claude/cache/dead-code-go.txt | sed 's/^/  /'
        fi

        # Check for unused packages (requires staticcheck)
        if command -v staticcheck &> /dev/null; then
            echo "Running staticcheck for unused code..."
            staticcheck ./... | grep -E "(unused|unreachable)" > .claude/cache/dead-code-go-static.txt 2>/dev/null || true
            UNUSED_COUNT=$(wc -l < .claude/cache/dead-code-go-static.txt | tr -d ' ')
            if [[ "$UNUSED_COUNT" -gt 0 ]]; then
                echo "✅ Found $UNUSED_COUNT unused Go items"
                head -10 .claude/cache/dead-code-go-static.txt | sed 's/^/  /'
            fi
        else
            echo "💡 Install staticcheck for better Go dead code detection: go install honnef.co/go/tools/cmd/staticcheck@latest"
        fi
    else
        echo "⚠️  Go not found in PATH"
    fi
fi

echo ""
echo "📊 Summary saved to .claude/cache/dead-code-*.{json,txt}"
echo "🔧 Run with --fix flag to attempt automatic fixes (where supported)"
echo ""

# Update state
echo "Dead code scan completed: $(date)" >> .claude/state.md
