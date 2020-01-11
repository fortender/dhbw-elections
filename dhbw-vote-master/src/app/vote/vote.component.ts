import { Component, OnInit } from '@angular/core';
import { VotingService } from '../services/voting.service';
import { Candidate } from '../candidate';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

    candidates: Candidate[];
    voted: boolean;

    constructor(private votingService: VotingService) { }

    ngOnInit() {
        this.votingService.getCandidates().subscribe(candidates => {
            this.candidates = candidates;
        }, error => {
            console.error(error);
        });
        this.votingService.hasVoted().subscribe(voted => {
            this.voted = voted;
        });
    }

    vote() {
        this.votingService.vote(this.candidates[0]).subscribe(o => {
            console.dir(o);
            console.log('success: ', o);
        }, error => console.error(error));
    }

}
