import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  patients: any[] = [
    // Sample patient data
    { id: 1, name: 'John Doe', age: 35, issue: 'Headache' },
    { id: 2, name: 'Abraham', age: 35, issue: 'Headache' },
    { id: 3, name: 'Alexa', age: 35, issue: 'Headache' },
    { id: 4, name: 'Bieber', age: 35, issue: 'Headache' },
    { id: 5, name: 'Max', age: 35, issue: 'Headache' },
    { id: 6, name: 'Doe', age: 35, issue: 'Headache' },
    { id: 7, name: 'Danzig', age: 35, issue: 'Headache' },
    { id: 8, name: 'Zia', age: 35, issue: 'Headache' },
    { id: 9, name: 'Baber', age: 35, issue: 'Headache' },
    { id: 10, name: 'Jin', age: 35, issue: 'Headache' },
    { id: 11, name: 'Zoro', age: 35, issue: 'Headache' },
    {
      id: 12,
      name: 'Jane Smith',
      age: 28,
      issue: 'Stomach pains',
    },
    // ... more patients
  ];

  filteredPatients: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Adjust as needed

  ngOnInit() {
    this.filterPatients();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterPatients(input?.value);
  }

  filterPatients(searchTerm?: string) {
    if (searchTerm) {
      this.filteredPatients = this.patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.issue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.filteredPatients = this.patients;
    }
    this.currentPage = 1;
  }

  getPatientImageUrl(patient: any) {
    // Implement logic to get the image URL based on the patient object
    return 'assets/images/avatar-placeholder.png';
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
