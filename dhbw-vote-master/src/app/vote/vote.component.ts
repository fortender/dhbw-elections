import { Component, OnInit, Input } from '@angular/core';
import { VotingService } from '../services/voting.service';
import { Candidate } from '../candidate';
import { AlertService } from '../services/alert.service';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { VoteConfirmationDialogComponent } from '../vote-confirmation-dialog/vote-confirmation-dialog.component';

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
                private alertService: AlertService,
                private dialog: MatDialog) { }

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

    vote(candidate: any) {
        const dialogRef = this.dialog.open(VoteConfirmationDialogComponent, {
            width: '250px',
            data: { candidateName: `${candidate.first_name} ${candidate.last_name}` }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.dir(result);
            const confirmed = result as boolean;
            if (confirmed) {
                this.votingService.vote(candidate).subscribe(voteId => {
                    this.voteId = voteId;
                    this.alertService.success(`Successfully voted for ${candidate.first_name} ${candidate.last_name}! Your id: ${voteId}`, false);
                }, error => {
                    this.voteId = null;
                    this.alertService.error(error.error.errorDescription, false);
                });
            }
        });
    }

}
