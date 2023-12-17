import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Chart, registerables } from 'chart.js/auto';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  authStateSubscription: Subscription;
  userGraph: any = {};  // Initialize userGraph as an empty object
  myChart: Chart; // Variable to hold a reference to the chart

  @ViewChild('myCanvas') myCanvas: ElementRef; // Reference to the canvas element

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.afAuth && this.authService.afAuth.authState) {
      this.authStateSubscription = this.authService.afAuth.authState.subscribe((user) => {
        if (user) {
          // Get the user data from the database
          this.userGraph = { ...this.authService.userData };
          this.initChart();
        }
      });
    }
  }
  
  ngOnDestroy(): void {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  initChart() {
    if (this.userGraph && this.userGraph.banking) {
      const sumByDate = {};
      this.userGraph.banking.forEach(transaction => {
        // Sums the amount for each date
        const date = transaction.date;
        if (!sumByDate[date]) {
          sumByDate[date] = 0;
        }
        sumByDate[date] += transaction.amount;
      });

      const dates = Object.keys(sumByDate);
      const amounts = Object.values(sumByDate);
      const colors = amounts.map(amount => (Number(amount) >= 0) ? '#1ea44a' : '#da2121');

      // Obtain a reference to the canvas element
      const ctx: CanvasRenderingContext2D = this.myCanvas.nativeElement.getContext('2d');

      Chart.defaults.color = '#fff';

      // Create the chart with Chart.js
      this.myChart = new Chart<"bar", (number | [number, number] )[], string>(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: 'Amount',
            data: amounts as (number | [number, number] )[],
            backgroundColor: colors,
            borderWidth: 2,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Kontaki Chart'
            }
          },
          scales: {
            x: {
              display: true
            },
            y: {
              display: false,
            }
          }
        }
      });
    }
  }
}
