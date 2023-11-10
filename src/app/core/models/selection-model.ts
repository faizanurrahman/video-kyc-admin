class SelectionModel<T> {
  private selectedItems: Set<T>;

  constructor() {
    this.selectedItems = new Set<T>();
  }

  select(item: T): void {
    this.selectedItems.add(item);
  }

  deselect(item: T): void {
    this.selectedItems.delete(item);
  }

  toggle(item: T): void {
    if (this.isSelected(item)) {
      this.deselect(item);
    } else {
      this.select(item);
    }
  }

  isSelected(item: T): boolean {
    return this.selectedItems.has(item);
  }

  getSelectedItems(): T[] {
    return Array.from(this.selectedItems);
  }

  clearSelection(): void {
    this.selectedItems.clear();
  }
}
