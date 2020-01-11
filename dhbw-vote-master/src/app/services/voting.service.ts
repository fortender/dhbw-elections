import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Candidate } from '../candidate';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  constructor(private authenticationService: AuthenticationService,
              private http: HttpClient) { }

  hasVoted(): Observable<boolean> {
    const path = `${environment.apiUrl}/users/${encodeURIComponent(this.authenticationService.currentUserValue.mail)}`;
    return this.http.get<{ mail: string, voted: number }>(path).pipe(map(obj => obj.voted != null));
  }

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<{ candidates: Candidate[] }>(`${environment.apiUrl}/candidates`).pipe(map(obj => obj.candidates));
  }

  vote(candidate: Candidate): Observable<boolean> {
    const path = `${environment.apiUrl}/users/${encodeURIComponent(this.authenticationService.currentUserValue.mail)}`;
    return this.http.put<{ success: boolean }>(path, { candidate }).pipe(map(obj => obj.success));
  }

}
