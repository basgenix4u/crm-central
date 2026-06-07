import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-opportunity-form', standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Opportunity' : 'New Opportunity' }}</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Opportunity Name</mat-label><input matInput [(ngModel)]="form.name" required></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Stage</mat-label>
          <mat-select [(ngModel)]="form.stage" required>
            <mat-option value="PROSPECT">Prospect</mat-option><mat-option value="QUALIFIED">Qualified</mat-option>
            <mat-option value="PROPOSAL_SENT">Proposal Sent</mat-option><mat-option value="NEGOTIATION">Negotiation</mat-option>
            <mat-option value="WON">Won</mat-option><mat-option value="LOST">Lost</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Amount</mat-label><input matInput type="number" [(ngModel)]="form.amount"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Probability (%)</mat-label><input matInput type="number" [(ngModel)]="form.probability" min="0" max="100"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Expected Close Date</mat-label><input matInput [(ngModel)]="form.expectedCloseDate" type="date"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Type</mat-label>
          <mat-select [(ngModel)]="form.type"><mat-option value="New Business">New Business</mat-option><mat-option value="Existing Business">Existing</mat-option><mat-option value="Renewal">Renewal</mat-option></mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Next Step</mat-label><input matInput [(ngModel)]="form.nextStep"></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput rows="3" [(ngModel)]="form.description"></textarea></mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!form.name||!form.stage"><mat-icon>save</mat-icon> {{ data?.id ? 'Update' : 'Create' }}</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px}.full-width{grid-column:1/-1}mat-form-field{width:100%}mat-dialog-content{max-height:70vh}`]
})
export class OpportunityFormComponent implements OnInit {
  form: any = { name:'',stage:'PROSPECT',amount:null,probability:null,expectedCloseDate:'',type:'New Business',nextStep:'',description:'' };
  constructor(public dialogRef: MatDialogRef<OpportunityFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() { if (this.data) this.form = { ...this.data }; }
  save() { this.dialogRef.close(this.form); }
}
