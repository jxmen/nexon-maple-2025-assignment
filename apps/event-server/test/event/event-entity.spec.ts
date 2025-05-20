import { TestEventEntityBuilder } from './test-event-entity-builder';
import { EventStatus } from '../../src/event/event.schema';
import { EventType } from '../../src/event/enum/event-type';

function dateOf(
  year: number,
  month: number,
  day: number,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0,
): Date {
  // NOTE: new Date()는 monthIndex를 받기 때문에 -1을 해준다.
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

describe('EventEntity', () => {
  let builder: TestEventEntityBuilder;

  beforeEach(() => {
    builder = new TestEventEntityBuilder();
  });

  describe('isEnded 메서드는', () => {
    const trueCases = [
      {
        description: '현재 시간이 종료 시간 이후라면',
        currentDate: dateOf(2025, 5, 19, 0, 0),
        endDate: dateOf(2025, 5, 18, 23, 59),
      },
      {
        description: '현재 시간이 종료 시간보다 하루 이후라면',
        currentDate: dateOf(2025, 5, 20),
        endDate: dateOf(2025, 5, 19),
      },
      {
        description: '현재 시간이 종료 시간보다 1초 이후라면',
        currentDate: dateOf(2025, 5, 20, 10, 5),
        endDate: dateOf(2025, 5, 20, 10, 4),
      },
    ];

    it.each(trueCases)(
      '$description true를 리턴한다',
      ({ currentDate, endDate }) => {
        const event = builder.withEndDate(endDate).build();
        expect(event.isEnded(currentDate)).toBeTruthy();
      },
    );

    const falseCases = [
      {
        description: '현재 시간이 종료 시간보다 하루 이전이라면',
        currentDate: dateOf(2025, 5, 17),
        endDate: dateOf(2025, 5, 18),
      },
      {
        description: '현재 시간이 종료 시간보다 1초 이전이라면',
        currentDate: dateOf(2025, 5, 18, 23, 58, 59),
        endDate: dateOf(2025, 5, 18, 23, 59),
      },
      {
        description: '현재 시간이 종료 시간 전이라면',
        currentDate: dateOf(2025, 5, 17),
        endDate: dateOf(2025, 5, 17),
      },
    ];

    it.each(falseCases)(
      '$description false를 리턴한다',
      ({ currentDate, endDate }) => {
        const event = builder.withEndDate(endDate).build();
        expect(event.isEnded(currentDate)).toBeFalsy();
      },
    );
  });

  describe('isStarted 메서드는', () => {
    const successCases = [
      {
        description: '현재 시간이 시작 시간 이후라면',
        currentDate: dateOf(2025, 5, 17),
        startDate: dateOf(2025, 5, 16),
      },
      {
        description: '현재 시간이 시작 시간 1초 뒤라면',
        currentDate: dateOf(2025, 5, 17, 10, 5, 1),
        startDate: dateOf(2025, 5, 17, 10, 5, 0),
      },
    ];

    it.each(successCases)(
      '$description true를 리턴한다',
      ({ currentDate, startDate }) => {
        const event = builder.withStartDate(startDate).build();
        expect(event.isStarted(currentDate));
      },
    );

    const failCases = [
      {
        description: '현재 시간이 시작 시간보다 하루 이전이라면',
        currentDate: dateOf(2025, 5, 17),
        startDate: dateOf(2025, 5, 18),
      },
      {
        description: '현재 시간이 시작 시간보다 1초 이전이라면',
        currentDate: dateOf(2025, 5, 18, 8, 59, 59),
        startDate: dateOf(2025, 5, 18, 9, 0, 0),
      },
    ];

    it.each(failCases)(
      '$description false를 리턴한다',
      ({ currentDate, startDate }) => {
        const event = builder.withStartDate(startDate).build();
        expect(event.isStarted(currentDate)).toBeFalsy();
      },
    );
  });

  describe('isActivate 메서드는', () => {
    it('이벤트 상태가 activate 라면 true', () => {
      const event = builder.withStatus('activate').build();

      expect(event.isActivate()).toBeTruthy();
    });

    const nonActivateStatuses: EventStatus[] = ['deactivate'];

    it.each(nonActivateStatuses)(
      '이벤트 상태가 "%s"인 경우 false를 리턴한다',
      (status) => {
        const event = builder.withStatus(status).build();

        expect(event.isActivate()).toBeFalsy();
      },
    );
  });

  describe('isCheckInType 메서드는', () => {
    it('이벤트 타입이 check-in일 경우 true를 리턴한다', () => {
      const event = builder.withType(EventType.CHECK_IN).build();

      expect(event.isCheckInType()).toBeTruthy();
    });
  });
});
