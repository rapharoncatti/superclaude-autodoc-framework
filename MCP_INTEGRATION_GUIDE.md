# SuperClaude Multi-MCP Integration Guide

## ✅ Core MCP Servers (Working)

The framework now includes **3 core MCP servers** that work reliably across all projects:

### 1. Context7 MCP 📚
- **Purpose**: Documentation research and technical patterns
- **Install**: `npx -y @upstash/context7-mcp` (auto-installed)
- **Capabilities**: search, research, documentation
- **Used by**: All personas for technical research

### 2. Sequential MCP 🧠
- **Purpose**: Analytical thinking and step-by-step reasoning
- **Install**: `npm install -g @modelcontextprotocol/server-sequential-thinking`
- **Capabilities**: thinking, analysis, reasoning
- **Used by**: Analyzer, Security, Performance personas for systematic analysis

### 3. Magic MCP ⚡
- **Purpose**: General task automation and tooling
- **Install**: `npx @21st-dev/magic` (auto-installed)
- **Capabilities**: automation, general, tasks
- **Used by**: Frontend persona primarily, avoided by Security/Architect per preferences

## 🎭 Persona-Specific MCP Usage

Different SuperClaude personas use different combinations of MCPs:

```javascript
// Architect persona
MCP_Preferences: "Sequential(primary) + Context7(patterns) | Avoid Magic"
// Uses: Sequential for systematic design, Context7 for patterns

// Security persona  
MCP_Preferences: "Sequential(threat modeling) + Context7(security patterns)"
// Uses: Sequential for threat analysis, Context7 for security research

// Performance persona
MCP_Preferences: "Sequential(bottleneck analysis) + Context7(optimization patterns)"
// Uses: Sequential for performance analysis, Context7 for optimization patterns

// Frontend persona
MCP_Preferences: "Magic(primary) + Context7(frameworks)"
// Uses: Magic for automation, Context7 for framework research
```

## 🔧 Adding Project-Specific MCPs

For project-specific needs (like Unity, Puppeteer, etc.), use the custom MCP API:

```javascript
const session = new ActiveSuperClaudeSession();

// Add Unity MCP for game development projects
session.realMCP.addCustomMCP('unity', {
    command: 'node',
    args: ['/path/to/unity-mcp-server/index.js'],
    description: 'Unity MCP for Unity Editor integration',
    capabilities: ['unity', 'gamedev', 'editor'],
    type: 'stdio'
});

// Add Puppeteer MCP for web testing projects
session.realMCP.addCustomMCP('puppeteer', {
    command: 'npx',
    args: ['puppeteer-mcp'],
    description: 'Puppeteer MCP for web automation',
    capabilities: ['web', 'testing', 'automation'],
    type: 'http', // Different type for HTTP-based MCPs
    port: 8443    // Additional config for HTTP MCPs
});
```

## 📊 Framework Performance

- ✅ **3/3 Core MCPs**: Working reliably
- ✅ **Sub-second switching**: Persona changes with MCP reconnection < 1s
- ✅ **Parallel processing**: Multiple MCPs called simultaneously
- ✅ **Smart caching**: Results cached for microsecond decisions
- ✅ **Error handling**: Graceful fallback when MCPs fail

## 🚀 Usage Examples

```javascript
// Initialize with automatic MCP selection
const session = new ActiveSuperClaudeSession();
await session.initializeSession('designing secure authentication system');

// Persona automatically selects appropriate MCPs
await session.switchPersona('security', 'security analysis needed');
// Will connect to: Sequential(threat modeling) + Context7(security patterns)

// Use commands that leverage multiple MCPs
const result = await session.secure(['authentication-system'], ['--audit']);
// Uses both Sequential for analysis and Context7 for security patterns

// Process requests with automatic MCP utilization
const analysis = await session.processRequest('optimize database performance for high concurrency');
// Auto-switches to performance persona and uses Sequential + Context7
```

## 🔍 Troubleshooting

### MCP Connection Issues
- **Check installation**: Ensure MCP packages are installed globally
- **Port conflicts**: Sequential MCP uses stdio, no port conflicts
- **Permissions**: Some MCPs may need specific permissions

### Missing MCPs
- **Puppeteer MCP**: Requires configuration file (see puppeteer-mcp docs)
- **Custom MCPs**: Use `addCustomMCP()` method for project-specific MCPs
- **Legacy MCPs**: Some MCPs may use older MCP protocol versions

### Performance Issues
- **Cache hit rate**: Monitor cache efficiency in session status
- **MCP timeouts**: Increase timeout values for slow MCPs
- **Connection reuse**: MCPs stay connected across persona switches

## 📁 Framework Structure

```
core/
├── real-mcp-integration.js    # Core MCP management
├── active-superclaude-session.js  # Session with MCP integration
├── persona-intelligence-engine.js # Persona selection logic
└── superclaude-commands.js    # 19 specialized commands

Core MCPs: context7, sequential, magic
Custom MCPs: Added per project via addCustomMCP()
```

This architecture ensures the framework remains lightweight and universal while allowing projects to add their specific MCP requirements.