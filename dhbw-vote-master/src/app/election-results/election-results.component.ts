import { OnInit, Component, Input } from '@angular/core';
import { VotingService } from '../services/voting.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
    selector: 'app-election-results',
    templateUrl: './election-results.component.html',
    styleUrls: ['./election-results.component.css']
})
export class ElectionResultsComponent implements OnInit {

    @Input()
    electionId: number;
    election: any;
    totalVotes: number;

    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'left',
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
                },
            },
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem, chart) => {
                    const dataset = chart.datasets[tooltipItem.datasetIndex];
                    const label = chart.labels[tooltipItem.index];
                    const datasetLabel = typeof label === 'string' ? label : label[0];
                    const value = dataset.data[tooltipItem.index] as number;
                    const total = (dataset.data as string[]).reduce((prev, cur) => prev + parseInt(cur, 10), 0);
                    return `${datasetLabel}: ${value} Stimme(n) (${(value / total * 100).toFixed(2)} %)`;
                }
            }
        }
    };
    pieChartLabels: Label[] = [];
    pieChartData: number[] = [];
    pieChartType: ChartType = 'pie';
    pieChartLegend = true;
    pieChartPlugins = [pluginDataLabels];
    pieChartColors = [{backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3']}];

    constructor(private votingService: VotingService,
                private activatedRoute: ActivatedRoute,
                private alertService: AlertService) { }

    ngOnInit(): void {
        this.electionId = this.activatedRoute.snapshot.params.election_id;
        this.votingService.getElection(this.electionId).subscribe(
            election => this.election = election,
            error => this.alertService.error(error.error.errorDescription, false)
        );
        this.votingService.getElectionResults(this.electionId).subscribe(
            success => {
                const candidates: any[] = success.result;
                this.totalVotes = candidates.reduce((prev, cur) => prev + parseInt(cur.votes, 10), 0);
                this.pieChartLabels = candidates.map(c => [
                    `${c.first_name} ${c.last_name}`,
                    `${c.votes} Stimmen`,
                    `${(c.votes / this.totalVotes * 100).toFixed(2)} %`
                ]);
                this.pieChartData = candidates.map(c => c.votes as number);
            },
            error => this.alertService.error(error.error.errorDescription, false)
        );
    }

    // events
    public chartClicked(e: any): void {
        //console.log(e);
    }

    public chartHovered(e: any): void {
        //console.log(e);
    }

}
