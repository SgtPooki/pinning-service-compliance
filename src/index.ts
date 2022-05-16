#!/usr/bin/env node
import { writeSync } from 'fs'

import { getAllPins, checkEmptyBearerToken, checkInvalidBearerToken, addPin, deleteAllPins, testPagination, deleteNewPin, replacePin, matchPin } from './checks/index.js'
import { cli } from './cli/index.js'
import { serviceAndToken } from './cli/options/index.js'
import { writeHeaders } from './output/reporting.js'
import type { ServiceAndTokenPair } from './types.js'
import { logger } from './utils/logs.js'

const validatePinningService = async (pair: ServiceAndTokenPair) => {
  const complianceCheckFunctions = [checkEmptyBearerToken, checkInvalidBearerToken, addPin, deleteNewPin, getAllPins, replacePin, matchPin, testPagination, deleteAllPins]
  for await (const complianceCheckFn of complianceCheckFunctions) {
    logger.debug(`Starting compliance check '${complianceCheckFn.name}'`)
    try {
      await complianceCheckFn(pair)
    } catch (err) {
      logger.error(`Problem running compliance check: '${complianceCheckFn.name}': ${err as string}`)
      // logger.error(err)
    }
  }
}

const main = async () => {
  const argv = await cli.option('serviceAndToken', { require: true, ...serviceAndToken }).argv

  for await (const serviceAndToken of argv.serviceAndToken) {
    const [service, key] = serviceAndToken

    try {
      await validatePinningService([service, key])
    } catch (err) {
      logger.error('could not validate pinning service')
      logger.error(err)
    }
  }
  await writeHeaders()
}
main().catch((err) => {
  logger.error(err)
  process.exit(1)
})

process.on('unhandledRejection', (err, origin) => {
  logger.log('unhandledRejection', err)
  writeSync(
    process.stderr.fd,
    `Caught exception: ${JSON.stringify(err, null, 2)}\n`
  )
})
process.on('uncaughtException', (err, origin) => {
  logger.log('uncaughtException', err)
  writeSync(
    process.stderr.fd,
    `Caught exception: ${JSON.stringify(err, null, 2)}\n` +
    `Exception origin: ${origin}`
  )
})
