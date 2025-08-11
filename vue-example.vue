<template>
  <div class="vue-example">
    <div class="example-header">
      <h1>Direct Deposit Web Component</h1>
      <p><strong>Framework:</strong> Vue.js</p>
      <p>This example demonstrates how to use the Direct Deposit web component in a Vue.js application.</p>
    </div>

    <div class="controls">
      <button class="btn btn-primary" @click="handleManualTokenUpdate">Refresh Token</button>
      <button class="btn btn-secondary" @click="clearEvents">Clear Events</button>
      <button class="btn btn-secondary" @click="updateEmployeeId">Change Employee</button>
    </div>

    <!-- Direct Deposit Web Component -->
    <direct-deposit-element 
      ref="directDepositElement"
      :employee-id="employeeId"
      :api-base-url="apiBaseUrl"
      :auth-token="token"
    />

    <!-- Event Log -->
    <div class="event-log">
      <h4>Event Log ({{ events.length }})</h4>
      <div v-if="events.length === 0" class="no-events">
        Listening for events...
      </div>
      <div 
        v-else
        v-for="event in events" 
        :key="event.id"
        class="event-item"
      >
        <strong>{{ event.type }}</strong> - {{ event.timestamp }}<br>
        <pre>{{ JSON.stringify(event.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DirectDepositVueExample',
  data() {
    return {
      events: [],
      token: 'initial-vue-token-123',
      employeeId: 'emp-vue-12345',
      apiBaseUrl: '/api/direct-deposit'
    };
  },
  mounted() {
    this.setupEventListeners();
    this.addEvent('Component Mounted', {
      employeeId: this.employeeId,
      apiBaseUrl: this.apiBaseUrl
    });
  },
  beforeUnmount() {
    this.removeEventListeners();
  },
  methods: {
    addEvent(eventType, eventData) {
      const newEvent = {
        id: Date.now(),
        type: eventType,
        data: eventData,
        timestamp: new Date().toLocaleTimeString()
      };
      this.events.push(newEvent);
    },
    
    setupEventListeners() {
      // Event handlers
      this.handleStateChanged = (event) => {
        this.addEvent('State Changed', event.detail);
      };

      this.handleTokenRefreshRequired = (event) => {
        this.addEvent('Token Refresh Required', event.detail);
        
        // Automatically refresh token
        setTimeout(() => {
          const newToken = 'vue-refreshed-token-' + Date.now();
          this.token = newToken;
          if (this.$refs.directDepositElement) {
            this.$refs.directDepositElement.updateToken(newToken);
          }
          this.addEvent('Token Updated', { newToken });
        }, 2000);
      };

      this.handleAccountAdded = (event) => {
        this.addEvent('Account Added', event.detail);
      };

      this.handleAccountRemoved = (event) => {
        this.addEvent('Account Removed', event.detail);
      };

      this.handleSettingsUpdated = (event) => {
        this.addEvent('Settings Updated', event.detail);
      };

      this.handleVerificationCompleted = (event) => {
        this.addEvent('Verification Completed', event.detail);
      };

      this.handleErrorOccurred = (event) => {
        this.addEvent('Error Occurred', event.detail);
      };

      // Add event listeners
      document.addEventListener('depositStateChanged', this.handleStateChanged);
      document.addEventListener('tokenRefreshRequired', this.handleTokenRefreshRequired);
      document.addEventListener('accountAdded', this.handleAccountAdded);
      document.addEventListener('accountRemoved', this.handleAccountRemoved);
      document.addEventListener('settingsUpdated', this.handleSettingsUpdated);
      document.addEventListener('verificationCompleted', this.handleVerificationCompleted);
      document.addEventListener('errorOccurred', this.handleErrorOccurred);
    },

    removeEventListeners() {
      document.removeEventListener('depositStateChanged', this.handleStateChanged);
      document.removeEventListener('tokenRefreshRequired', this.handleTokenRefreshRequired);
      document.removeEventListener('accountAdded', this.handleAccountAdded);
      document.removeEventListener('accountRemoved', this.handleAccountRemoved);
      document.removeEventListener('settingsUpdated', this.handleSettingsUpdated);
      document.removeEventListener('verificationCompleted', this.handleVerificationCompleted);
      document.removeEventListener('errorOccurred', this.handleErrorOccurred);
    },

    handleManualTokenUpdate() {
      const newToken = 'vue-manual-token-' + Date.now();
      this.token = newToken;
      if (this.$refs.directDepositElement) {
        this.$refs.directDepositElement.updateToken(newToken);
      }
      this.addEvent('Manual Token Update', { newToken });
    },

    updateEmployeeId() {
      const newEmployeeId = prompt('Enter new Employee ID:', this.employeeId);
      if (newEmployeeId && newEmployeeId !== this.employeeId) {
        this.employeeId = newEmployeeId;
        this.addEvent('Employee ID Updated', { newEmployeeId });
      }
    },

    clearEvents() {
      this.events = [];
    }
  }
};
</script>

<style scoped>
.vue-example {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.example-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.example-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.event-log {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.event-log h4 {
  margin-top: 0;
  color: #495057;
}

.no-events {
  color: #6c757d;
  font-style: italic;
}

.event-item {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin: 5px 0;
  padding: 8px;
  background: white;
  border-radius: 3px;
  border-left: 3px solid #007bff;
}

.event-item pre {
  margin: 5px 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 