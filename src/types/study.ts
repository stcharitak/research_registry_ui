import type { ApiDate } from "./common";

export type Study = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  created_by_username: string;
  created_at?: ApiDate;
};
