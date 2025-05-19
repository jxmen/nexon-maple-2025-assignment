import { TestEventBuilder } from './test-event-builder';

function dateOf(year: number, month: number, day: number): Date {
  // NOTE: new Date()는 monthIndex를 받기 때문에 -1을 해준다.
  return new Date(year, month - 1, day);
}

describe('Event', () => {
  describe('isEnded 메서드는', () => {
    it('현재 시간이 종료 시간 이후라면 true를 리턴한다', () => {
      const currentDate = dateOf(2025, 5, 19);
      const endDate = dateOf(2025, 5, 18);

      const event = new TestEventBuilder().withEndDate(endDate).build();

      expect(event.isEnded(currentDate)).toBeTruthy();
    });

    it('현재 시간이 종류 시간 전이라면 false를 리턴한다', () => {
      const currentDate = dateOf(2025, 5, 17);
      const endDate = dateOf(2025, 5, 17);

      const event = new TestEventBuilder().withEndDate(endDate).build();

      expect(event.isEnded(currentDate)).toBeFalsy();
    });
  });
});
