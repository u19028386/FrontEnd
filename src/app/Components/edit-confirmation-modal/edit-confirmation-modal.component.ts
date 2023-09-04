import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-edit-confirmation-modal',
  templateUrl: './edit-confirmation-modal.component.html',
  styleUrls: ['./edit-confirmation-modal.component.css']
})
export class EditConfirmationModalComponent {
  @Output() confirmEditEvent = new EventEmitter<void>();
  @Input() itemName: string = '';
  @Input() displayModal: boolean = false;


  constructor(private renderer: Renderer2, private el: ElementRef) {}


  confirmEdit() {
    this.confirmEditEvent.emit();
    const modal = document.getElementById('editConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }


  openModal(itemName: string) {
    this.itemName = itemName;
    this.showModal();
  }


  closeModal() {
    const modal = document.getElementById('editConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.itemName = '';
    this.hideModal();
  }


  get confirmationMessage(): string {
    return `Are you sure you want to update "${this.itemName}"?`;
  }


  private showModal() {
    const modal = document.getElementById('editConfirmationModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }


  private hideModal() {
    const modal = document.getElementById('editConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}

