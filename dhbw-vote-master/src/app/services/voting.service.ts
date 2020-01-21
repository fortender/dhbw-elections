import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Candidate } from '../candidate';
import { Observable, merge, combineLatest, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, first, mergeAll, toArray, mergeMap, flatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  constructor(private authenticationService: AuthenticationService,
              private http: HttpClient) { }

  /*
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
  */

  //

  getElections(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/elections`)
      .pipe(flatMap(result => {
        const results: any[] = result.result;
        return forkJoin(results
          .map(election => this.http.get<any>(`${environment.apiUrl}/elections/${election.id}`).pipe(first())));
      }));
  }

  getElection(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/elections/${id}`);
  }

  getElectionCandidates(electionId: number): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/elections/${electionId}/candidates`).pipe(map(result => result.result));
  }

  getElectionResults(electionId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/elections/${electionId}/results`);
  }

  getElectionResultSet(electionId: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/elections/${electionId}/results?mode=test&view=csv`, { responseType: 'text' });
  }

  vote(candidate: any): Observable<number> {
    const electionId = candidate.election_id;
    const candidateId = candidate.id;
    return this.http
      .post<{ voteId: number }>(`${environment.apiUrl}/elections/${electionId}/candidates/${candidateId}/vote`, { })
      .pipe(map(result => result.voteId));
  }

}
