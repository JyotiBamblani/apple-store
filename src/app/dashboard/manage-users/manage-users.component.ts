import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { StoreService } from '../../services/store.service';
import { UserTableComponent } from '../../components/user-table/user-table.component';

const PAGE_SIZE = 5;

/** Dashboard page: paginated user table and edit-user popup (name, items editable; email read-only) */
@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, FormsModule, UserTableComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
  private store = inject(StoreService);
  users = this.store.users;
  currentPage = signal(1);
  pageSize = PAGE_SIZE;
  editPopupVisible = signal(false);
  editingUser: User | null = null;
  editName = '';
  editItemsPurchased = 0;

  totalPages = computed(() => Math.max(1, Math.ceil(this.users().length / this.pageSize)));
  paginatedUsers = computed(() => {
    const list = this.users();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });
  canGoPrevious = computed(() => this.currentPage() > 1);
  canGoNext = computed(() => this.currentPage() < this.totalPages());

  previousPage(): void {
    if (this.canGoPrevious()) this.currentPage.update((p) => p - 1);
  }

  nextPage(): void {
    if (this.canGoNext()) this.currentPage.update((p) => p + 1);
  }

  /** Open edit popup with user data (email is non-editable) */
  openEdit(user: User): void {
    this.editingUser = { ...user };
    this.editName = user.name;
    this.editItemsPurchased = user.itemsPurchased;
    this.editPopupVisible.set(true);
  }

  closeEdit(): void {
    this.editPopupVisible.set(false);
    this.editingUser = null;
  }

  /** Save edited name and items purchased to StoreService (persists to localStorage) */
  saveEdit(): void {
    if (!this.editingUser) return;
    const nameTrim = this.editName.trim();
    if (!nameTrim) return;
    const items = Math.max(0, Math.floor(Number(this.editItemsPurchased)));
    this.store.updateUser(this.editingUser.id, { name: nameTrim, itemsPurchased: items });
    this.closeEdit();
  }

  /** Close popup when clicking backdrop */
  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('popup-backdrop')) this.closeEdit();
  }
}
