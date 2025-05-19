import { Injectable } from '@nestjs/common';
import { EventEntity } from './event.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EventValidator {
  /**
   * 이벤트가 보상을 지급할 수 있는 상태인지 검증합니다. 아닐 경우 예외를 던집니다.
   * @param event
   */
  async validateRewardClaimableStatus(event: EventEntity) {
    if (event.isEnded()) {
      throw new RpcException({
        code: 'EVENT_ENDED',
        message: '종료된 이벤트입니다.',
      });
    }
    if (!event.isStarted()) {
      throw new RpcException({
        code: 'EVENT_NOT_STARTED',
        message: '이벤트가 아직 시작되지 않았습니다.',
      });
    }
    if (!event.isActivate()) {
      throw new RpcException({
        code: 'EVENT_NOT_ACTIVATED',
        message: '이벤트가 아직 활성화되지 않았습니다.',
      });
    }
  }

  /**
   * 유저가 이벤트 조건을 충족했는지 검증합니다.
   *
   * 조건을 충족하지 않았다면, 'EVENT_CONDITION_NOT_MET' 에러 코드를 가진 예외를 발생시켜야 합니다.
   *
   * @param event 이벤트
   * @param userId 유저 식별자
   */
  async validateUserConditionSatisfied(event: EventEntity, userId: string) {
    /**
     * NOTE: 현재는 이벤트 타입 값이 'check-in'(그냥 출석만 해도 지급) 밖에 없어, 무조건 validate에 성공한다.
     *
     * 만약 친구 초대, 연속 출석 등 이벤트 종류가 추가된다면 그에 따라 코드 수정 및 DB 조회 기능이 필요하다.
     *
     * 예1) 친구 초대 형태의 이벤트일 시 - 친구 초대 내역 조회
     * 예2) 연속 출석 형태의 이벤트일 시 - 출석 내역 조회
     */

    if (event.isCheckInType()) return;
  }
}
