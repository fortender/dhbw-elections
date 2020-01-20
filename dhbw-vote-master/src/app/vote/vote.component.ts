import { Component, OnInit, Input } from '@angular/core';
import { VotingService } from '../services/voting.service';
import { Candidate } from '../candidate';
import { AlertService } from '../services/alert.service';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

    @Input()
    electionId: number;

    election: any;
    selectedCandidate: any;
    voteId: number;

    constructor(private votingService: VotingService,
                private alertService: AlertService) { }

    ngOnInit() {
        if (!this.electionId) {
            this.electionId = 3;
        }
        this.votingService.getElection(this.electionId).pipe(
            concatMap(election => this.votingService.getElectionCandidates(election.id)
            .pipe(map(res => (election.candidates = res, election))))
        ).subscribe(
            election => {
                this.election = election;
                this.voteId = election.voteId;
            },
            error => this.alertService.error(error.error.errorDescription, false)
        );
    }

    vote() {
        this.votingService.vote(this.selectedCandidate).subscribe(voteId => {
            this.voteId = voteId;
            this.alertService.success(`Successfully voted for ${this.selectedCandidate.first_name} ${this.selectedCandidate.last_name}! Your id: ${voteId}`, false);
        }, error => {
            this.voteId = null;
            this.alertService.error(error.error.errorDescription, false);
        });
    }

}
