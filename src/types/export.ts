import type { ApiDate } from "./common";

export type ExportJob = {
  id: number;
  export_type: string;
  status: string;
  created_at?: ApiDate;
  download_url?: string | null;
};
