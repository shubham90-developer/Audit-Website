import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const meetTheTeamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetTheTeam: builder.query<ContentRecord, void>({
      query: () => '/meet-the-team',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetMeetTheTeamQuery, useLazyGetMeetTheTeamQuery } = meetTheTeamApi;
