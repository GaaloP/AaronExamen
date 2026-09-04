export class MetricsDto {
  metricData!: {
    openedTicketsCount: number;
    inProgressTicketsCount: number;
    closedTicketsCount: number;
    averageSolutionTime: number;
  };
}