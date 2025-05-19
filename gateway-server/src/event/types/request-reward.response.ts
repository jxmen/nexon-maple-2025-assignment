export type RequestRewardResponse = {
  result: 'success' | 'failed';
  items: Record<string, number>;
};