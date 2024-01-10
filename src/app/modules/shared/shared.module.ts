import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    DialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent
  ],
  exports: [
    MatDialogModule,
    DialogComponent,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent
  ],
})
export class SharedModule {}
