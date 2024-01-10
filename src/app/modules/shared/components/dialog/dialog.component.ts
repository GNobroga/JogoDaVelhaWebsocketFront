import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface IDialogData {
  message: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {

  #dialogRef = inject(MatDialogRef<DialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogData) {}

  public refuse() {
    this.#dialogRef.close(false);
  }

  public accept() {
    this.#dialogRef.close(true);
  }
}
