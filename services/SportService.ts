import { SportDetails } from "@/types/api";
import { apiClient } from "./ApiClient";
import { ApiResult } from "@/types/own";

export const getSports = async (): Promise<ApiResult<SportDetails[]>> =>
  await apiClient.get<SportDetails[]>('/sports');