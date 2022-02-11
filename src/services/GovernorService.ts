import { Contract } from '@ethersproject/contracts'
import { GOVERNOR_ADDRESS } from '../constants';
import governorAbi from '../constants/abis/governor.json';
import { Web3Provider } from '@ethersproject/providers'

export class GovernorService{

    public contract: Contract
    public account: string
    public chainId: number

    public constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(GOVERNOR_ADDRESS, governorAbi, signer);
        this.account = account;
        this.chainId = chainId;
    }

    public async getProposalThreshold() {
        return await this.contract.proposalThreshold()
    }
}