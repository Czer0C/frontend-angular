import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout, finalize } from 'rxjs/operators';

export interface MemoryUsage {
  total: string;
  used: string;
  free: string;
  used_percent: number;
}

export interface Metrics {
  cpu_usage: number;
  memory_usage: MemoryUsage;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  private apiUrl = 'http://localhost:8081/metrics';
  private readonly TIMEOUT = 30000; // Increased to 30 seconds
  private readonly RETRY_COUNT = 3;
  private readonly RETRY_DELAY = 2000; // Increased to 2 seconds

  constructor(private http: HttpClient) { }

  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(this.apiUrl).pipe(
      timeout(this.TIMEOUT), // ⏳ Timeout after 30s
      retry({ count: this.RETRY_COUNT, delay: this.RETRY_DELAY }), // 🔁 Retry with delay
      catchError(this.handleError) // ❌ Handle errors
      ,finalize(() => {
        console.log('Metrics request completed');
      })
    );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error instanceof Error && error.name === 'HttpErrorResponse') {
      errorMessage = 'Request timed out. The server is taking too long to respond.';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check if the server is running.';
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('Monitor Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}


