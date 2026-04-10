import type { ApiDate } from "./common";
import type { Participant } from "./participant";
import type { Study } from "./study";
import type { User } from "./user";

export type Application = {
  id: number;
  participant: Participant;
  study?: Study | null;
  status: string;
  reviewed_by?: User | null;
  created_at?: ApiDate;
};
