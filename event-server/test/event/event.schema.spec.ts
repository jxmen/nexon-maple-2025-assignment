import { TestEventBuilder } from './test-event-builder';
import { EventStatus } from '../../src/event/event.schema';

function dateOf(year: number, month: number, day: number): Date {
  // NOTE: new Date()는 monthIndex를 받기 때문에 -1을 해준다.
  return new Date(year, month - 1, day);
}

describe('Event', () => {
  let testEventBuilder: TestEventBuilder;

  beforeEach(() => {
    testEventBuilder = new TestEventBuilder();
  });

  describe('isEnded 메서드는', () => {
    it('현재 시간이 종료 시간 이후라면 true를 리턴한다', () => {
      const currentDate = dateOf(2025, 5, 19);
      const endDate = dateOf(2025, 5, 18);

      const event = testEventBuilder.withEndDate(endDate).build();

      expect(event.isEnded(currentDate)).toBeTruthy();
    });

    it('현재 시간이 종류 시간 전이라면 false를 리턴한다', () => {
      const currentDate = dateOf(2025, 5, 17);
      const endDate = dateOf(2025, 5, 17);

      const event = testEventBuilder.withEndDate(endDate).build();

      expect(event.isEnded(currentDate)).toBeFalsy();
    });
  });

  describe('isStarted 메서드는', () => {
    it('현재 시간이 시작 시간 이후라면 true를 리턴한다', () => {
      const currentDate = dateOf(2025, 5, 19);
      const startDate = dateOf(2025, 5, 18);

      const event = testEventBuilder.withStartDate(startDate).build();

      expect(event.isStarted(currentDate)).toBeTruthy();
    });

    it('현재 시간이 시작 시간 전이라면 false를 리턴한다', () => {
      const currentDate = dateOf(2025, 5, 17);
      const startDate = dateOf(2025, 5, 18);

      const event = testEventBuilder.withStartDate(startDate).build();

      expect(event.isStarted(currentDate)).toBeFalsy();
    });
  });

  describe('isActivate 메서드는', () => {
    it('이벤트 상태가 activate 라면 true', () => {
      const event = testEventBuilder.withStatus('activate').build();

      expect(event.isActivate()).toBeTruthy();
    });

    const nonActivateStatuses: EventStatus[] = ['deactivate'];

    it.each(nonActivateStatuses)(
      '이벤트 상태가 "%s"인 경우 false를 리턴한다',
      (status) => {
        const event = testEventBuilder.withStatus(status).build();

        expect(event.isActivate()).toBeFalsy();
      },
    );
  });
});
