import { Component, OnInit } from '@angular/core';
import { VotingService } from '../services/voting.service';
import { Candidate } from '../candidate';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

    selectedCandidate: Candidate;
    candidates: Candidate[];
    voted: boolean;

    constructor(private votingService: VotingService,
                private alertService: AlertService) { }

    ngOnInit() {
        this.votingService.getCandidates().subscribe(candidates => {
            this.candidates = candidates;
        }, error => {
            this.alertService.error(error, false);
        });
        this.votingService.hasVoted().subscribe(voted => {
            this.voted = voted;
        });
    }

    vote() {
        this.votingService.vote(this.selectedCandidate).subscribe(o => {
            this.voted = true;
            this.alertService.success(`Successfully voted for ${this.selectedCandidate.firstName} ${this.selectedCandidate.lastName}!`, false);
        }, error => {
            this.alertService.error(error, false);
        });
    }

}
