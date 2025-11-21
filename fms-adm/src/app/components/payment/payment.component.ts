// Angular Modules
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';

import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    Stripe: any;
  }
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    FormsModule,
    DialogModule,
    StepsModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    DividerModule,
    DropdownModule,
    ToggleSwitchModule,
    RadioButtonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  @Input() displayModal = false;
  @Output() displayModalChange = new EventEmitter<boolean>();

  @ViewChild('cardElement', { static: false }) cardElementRef?: ElementRef;

  paymentDescription: string = 'Assinatura Mensal - Plano Básico';
  paymentAmount: number = 29.99; // Valor em reais
  paymentReference: string = 'REF123456';
  isProcessingPayment: boolean = false;
  installmentOptions: any[] = [{ value: "1x" }, { value: "2x" }];

  billingDetails: FormGroup;
  billingAddress: FormGroup;

  // Stripe
  private stripe: any;
  private elements: any;
  private card: any;
  cardError: string | null = null;

  constructor() {
    this.billingDetails = new FormGroup({
      cardholderName: new FormControl('', [Validators.required]),
      paymentMethod: new FormControl('credit-card', [Validators.required]),
      installments: new FormControl('', [Validators.required]),
      saveCard: new FormControl(false),
    });

    this.billingAddress = new FormGroup({
      billingZipCode: new FormControl(''),
      billingStreet: new FormControl(''),
      billingNumber: new FormControl(''),
      billingDistrict: new FormControl(''),
      billingComplement: new FormControl(''),
      billingCity: new FormControl(''),
      billingState: new FormControl(''),
    });
  }

  ngAfterViewInit(): void {
    if (!window.Stripe) {
      console.error('Stripe.js não foi carregado. Confira o script no index.html');
      return;
    }

    this.stripe = window.Stripe(environment.stripeKey);

    this.elements = this.stripe.elements();

    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    };

    this.card = this.elements.create('card', {
      style,
      hidePostalCode: true,
    });

    if (this.cardElementRef?.nativeElement) {
      this.card.mount(this.cardElementRef.nativeElement);
    }

    this.card.on('change', (event: any) => {
      this.cardError = event.error ? event.error.message : null;
    });
  }

  ngOnDestroy(): void {
    if (this.card) {
      this.card.destroy();
    }
  }

  openPaymentDialog() {
    this.displayModal = true;
  }

  async onConfirmPayment() {
    if (this.billingDetails.invalid || !this.card) {
      this.billingDetails.markAllAsTouched();
      return;
    }

    this.isProcessingPayment = true;
    this.cardError = null;

    const cardholderName = this.billingDetails.get('cardholderName')?.value;

    const billingDetails: any = {
      name: cardholderName,
      address: {
        postal_code: this.billingAddress.get('billingZipCode')?.value || undefined,
        line1: this.billingAddress.get('billingStreet')?.value ? `${this.billingAddress.get('billingStreet')?.value}, ${this.billingAddress.get('billingNumber')?.value || ''}` : undefined,
        city: this.billingAddress.get('billingCity')?.value  || undefined,
        state: this.billingAddress.get('billingState')?.value || undefined,
      },
    };

    try {
      const result = await this.stripe.createToken(this.card, billingDetails);

      if (result.error) {
        this.cardError = result.error.message;
        this.isProcessingPayment = false;
        return;
      }

      const token = result.token;

      console.log('Stripe token gerado:', token);

      this.isProcessingPayment = false;
      this.close();

    } catch (err: any) {
      console.error(err);
      this.cardError = 'Ocorreu um erro ao processar o pagamento.';
      this.isProcessingPayment = false;
    }
  }

  onCancelPayment() {
    this.displayModal = false;
  }

  close() {
    this.displayModal = false;
    this.displayModalChange.emit(this.displayModal);
  }
}
