# Direct Deposit Web Component

A comprehensive Angular 15 web component for handling direct deposit functionality that can be easily integrated into any web application regardless of the framework being used.

## Features

### 🏦 Multi-Screen Direct Deposit Flow
- **Overview Screen**: Display current direct deposit settings and account status
- **Add Account Screen**: Form to add new bank accounts with validation
- **Edit Allocation Screen**: Manage percentage allocations across multiple accounts
- **Verify Account Screen**: Handle account verification (micro-deposits or instant verification)
- **Confirmation Screen**: Success confirmation after completing setup

### 🔒 Secure Token Management
- JWT/Bearer token support with automatic expiration detection
- Token refresh mechanism with host application notification
- Configurable token expiration handling
- Cross-domain security considerations

### 📡 Comprehensive Event System
- Real-time event emission to host applications
- Support for all direct deposit state changes
- Token refresh requests and confirmations
- Error handling and reporting
- Account lifecycle events (add, remove, verify)

### 🌐 Framework Agnostic
- Can be used in React, Vue, Angular, or vanilla JavaScript
- Shadow DOM encapsulation for style isolation
- Standard web component custom element
- Single bundle file for easy distribution

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Clean, professional interface
- Progress indicators and step navigation
- Loading states and error handling
- Accessibility features built-in

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd direct-deposit-web-component

# Install dependencies
npm install

# Build the component
npm run build:elements
```

### 2. Include in Your Project

```html
<!-- Include the bundled component -->
<script src="path/to/dist/bundle.js"></script>

<!-- Use the component -->
<direct-deposit-element 
    employee-id="emp-12345"
    api-base-url="https://your-api.com/api/direct-deposit"
    auth-token="your-jwt-token">
</direct-deposit-element>
```

### 3. Listen for Events

```javascript
// Listen for state changes
document.addEventListener('depositStateChanged', function(event) {
    console.log('State changed:', event.detail);
});

// Handle token refresh requests
document.addEventListener('tokenRefreshRequired', function(event) {
    console.log('Token refresh needed:', event.detail);
    // Provide new token
    const element = document.querySelector('direct-deposit-element');
    element.updateToken('new-token-here');
});
```

## Component Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `employee-id` | string | Yes | Unique identifier for the employee |
| `api-base-url` | string | No | Base URL for API calls (default: '/api/direct-deposit') |
| `auth-token` | string | Yes | JWT or Bearer token for authentication |

## Events

The component emits the following custom events:

### `depositStateChanged`
Fired whenever the component's internal state changes.

```javascript
document.addEventListener('depositStateChanged', function(event) {
    const { state, timestamp } = event.detail.payload;
    // Handle state change
});
```

### `tokenRefreshRequired`
Fired when the token is expired or about to expire.

```javascript
document.addEventListener('tokenRefreshRequired', function(event) {
    const { reason, requestId } = event.detail.payload;
    // Fetch new token and update component
});
```

### `accountAdded`
Fired when a new bank account is successfully added.

```javascript
document.addEventListener('accountAdded', function(event) {
    const { account } = event.detail.payload;
    // Handle new account
});
```

### `accountRemoved`
Fired when a bank account is removed.

```javascript
document.addEventListener('accountRemoved', function(event) {
    const { accountId } = event.detail.payload;
    // Handle account removal
});
```

### `settingsUpdated`
Fired when direct deposit settings are updated.

```javascript
document.addEventListener('settingsUpdated', function(event) {
    const { settings } = event.detail.payload;
    // Handle settings update
});
```

### `verificationCompleted`
Fired when account verification is completed.

```javascript
document.addEventListener('verificationCompleted', function(event) {
    const { accountId, success } = event.detail.payload;
    // Handle verification result
});
```

### `errorOccurred`
Fired when an error occurs.

```javascript
document.addEventListener('errorOccurred', function(event) {
    const { error, context } = event.detail.payload;
    // Handle error
});
```

## API Methods

### `updateToken(token: string, expiresIn?: number)`
Updates the authentication token.

```javascript
const element = document.querySelector('direct-deposit-element');
element.updateToken('new-token', 3600); // Token expires in 1 hour
```

## API Integration

The component expects your backend API to implement the following endpoints:

### GET `/api/direct-deposit/settings/{employeeId}`
Retrieve direct deposit settings for an employee.

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "settings-123",
        "employeeId": "emp-12345",
        "accounts": [
            {
                "id": "acc-123",
                "accountType": "checking",
                "routingNumber": "123456789",
                "accountNumber": "987654321",
                "bankName": "Sample Bank",
                "isVerified": true
            }
        ],
        "totalAllocationPercentage": 100,
        "isActive": true
    }
}
```

### PUT `/api/direct-deposit/settings`
Update direct deposit settings.

### POST `/api/direct-deposit/accounts`
Add a new bank account.

### DELETE `/api/direct-deposit/accounts/{accountId}`
Remove a bank account.

### POST `/api/direct-deposit/accounts/{accountId}/verify`
Verify a bank account.

### GET `/api/direct-deposit/banks/lookup/{routingNumber}`
Get bank information by routing number.

All endpoints should:
- Require authentication via Bearer token
- Return appropriate HTTP status codes
- Include error messages in the response for failed requests
- Support CORS for cross-domain requests

## Framework Integration Examples

### React

```jsx
import React, { useEffect, useRef } from 'react';

function DirectDepositContainer() {
    const elementRef = useRef(null);

    useEffect(() => {
        const handleTokenRefresh = (event) => {
            // Get new token from your auth service
            const newToken = getNewToken();
            elementRef.current.updateToken(newToken);
        };

        document.addEventListener('tokenRefreshRequired', handleTokenRefresh);
        return () => {
            document.removeEventListener('tokenRefreshRequired', handleTokenRefresh);
        };
    }, []);

    return (
        <direct-deposit-element
            ref={elementRef}
            employee-id="emp-12345"
            api-base-url="/api/direct-deposit"
            auth-token="your-token"
        />
    );
}
```

### Vue.js

```vue
<template>
    <direct-deposit-element 
        ref="directDeposit"
        :employee-id="employeeId"
        :api-base-url="apiBaseUrl"
        :auth-token="authToken"
    />
</template>

<script>
export default {
    data() {
        return {
            employeeId: 'emp-12345',
            apiBaseUrl: '/api/direct-deposit',
            authToken: 'your-token'
        };
    },
    mounted() {
        document.addEventListener('tokenRefreshRequired', this.handleTokenRefresh);
    },
    beforeUnmount() {
        document.removeEventListener('tokenRefreshRequired', this.handleTokenRefresh);
    },
    methods: {
        handleTokenRefresh() {
            // Refresh token logic
            this.authToken = getNewToken();
            this.$refs.directDeposit.updateToken(this.authToken);
        }
    }
};
</script>
```

### Angular

```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-direct-deposit',
    template: `
        <direct-deposit-element 
            #directDeposit
            employee-id="emp-12345"
            api-base-url="/api/direct-deposit"
            [auth-token]="authToken">
        </direct-deposit-element>
    `
})
export class DirectDepositComponent {
    @ViewChild('directDeposit') directDeposit!: ElementRef;
    authToken = 'your-token';

    ngOnInit() {
        document.addEventListener('tokenRefreshRequired', this.handleTokenRefresh);
    }

    ngOnDestroy() {
        document.removeEventListener('tokenRefreshRequired', this.handleTokenRefresh);
    }

    handleTokenRefresh = () => {
        // Refresh token logic
        this.authToken = getNewToken();
        this.directDeposit.nativeElement.updateToken(this.authToken);
    };
}
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:elements

# Run tests
npm test
```

### Build Process

The build process uses Angular CLI for compilation and Rollup for bundling:

1. Angular CLI compiles the TypeScript and creates optimized bundles
2. Rollup combines all files into a single `bundle.js`
3. The bundle includes all dependencies and is ready for distribution

### Folder Structure

```
src/
├── app/
│   ├── components/
│   │   ├── direct-deposit/           # Main component
│   │   └── screens/                  # Individual screen components
│   ├── interfaces/                   # TypeScript interfaces
│   └── services/                     # Angular services
├── assets/                           # Static assets
└── styles.scss                       # Global styles

examples/                             # Framework integration examples
├── vanilla-js.html
├── react-example.jsx
└── vue-example.vue

dist/                                 # Build output
└── bundle.js                         # Single bundled file
```

## Security Considerations

### Token Management
- Tokens are stored in memory only (not localStorage/sessionStorage)
- Automatic expiration detection and refresh requests
- Support for both JWT and opaque tokens
- Secure token transmission via HTTPS only

### Cross-Domain Usage
- CORS configuration required on API server
- Content Security Policy (CSP) considerations
- Proper authentication header handling

### Data Validation
- Client-side validation for all form inputs
- Server-side validation required for security
- Sensitive data masking in UI (account numbers)

## Browser Support

- Chrome 60+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support, please:
- Check the [examples](examples/) directory for integration samples
- Review the [API documentation](#api-integration) for backend requirements
- Open an issue for bugs or feature requests

## Changelog

### v1.0.0
- Initial release
- Complete direct deposit workflow
- Multi-framework support
- Comprehensive event system
- Token refresh mechanism
- Responsive design 