import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  @Output() confirmDeleteEvent = new EventEmitter<void>();
  @Input() itemName: string = '';


  constructor(private renderer: Renderer2, private el: ElementRef) {}


  confirmDelete() {
    this.confirmDeleteEvent.emit();
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
    }
   
  }


  openModal(itemName: string) {
    this.itemName = itemName;
    this.showModal();
  }


  closeModal() {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
    }
    this.itemName = '';
    this.hideModal();
  }


  get confirmationMessage(): string {
    return `Are you sure you want to delete "${this.itemName}"?`;
  }


  private showModal() {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }


  private hideModal() {
    const modal = document.getElementById('deleteConfirmationModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }


}

