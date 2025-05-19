import http from 'k6/http';
import {sleep} from 'k6'

export const options = {
    vus: 10, // n명 유저
    iterations: 10, // n번 실행
    thresholds: {
        'http_req_failed': ['rate==0.99']
    }
}

/**
 * NOTE: 액세스 토큰이 유효하고, 이벤트도 해당 코드에 맞는 이벤트가 생성되어 있어야 합니다.
 */
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqeG1lbiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3NDk2NDUxLCJleHAiOjE3NTYxMzY0NTF9.atNeINFJJ-wMh6Qtcj91b_t8CjohJtLqzw0KW6bcQE8"
const eventCode = '20250517-check-in'

export default function () {
    const url = `http://localhost:3001/events/${eventCode}/reward-request`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    const res = http.post(url, JSON.stringify({}), {headers});

    console.log(`status: ${res.status}`)

    sleep(0.1);
}

// 테스트 종료 후 호출됨
export function handleSummary(data) {
    const total = data.metrics.http_reqs.values.count;
    const failedCount = data.metrics.http_req_failed.values.passes
    const successCount = total - failedCount

    console.log(`successCount: ${successCount}`);
    if (successCount !== 1) {
        console.error(`성공 요청 수가 1이 아님: ${successCount}`);
    } else {
        console.log(`성공 요청 수가 정확히 1개임`);
    }

    return {
        stdout: `성공 요청 수: ${successCount}\n`,
    };
}