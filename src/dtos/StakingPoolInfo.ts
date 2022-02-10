import { TokenInfo } from "./TokenInfo";

export class StakingPoolInfo {
    public stakingToken: TokenInfo
    public apy: number
    public name: string
    public poolId?: number

    constructor(stakingToken: TokenInfo, apy: number, name: string, poolId?: number)
    {
        this.stakingToken = stakingToken
        this.apy = apy
        this.name = name
        this.poolId = poolId
    }
}