import { mapStateToProps } from '../../../components/content/LogContent'
import { TransactionType } from '../../../unlock'
import configure from '../../../config'

const transactions = {
  '0x1234': {
    hash: '0x12345678',
    confirmations: 12,
    status: 'mined',
    lock: '0x12345678a',
    blockNumber: 1,
    type: TransactionType.LOCK_CREATION,
  },
  '0x5678': {
    hash: '0x56781234',
    confirmations: 4,
    status: 'mined',
    lock: '0x56781234a',
    blockNumber: 2,
    type: TransactionType.LOCK_CREATION,
  },
  '0x89ab': {
    hash: '0x9abcdef0',
    confirmations: 2,
    status: 'mined',
    lock: '0x9abcdef0a',
    blockNumber: 3,
    type: TransactionType.LOCK_CREATION,
  },
}

describe('Transaction Log', () => {
  describe('mapStateToProps', () => {
    const state = {
      account: {},
      network: {},
      transactions,
    }
    const config = configure()
    const { transactionFeed } = mapStateToProps(state, { config })
    it('Should provide a feed of transactions sorted by blockNumber, descending', () => {
      expect.assertions(4)
      expect(transactionFeed).toHaveLength(3)
      expect(transactionFeed[0].blockNumber).toEqual(3)
      expect(transactionFeed[1].blockNumber).toEqual(2)
      expect(transactionFeed[2].blockNumber).toEqual(1)
    })
    it('should include href to explorer in the feed', () => {
      expect.assertions(1)
      const tx = transactionFeed[0]
      expect(tx).toHaveProperty('href')
    })
  })
})
