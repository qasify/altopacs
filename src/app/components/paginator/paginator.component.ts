import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;

  ngOnInit() {
    this.calculateTotalPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.['totalItems'] && !changes?.['totalItems']?.firstChange) {
      this.calculateTotalPages();
    }
  }

  private calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  public goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  public getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }
}
