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
  storeError = this.store.error;
  currentPage = signal(1);
  pageSize = PAGE_SIZE;
  editPopupVisible = signal(false);
  isCreateMode = signal(false);
  editingUser: User | null = null;
  editName = '';
  editEmail = '';
  editItemsPurchased = 0;
  editError = signal<string | null>(null);

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
    this.isCreateMode.set(false);
    this.editingUser = { ...user };
    this.editName = user.name;
    this.editEmail = user.email;
    this.editItemsPurchased = user.itemsPurchased;
    this.editPopupVisible.set(true);
    this.editError.set(null);
  }

  /** Open create user popup */
  openCreate(): void {
    this.isCreateMode.set(true);
    this.editingUser = null;
    this.editName = '';
    this.editEmail = '';
    this.editItemsPurchased = 0;
    this.editPopupVisible.set(true);
    this.editError.set(null);
  }

  closeEdit(): void {
    this.editPopupVisible.set(false);
    this.editingUser = null;
    this.editError.set(null);
  }

  /** Save user (create or update) via StoreService (persists to localStorage) */
  saveEdit(): void {
    this.editError.set(null);
    
    const nameTrim = this.editName.trim();
    if (!nameTrim) {
      this.editError.set('Name is required');
      return;
    }

    const items = Math.max(0, Math.floor(Number(this.editItemsPurchased)));
    if (isNaN(items)) {
      this.editError.set('Items purchased must be a valid number');
      return;
    }

    if (this.isCreateMode()) {
      const emailTrim = this.editEmail.trim();
      if (!emailTrim) {
        this.editError.set('Email is required');
        return;
      }

      const result = this.store.createUser({
        name: nameTrim,
        email: emailTrim,
        itemsPurchased: items
      });

      if (!result.success) {
        this.editError.set(result.error);
        console.error('Create user failed:', result.error);
      } else {
        this.closeEdit();
      }
    } else {
      if (!this.editingUser) return;

      const result = this.store.updateUser(this.editingUser.id, {
        name: nameTrim,
        itemsPurchased: items
      });

      if (!result.success) {
        this.editError.set(result.error);
        console.error('Update failed:', result.error);
      } else {
        this.closeEdit();
      }
    }
  }

  /** Delete a user (with confirmation) */
  onDelete(user: User): void {
    const confirmed = window.confirm(`Delete user "${user.name}" (${user.email})?`);
    if (!confirmed) return;

    const result = this.store.deleteUser(user.id);
    if (!result.success) {
      console.error('Delete user failed:', result.error);
      return;
    }

    // Adjust current page if necessary after deletion
    const total = this.totalPages();
    if (this.currentPage() > total) {
      this.currentPage.set(total);
    }
  }

  /** Close popup when clicking backdrop */
  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('popup-backdrop')) this.closeEdit();
  }

  /** Clear store error */
  clearStoreError(): void {
    this.store.clearError();
  }
}
