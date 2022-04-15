
import type { ResponseContext } from '@ipfs-shipyard/pinning-service-client'

interface ComplianceCheckDetailsCallbackArg extends ResponseContext {
  response: ProcessedResponse
  errors: Error[]
  url: string
}
interface ProcessedResponse extends Response {
  text: string | null
  json: Record<string, any>
  // body: string | null
}

interface ComplianceCheckDetailsCallback {
  (details: ComplianceCheckDetailsCallbackArg): Promise<void>
}

interface ExpectationResult {
  error?: Error
  success: boolean
  title: string
}

type ServiceAndTokenPair = [endpointUrl: string, authToken: string | undefined]
// type ServiceAndTokenPairCollection = ServiceAndTokenPair[]

type PinsApiType = import('@ipfs-shipyard/pinning-service-client').PinsApi
type ImplementableMethods = keyof Omit<PinsApiType, 'withMiddleware' | 'withPreMiddleware' | 'withPostMiddleware'>
type PinsApiMethod<T extends ImplementableMethods = ImplementableMethods> = PinsApiType[T] extends never ? never : T
type SchemaNames = 'Delegates' | 'Failure' | 'Origins' | 'Pin' | 'PinMeta' | 'PinResults' | 'PinStatus' | 'StatusInfo' | 'Status' | 'TextMatchingStrategy'
type PinningSpecJoiSchema = Record<SchemaNames, import('@hapi/joi').Schema>

interface CheckResult {
  success: boolean
}

interface ComplianceCheckRequest {
  headers: Headers | string[][] | Record<string, string>
  body: string
}
interface ComplianceCheckResponse {
  headers: Headers | string[][] | Record<string, string>
  status: number
  statusText: string
  json: Record<string, any> | null
  body: string
}

interface ComplianceCheckDetails<T> {
  pair: ServiceAndTokenPair
  errors: Error[]
  url: string
  method: string
  title: string
  successful: boolean
  validationResult: import('@hapi/joi').ValidationResult | null
  request: ComplianceCheckRequest
  response: ComplianceCheckResponse
  result: T | null
  expectationResults: ExpectationResult[]

}
// interface ComplianceCheckFetchData {

// }
// type ResponseContext = import('@ipfs-shipyard/pinning-service-client').ResponseContext
// eslint-disable-next-line @typescript-eslint/dot-notation
interface ProcessedResponse extends Response {
  text: string | null
  json: Record<string, any>
  // body: string | null
}

interface ComplianceCheckDetailsCallback {
  (details: ComplianceCheckDetailsCallbackArg): void
}

export type {
  ComplianceCheckDetails,
  ExpectationResult,
  ProcessedResponse,
  ComplianceCheckDetailsCallback,
  ComplianceCheckDetailsCallbackArg,
  PinningSpecJoiSchema,
  ServiceAndTokenPair
}
