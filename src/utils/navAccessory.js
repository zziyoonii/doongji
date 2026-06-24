export async function setupPlusAccessoryButton(onPress) {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) return () => {}

  const { partner, tdsEvent } = await import('@apps-in-toss/web-framework')

  await partner.addAccessoryButton({
    id: 'dungi-plus',
    title: 'PLUS',
    icon: { name: 'icon-crown-mono' },
  })

  const removeListener = tdsEvent.addEventListener('navigationAccessoryEvent', {
    onEvent: ({ id }) => {
      if (id === 'dungi-plus') onPress()
    },
  })

  return () => {
    removeListener()
    partner.removeAccessoryButton()
  }
}
