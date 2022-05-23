import { Address, dataSource, log, BigInt, store } from '@graphprotocol/graph-ts';
import { Frabric as FrabricContract, KYC, ParticipantChange, Vouch } from '../../generated/templates/Frabric/Frabric';
import { 
  BaseProposal, BondRemovalProposal, Frabric, FrabricParticipantRecord, ParticipantProposal, 
  ParticipantRemovalProposal, ThreadProposal, ThreadProposalProposal, TokenActionProposal, 
  UpgradeProposal, Vote, Voucher 
} from '../../generated/schema';
import { 
  Initialized, Proposal, ProposalStateChange, 
  BondRemovalProposal as BondRemovalProposalEvent,
  ParticipantProposal as ParticipantProposalEvent, 
  ParticipantRemovalProposal as ParticipantRemovalProposalEvent, 
  ThreadProposal as ThreadProposalEvent, 
  ThreadProposalProposal as ThreadProposalProposalEvent, 
  TokenActionProposal as TokenActionProposalEvent, 
  UpgradeProposal as UpgradeProposalEvent,
  Vote as VoteEvent,
} from '../../generated/templates/Frabric/Frabric';
import { frabricParticipantTypeAtIndex, proposalStateAtIndex, voteDirectionAtIndex } from './helpers/types';

// ### LIFECYCLE

export function handleInitialized(event: Initialized): void {

}

// ### PROPOSALS ###

// TODO: Extract reusable proposal and voting code

export function handleProposal(event: Proposal): void {
  let contract = FrabricContract.bind(event.address)

  let proposal = new BaseProposal(event.params.id.toString())
  proposal.frabric = event.address.toString()
  proposal.creator = event.params.creator
  // TODO: Smart-map it to a type convenient for the frontend
  proposal.type = event.params.proposalType.toI32()
  proposal.state = "Null"
  proposal.info = event.params.info
  proposal.supermajority = event.params.supermajority
  proposal.startTimestamp = event.block.timestamp.toI32()
  proposal.endTimestamp = proposal.startTimestamp + contract.votingPeriod().toI32()
  proposal.save()
}

export function handleProposalStateChange(event: ProposalStateChange): void {
  let proposal = new BaseProposal(event.params.id.toString())
  proposal.state =  proposalStateAtIndex(event.params.state)
  proposal.save()
}

export function handleVote(event: VoteEvent): void {
  let voteId = event.params.id.toString().concat("_").concat(event.params.voter.toHexString())

  let vote = new Vote(voteId)
  vote.proposal = BaseProposal.load(event.params.id.toString())!.id
  vote.voter = event.params.voter
  vote.voteDirection = voteDirectionAtIndex(event.params.direction)
  vote.count = event.params.votes
  vote.save()
}

export function handleBondRemovalProposal(event: BondRemovalProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new BondRemovalProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.participant = event.params.participant
  proposal.slash = event.params.slash
  proposal.amount = event.params.amount
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

export function handleParticipantProposal(event: ParticipantProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new ParticipantProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.participant = event.params.participant
  proposal.proposer = event.params.proposer
  proposal.participant = event.params.participant
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

export function handleParticipantRemovalProposal(event: ParticipantRemovalProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new ParticipantRemovalProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.participant = event.params.participant
  proposal.removalFee = event.params.fee
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

export function handleThreadProposal(event: ThreadProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new ThreadProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.governor = event.params.governor
  proposal.name = event.params.name
  proposal.symbol = event.params.symbol
  proposal.descriptor = event.params.descriptor
  proposal.data = event.params.data
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

export function handleThreadProposalProposal(event: ThreadProposalProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new ThreadProposalProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.thread = event.params.thread
  proposal.info = event.params.info
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

export function handleTokenActionProposal(event: TokenActionProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new TokenActionProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.token = event.params.token
  proposal.target = event.params.target
  proposal.mint = event.params.mint
  proposal.price = event.params.price
  proposal.amount = event.params.amount
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

export function handleUpgradeProposal(event: UpgradeProposalEvent): void {
  let frabric = Frabric.load(event.address.toString())!

  let baseProposal = BaseProposal.load(event.params.id.toHexString())!

  let proposal = new UpgradeProposal(event.params.id.toString())
  proposal.frabric = frabric.id
  proposal.beacon = event.params.beacon
  proposal.instance = event.params.instance
  proposal.version = event.params.version
  proposal.code = event.params.code
  proposal.data = event.params.data
  proposal.baseProposal = baseProposal.id
  proposal.save()
}

// ### PARTICIPANTION ###

export function handleKYC(event: KYC): void {
  // Not adding much to the indexed state for now
}

export function handleParticipantChange(event: ParticipantChange): void {
  let participant = new FrabricParticipantRecord(event.params.participant.toString())
  participant.frabric = event.address.toString()
  participant.address = event.params.participant
  participant.type = frabricParticipantTypeAtIndex(event.params.participantType)
  participant.save()
}

export function handleVouch(event: Vouch): void {
  let voucher = new Voucher(event.params.voucher.toString().concat(event.params.vouchee.toString()))
  voucher.frabric = event.address.toString()
  voucher.signer = event.params.voucher
  voucher.participant = event.params.vouchee
  voucher.save()
}