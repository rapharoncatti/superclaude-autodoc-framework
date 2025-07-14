#!/bin/bash

# SuperClaude Enhanced - Universal Installation Script
# Works on Linux/WSL environments

set -e

echo "🚀 SuperClaude Enhanced Installation"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running in WSL
if grep -qEi "(Microsoft|WSL)" /proc/version &> /dev/null; then
    echo -e "${BLUE}📟 WSL environment detected${NC}"
    IS_WSL=true
else
    echo -e "${BLUE}🐧 Linux environment detected${NC}"
    IS_WSL=false
fi

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
echo -e "\n${BLUE}🔍 Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js not found. Please install Node.js 18+ first:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
else
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
fi

# Check Claude Code CLI
if ! command -v claude &> /dev/null; then
    print_error "Claude Code CLI not found. Please install first:"
    echo "  Visit: https://docs.anthropic.com/en/docs/claude-code"
    exit 1
else
    print_status "Claude Code CLI found"
fi

# Create installation directory
INSTALL_DIR="$HOME/.superclaude-enhanced"
echo -e "\n${BLUE}📁 Creating installation directory: $INSTALL_DIR${NC}"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Download/copy SuperClaude Enhanced files
echo -e "\n${BLUE}📥 Installing SuperClaude Enhanced files...${NC}"

# If running from cloned repository
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/src/enhanced-superclaude-complete.js" ]; then
    cp -r "$SCRIPT_DIR/src/"* "$INSTALL_DIR/"
    print_status "Files copied from repository src/ directory"
else
    print_error "Source files not found. Please run from the cloned repository directory."
    print_error "Expected location: $SCRIPT_DIR/src/"
    exit 1
fi

# Install NomenAK's SuperClaude Foundation
echo -e "\n${BLUE}🏗️ Installing SuperClaude Foundation (NomenAK)...${NC}"

# Check if already installed
if [ -d "$HOME/.claude/commands/sc" ]; then
    print_warning "SuperClaude foundation already installed"
else
    # Clone and install SuperClaude
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    git clone https://github.com/NomenAK/SuperClaude.git
    cd SuperClaude
    
    # Run SuperClaude installer
    python3 SuperClaude.py
    
    print_status "SuperClaude foundation installed"
    
    # Cleanup
    rm -rf "$TEMP_DIR"
    cd "$INSTALL_DIR"
fi

# Install MCP Servers
echo -e "\n${BLUE}🔌 Installing MCP servers...${NC}"

# 1. Context7 MCP
echo "Installing Context7 MCP..."
if claude mcp list | grep -q "context7"; then
    print_warning "Context7 MCP already installed"
else
    claude mcp add context7 -- npx -y @upstash/context7-mcp
    print_status "Context7 MCP installed"
fi

# 2. Sequential Thinking MCP
echo "Installing Sequential Thinking MCP..."
if claude mcp list | grep -q "sequential"; then
    print_warning "Sequential Thinking MCP already installed"
else
    # Install from npm (more reliable)
    if npm install -g @modelcontextprotocol/server-sequential-thinking 2>/dev/null; then
        claude mcp add sequential-thinking -- npx @modelcontextprotocol/server-sequential-thinking
        print_status "Sequential Thinking MCP installed"
    else
        print_warning "Sequential Thinking MCP installation failed - trying alternative"
        # Fallback to manual installation
        SEQUENTIAL_DIR="$HOME/.mcp-servers/sequential-thinking"
        mkdir -p "$SEQUENTIAL_DIR"
        cd "$SEQUENTIAL_DIR"
        
        if git clone https://github.com/jasonpaulso/sequential-thinking-claude-code.git . 2>/dev/null; then
            npm install && npm run build
            claude mcp add sequential-thinking -- node "$SEQUENTIAL_DIR/dist/index.js"
            print_status "Sequential Thinking MCP installed (manual)"
        else
            print_warning "Sequential Thinking MCP installation failed"
        fi
        cd "$INSTALL_DIR"
    fi
fi

# 3. Magic AI MCP (attempt)
echo "Installing Magic AI MCP..."
if claude mcp list | grep -q "magic"; then
    print_warning "Magic AI MCP already installed"
else
    # Try to install Magic MCP
    if claude mcp add magic -- npx @21st-dev/magic 2>/dev/null; then
        print_status "Magic AI MCP installed"
    else
        print_warning "Magic AI MCP installation failed (known issue)"
    fi
fi

# 4. Playwright MCP (attempt)
echo "Installing Playwright MCP..."
if claude mcp list | grep -q "playwright"; then
    print_warning "Playwright MCP already installed"
else
    # Try to install Playwright MCP
    if npm install -g @microsoft/playwright-mcp 2>/dev/null; then
        claude mcp add playwright -- npx @microsoft/playwright-mcp
        print_status "Playwright MCP installed"
    else
        print_warning "Playwright MCP installation failed (known issue)"
    fi
fi

# Create activation script
echo -e "\n${BLUE}⚡ Creating activation script...${NC}"

cat > "$INSTALL_DIR/activate.js" << 'EOF'
#!/usr/bin/env node

// SuperClaude Enhanced - Activation Script
const enhanced = require('./enhanced-superclaude-complete.js');

console.log('🚀 SuperClaude Enhanced - Active');
console.log('================================');

// Show system status
const health = enhanced.healthCheck();
console.log(`\n📊 System Health: ${health.overall}`);

Object.entries(health.components).forEach(([name, status]) => {
    const icon = status.status === 'OPERATIONAL' ? '✅' : 
                 status.status === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`  ${icon} ${name}: ${status.status}`);
});

// Show capabilities
console.log('\n🎯 Available Features:');
console.log('  • 7 Intelligent Personas (auto-switching)');
console.log('  • 6 Workflow Automations (chain /sc: commands)'); 
console.log('  • Real-time Auto-Documentation');
console.log('  • Context7 + Sequential MCP integration');

console.log('\n💡 Usage:');
console.log('  • Just interact naturally - enhancement is automatic');
console.log('  • Use /sc: commands for explicit SuperClaude functionality');
console.log('  • Check ~/.claude/CLAUDE.md for auto-documentation');

// Activate global enhancement
if (typeof global !== 'undefined') {
    global.SuperClaudeEnhanced = enhanced.globalEnhancedSuperClaude;
    console.log('\n✅ Enhancement layer activated globally');
}

module.exports = enhanced;
EOF

chmod +x "$INSTALL_DIR/activate.js"

# Create project integration script
cat > "$INSTALL_DIR/integrate.js" << 'EOF'
#!/usr/bin/env node

// Project Integration Script
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const enhancedPath = require('path').dirname(__filename);

console.log('🔧 Integrating SuperClaude Enhanced with current project...');

// Create .superclaude directory in project
const projectSuperclaude = path.join(projectRoot, '.superclaude');
if (!fs.existsSync(projectSuperclaude)) {
    fs.mkdirSync(projectSuperclaude);
}

// Create activation link
const activationScript = `// SuperClaude Enhanced - Project Integration
const enhanced = require('${enhancedPath}/enhanced-superclaude-complete.js');

// Auto-activate for this project
enhanced.globalEnhancedSuperClaude.processEnhancedRequest('Project integration activated', {
    project: '${path.basename(projectRoot)}',
    path: '${projectRoot}'
});

console.log('✅ SuperClaude Enhanced active for project: ${path.basename(projectRoot)}');

module.exports = enhanced;
`;

fs.writeFileSync(path.join(projectSuperclaude, 'activate.js'), activationScript);

// Update project CLAUDE.md if it exists
const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
if (fs.existsSync(claudeMdPath)) {
    let content = fs.readFileSync(claudeMdPath, 'utf8');
    
    if (!content.includes('SuperClaude Enhanced')) {
        content += `

## SuperClaude Enhanced Integration

- **Status**: ✅ Active
- **Features**: Intelligent personas, workflow automation, auto-documentation
- **MCP Servers**: Context7, Sequential (working), Magic, Playwright (partial)
- **Activation**: \`node .superclaude/activate.js\`

---
*Enhanced with SuperClaude Enhanced v1.0*
`;
        fs.writeFileSync(claudeMdPath, content);
        console.log('📝 Updated project CLAUDE.md');
    }
}

console.log('✅ Project integration complete');
console.log('💡 Run: node .superclaude/activate.js to activate');
EOF

chmod +x "$INSTALL_DIR/integrate.js"

# Installation summary
echo -e "\n${GREEN}🎉 SuperClaude Enhanced Installation Complete!${NC}"
echo "============================================="

# Check MCP status
echo -e "\n${BLUE}📊 MCP Server Status:${NC}"
claude mcp list 2>/dev/null | grep -E "(context7|sequential|magic|playwright)" || print_warning "Some MCPs may need Claude Code restart"

echo -e "\n${BLUE}🚀 Next Steps:${NC}"
echo "1. Restart Claude Code to load MCP servers:"
echo "   ${YELLOW}claude --restart${NC}"
echo ""
echo "2. Activate in current project:"
echo "   ${YELLOW}node $INSTALL_DIR/integrate.js${NC}"
echo ""
echo "3. Test the system:"
echo "   ${YELLOW}node $INSTALL_DIR/activate.js${NC}"
echo ""
echo "4. Use naturally - enhancement is automatic!"

echo -e "\n${GREEN}✨ Installation directory: $INSTALL_DIR${NC}"
echo -e "${GREEN}📚 Documentation: https://github.com/rapharoncatti/superclaude-enhanced${NC}"

# Create uninstall script
cat > "$INSTALL_DIR/uninstall.sh" << 'EOF'
#!/bin/bash
echo "🗑️ Uninstalling SuperClaude Enhanced..."

# Remove MCP servers
claude mcp remove context7 2>/dev/null || true
claude mcp remove sequential-thinking 2>/dev/null || true  
claude mcp remove magic 2>/dev/null || true
claude mcp remove playwright 2>/dev/null || true

# Remove installation directory
rm -rf "$HOME/.superclaude-enhanced"

echo "✅ SuperClaude Enhanced uninstalled"
echo "Note: SuperClaude foundation (NomenAK) remains installed"
EOF

chmod +x "$INSTALL_DIR/uninstall.sh"

print_status "Installation complete! 🎉"