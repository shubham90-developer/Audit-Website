import { baseApi } from './baseApi';
import type { ApiEnvelope } from './types';
/** Submission is public; enquiry listing and management are admin-only. */
export interface EnquiryPayload {
  name: string;
  companyName?: string;
  email: string;
  countryCode?: string;
  mobile: string;
  service: string;
  requirements: string;
  language?: 'en' | 'ar';
}
export const enquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitEnquiry: builder.mutation<{ _id: string }, EnquiryPayload>({
      query: (body) => ({ url: '/enquiries', method: 'POST', body }),
      transformResponse: (response: ApiEnvelope<{ _id: string }>) => response.data,
    }),
  }),
});
export const { useSubmitEnquiryMutation } = enquiryApi;
