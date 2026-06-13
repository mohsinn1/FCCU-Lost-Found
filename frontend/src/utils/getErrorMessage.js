function getErrorMessage(data) {
  if (typeof data === 'string') {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(getErrorMessage).join(' ')
  }

  if (data && typeof data === 'object') {
    return Object.values(data).map(getErrorMessage).join(' ')
  }

  return 'Something went wrong. Please try again.'
}

export default getErrorMessage
