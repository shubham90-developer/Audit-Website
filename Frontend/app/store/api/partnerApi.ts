import { baseApi } from "./baseApi";

export type Localized<T = string> = {
  en: T;
  ar: T;
};

export interface PartnerMedia {
  url: string;
  publicId: string;
}

export interface Partner {
  _id: string;
  title: Localized;
  text: Localized;
  logo: Localized<PartnerMedia[]>;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PartnersResponse {
  data: Partner[];
  message?: string;
}

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPartners: builder.query<Partner[], void>({
      query: () => "partners",

      transformResponse: (response: PartnersResponse | Partner[]) => {
        const partners = Array.isArray(response) ? response : response.data;

        return [...partners].sort((a, b) => a.order - b.order);
      },
      providesTags: ["WebsiteContent"],
    }),
  }),
});

export const { useGetPartnersQuery } = partnerApi;
