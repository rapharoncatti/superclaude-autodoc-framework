# SuperClaude Auto-Documentation Framework - Installation Guide

🚀 **Quick setup guide for the universal auto-documentation framework**

## 📦 **Global Installation**

### **Option 1: NPM Global Installation (Recommended)**

```bash
# Install globally from npm (when published)
npm install -g @superclaude/autodoc-framework

# Use anywhere
cd your-project
superclaude-init
```

### **Option 2: Local Installation from Source**

```bash
# Clone or copy the framework
git clone /path/to/superclaude-autodoc-framework
cd superclaude-autodoc-framework

# Install dependencies
npm install

# Make globally available (optional)
npm link

# Or use directly
node setup/project-initializer.js
```

## 🎯 **Project Initialization**

### **Auto-Detection (Recommended)**
```bash
cd your-project
superclaude-init
# Framework automatically detects project type
```

### **Specify Project Type**
```bash
# Web development (React, Vue, Angular)
superclaude-init --type web-development

# Unity game development
superclaude-init --type unity-gamedev

# Backend API development
superclaude-init --type backend-api

# Data science projects
superclaude-init --type data-science

# Generic projects
superclaude-init --type generic
```

### **View Available Templates**
```bash
superclaude-init templates
```

## 🔧 **Project Setup Results**

After initialization, your project will have:

- **`.superclaude.yml`** - Configuration file
- **`CLAUDE.md`** - Auto-maintained documentation
- **`.superclaude/`** - Framework files
- **`superclaude-maintain.sh`** - Maintenance commands
- **Git hooks** - Automatic documentation updates (if git repo)

## 📝 **Daily Usage Commands**

```bash
# Update documentation
./superclaude-maintain.sh update

# Check framework status
./superclaude-maintain.sh status

# Validate documentation
./superclaude-maintain.sh validate

# Create backup
./superclaude-maintain.sh backup

# Test installation
./superclaude-maintain.sh test

# Show all commands
./superclaude-maintain.sh help
```

## 🎭 **SuperClaude Integration**

The framework integrates with SuperClaude personas for decision logging:

```javascript
// These functions are available after setup
logArchitectDecision("Use microservices architecture", "Better scalability and maintainability");
logSecurityDecision("Implement JWT authentication", "Stateless and secure token-based auth");
logPerformanceDecision("Add Redis caching", "Reduce database load and improve response times");
```

## ⚙️ **Configuration**

### **Project Configuration (`.superclaude.yml`)**

```yaml
superclaude_framework:
  version: "1.0.0"
  template: "web-development"

project:
  type: "web-development"
  technologies: ["React", "Node.js", "TypeScript"]

auto_doc:
  update_mode: "moderate"        # conservative | moderate | aggressive
  validation_level: "semantic"   # syntax | semantic | integration
  backup_enabled: true
  auto_commit: false
```

### **Update Modes**

- **Conservative**: Only high-confidence changes
- **Moderate**: Significant changes with validation (default)
- **Aggressive**: All detected changes with review

## 🔍 **Requirements**

- **Node.js**: 16.0.0 or higher
- **Git**: For change detection and hooks (optional)
- **Project files**: Source code in supported languages

## 📁 **Supported Project Types**

| Template | Technologies | Best For |
|----------|-------------|----------|
| **web-development** | React, Vue, Angular, Node.js | Frontend/backend web apps |
| **unity-gamedev** | C#, Unity, MonoBehaviour | Unity game development |
| **backend-api** | Node.js, Python, Java, Go | REST/GraphQL APIs |
| **data-science** | Python, R, Jupyter | Data analysis, ML projects |
| **generic** | Any language | Mixed or unknown tech stacks |

## 🚨 **Troubleshooting**

### **Framework Not Working**
```bash
# Check installation
./superclaude-maintain.sh test

# Reinstall framework
superclaude-init --force
```

### **Missing Dependencies**
```bash
# Install required packages
npm install js-yaml --no-bin-links

# Or globally
npm install -g js-yaml
```

### **Git Hooks Not Working**
```bash
# Initialize git first
git init

# Then reinstall framework
superclaude-init
```

### **Permission Errors**
```bash
# Make scripts executable
chmod +x superclaude-maintain.sh
chmod +x .superclaude/auto-documentation.js
```

## 📊 **Verification**

After setup, verify everything works:

```bash
# 1. Check status
./superclaude-maintain.sh status

# 2. Test update
./superclaude-maintain.sh update

# 3. Validate documentation
./superclaude-maintain.sh validate

# 4. View generated documentation
cat CLAUDE.md
```

## 🎉 **Success Indicators**

✅ **Setup Complete** when you see:
- CLAUDE.md file created with project-specific sections
- .superclaude.yml configuration file
- superclaude-maintain.sh script working
- Documentation updates automatically with code changes

## 🔗 **Next Steps**

1. **Write some code** - Framework will detect changes
2. **Make git commits** - Documentation updates automatically
3. **Review CLAUDE.md** - See your project documented
4. **Customize templates** - Add project-specific patterns
5. **Share with team** - Everyone gets self-maintaining docs

---

**🤖 Your documentation will now maintain itself!**

The SuperClaude Auto-Documentation Framework monitors your code, detects changes, and updates documentation automatically. Focus on building, let the framework handle the docs.