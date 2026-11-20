import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Set NEXT_PUBLIC_API_URL to the full API root, e.g. https://example.com/v1/api */
export const baseApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api",
  }),
  tagTypes: ["WebsiteContent"],
  endpoints: () => ({}),
});
