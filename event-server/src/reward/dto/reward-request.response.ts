export class RewardRequestResponse {
  items: Record<string, number>;

  constructor(items: Map<string, number> | Record<string, number>) {
    if (items instanceof Map) {
      this.items = {};
      items.forEach((value, key) => {
        this.items[key] = value;
      });
    } else {
      this.items = items;
    }
  }
}
