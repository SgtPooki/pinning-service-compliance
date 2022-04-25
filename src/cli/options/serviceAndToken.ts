import type { ServiceAndTokenPair } from '../../types'

const serviceAndToken = {
  alias: 's',
  description: 'An ipfs pinning service endpoint and the secret token for that endpoint',
  nargs: 2,
  requiresArg: true,
  coerce: (pinningServicePairs): ServiceAndTokenPair[] => {
    const coercedPairs: ServiceAndTokenPair[] = []
    if (pinningServicePairs == null) {
      return coercedPairs
    }
    for (let i = 0; i < pinningServicePairs.length; i += 2) {
      const [service, key] = pinningServicePairs.slice(i, i + 2)
      coercedPairs.push([service, key])
    }
    return coercedPairs
  }
}

export { serviceAndToken }
