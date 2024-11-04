import {gql} from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
    DateTime: { input: any; output: any; }
};

export type CreateRuningInfoDto = {
    dayQuery: Scalars['String']['input'];
    runingInfoDtoItems: RuningInfoDtoItems;
    userId?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
    __typename?: 'Mutation';
    createRunningInfo: RuningInfoEntity;
};


export type MutationCreateRunningInfoArgs = {
    createRunningInfoDto: CreateRuningInfoDto;
};

export type Query = {
    __typename?: 'Query';
    getRunningInfoById?: Maybe<RuningInfoEntity>;
};


export type QueryGetRunningInfoByIdArgs = {
    id: Scalars['Int']['input'];
};

export type RuningInfoDtoItems = {
    id: Scalars['Int']['input'];
    testType: Scalars['String']['input'];
    lock_status?: InputMaybe<Scalars['Boolean']['input']>;
    traySlot: Scalars['String']['input'];
    barcodeNo: Scalars['String']['input'];
    patientId: Scalars['String']['input'];
    patientNm: Scalars['String']['input'];
    analyzedDttm: Scalars['String']['input'];
    tactTime: Scalars['String']['input'];
    submitState?: InputMaybe<Scalars['String']['input']>;
    submitOfDate?: InputMaybe<Scalars['DateTime']['input']>;
    slotNo: Scalars['String']['input'];
    cassetId: Scalars['String']['input'];
    slotId: Scalars['String']['input'];
    orderDttm: Scalars['String']['input'];
    gender: Scalars['String']['input'];
    birthDay: Scalars['String']['input'];
    isNormal: Scalars['Boolean']['input'];
    classInfo: Array<Scalars['String']['input']>
    submitUserId?: InputMaybe<Scalars['String']['input']>;
    memo?: InputMaybe<Scalars['String']['input']>;
    pcIp: Scalars['String']['input'];
    cbcPatientNo?: InputMaybe<Scalars['String']['input']>;
    cbcPatientNm?: InputMaybe<Scalars['String']['input']>;
    cbcSex?: InputMaybe<Scalars['String']['input']>;
    cbcAge?: InputMaybe<Scalars['String']['input']>;
    img_drive_root_path?: InputMaybe<Scalars['String']['input']>;
};

export type RuningInfoEntity = {
    __typename?: 'RuningInfoEntity';
    id: Scalars['Int']['input'];
    testType: Scalars['String']['input'];
    lock_status?: InputMaybe<Scalars['Boolean']['input']>;
    traySlot: Scalars['String']['input'];
    barcodeNo: Scalars['String']['input'];
    patientId: Scalars['String']['input'];
    patientNm: Scalars['String']['input'];
    analyzedDttm: Scalars['String']['input'];
    tactTime: Scalars['String']['input'];
    submitState?: InputMaybe<Scalars['String']['input']>;
    submitOfDate?: InputMaybe<Scalars['DateTime']['input']>;
    slotNo: Scalars['String']['input'];
    cassetId: Scalars['String']['input'];
    slotId: Scalars['String']['input'];
    orderDttm: Scalars['String']['input'];
    gender: Scalars['String']['input'];
    birthDay: Scalars['String']['input'];
    isNormal: Scalars['Boolean']['input'];
    classInfo: Array<Scalars['String']['input']>
    submitUserId?: InputMaybe<Scalars['String']['input']>;
    memo?: InputMaybe<Scalars['String']['input']>;
    pcIp: Scalars['String']['input'];
    cbcPatientNo?: InputMaybe<Scalars['String']['input']>;
    cbcPatientNm?: InputMaybe<Scalars['String']['input']>;
    cbcSex?: InputMaybe<Scalars['String']['input']>;
    cbcAge?: InputMaybe<Scalars['String']['input']>;
    img_drive_root_path?: InputMaybe<Scalars['String']['input']>;
};

export type GetRunningInfoByIdQueryVariables = Exact<{
    id: Scalars['Int']['input'];
}>;


export type GetRunningInfoByIdQuery = {
    __typename?: 'Query',
    getRunningInfoById?: { __typename?: 'RuningInfoEntity', id: number } | null
};


export const GetRunningInfoByIdDocument = gql`
  query GetRunningInfoById($id: Int!) {
    getRunningInfoByIdGQL(id: $id) {
          id
          testType
          lock_status
          traySlot
          barcodeNo
          patientId
          patientNm
          analyzedDttm
          tactTime
          submitState
          submitOfDate
          slotNo
          cassetId
          slotId
          orderDttm
          gender
          birthDay
          isNormal
          classInfo {
              id
              name
              classInfo {
                  count
                  classId
                  afterGrade
                  beforeGrade
              }          
          }
          submitUserId
          memo
          pcIp
          cbcPatientNo
          cbcPatientNm
          cbcSex
          cbcAge
          img_drive_root_path
    }
  }
`;

/**
 * __useGetRunningInfoByIdQuery__
 *
 * To run a query within a Vue component, call `useGetRunningInfoByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRunningInfoByIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetRunningInfoByIdQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetRunningInfoByIdQuery(
    variables: GetRunningInfoByIdQueryVariables | ReactiveFunction<GetRunningInfoByIdQueryVariables>,
    options: VueApolloComposable.UseQueryOptions<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables>> = {}
) {
    return VueApolloComposable.useQuery<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables>(
        GetRunningInfoByIdDocument,
        variables,
        options
    );
}

export function useGetRunningInfoByIdLazyQuery(
    variables?: GetRunningInfoByIdQueryVariables | ReactiveFunction<GetRunningInfoByIdQueryVariables>,
    options: VueApolloComposable.UseQueryOptions<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables>> = {}
) {
    return VueApolloComposable.useLazyQuery<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables>(
        GetRunningInfoByIdDocument,
        variables,
        options
    );
}

export type GetRunningInfoByIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetRunningInfoByIdQuery, GetRunningInfoByIdQueryVariables>;