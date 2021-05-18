/**
 * @param {string} lockAddres address of the lock
 * @param {string} tokenId
 */
export default async function (lockAddres, tokenId, provider) {
  const lockContract = await this.getLockContract(lockAddres, provider)

  return lockContract.keyManagerOf(tokenId)
}
