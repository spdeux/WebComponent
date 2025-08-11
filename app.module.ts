import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { createCustomElement } from '@angular/elements';

import { DirectDepositComponent } from './components/direct-deposit/direct-deposit.component';
import { OverviewScreenComponent } from './components/screens/overview-screen/overview-screen.component';
import { AddAccountScreenComponent } from './components/screens/add-account-screen/add-account-screen.component';
import { EditAllocationScreenComponent } from './components/screens/edit-allocation-screen/edit-allocation-screen.component';
import { VerifyAccountScreenComponent } from './components/screens/verify-account-screen/verify-account-screen.component';
import { ConfirmationScreenComponent } from './components/screens/confirmation-screen/confirmation-screen.component';

import { ApiService } from './services/api.service';
import { EventEmissionService } from './services/event-emission.service';

@NgModule({
  declarations: [
    DirectDepositComponent,
    OverviewScreenComponent,
    AddAccountScreenComponent,
    EditAllocationScreenComponent,
    VerifyAccountScreenComponent,
    ConfirmationScreenComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    ApiService,
    EventEmissionService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    // Create the custom element
    const directDepositElement = createCustomElement(DirectDepositComponent, { injector: this.injector });
    
    // Register the custom element with the browser
    customElements.define('direct-deposit-element', directDepositElement);
  }
} 