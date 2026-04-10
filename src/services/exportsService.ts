import api from "../api/client";
import type { PaginatedResponse } from "../types/common";
import type { ExportJob } from "../types/export";

export type ExportDownload = {
  blob: Blob;
  filename: string;
};

export async function fetchExports(
  page: number = 1,
): Promise<PaginatedResponse<ExportJob>> {
  const response = await api.get<PaginatedResponse<ExportJob>>("/api/exports/", {
    params: { page },
  });
  return response.data;
}

export async function downloadExport(
  exportId: number,
): Promise<ExportDownload | null> {
  const response = await api.get(`/api/exports/${exportId}/download/`, {
    responseType: "blob",
  });

  const contentType = response.headers["content-type"];
  if (contentType && contentType.includes("text/html")) {
    return null;
  }

  const disposition = response.headers["content-disposition"];
  let filename = `export-${exportId}.csv`;

  if (disposition) {
    const match = disposition.match(/filename="(.+)"/);
    if (match?.[1]) {
      filename = match[1];
    }
  }

  return {
    blob: response.data,
    filename,
  };
}
