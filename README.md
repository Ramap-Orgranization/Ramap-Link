# Ramap-Link

Ramap 매장 공유 URL의 웹 fallback과 Android App Links / iOS Universal Links
검증 파일을 제공하는 독립 Next.js 앱입니다.

## 제공 경로

- `/shops/{shopId}`: Android/iOS 앱 열기 중계 화면
- `/.well-known/assetlinks.json`: Android App Links
- `/.well-known/apple-app-site-association`: iOS Universal Links

매장 정보나 웹 지도는 표시하지 않습니다. Android에는 Google Play,
iOS/iPadOS에는 App Store 버튼을 표시하며, 실제 스토어 URL이 없으면 같은
자리에 `스토어 출시 준비 중` 비활성 버튼을 표시합니다. 앱 자동 실행이나
타이머 기반 스토어 fallback은 사용하지 않습니다. 데스크톱에서는 모바일로
링크를 열어 달라는 안내만 표시합니다.

## 로컬 실행

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

로컬 UI 확인 시 `NEXT_PUBLIC_SITE_URL`에는 프로덕션 HTTPS URL을 입력합니다.

## 환경 변수

| 이름                                       | 필수 시점        | 설명                                         |
| ------------------------------------------ | ---------------- | -------------------------------------------- |
| `SUPABASE_URL`                             | 클릭 로깅        | Ramap Supabase 프로젝트 URL                  |
| `SUPABASE_SERVICE_ROLE_KEY`                | 클릭 로깅        | 서버 전용 service role 키                    |
| `NEXT_PUBLIC_SITE_URL`                     | 매장 페이지 요청 | 최초 배포 후 확정된 HTTPS Production URL     |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL`              | 선택             | 출시 후 Google Play 앱 URL                   |
| `NEXT_PUBLIC_APP_STORE_URL`                | 선택             | 출시 후 App Store 앱 URL                     |
| `ANDROID_RELEASE_SHA256_CERT_FINGERPRINTS` | assetlinks 요청  | 콜론 형식 SHA-256, 쉼표/줄바꿈으로 복수 입력 |
| `ANDROID_DEBUG_SHA256_CERT_FINGERPRINTS`   | 선택             | debug 앱 연결용 SHA-256                      |
| `APPLE_TEAM_ID`                            | AASA 요청        | 10자리 Apple Team ID                         |
| `IOS_INCLUDE_DEBUG_APP`                    | 선택             | `true`일 때 debug bundle ID 포함             |

Production Domain이 확정되기 전에는 `NEXT_PUBLIC_SITE_URL`에 임의의
`*.vercel.app` 주소나 Preview URL을 넣지 않습니다. 환경 값이 없어도
프로젝트 빌드는 가능하지만 관련 실제 요청은 2xx로 성공하지 않습니다.

`SUPABASE_SERVICE_ROLE_KEY`는 브라우저에 노출되지 않는 서버 환경 변수로만 설정합니다.
`web_link_events` 테이블 마이그레이션을 Ramap 메인 프로젝트에 적용한 뒤 클릭 로깅이 활성화됩니다.

## 검증

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm format:check
```

배포 후 association URL이 redirect 없이 `application/json`을 반환하는지
확인하고 Android/iOS 실기기에서 각각 공유 링크를 테스트합니다.
