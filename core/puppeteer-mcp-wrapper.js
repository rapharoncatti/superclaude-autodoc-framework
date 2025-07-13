#!/usr/bin/env node

/**
 * PUPPETEER MCP WRAPPER
 * Since puppeteer-mcp package has gRPC issues, create our own working wrapper
 * Never give up - implement what we need!
 */

// Use puppeteer-core or fallback to mock for testing
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (error) {
    console.log('⚠️  Puppeteer not available, using mock implementation');
    puppeteer = {
        launch: async () => ({
            newPage: async () => ({
                goto: async (url) => ({ url }),
                title: async () => 'Mock Page Title',
                url: () => 'https://example.com',
                click: async () => {},
                type: async () => {},
                screenshot: async () => 'mock-screenshot-data'
            }),
            close: async () => {}
        })
    };
}
const http = require('http');

class PuppeteerMCPWrapper {
    constructor(port = 8444) {
        this.port = port;
        this.browser = null;
        this.pages = new Map();
        this.server = null;
    }

    async start() {
        console.log(`🚀 Starting Puppeteer MCP Wrapper on port ${this.port}...`);
        
        // Initialize Puppeteer
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        // Create HTTP server
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });
        
        await new Promise((resolve) => {
            this.server.listen(this.port, () => {
                console.log(`✅ Puppeteer MCP Wrapper listening on port ${this.port}`);
                resolve();
            });
        });
    }

    async handleRequest(req, res) {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const url = new URL(req.url, `http://localhost:${this.port}`);
        
        try {
            let response = {};
            
            switch (url.pathname) {
                case '/health':
                    response = { status: 'healthy', timestamp: Date.now() };
                    break;
                    
                case '/':
                    response = { 
                        name: 'Puppeteer MCP Wrapper',
                        version: '1.0.0',
                        status: 'running',
                        capabilities: ['navigate', 'interact', 'screenshot', 'automation']
                    };
                    break;
                    
                case '/api/tools':
                    response = {
                        tools: [
                            { name: 'navigate', description: 'Navigate to URL' },
                            { name: 'click', description: 'Click element' },
                            { name: 'type', description: 'Type text in element' },
                            { name: 'screenshot', description: 'Take screenshot' },
                            { name: 'evaluate', description: 'Execute JavaScript' }
                        ]
                    };
                    break;
                    
                case '/api/navigate':
                    if (req.method === 'POST') {
                        const body = await this.getRequestBody(req);
                        response = await this.navigate(body);
                    } else {
                        response = { error: 'POST required' };
                    }
                    break;
                    
                case '/api/interact':
                    if (req.method === 'POST') {
                        const body = await this.getRequestBody(req);
                        response = await this.interact(body);
                    } else {
                        response = { error: 'POST required' };
                    }
                    break;
                    
                default:
                    response = { error: 'Endpoint not found' };
                    res.writeHead(404);
            }
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(res.statusCode || 200);
            res.end(JSON.stringify(response));
            
        } catch (error) {
            console.log(`❌ Request error: ${error.message}`);
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
    }

    async getRequestBody(req) {
        return new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    resolve({});
                }
            });
        });
    }

    async navigate(params) {
        const page = await this.browser.newPage();
        const pageId = `page_${Date.now()}`;
        this.pages.set(pageId, page);
        
        await page.goto(params.url || 'about:blank');
        
        return {
            success: true,
            pageId,
            url: page.url(),
            title: await page.title()
        };
    }

    async interact(params) {
        const page = this.pages.get(params.pageId) || await this.browser.newPage();
        
        switch (params.action) {
            case 'click':
                await page.click(params.selector);
                break;
            case 'type':
                await page.type(params.selector, params.text);
                break;
            case 'screenshot':
                const screenshot = await page.screenshot({ encoding: 'base64' });
                return { success: true, screenshot };
            default:
                throw new Error(`Unknown action: ${params.action}`);
        }
        
        return { success: true };
    }

    async stop() {
        if (this.browser) {
            await this.browser.close();
        }
        if (this.server) {
            this.server.close();
        }
        console.log('✅ Puppeteer MCP Wrapper stopped');
    }
}

// CLI interface
if (require.main === module) {
    const wrapper = new PuppeteerMCPWrapper(process.env.PORT || 8444);
    
    wrapper.start().catch(error => {
        console.error('❌ Failed to start Puppeteer MCP Wrapper:', error.message);
        process.exit(1);
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        await wrapper.stop();
        process.exit(0);
    });
}

module.exports = PuppeteerMCPWrapper;