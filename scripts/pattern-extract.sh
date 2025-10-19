#!/bin/bash
# Pattern Extraction Automation
# Analyzes git history and workspace patterns for AI context enhancement

set -e

CACHE_DIR=".claude/cache"
PATTERNS_FILE=".claude/patterns.json"
STATE_FILE=".claude/state.md"

# Ensure required directories exist
mkdir -p "$CACHE_DIR"

function analyze_git_patterns() {
    echo "📊 Analyzing git commit patterns..."

    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Not in a git repository"
        return 1
    fi

    local commits_cache="$CACHE_DIR/commits-analysis.json"
    local since_date="${1:-30 days ago}"

    echo "🔍 Analyzing commits since: $since_date"

    # Get commit data
    local commit_data=$(git log --since="$since_date" --pretty=format:'{"hash":"%H","date":"%ai","author":"%an","message":"%s","files_changed":%d}' --shortstat | \
        grep -v "^$" | \
        paste -d',' - - 2>/dev/null || git log --since="$since_date" --pretty=format:'{"hash":"%H","date":"%ai","author":"%an","message":"%s"}')

    # Analyze patterns
    cat > "$commits_cache" << EOF
{
  "analysis_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "period": "$since_date",
  "commits": [
$(echo "$commit_data" | head -100 | sed 's/$/,/' | sed '$ s/,$//')
  ]
}
EOF

    # Extract patterns using git log
    echo "🔍 Extracting commit type patterns..."

    local types_analysis=$(git log --since="$since_date" --pretty=format:'%s' | \
        grep -oE '^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?' | \
        sort | uniq -c | sort -nr)

    local file_patterns=$(git log --since="$since_date" --name-only --pretty=format: | \
        grep -v '^$' | \
        grep -oE '\.[^.]+$' | \
        sort | uniq -c | sort -nr)

    local author_patterns=$(git log --since="$since_date" --pretty=format:'%an' | \
        sort | uniq -c | sort -nr)

    echo "📈 Commit type distribution:"
    echo "$types_analysis" | head -10
    echo ""
    echo "📁 File type distribution:"
    echo "$file_patterns" | head -10
    echo ""
    echo "👥 Author activity:"
    echo "$author_patterns" | head -5

    # Update patterns.json
    if command -v jq >/dev/null 2>&1; then
        local temp_file=$(mktemp)

        if [[ -f "$PATTERNS_FILE" ]]; then
            cp "$PATTERNS_FILE" "$temp_file"
        else
            echo '{"git_patterns": {}, "file_patterns": {}, "commit_patterns": []}' > "$temp_file"
        fi

        # Add git analysis
        jq --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
           --arg period "$since_date" \
           --argjson types "$(echo "$types_analysis" | head -10 | awk '{print "{\"type\":\"" $2 "\",\"count\":" $1 "}"}' | jq -s '.')" \
           --argjson files "$(echo "$file_patterns" | head -10 | awk '{print "{\"extension\":\"" $2 "\",\"count\":" $1 "}"}' | jq -s '.')" \
           '.git_patterns = {
               "last_analysis": $date,
               "period": $period,
               "commit_types": $types,
               "file_types": $files
           }' "$temp_file" > "$PATTERNS_FILE"

        rm "$temp_file"
        echo "✅ Updated git patterns in $PATTERNS_FILE"
    fi
}

function analyze_file_patterns() {
    echo "📁 Analyzing workspace file patterns..."

    local files_cache="$CACHE_DIR/file-patterns.json"

    # Get file statistics
    local total_files=$(find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.claude/cache/*' | wc -l | tr -d ' ')
    local file_types=$(find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.claude/cache/*' | \
        grep -oE '\.[^.]+$' | sort | uniq -c | sort -nr)
    local total_lines=$(find . -type f -not -path './.git/*' -not -path './node_modules/*' -not -path './.claude/cache/*' \
        -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.md" | \
        xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")

    echo "📊 Workspace statistics:"
    echo "  Total files: $total_files"
    echo "  Total lines of code: $total_lines"
    echo ""
    echo "📁 File type distribution:"
    echo "$file_types" | head -15

    # Language-specific analysis
    echo ""
    echo "🔍 Language-specific analysis:"

    # TypeScript/JavaScript
    local ts_files=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l | tr -d ' ')
    if [[ $ts_files -gt 0 ]]; then
        echo "  📜 TypeScript/JavaScript: $ts_files files"
        local ts_lines=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
        echo "    Lines of code: $ts_lines"

        # Check for common patterns
        if command -v grep >/dev/null 2>&1; then
            local exports=$(find . -name "*.ts" -o -name "*.js" | xargs grep -l "export" 2>/dev/null | wc -l | tr -d ' ')
            local imports=$(find . -name "*.ts" -o -name "*.js" | xargs grep -l "import" 2>/dev/null | wc -l | tr -d ' ')
            echo "    Files with exports: $exports"
            echo "    Files with imports: $imports"
        fi
    fi

    # Python
    local py_files=$(find . -name "*.py" | wc -l | tr -d ' ')
    if [[ $py_files -gt 0 ]]; then
        echo "  🐍 Python: $py_files files"
        local py_lines=$(find . -name "*.py" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
        echo "    Lines of code: $py_lines"

        if command -v grep >/dev/null 2>&1; then
            local classes=$(find . -name "*.py" | xargs grep -l "^class " 2>/dev/null | wc -l | tr -d ' ')
            local functions=$(find . -name "*.py" | xargs grep -l "^def " 2>/dev/null | wc -l | tr -d ' ')
            echo "    Files with classes: $classes"
            echo "    Files with functions: $functions"
        fi
    fi

    # Go
    local go_files=$(find . -name "*.go" | wc -l | tr -d ' ')
    if [[ $go_files -gt 0 ]]; then
        echo "  🔷 Go: $go_files files"
        local go_lines=$(find . -name "*.go" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
        echo "    Lines of code: $go_lines"

        if command -v grep >/dev/null 2>&1; then
            local packages=$(find . -name "*.go" | xargs grep "^package " 2>/dev/null | cut -d: -f2 | sort | uniq | wc -l | tr -d ' ')
            local structs=$(find . -name "*.go" | xargs grep -l "type.*struct" 2>/dev/null | wc -l | tr -d ' ')
            echo "    Unique packages: $packages"
            echo "    Files with structs: $structs"
        fi
    fi

    # Save to cache
    cat > "$files_cache" << EOF
{
  "analysis_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "total_files": $total_files,
  "total_lines": $total_lines,
  "languages": {
    "typescript": $ts_files,
    "python": $py_files,
    "go": $go_files
  }
}
EOF

    echo "✅ File analysis cached to $files_cache"
}

function analyze_dependency_patterns() {
    echo "📦 Analyzing dependency patterns..."

    local deps_cache="$CACHE_DIR/dependencies.json"
    local temp_deps=$(mktemp)

    echo '{"analysis_date": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'", "dependencies": {}}' > "$temp_deps"

    # TypeScript/JavaScript dependencies
    if [[ -f "package.json" ]]; then
        echo "📜 Analyzing npm dependencies..."
        if command -v jq >/dev/null 2>&1; then
            local npm_deps=$(jq -r '.dependencies // {} | keys[]' package.json 2>/dev/null | wc -l | tr -d ' ')
            local npm_dev_deps=$(jq -r '.devDependencies // {} | keys[]' package.json 2>/dev/null | wc -l | tr -d ' ')

            echo "  Production dependencies: $npm_deps"
            echo "  Development dependencies: $npm_dev_deps"

            jq --argjson npm_data '{"production": '"$npm_deps"', "development": '"$npm_dev_deps"'}' \
               '.dependencies.npm = $npm_data' "$temp_deps" > "$temp_deps.tmp"
            mv "$temp_deps.tmp" "$temp_deps"
        fi
    fi

    # Python dependencies
    if [[ -f "requirements.txt" ]] || [[ -f "pyproject.toml" ]] || [[ -f "Pipfile" ]]; then
        echo "🐍 Analyzing Python dependencies..."
        local py_deps=0

        if [[ -f "requirements.txt" ]]; then
            py_deps=$(grep -v '^#' requirements.txt | grep -v '^$' | wc -l | tr -d ' ')
        elif [[ -f "pyproject.toml" ]] && command -v grep >/dev/null 2>&1; then
            py_deps=$(grep -A 100 '^\[tool\.poetry\.dependencies\]' pyproject.toml | grep '^[a-zA-Z]' | wc -l | tr -d ' ')
        fi

        echo "  Python packages: $py_deps"

        if command -v jq >/dev/null 2>&1; then
            jq --argjson py_data '{"packages": '"$py_deps"'}' \
               '.dependencies.python = $py_data' "$temp_deps" > "$temp_deps.tmp"
            mv "$temp_deps.tmp" "$temp_deps"
        fi
    fi

    # Go dependencies
    if [[ -f "go.mod" ]]; then
        echo "🔷 Analyzing Go dependencies..."
        local go_deps=$(grep -c '^[[:space:]]*[^[:space:]].*v[0-9]' go.mod 2>/dev/null || echo "0")

        echo "  Go modules: $go_deps"

        if command -v jq >/dev/null 2>&1; then
            jq --argjson go_data '{"modules": '"$go_deps"'}' \
               '.dependencies.go = $go_data' "$temp_deps" > "$temp_deps.tmp"
            mv "$temp_deps.tmp" "$temp_deps"
        fi
    fi

    mv "$temp_deps" "$deps_cache"
    echo "✅ Dependency analysis cached to $deps_cache"
}

function update_state_summary() {
    echo "📝 Updating workspace state summary..."

    if [[ ! -f "$STATE_FILE" ]]; then
        cat > "$STATE_FILE" << 'EOF'
# Multi-Agent Workspace State

This file tracks the current state and patterns of the workspace for AI context.

## Last Analysis
EOF
    fi

    # Add current analysis to state
    cat >> "$STATE_FILE" << EOF

## Pattern Analysis $(date '+%Y-%m-%d %H:%M')

### Git Patterns
$(git log --since="7 days ago" --pretty=format:'- %s' --oneline | head -10 2>/dev/null || echo "- No recent commits")

### File Statistics
- Total files: $(find . -type f -not -path './.git/*' -not -path './node_modules/*' | wc -l | tr -d ' ')
- TypeScript/JS: $(find . -name "*.ts" -o -name "*.js" | wc -l | tr -d ' ') files
- Python: $(find . -name "*.py" | wc -l | tr -d ' ') files
- Go: $(find . -name "*.go" | wc -l | tr -d ' ') files

### Cache Status
$(ls -la .claude/cache/ 2>/dev/null | tail -n +2 | awk '{print "- " $9 ": " $5 " bytes"}' || echo "- No cache files")

EOF

    # Keep only last 50 entries
    if command -v tail >/dev/null 2>&1; then
        tail -200 "$STATE_FILE" > "$STATE_FILE.tmp"
        mv "$STATE_FILE.tmp" "$STATE_FILE"
    fi

    echo "✅ Updated state summary in $STATE_FILE"
}

function full_analysis() {
    echo "🚀 Running comprehensive workspace pattern analysis..."
    echo "===================================================="

    analyze_git_patterns "$1"
    echo ""
    analyze_file_patterns
    echo ""
    analyze_dependency_patterns
    echo ""
    update_state_summary

    echo ""
    echo "✅ Pattern analysis complete!"
    echo ""
    echo "Generated files:"
    echo "  📊 $PATTERNS_FILE - Extracted patterns (JSON)"
    echo "  📝 $STATE_FILE - Workspace state summary"
    echo "  📁 $CACHE_DIR/ - Analysis cache files"
    echo ""
    echo "To view patterns: jq . $PATTERNS_FILE"
    echo "To view state: cat $STATE_FILE"
}

# Main command handling
case "${1:-full}" in
    "git")
        analyze_git_patterns "${2:-30 days ago}"
        ;;
    "files")
        analyze_file_patterns
        ;;
    "deps")
        analyze_dependency_patterns
        ;;
    "state")
        update_state_summary
        ;;
    "full")
        full_analysis "${2:-30 days ago}"
        ;;
    *)
        echo "🔍 Pattern Extraction Automation"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  git [period]    Analyze git commit patterns (default: 30 days ago)"
        echo "  files           Analyze workspace file patterns"
        echo "  deps            Analyze dependency patterns"
        echo "  state           Update workspace state summary"
        echo "  full [period]   Run complete analysis (default)"
        echo ""
        echo "Examples:"
        echo "  $0 git '7 days ago'"
        echo "  $0 full '1 month ago'"
        echo "  $0 files"
        echo ""
        echo "Output:"
        echo "  📊 .claude/patterns.json - Machine-readable patterns"
        echo "  📝 .claude/state.md - Human-readable state"
        echo "  📁 .claude/cache/ - Analysis cache files"
        ;;
esac
