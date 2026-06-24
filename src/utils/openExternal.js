export async function openExternal(url) {
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    const { openURL } = await import('@apps-in-toss/web-framework')
    await openURL(url)
    return
  }
  window.open(url, '_blank', 'noopener')
}
