import { Contract } from '@ethersproject/contracts'
import { GOVERNOR_ADDRESS, TOKEN_ADDRESS } from '../constants'
import governorAbi from '../constants/abis/governor.json'
import tokenAbi from '../constants/abis/tokenAbi.json'
import { Web3Provider } from '@ethersproject/providers'
// import Web3 from 'web3'; 

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
    
    public async postPropose(params:any) {
        return await this.contract['propose(address[],uint256[],bytes[],string)'](params.targets, params.values, params.calldata, params.description);
    }
    public async postvoteWithReason(params: any) {
        return await this.contract.castVoteWithReason(params.proposalId.id, params.support, params.reason);
        //  return await this.contract.castvoteWithReason(data.proposalId, data.support, data.reason);
    }
    public async postvoteWithoutReason(params: any) {
        return await this.contract.castVoteWithReason(params.proposalId.id, params.support);
        //  return await this.contract.castvoteWithReason(data.proposalId, data.support, data.reason);
    }

    public async getQuorumVotes() {
        return await this.contract.quorumVotes()
    }

    public async getVotingDelay() {
        return await this.contract.votingDelay()
    }
    public async getVotingPeriode() {
        return await this.contract.votingPeriod()
    }

    public enumerateProposalState = (state: number) => {
        const proposalStates = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
        return proposalStates[state];
    };
  
    public async getProposals(){
        let filter = this.contract.filters.ProposalCreated();
        const proposalCreatedEvents = await this.contract.queryFilter(filter, 0, 'latest');
    
          let proposals = [];
          for(let i=proposalCreatedEvents.length-1;i>=0;i--){
            var d = proposalCreatedEvents[i];
            if(d.args != undefined){
                var id = d.args.proposalId;
                var proposal = await this.contract.proposals(id);
                var state = await this.contract.state(id);

                let newProposal = Object.assign({}, proposal);
                newProposal.state = this.enumerateProposalState(state);
                newProposal.title = d.args.description.split("|")[0];
                newProposal.description = d.args.description;
                proposals.push(newProposal);
            }
          }
        return proposals;
    }

    public async getToken(){
        return await this.tokenContract.balanceOf(this.account);
    }

    public async getCurrentDelegate() {
        return await this.tokenContract.delegates(this.account);
    }

    public async delegate(delegateTo : string){
        return await this.tokenContract.delegate(delegateTo);
    }

    public async getVotingPower(){
        let filter = this.tokenContract.filters.DelegateVotesChanged();
        const delegations = await this.tokenContract.queryFilter(filter, 0, 'latest');
        const delegateAccounts: {[key: string]: any} = [];
        for(let i=0;i<delegations.length;i++){
            let d = delegations[i];

            if(d.args != undefined){
                let delegate = d.args.delegate;
                let newBalance = d.args.newBalance;
                delegateAccounts[delegate] = newBalance;    
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
        return delegates;
    }
}