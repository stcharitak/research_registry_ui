import type { ApiDate } from "./common";

export type Participant = {
  id: number;
  code: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  birth_year: number;
  consent?: boolean;
  created_at?: ApiDate;
};
