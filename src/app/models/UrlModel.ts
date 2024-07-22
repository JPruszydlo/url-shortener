export type UrlModel = {
  id: number;
  longUrl: string;
  shortUrl: string;
  hostName: string;
  createdAt: string;
};

export type UrlHistoryModel = {
  long: string;
  short: string;
  createdAt: bigint;
};
