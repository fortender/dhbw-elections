import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatGridListModule,
  MatSelectModule,
  MatDialogModule,
  MatCardModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatListModule,
  MatRadioModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatListModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatListModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
})
export class MaterialModule { }
