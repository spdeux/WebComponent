# Build Instructions

This document provides detailed instructions for building the Direct Deposit Web Component.

## Prerequisites

- Node.js 16+ and npm 8+
- Git

## Setup

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd direct-deposit-web-component
   npm install
   ```

## Build Process

### Development Build

```bash
# Start development server with hot reload
npm start

# This will:
# - Start Angular dev server on http://localhost:4200
# - Enable hot reload for development
# - Use development configuration
```

### Production Build

```bash
# Build for production and create bundle
npm run build:elements

# This will:
# 1. Run Angular CLI build with production optimizations
# 2. Use Rollup to bundle all files into single bundle.js
# 3. Output final bundle to dist/bundle.js
```

### Manual Build Steps

If you need to run the build steps manually:

```bash
# Step 1: Angular build
npm run build

# Step 2: Bundle with Rollup
npm run bundle
```

## Build Output

After running `npm run build:elements`, you'll find:

```
dist/
├── bundle.js           # Single bundled file ready for distribution
├── main.js            # Angular compiled main module
├── polyfills.js       # Browser polyfills
├── runtime.js         # Angular runtime
└── styles.css         # Compiled styles
```

The `bundle.js` file contains everything needed to use the web component.

## Development Workflow

### 1. Start Development Server
```bash
npm start
```

### 2. Make Changes
- Edit files in `src/app/`
- Changes will hot-reload automatically
- Test in browser at `http://localhost:4200`

### 3. Test Changes
```bash
# Run unit tests
npm test

# Run e2e tests (if configured)
npm run e2e
```

### 4. Build for Production
```bash
npm run build:elements
```

### 5. Test Production Bundle
- Open `examples/vanilla-js.html` in browser
- Ensure the bundle loads and functions correctly

## Configuration

### Angular Configuration

Key configuration files:
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript config

### Rollup Configuration

The `rollup.config.js` file handles bundling:
- Combines all Angular output files
- Minifies and optimizes code
- Creates single IIFE bundle
- Preserves custom element functionality

### Build Optimization

The build process includes:
- **Tree shaking** - Removes unused code
- **Minification** - Reduces file size
- **Bundle optimization** - Single file output
- **Shadow DOM encapsulation** - Style isolation

## Troubleshooting

### Build Issues

1. **Dependencies not installed**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript errors**
   ```bash
   npm run build -- --verbose
   # Check console for specific errors
   ```

3. **Rollup bundling fails**
   ```bash
   # Ensure Angular build completed successfully first
   npm run build
   # Then run rollup separately
   npm run bundle
   ```

### Common Issues

1. **"Cannot find module" errors**
   - Ensure all dependencies are installed
   - Check import paths are correct
   - Verify TypeScript configuration

2. **Custom element not registering**
   - Check that `createCustomElement` is called
   - Verify custom element name is unique
   - Ensure polyfills are loaded

3. **Bundle size too large**
   - Check for duplicate dependencies
   - Use tree shaking to remove unused code
   - Consider lazy loading for large features

## Testing the Build

### 1. Test Vanilla JavaScript Integration
```bash
# After building
open examples/vanilla-js.html
```

### 2. Test React Integration
```bash
# In a React project
npm install
# Copy dist/bundle.js to public/
# Import in your React component
```

### 3. Test Vue Integration
```bash
# In a Vue project
npm install
# Copy dist/bundle.js to public/
# Use in Vue component
```

### 4. Test Angular Integration
```bash
# In an Angular project
npm install
# Copy dist/bundle.js to assets/
# Import in Angular module
```

## Deployment

### CDN Deployment
```bash
# Upload dist/bundle.js to your CDN
# Reference in HTML:
<script src="https://your-cdn.com/direct-deposit/bundle.js"></script>
```

### NPM Package
```bash
# To publish as NPM package
npm publish
```

### Direct Integration
```bash
# Copy bundle.js to your project
cp dist/bundle.js /path/to/your/project/assets/
```

## Environment-Specific Builds

### Development
```bash
npm run build -- --configuration development
npm run bundle
```

### Staging
```bash
npm run build -- --configuration production
npm run bundle
```

### Production
```bash
npm run build:elements
```

## Performance Optimization

### Bundle Size Analysis
```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Analyze bundle (after Angular build)
npx webpack-bundle-analyzer dist/
```

### Optimization Tips
1. Use OnPush change detection strategy
2. Lazy load large components
3. Minimize external dependencies
4. Use trackBy functions in ngFor
5. Implement virtual scrolling for large lists

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm test
      - run: npm run build:elements
      - uses: actions/upload-artifact@v2
        with:
          name: bundle
          path: dist/bundle.js
```

This build process ensures your Direct Deposit Web Component is properly compiled, optimized, and ready for distribution across different frameworks and environments. 