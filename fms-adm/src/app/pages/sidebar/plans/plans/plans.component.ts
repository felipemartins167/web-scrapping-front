// Angular Modules
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';

// Components
import { PaymentComponent } from '../../../../components/payment/payment.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CardModule, DropdownModule, DialogModule, PaymentComponent ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent {
  plans: any[] = [
    { name: 'Plano Básico', price: 29.99, description: 'Ideal para indivíduos e pequenas equipes.' },
    { name: 'Plano Pro', price: 59.99, description: 'Perfeito para profissionais e equipes em crescimento.' },
    { name: 'Plano Empresarial', price: 99.99, description: 'Soluções completas para grandes organizações.' }
  ];
  displaySubscribeDialog: boolean = false;
  displayPaymentDialog: boolean = false;
  selectedPlan: any = null;

  onPlanChange(event: any) {

  }

  confirmSubscription() {
    this.displaySubscribeDialog = false;
    this.displayPaymentDialog = true;
  }


}
