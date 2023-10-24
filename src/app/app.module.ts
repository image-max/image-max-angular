/* eslint-disable max-len */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbTooltipModule, NgbModalModule, NgbActiveModal, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TestPageComponent } from './test-page/test-page.component';
import { ImageMaxComponent } from './image-max/image-max.component';

@NgModule({
  imports: [HttpClientModule, AppRoutingModule, BrowserModule, BrowserAnimationsModule, NgbTooltipModule, NgbModalModule, NgbAccordionModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DecimalPipe, { provide: Window, useValue: window }, NgbActiveModal],
  bootstrap: [AppComponent],
  declarations: [AppComponent, TestPageComponent, ImageMaxComponent],
})
export class AppModule {}
