import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../data/models/User';
import { Task } from '../data/models/Task';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private PetersPapersEndpoint = 'https://localhost:44362/api/user';

  constructor(private httpClient: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getUsers(q: string) {
    let uri = `${this.PetersPapersEndpoint}/getUsers`;
    if(q != undefined || q != null){
      uri = uri+`?q=${q}`
    }
    return this.httpClient
      .get(uri)
      .pipe(retry(3), catchError(this.handleError));
  }

  getDepartments() {
    return this.httpClient
      .get(`${this.PetersPapersEndpoint}/getDepartments`)
      .pipe(retry(3), catchError(this.handleError));
  }

  getTaskStatuses() {
    return this.httpClient
      .get(`${this.PetersPapersEndpoint}/getTaskStatuses`)
      .pipe(retry(3), catchError(this.handleError));
  }

  saveUser(user: User) {
    return this.httpClient
      .put(`${this.PetersPapersEndpoint}/saveUser`, user)
      .pipe(retry(3), catchError(this.handleError));
  }

  saveTasks(tasks: Task[]) {
    return this.httpClient
      .put(`${this.PetersPapersEndpoint}/saveTasks`, tasks)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteUser(userId: number) {
    return this.httpClient
      .delete(`${this.PetersPapersEndpoint}/deleteUser/${userId}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteTask(taskId: number) {
    return this.httpClient
      .delete(`${this.PetersPapersEndpoint}/deleteTask/${taskId}`)
      .pipe(retry(3), catchError(this.handleError));
  }
}
