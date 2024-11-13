import {LocationQueryValue} from "vue-router";

export type GenericObject = { [key: string]: any }

export type Endpoint = { endpoint: string, requiresToken: boolean }

export type IntervalType = NodeJS.Timeout | number | null | undefined;

export type RouteType = LocationQueryValue | LocationQueryValue[];