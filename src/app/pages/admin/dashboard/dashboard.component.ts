import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { fadeAnimation } from '../../../widgets/animations/fade.animation';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    ChartModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [fadeAnimation]
})
export class DashboardComponent implements OnInit {
  salesData: any;
  revenueData: any;
  transactions: any;
  chartOptions: any;

  data: any;
  options: any;
  basicData: any;
  lineData: any;
  basicOptions: any;
  lineOptions: any;
  pieData: any;
  pieOptions: any;
  ngOnInit() {
    this.initializeSalesData();
    this.initializeRevenueData();
    this.initializeTransactions();
    this.initializeChartOptions();

    /* PIE CHART - Revenue by Merchants */
    this.data = {
      labels: ['Merchant A', 'Merchant B', 'Merchant C'],
      datasets: [
        {
          data: [54000, 32500, 70200],
          backgroundColor: ['#5A8DEE', '#F86666', '#6ECB63'], // Muted blue, red, and green
          hoverBackgroundColor: ['#486FB7', '#DC5B5B', '#5AA551'] // Slightly darker tones for hover
        }
      ]
    };

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#FFFFFF' // White text for better visibility on dark backgrounds
          }
        }
      }
    };

    /* BAR CHART */
    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Store A',
          data: [12000, 15000, 18000, 9000],
          backgroundColor: 'rgba(90, 141, 238, 0.7)', // Muted blue with transparency
          borderColor: 'rgba(90, 141, 238, 1)', // Solid blue
          borderWidth: 1
        },
        {
          label: 'Store B',
          data: [10000, 14000, 10000, 8000],
          backgroundColor: 'rgba(248, 102, 102, 0.7)', // Muted red with transparency
          borderColor: 'rgba(248, 102, 102, 1)', // Solid red
          borderWidth: 1
        },
        {
          label: 'Store C',
          data: [20000, 18000, 22000, 12000],
          backgroundColor: 'rgba(108, 203, 99, 0.7)', // Muted green with transparency
          borderColor: 'rgba(108, 203, 99, 1)', // Solid green
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#FFFFFF' // White for better contrast
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#DDDDDD' // Light gray for x-axis labels
          },
          grid: {
            color: '#333333' // Subtle dark gridlines
          }
        },
        y: {
          ticks: {
            color: '#DDDDDD' // Light gray for y-axis labels
          },
          grid: {
            color: '#333333' // Subtle dark gridlines
          }
        }
      }
    };

    /* LINE CHART */
    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          type: 'line',
          label: 'Apple',
          borderColor: '#5A8DEE', // Muted blue
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: [4000, 3000, 2000, 5000, 7000, 6000, 8000]
        },
        {
          type: 'bar',
          label: 'Samsung',
          backgroundColor: '#F86666', // Muted red
          data: [3000, 4000, 5000, 3000, 2000, 4000, 5000],
          borderColor: '#DC5B5B', // Slightly darker red for borders
          borderWidth: 2
        },
        {
          type: 'bar',
          label: 'Nike',
          backgroundColor: '#F9C74F', // Muted yellow
          data: [2000, 1000, 4000, 3000, 5000, 4000, 3000]
        }
      ]
    };

    this.lineOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: '#FFFFFF' // White for legend text
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#DDDDDD' // Light gray
          },
          grid: {
            color: '#333333' // Subtle gridlines
          }
        },
        y: {
          ticks: {
            color: '#DDDDDD' // Light gray
          },
          grid: {
            color: '#333333' // Subtle gridlines
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
      responsive: true,
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