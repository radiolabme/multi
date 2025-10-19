#!/bin/bash
# MCP Registry Cache Manager
# Usage: ./scripts/mcp-cache.sh [update|search|list]

set -e

CACHE_DIR=".claude/cache"
MCP_CACHE="$CACHE_DIR/mcp-servers.json"
MCP_REGISTRY_URL="https://registry.mcp.dev/api/servers"

# Ensure cache directory exists
mkdir -p "$CACHE_DIR"

function update_cache() {
    echo "📡 Updating MCP registry cache..."

    # Try to fetch from registry
    if curl -s --fail "$MCP_REGISTRY_URL" > "$MCP_CACHE.tmp" 2>/dev/null; then
        mv "$MCP_CACHE.tmp" "$MCP_CACHE"
        echo "✅ MCP registry cache updated ($(jq length "$MCP_CACHE" 2>/dev/null || echo "unknown") servers)"
    else
        echo "⚠️  Failed to fetch from registry, creating mock cache..."
        # Create a minimal cache with common MCP servers
        cat > "$MCP_CACHE" << 'EOF'
[
  {
    "name": "filesystem",
    "description": "File system operations and monitoring",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["files", "filesystem"]
  },
  {
    "name": "git",
    "description": "Git repository operations and history",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["git", "version-control"]
  },
  {
    "name": "github",
    "description": "GitHub API integration for repositories and issues",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["github", "api", "issues"]
  },
  {
    "name": "postgres",
    "description": "PostgreSQL database connectivity and queries",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["database", "postgres", "sql"]
  },
  {
    "name": "brave-search",
    "description": "Web search using Brave Search API",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["search", "web", "api"]
  },
  {
    "name": "sqlite",
    "description": "SQLite database operations and queries",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["database", "sqlite", "sql"]
  },
  {
    "name": "memory",
    "description": "Persistent memory and knowledge graphs",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["memory", "knowledge", "persistence"]
  },
  {
    "name": "everything",
    "description": "Windows Everything search integration",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["search", "windows", "files"]
  },
  {
    "name": "puppeteer",
    "description": "Browser automation and web scraping",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["browser", "automation", "scraping"]
  },
  {
    "name": "fetch",
    "description": "HTTP requests and web content fetching",
    "repository": "https://github.com/modelcontextprotocol/servers",
    "language": "TypeScript",
    "tags": ["http", "fetch", "web"]
  }
]
EOF
        echo "✅ Mock MCP registry cache created (10 common servers)"
    fi

    echo "Cache location: $MCP_CACHE"
    echo "Last updated: $(date)" > "$CACHE_DIR/mcp-last-update.txt"
}

function search_servers() {
    local query="$1"

    if [[ ! -f "$MCP_CACHE" ]]; then
        echo "❌ Cache not found. Run: $0 update"
        exit 1
    fi

    if [[ -z "$query" ]]; then
        echo "Usage: $0 search <query>"
        exit 1
    fi

    echo "🔍 Searching MCP servers for: $query"
    echo "======================================="

    # Search in name, description, and tags
    jq -r --arg query "$query" '
        .[] |
        select(
            (.name | ascii_downcase | contains($query | ascii_downcase)) or
            (.description | ascii_downcase | contains($query | ascii_downcase)) or
            (.tags[]? | ascii_downcase | contains($query | ascii_downcase))
        ) |
        "📦 \(.name)\n   \(.description)\n   Language: \(.language // "Unknown")\n   Tags: \(.tags // [] | join(", "))\n   Repo: \(.repository // "Unknown")\n"
    ' "$MCP_CACHE" 2>/dev/null || echo "❌ Failed to search cache"
}

function list_servers() {
    if [[ ! -f "$MCP_CACHE" ]]; then
        echo "❌ Cache not found. Run: $0 update"
        exit 1
    fi

    echo "📋 Available MCP Servers"
    echo "========================"

    jq -r '.[] | "📦 \(.name) - \(.description)"' "$MCP_CACHE" 2>/dev/null || echo "❌ Failed to read cache"

    echo ""
    echo "Total servers: $(jq length "$MCP_CACHE" 2>/dev/null || echo "unknown")"
    echo "Last updated: $(cat "$CACHE_DIR/mcp-last-update.txt" 2>/dev/null || echo "unknown")"
}

function show_stats() {
    if [[ ! -f "$MCP_CACHE" ]]; then
        echo "❌ Cache not found. Run: $0 update"
        exit 1
    fi

    echo "📊 MCP Registry Statistics"
    echo "=========================="

    echo "Total servers: $(jq length "$MCP_CACHE")"
    echo ""

    echo "Languages:"
    jq -r '.[] | .language // "Unknown"' "$MCP_CACHE" | sort | uniq -c | sort -nr | head -10
    echo ""

    echo "Popular tags:"
    jq -r '.[] | .tags[]? // empty' "$MCP_CACHE" | sort | uniq -c | sort -nr | head -10
}

# Main command handling
case "${1:-list}" in
    "update")
        update_cache
        ;;
    "search")
        search_servers "$2"
        ;;
    "list")
        list_servers
        ;;
    "stats")
        show_stats
        ;;
    *)
        echo "🔧 MCP Registry Cache Manager"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  update          Update the MCP server registry cache"
        echo "  search <query>  Search for MCP servers"
        echo "  list            List all cached MCP servers"
        echo "  stats           Show registry statistics"
        echo ""
        echo "Examples:"
        echo "  $0 update"
        echo "  $0 search database"
        echo "  $0 search git"
        echo "  $0 list"
        ;;
esac
