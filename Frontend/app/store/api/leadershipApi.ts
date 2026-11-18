import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const leadershipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadership: builder.query<ContentRecord, void>({
      query: () => '/leadership',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetLeadershipQuery, useLazyGetLeadershipQuery } = leadershipApi;
