#!/bin/bash
# Architecture Linting Setup for TypeScript, Go, and Python
# Usage: ./scripts/setup-arch-linting.sh

set -e

echo "🏗️  Architecture Linting Setup"
echo "============================="

# TypeScript Architecture Linting
if [[ -f "package.json" ]]; then
    echo "📦 Setting up TypeScript architecture linting..."

    # Install dependencies
    npm install -D eslint-plugin-boundaries @typescript-eslint/parser @typescript-eslint/eslint-plugin

    # Create boundaries config
    cat > .eslintrc.boundaries.js << 'EOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['boundaries', '@typescript-eslint'],
  extends: [
    '@typescript-eslint/recommended'
  ],
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            from: 'components',
            allow: ['utils', 'types', 'hooks']
          },
          {
            from: 'pages',
            allow: ['components', 'utils', 'types', 'hooks', 'services']
          },
          {
            from: 'services',
            allow: ['utils', 'types']
          },
          {
            from: 'utils',
            allow: ['types']
          }
        ]
      }
    ],
    'boundaries/entry-point': 'error',
    'boundaries/external': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            from: 'components',
            allow: ['react', 'react-dom']
          },
          {
            from: 'services',
            allow: ['axios', 'node:*']
          }
        ]
      }
    ]
  },
  settings: {
    'boundaries/elements': [
      {
        type: 'components',
        pattern: 'src/components/**/*'
      },
      {
        type: 'pages',
        pattern: 'src/pages/**/*'
      },
      {
        type: 'services',
        pattern: 'src/services/**/*'
      },
      {
        type: 'utils',
        pattern: 'src/utils/**/*'
      },
      {
        type: 'types',
        pattern: 'src/types/**/*'
      },
      {
        type: 'hooks',
        pattern: 'src/hooks/**/*'
      }
    ]
  }
};
EOF

    # Add npm script
    if command -v jq &> /dev/null; then
        jq '.scripts["lint:boundaries"] = "eslint --config .eslintrc.boundaries.js src/"' package.json > package.json.tmp && mv package.json.tmp package.json
    else
        echo "💡 Add this to package.json scripts: \"lint:boundaries\": \"eslint --config .eslintrc.boundaries.js src/\""
    fi

    echo "✅ TypeScript architecture linting configured"
fi

# Python Architecture Linting (using import-linter)
if [[ -f "requirements.txt" ]] || [[ -f "pyproject.toml" ]] || [[ -f "setup.py" ]]; then
    echo ""
    echo "🐍 Setting up Python architecture linting..."

    # Install import-linter
    pip install import-linter

    # Create configuration
    cat > .importlinter << 'EOF'
[importlinter]
root_package = src

[[importlinter.contracts]]
name = "Layered architecture"
type = "layers"
layers = [
    "src.presentation",
    "src.application",
    "src.domain",
    "src.infrastructure"
]

[[importlinter.contracts]]
name = "No direct database access from presentation"
type = "forbidden"
source_modules = ["src.presentation"]
forbidden_modules = ["src.infrastructure.database"]

[[importlinter.contracts]]
name = "Domain independence"
type = "independence"
modules = ["src.domain"]
EOF

    # Create lint script
    cat > scripts/lint-python-arch.sh << 'EOF'
#!/bin/bash
echo "🐍 Running Python architecture linting..."
lint-imports --config .importlinter
EOF
    chmod +x scripts/lint-python-arch.sh

    echo "✅ Python architecture linting configured"
fi

# Go Architecture Linting (using go-cleanarch)
if [[ -f "go.mod" ]]; then
    echo ""
    echo "🔷 Setting up Go architecture linting..."

    # Install go-cleanarch
    go install github.com/roblaszczak/go-cleanarch@latest

    # Create configuration
    cat > .go-cleanarch.yml << 'EOF'
layers:
  - name: "domain"
    packages:
      - "pkg/domain/**"
  - name: "application"
    packages:
      - "pkg/application/**"
    depends_on:
      - "domain"
  - name: "infrastructure"
    packages:
      - "pkg/infrastructure/**"
    depends_on:
      - "domain"
      - "application"
  - name: "interfaces"
    packages:
      - "pkg/interfaces/**"
    depends_on:
      - "domain"
      - "application"
      - "infrastructure"

ignore:
  - "**/*_test.go"
  - "vendor/**"
EOF

    # Create lint script
    cat > scripts/lint-go-arch.sh << 'EOF'
#!/bin/bash
echo "🔷 Running Go architecture linting..."
go-cleanarch -config .go-cleanarch.yml
EOF
    chmod +x scripts/lint-go-arch.sh

    echo "✅ Go architecture linting configured"
fi

echo ""
echo "🎯 Architecture linting setup complete!"
echo "Run linting with:"
echo "  TypeScript: npm run lint:boundaries"
echo "  Python:     ./scripts/lint-python-arch.sh"
echo "  Go:         ./scripts/lint-go-arch.sh"
