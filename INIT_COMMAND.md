# /init Command Documentation

## What is /init?

The `/init` command initializes the SuperClaude Enhanced behavioral framework in your project by creating comprehensive documentation that teaches Claude how to behave.

## Usage

In any Claude session within your project:
```
/init
```

## What it does:

1. **Creates/Updates CLAUDE.md** with:
   - 7 detailed persona definitions
   - 6 workflow patterns
   - Command usage guidelines
   - MCP integration strategies

2. **Teaches Claude**:
   - HOW each persona thinks (mindset, framework, identity)
   - WHEN to switch personas (context triggers)
   - WHICH /sc: commands to use for each task
   - WHAT workflows to follow for complex tasks

3. **Enables behavioral patterns**:
   - Persona-based thinking
   - Workflow automation guidance
   - Command chaining patterns
   - MCP usage optimization

## Implementation

When Claude sees `/init`, it should:

1. Run the initialization script:
```bash
node .superclaude/init-behavioral-framework.js
```

2. Confirm the framework is activated

3. Offer a quick test to verify personas are working

## Example Response to /init:

```
🚀 Initializing SuperClaude Enhanced Behavioral Framework...
✅ Created/Updated CLAUDE.md with behavioral patterns
📚 Framework includes:
  • 7 Personas (Architect, Frontend, Backend, Security, Performance, Analyzer, QA)
  • 6 Workflows (Feature, Bug, Security, Performance, Quality, Deployment)
  • Command patterns for each persona
  • MCP usage strategies

💡 Test me! Try:
  - "Debug this error" → I'll think like Analyzer
  - "Build a component" → I'll think like Frontend
  - "Review security" → I'll think like Security

The behavioral framework is now active!
```

## Note for Claude

When you see `/init`, you should execute the initialization script to create the behavioral documentation, then follow those patterns in all subsequent interactions within the project.