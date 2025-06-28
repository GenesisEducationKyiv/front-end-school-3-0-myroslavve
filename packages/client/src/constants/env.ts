export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  storageUrl: process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/api/files",
} as const;