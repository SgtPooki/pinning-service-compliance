import { Status } from '@ipfs-shipyard/pinning-service-client'

import { getInlineCid } from '../../utils/getInlineCid'
import { getJoiSchema } from '../../utils/constants'
import { ApiCall } from '../../ApiCall'
import type { ServiceAndTokenPair } from '../../types'

const addPin = async (pair: ServiceAndTokenPair) => {
  const cid = await getInlineCid()
  const schema = await getJoiSchema('PinStatus')

  const apiCall = new ApiCall({
    pair,
    fn: async (client) => await client.pinsPost({ pin: { cid } }),
    schema,
    title: `Pins post of CID '${cid}'`
  })

  apiCall.expect({
    title: `Pinning status is either ${Status.Queued}, ${Status.Pinning}, or ${Status.Pinned}`,
    fn: ({ result }) => result !== null && result.status !== Status.Failed && [Status.Queued, Status.Pinning, Status.Pinned].includes(result.status)
  })

  await apiCall.runExpectations()
}

export { addPin }
