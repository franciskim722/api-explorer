// Helper methods...
export const formatBodyState = body => body.reduce((obj, i) => {
  obj[i.name] = i
  return obj
}, {})

// We are making an assumption the URL will always be formatted similar to http://abc.com/123
const HTTPS_PREFIX = 'https://'
export const parseBaseUrl = str => `${HTTPS_PREFIX}${str.split('/')[2]}/`
export const parseLabel = str => str.split('-').join(' ')
