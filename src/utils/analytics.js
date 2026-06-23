import { Analytics } from '@apps-in-toss/web-framework'

// 토스 앱 밖(Vercel 웹 등)에서는 네이티브 브릿지가 없어 Analytics 호출이 던지므로 무시한다
export function logScreen(name) {
  try {
    Analytics.screen({ log_name: name })
  } catch {
    // ignore: 토스 앱 환경이 아님
  }
}

export function logClick(name) {
  try {
    Analytics.click({ log_name: name })
  } catch {
    // ignore: 토스 앱 환경이 아님
  }
}
