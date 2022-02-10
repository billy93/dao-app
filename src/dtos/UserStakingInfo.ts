import { StakingPoolInfo } from "./StakingPoolInfo";

export class UserStakingInfo {
    public pool: StakingPoolInfo
    public staked: number
    public rewards: number

    constructor(pool: StakingPoolInfo, staked: number, rewards: number)
    {
        this.pool = pool
        this.staked = staked
        this.rewards = rewards
    }
}