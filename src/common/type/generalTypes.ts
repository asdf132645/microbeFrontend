export type GenericObject = { [key: string]: any }

export type Endpoint = { endpoint: string, requiresToken: boolean }

export type IntervalType = NodeJS.Timeout | number | null;