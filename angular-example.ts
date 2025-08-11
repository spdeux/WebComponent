import { Component, ViewChild, ElementRef, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// First, declare the custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'direct-deposit-element': any;
    }
  }
}

@Component({
  selector: 'app-direct-deposit-example',
  template: `
    <div class="angular-example">
      <div class="example-header">
        <h1>Direct Deposit Web Component</h1>
        <p><strong>Framework:</strong> Angular</p>
        <p>This example demonstrates how to use the Direct Deposit web component in an Angular application.</p>
      </div>

      <div class="controls">
        <button class="btn btn-primary" (click)="handleManualTokenUpdate()">Refresh Token</button>
        <button class="btn btn-secondary" (click)="clearEvents()">Clear Events</button>
        <button class="btn btn-secondary" (click)="updateEmployeeId()">Change Employee</button>
      </div>

      <!-- Direct Deposit Web Component -->
      <direct-deposit-element 
        #directDepositElement
        [attr.employee-id]="employeeId"
        [attr.api-base-url]="apiBaseUrl"
        [attr.auth-token]="authToken">
      </direct-deposit-element>

      <!-- Event Log -->
      <div class="event-log">
        <h4>Event Log ({{ events.length }})</h4>
        <div *ngIf="events.length === 0" class="no-events">
          Listening for events...
        </div>
        <div 
          *ngFor="let event of events" 
          class="event-item">
          <strong>{{ event.type }}</strong> - {{ event.timestamp }}<br>
          <pre>{{ event.data | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .angular-example {
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
      color: #dd0031;
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
      background-color: #dd0031;
      color: white;
    }

    .btn-primary:hover {
      background-color: #c20029;
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
      border-left: 3px solid #dd0031;
    }

    .event-item pre {
      margin: 5px 0 0 0;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DirectDepositExampleComponent implements OnInit, OnDestroy {
  @ViewChild('directDepositElement') directDepositElement!: ElementRef;

  events: any[] = [];
  authToken = 'initial-angular-token-123';
  employeeId = 'emp-angular-12345';
  apiBaseUrl = '/api/direct-deposit';

  private eventHandlers: { [key: string]: (event: any) => void } = {};

  ngOnInit(): void {
    this.setupEventListeners();
    this.addEvent('Component Initialized', {
      employeeId: this.employeeId,
      apiBaseUrl: this.apiBaseUrl
    });
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
  }

  private addEvent(eventType: string, eventData: any): void {
    const newEvent = {
      id: Date.now(),
      type: eventType,
      data: eventData,
      timestamp: new Date().toLocaleTimeString()
    };
    this.events.push(newEvent);
  }

  private setupEventListeners(): void {
    // Create bound event handlers
    this.eventHandlers.stateChanged = (event: any) => {
      this.addEvent('State Changed', event.detail);
    };

    this.eventHandlers.tokenRefreshRequired = (event: any) => {
      this.addEvent('Token Refresh Required', event.detail);
      
      // Automatically refresh token
      setTimeout(() => {
        const newToken = 'angular-refreshed-token-' + Date.now();
        this.authToken = newToken;
        if (this.directDepositElement?.nativeElement) {
          this.directDepositElement.nativeElement.updateToken(newToken);
        }
        this.addEvent('Token Updated', { newToken });
      }, 2000);
    };

    this.eventHandlers.accountAdded = (event: any) => {
      this.addEvent('Account Added', event.detail);
    };

    this.eventHandlers.accountRemoved = (event: any) => {
      this.addEvent('Account Removed', event.detail);
    };

    this.eventHandlers.settingsUpdated = (event: any) => {
      this.addEvent('Settings Updated', event.detail);
    };

    this.eventHandlers.verificationCompleted = (event: any) => {
      this.addEvent('Verification Completed', event.detail);
    };

    this.eventHandlers.errorOccurred = (event: any) => {
      this.addEvent('Error Occurred', event.detail);
    };

    // Add event listeners
    document.addEventListener('depositStateChanged', this.eventHandlers.stateChanged);
    document.addEventListener('tokenRefreshRequired', this.eventHandlers.tokenRefreshRequired);
    document.addEventListener('accountAdded', this.eventHandlers.accountAdded);
    document.addEventListener('accountRemoved', this.eventHandlers.accountRemoved);
    document.addEventListener('settingsUpdated', this.eventHandlers.settingsUpdated);
    document.addEventListener('verificationCompleted', this.eventHandlers.verificationCompleted);
    document.addEventListener('errorOccurred', this.eventHandlers.errorOccurred);
  }

  private removeEventListeners(): void {
    document.removeEventListener('depositStateChanged', this.eventHandlers.stateChanged);
    document.removeEventListener('tokenRefreshRequired', this.eventHandlers.tokenRefreshRequired);
    document.removeEventListener('accountAdded', this.eventHandlers.accountAdded);
    document.removeEventListener('accountRemoved', this.eventHandlers.accountRemoved);
    document.removeEventListener('settingsUpdated', this.eventHandlers.settingsUpdated);
    document.removeEventListener('verificationCompleted', this.eventHandlers.verificationCompleted);
    document.removeEventListener('errorOccurred', this.eventHandlers.errorOccurred);
  }

  handleManualTokenUpdate(): void {
    const newToken = 'angular-manual-token-' + Date.now();
    this.authToken = newToken;
    if (this.directDepositElement?.nativeElement) {
      this.directDepositElement.nativeElement.updateToken(newToken);
    }
    this.addEvent('Manual Token Update', { newToken });
  }

  updateEmployeeId(): void {
    const newEmployeeId = prompt('Enter new Employee ID:', this.employeeId);
    if (newEmployeeId && newEmployeeId !== this.employeeId) {
      this.employeeId = newEmployeeId;
      this.addEvent('Employee ID Updated', { newEmployeeId });
    }
  }

  clearEvents(): void {
    this.events = [];
  }
}

// Module configuration for using this component
/*
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DirectDepositExampleComponent } from './direct-deposit-example.component';

@NgModule({
  declarations: [
    DirectDepositExampleComponent
  ],
  imports: [
    BrowserModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    DirectDepositExampleComponent
  ]
})
export class DirectDepositExampleModule { }
*/ 