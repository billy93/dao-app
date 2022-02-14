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
    }

    public async postvoteWithoutReason(params: any) {
        return await this.contract.castVote(params.proposalId.id, params.support);
    }

    public async postProposalToQueue(proposalId: any) {
        return await this.contract['queue(uint256)'](proposalId.proposalId);
    }

    public async postProposalToCancel(proposalId: any) {
        return await this.contract['cancel(uint256)'](proposalId);
    }

    public async postProposalToExecute(proposalId: any) {
        return await this.contract['execute(uint256)'](proposalId);
    }

    public async getListActions(proposalId: any) {
        return await this.contract.getActions(proposalId);
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

    public async getVotes(id : any){
        let filter = this.contract.filters.VoteCast();
        const voteCastEvents = await this.contract.queryFilter(filter, 0, 'latest');

        let submittedBallots = voteCastEvents;
        let formattedBallots: { blockNumber: number; address: any; support: string; supportAsText: string; votes: string; reason: any }[] = [];
        console.log(id)
        submittedBallots.forEach((ballot) => {
            if(ballot.args != null){
                const { voter, support, weight, proposalId, reason } = ballot.args;
                let supportAsText = 'Against';
                if (support == 1) {
                    supportAsText = 'In Favor';
                } else if (support == 2) {
                    supportAsText = 'Abstain';
                }
                if (proposalId == id) {
                    formattedBallots.push({
                        blockNumber: ballot.blockNumber,
                        address: voter.substring(0,4),
                        support: support,
                        supportAsText: supportAsText,
                        votes: (parseFloat(weight) / 1e18).toFixed(2),
                        reason
                    });
                }
            }
        });

        formattedBallots.reverse();
        return formattedBallots;
    }

    public async getProposalById(proposalId: any) {
        let filter = this.contract.filters.ProposalCreated();
        const proposalCreatedEvents = await this.contract.queryFilter(filter, 0, 'latest');

        let newProposal = null;
        for(let i=proposalCreatedEvents.length-1;i>=0;i--){
            var d = proposalCreatedEvents[i];
            if(d.args != undefined){
                var id = d.args.proposalId;
                if(id == proposalId){
                    var proposal = await this.contract.proposals(id);  
                    var state = await this.contract.state(id);

                    newProposal = Object.assign({}, proposal);
                    newProposal.state = this.enumerateProposalState(state);
                    newProposal.title = d.args.description.split("|")[0];

                    try{
                        newProposal.description = d.args.description.split("|")[1];          
                    }catch(e){
                        newProposal.description = d.args.description;
                    }
                    break;
                }
            }
        }
        return newProposal;
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