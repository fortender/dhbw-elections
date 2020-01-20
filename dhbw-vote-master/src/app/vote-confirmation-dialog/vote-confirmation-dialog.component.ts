import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  candidateName: string;
}

@Component({
  selector: 'app-vote-confirmation-dialog',
  templateUrl: 'vote-confirmation-dialog.component.html',
})
export class VoteConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<VoteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
