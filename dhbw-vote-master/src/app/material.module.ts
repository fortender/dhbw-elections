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
  MatFormFieldModule
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
    ReactiveFormsModule
  ],
})
export class MaterialModule { }
