import {
	Address, BigInt,
} from '@graphprotocol/graph-ts'

import {
  BondHoldings,
} from '../../../generated/schema'

export function getBondHoldings(bond: Address, governor: Address) {
  let id = bond.toString().concat("_").concat(governor.toString())

  let holdings = BondHoldings.load(id)

	if (holdings == null) {
		holdings = new BondHoldings(id)
    holdings.bond = bond.toString()
    holdings.governor = governor
    holdings.amount = BigInt.fromI32(0)
    holdings.save()
	}

	return holdings
}