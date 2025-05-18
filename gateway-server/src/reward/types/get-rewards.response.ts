export type GetRewardsResponse = {
  rewards: {
    items: Record<string, number>;
    event: {
      code: string;
      name: string;
    };
  }[];
};
