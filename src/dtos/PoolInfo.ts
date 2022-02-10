export class PoolInfo {

    public artId: string;
    public allocationPoints: string;
    public lastTotalReward: string;
    public accRewardPerShare: string
    public active: boolean;
    public name: string;

    constructor(artId: string, allocationPoints: string, lastTotalReward: string, accRewardPerShare: string, name: string) {
        this.artId = artId
        this.allocationPoints = allocationPoints
        this.lastTotalReward = lastTotalReward;
        this.accRewardPerShare = accRewardPerShare;
        this.active = false;
        this.name = name;
    }
}