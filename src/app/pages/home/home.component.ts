import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { PATIENTS } from '../../mockData';
import { Router } from '@angular/router';
import { Patient } from '../../types/Patient';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  patients: Patient[] = PATIENTS;

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

  examinePatient(id: number) {
    this.router.navigate(['/examine'], {
      queryParams: { id: id },
      queryParamsHandling: 'merge',
    });
  }
}
