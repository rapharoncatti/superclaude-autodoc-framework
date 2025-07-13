# SuperClaude Auto-Documentation Framework

🤖 **Universal auto-documentation system for SuperClaude projects** - Intelligent documentation that evolves with your code

[![npm version](https://badge.fury.io/js/%40superclaude%2Fautodoc-framework.svg)](https://www.npmjs.com/package/@superclaude/autodoc-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 **What is SuperClaude Auto-Documentation?**

The SuperClaude Auto-Documentation Framework brings intelligent, self-maintaining documentation to any development project. Originally developed for Unity game development with Twitch integration, it has evolved into a universal system that adapts to any technology stack.

### **Key Features**

- 🔄 **Automatic Documentation Updates** - Documentation evolves with your code
- 🎭 **Persona-Driven Decision Logging** - Architectural decisions automatically preserved
- 🔧 **Universal Project Support** - Works with any programming language or framework
- 📊 **Intelligent Change Detection** - Knows what matters and what doesn't
- 🛡️ **Backup & Rollback System** - Never lose documentation changes
- 🎯 **Template-Based Setup** - Optimized configurations for different project types

## 🚀 **Quick Start**

### **Installation**

```bash
# Install globally for use across all projects
npm install -g @superclaude/autodoc-framework

# Or use npx for one-time setup
npx @superclaude/autodoc-framework
```

### **Initialize in Any Project**

```bash
# Auto-detect project type and set up documentation
cd your-project
superclaude-init

# Or specify project type explicitly
superclaude-init --type web-development
superclaude-init --type unity-gamedev
superclaude-init --type generic
```

### **Maintenance Commands**

```bash
# Update documentation
superclaude-maintain update

# Validate documentation structure
superclaude-maintain validate

# Check framework status
superclaude-maintain status

# Create manual backup
superclaude-maintain backup

# Test framework installation
superclaude-maintain test
```

## 📋 **Project Templates**

### **🌐 Web Development**
- **Technologies**: React, Vue, Angular, Node.js, TypeScript
- **Optimized for**: Frontend/backend web applications, SPAs, APIs
- **Documentation Focus**: Components, API endpoints, deployment

### **🎮 Unity Game Development**
- **Technologies**: C#, Unity, MonoBehaviour, Visual Scripting
- **Optimized for**: Unity projects, game development, real-time systems
- **Documentation Focus**: Game architecture, component systems, scene management

### **📊 Data Science**
- **Technologies**: Python, Jupyter, pandas, scikit-learn
- **Optimized for**: Data analysis, machine learning, research projects
- **Documentation Focus**: Data pipelines, model documentation, experiment tracking

### **🔧 Generic**
- **Technologies**: Any programming language
- **Optimized for**: Mixed technology stacks, unknown project types
- **Documentation Focus**: Universal patterns, flexible structure

## 🏗️ **Architecture Overview**

### **Core Components**

```
superclaude-autodoc-framework/
├── core/                          # Universal documentation engine
│   ├── auto-documentation.js      # Change detection & content generation
│   ├── persona-manager.js          # SuperClaude persona integration
│   └── index.js                   # Framework entry point
├── templates/                     # Project type templates
│   ├── web-development/           # React/Vue/Angular projects
│   ├── unity-gamedev/             # Unity C# projects
│   ├── data-science/              # Python/Jupyter projects
│   └── generic/                   # Universal fallback
├── setup/                         # Installation & initialization
│   └── project-initializer.js     # Project setup automation
└── tools/                         # Maintenance utilities
    ├── doc-maintenance.js          # Documentation maintenance CLI
    └── framework-update.js         # Self-updating system
```

### **Workflow**

1. **Change Detection** - Monitors code, config, and system changes
2. **Intelligent Analysis** - Determines documentation relevance
3. **Content Generation** - Creates appropriate documentation updates
4. **Validation** - Ensures documentation quality and consistency
5. **Backup & Apply** - Safely updates documentation with rollback capability

## 🎭 **SuperClaude Persona Integration**

The framework integrates with SuperClaude's persona system to automatically log architectural decisions:

```javascript
// Architectural decisions automatically documented
logArchitectDecision("Use event-driven architecture for real-time voting", 
    "Provides loose coupling and scalability for high-frequency updates");

logSecurityDecision("Implement OAuth token encryption", 
    "Hardcoded tokens present security vulnerability");

logPerformanceDecision("Cache results in memory for fast lookup", 
    "Reduces computational overhead during intensive operations");
```

### **Persona Benefits**

- 🧠 **Knowledge Preservation** - No architectural decisions are lost
- 📊 **Decision Tracking** - Full history with rationale and timestamps
- 🔄 **Context Continuity** - Maintains consistency across development sessions
- 📈 **Progress Monitoring** - Tracks implementation status of decisions

## 📝 **Configuration**

### **Project Configuration (`.superclaude.yml`)**

```yaml
superclaude_framework:
  version: "1.0.0"
  template: "web-development"
  initialized: "2025-01-13T10:30:00Z"

project:
  type: "web-development"
  technologies: ["React", "Node.js", "TypeScript"]
  description: "Modern web application with React frontend"

patterns:
  source_files: "src/.*\\.(js|ts|jsx|tsx)$"
  config_files: "package\\.json$|tsconfig\\.json$"
  test_files: ".*\\.(test|spec)\\.(js|ts)$"

documentation_sections:
  - name: "Project Overview"
    auto_update: true
  - name: "Architecture Overview"
    auto_update: true
  - name: "API Documentation"
    auto_update: true

mcp_integration:
  recommended_servers: ["context7", "magic", "puppeteer"]
  
auto_doc:
  update_mode: "moderate"      # conservative | moderate | aggressive
  validation_level: "semantic" # syntax | semantic | integration
  backup_enabled: true
  auto_commit: false
```

### **Update Modes**

- **Conservative**: Only high-confidence changes with manual review
- **Moderate**: Significant changes with validation (recommended)
- **Aggressive**: All detected changes with review flags

## 🔧 **Advanced Usage**

### **Custom Templates**

Create custom templates for specialized project types:

```yaml
# templates/my-custom-template/config.yml
project_type: "my-custom-template"
description: "Custom project template"
technologies: ["CustomTech", "Framework"]

patterns:
  source_files: "src/.*\\.custom$"
  
documentation_sections:
  - name: "Custom Architecture"
    auto_update: true
    generator: "custom-docs-generator"
```

### **Git Integration**

Automatic git hooks ensure documentation stays synchronized:

```bash
# Pre-commit: Validate and update documentation
git commit -m "Add new feature"
# → Documentation automatically updated and included in commit

# Post-commit: Sync project status
# → System status updated based on commit changes
```

### **Programmatic Usage**

Use the framework programmatically in scripts:

```javascript
const SuperClaudeFramework = require('@superclaude/autodoc-framework');

const framework = new SuperClaudeFramework('/path/to/project');

// Initialize framework
await framework.init({ type: 'web-development' });

// Update documentation
await framework.update();

// Validate documentation
const validation = await framework.validate();
console.log(validation.success ? 'Valid' : 'Invalid');
```

## 🎉 **Benefits**

### **Zero-Maintenance Documentation**
- ✅ Documentation stays perfectly synchronized with code
- ✅ No manual intervention required for routine updates
- ✅ Automatic detection and documentation of new components

### **Architectural Decision Preservation**
- ✅ All persona-driven decisions automatically logged
- ✅ Technical rationale preserved for future reference
- ✅ Decision history provides project evolution timeline

### **Universal Compatibility**
- ✅ Works with any programming language or framework
- ✅ Template-based configuration for optimal project support
- ✅ Adapts to project structure rather than forcing conventions

### **Development Workflow Enhancement**
- ✅ Git integration ensures documentation currency
- ✅ Validation prevents inconsistent documentation
- ✅ Backup system provides safety net for changes

## 🛠️ **Requirements**

- **Node.js**: 16.0.0 or higher
- **Git**: For change detection and hooks (optional)
- **SuperClaude**: For persona integration (optional)

## 📚 **Documentation**

- [Installation Guide](docs/INSTALLATION.md)
- [Template Customization](docs/TEMPLATES.md)
- [Architecture Details](docs/ARCHITECTURE.md)
- [Best Practices](docs/BEST_PRACTICES.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🤝 **Contributing**

We welcome contributions to improve the SuperClaude Auto-Documentation Framework:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 **Links**

- [NPM Package](https://www.npmjs.com/package/@superclaude/autodoc-framework)
- [GitHub Repository](https://github.com/superclaude/autodoc-framework)
- [Issue Tracker](https://github.com/superclaude/autodoc-framework/issues)
- [SuperClaude Documentation](https://docs.superclaude.ai)

---

## 🎯 **Version History**

### **v1.0.0** - Universal Framework Release
- ✅ Abstracted from Unity-specific implementation
- ✅ Template system for multiple project types
- ✅ Universal auto-documentation engine
- ✅ Global CLI installation support
- ✅ Comprehensive testing and validation

**Architectural Achievement**: A universal auto-documentation framework that brings SuperClaude's intelligent documentation capabilities to every development project, regardless of technology stack or domain.

---

**🤖 Transform your documentation workflow. Install SuperClaude Auto-Documentation Framework today and never manually maintain project documentation again.**