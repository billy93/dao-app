import { Contract } from '@ethersproject/contracts'
import { GOVERNOR_ADDRESS, TOKEN_ADDRESS } from '../constants'
import governorAbi from '../constants/abis/governor.json'
import tokenAbi from '../constants/abis/tokenAbi.json'
import { Web3Provider } from '@ethersproject/providers'

export class GovernorService{

    public contract: Contract
    public tokenContract: Contract
    public account: string
    public chainId: number

    public constructor(library: Web3Provider, account: string, chainId: number) {
        const signer = library.getSigner(account).connectUnchecked();
        this.contract = new Contract(GOVERNOR_ADDRESS, governorAbi, signer);
        this.tokenContract = new Contract(TOKEN_ADDRESS, tokenAbi, signer);
        this.account = account;
        this.chainId = chainId;
    }

    public async getProposalThreshold() {
        return await this.contract.proposalThreshold()
    }

    public async getToken(){
        return await this.tokenContract.balanceOf(this.account);
    }

    public async getVotingPower(){
        let filter = this.tokenContract.filters.DelegateVotesChanged();
        // console.log(filter);

        const delegations = await this.tokenContract.queryFilter(filter, 0, 'latest');
        const delegateAccounts: {[key: string]: any} = [];
        for(let i=0;i<delegations.length;i++){
            let d = delegations[i];

            if(d.args != undefined){
                if( d.args.delegate == this.account){
                    let delegate = d.args.delegate;
                    let newBalance = d.args.newBalance;
                    delegateAccounts[delegate] = newBalance;    
                }
            }
        }

        const delegates: { delegate: string; vote_weight: any }[] = [];
        Object.keys(delegateAccounts).forEach((account) => {            
            let voteWeight = +delegateAccounts[account];
            // const voteWeight += delegateAccounts[account];
            if (voteWeight === 0) return;
            delegates.push({
                delegate: account,
                vote_weight: voteWeight
            });
        });

        delegates.sort((a, b) => {
            return a.vote_weight < b.vote_weight ? 1 : -1;
        });

        const maxSupply = 1000;
        delegates.forEach(d => {
            d.vote_weight = (100 * ((d.vote_weight / 1e18) / maxSupply)).toFixed(6) + '%';
        });

        // console.log(delegates);
        //   delegations.forEach((e: { returnValues: { delegate: any; newBalance: any } }) => {
            // const { delegate, newBalance } = e.returnValues;
            // delegateAccounts[delegate] = newBalance;
            // console.log(delegate, newBalance);
        //   });
        return delegates;
    }
}