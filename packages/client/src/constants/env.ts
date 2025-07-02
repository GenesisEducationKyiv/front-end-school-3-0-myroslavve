export type Env = {
  apiUrl: string;
  storageUrl: string;
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  storageUrl: process.env.NEXT_PUBLIC_STORAGE_URL!,
} satisfies Env;