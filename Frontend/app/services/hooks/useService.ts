"use client";

import { useParams } from "next/navigation";

import { useGetServiceByIdQuery } from "@/app/store/api/servicesApi";

/** Loads the service for the current /services/[name]/[id] route. */
export const useService = () => {
  const { id } = useParams<{ id: string }>();

  return useGetServiceByIdQuery(id, { skip: !id });
};
