import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';

@Component({
  selector: 'app-merchant-dashboard',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    ChartModule
  ],
  templateUrl: './merchant-dashboard.component.html',
  styleUrl: './merchant-dashboard.component.scss',
  animations: [fadeAnimation]
})
export class MerchantDashboardComponent {
  salesData: any;
  revenueData: any;
  transactions: any;
  chartOptions: any;

  lineData: any;
  lineOptions: any;
  pieData: any;
  pieOptions: any;
  ngOnInit() {
    this.initializeSalesData();
    this.initializeRevenueData();
    this.initializeTransactions();
    this.initializeChartOptions();

    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'line',
          label: 'Apple',
          borderColor: '#8BA9FF',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: [4000, 3000, 2000, 5000, 7000, 6000, 8000]
        },
        {
          type: 'bar',
          label: 'Samsung',
          backgroundColor: '#A8DFC1',
          data: [3000, 4000, 5000, 3000, 2000, 4000, 5000],
          borderColor: '#67e09e',
          borderWidth: 2
        },
        {
          type: 'bar',
          label: 'Nike',
          backgroundColor: '#66D2D6',
          data: [2000, 1000, 4000, 3000, 5000, 4000, 3000]
        }
      ]
    };

    this.lineOptions = {
      maintainAspectRatio: true,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#444444' // Darker gray for legend text
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#333333' // Darker gray for x-axis labels
          },
          grid: {
            color: '#CCCCCC' // Light gray gridlines
          }
        },
        y: {
          ticks: {
            color: '#333333' // Darker gray for y-axis labels
          },
          grid: {
            color: '#CCCCCC' // Light gray gridlines
          }
        }
      }
    };

    this.pieData = {
      labels: ['Merchant A', 'Merchant B', 'Merchant C'],
      datasets: [
        {
          data: [54000, 32500, 70200],
          backgroundColor: ['#9BAEDB', '#FFD866', '#88D4B1'],
          hoverBackgroundColor: ['#8197C7', '#FFC247', '#70B899']
        }
      ]
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#4A5568'
          }
        }
      }
    };
  }

  initializeSalesData() {
    this.salesData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Sales',
          data: [3000, 5000, 4000, 7000, 8000, 12000],
          fill: false,
          borderColor: '#42A5F5',
        },
      ],
    };
  }

  initializeRevenueData() {
    this.revenueData = {
      labels: ['Product A', 'Product B', 'Product C'],
      datasets: [
        {
          data: [50, 25, 25],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };
  }

  initializeTransactions() {
    this.transactions = [
      { date: '2024-12-01', customer: 'John Doe', amount: 120, status: 'completed' },
      { date: '2024-12-02', customer: 'Jane Smith', amount: 85, status: 'pending' },
      { date: '2024-12-03', customer: 'Michael Brown', amount: 250, status: 'failed' },
    ];
  }

  initializeChartOptions() {
    this.chartOptions = {
      responsive: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: number) => `$${value}`,
          },
        },
      },
    };
  }
}