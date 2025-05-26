import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subject, interval } from 'rxjs';
import { exhaustMap, takeUntil, catchError } from 'rxjs/operators';
import { SeoService } from '../../../core/services/seo/seo.service';
import { Metrics, MonitorService, ThresholdTracking } from './monitor.service';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent implements OnInit, OnDestroy {
  metrics: Metrics | null = null;
  loading = true;
  isValidating = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;
  alert: ThresholdTracking;



  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private seoService: SeoService,
    private monitorService: MonitorService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.seoService.setMetaTitle('Server Monitor');
    this.seoService.setMetaDescription('Server monitoring dashboard showing system metrics and performance data');

    this.alert = {
      count: 0,
      last_memory: 0,
      last_cpu: 0
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Start polling only in browser (client-side)
      interval(5000)
        .pipe(
          takeUntil(this.destroy$),
          exhaustMap(() => {
            this.isValidating = true;

            this.error = null;

            return this.monitorService.getMetrics().pipe(
              catchError(err => {
                this.error = err.message || 'Failed to fetch metrics.';
                console.error('Fetch error:', err);
                throw err;
              })
            );
          })
        )
        .subscribe({
          next: (data) => {
            this.metrics = data;
            if (this.metrics.memory_usage.used_percent > 80) {

              this.alert.count = this.alert.count + 1 || 1;
              this.alert.last_memory = this.metrics.memory_usage.used_percent;
              this.alert.last_cpu = this.metrics.cpu_usage;

              if (this.alert.count > 5) {

                const msg = `Memory usage is at ${this.alert.last_memory}% and CPU usage is at ${this.alert.last_cpu}%`;

                new Notification('Server is under heavy load', {
                  body: msg,
                });

                this.alert = {
                  count: 0,
                  last_memory: 0,
                  last_cpu: 0
                };
              }
            }
            else {
              this.alert = {
                count: 0,
                last_memory: 0,
                last_cpu: 0
              };
            }
            this.isValidating = false;
          },
          error: () => {
            this.isValidating = false;
          }
        });

      // Initial fetch
      this.fetchMetrics();
    }
  }

  fetchMetrics() {
    this.loading = true;
    this.monitorService.getMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to fetch metrics.';
        this.loading = false;
        console.error('Initial fetch error:', err);
      }
    });
  }

  retry() {
    if (this.isBrowser) {
      this.fetchMetrics();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
