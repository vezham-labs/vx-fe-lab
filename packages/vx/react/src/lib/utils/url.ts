const getOpenUrl = (url: string) => {
  if (url.startsWith('/') || /^https?:\/\//i.test(url)) {
    return url
  }

  return `https://${url}`
}

const getAppPath = (url: string, origin: string) => {
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url
  }

  if (!/^https?:\/\//i.test(url)) {
    return null
  }

  let destination: URL

  try {
    destination = new URL(url)
  } catch {
    return null
  }

  if (destination.origin !== origin) {
    return null
  }

  return `${destination.pathname}${destination.search}${destination.hash}`
}

export { getAppPath, getOpenUrl }
