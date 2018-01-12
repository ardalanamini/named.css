const DICTIONARY = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const generateString = (last?: string | null) => {
  if (!last) return 'a'

  if (/^Z*$/.test(last)) return 'a' + '0'.repeat(last.length)

  if (/Z$/.test(last)) {
    let fresh = ''

    if (last.length > 1) {
      if (last.length > 2) fresh += last.substr(0, last.length - 2)

      fresh += DICTIONARY[(DICTIONARY.indexOf(last[last.length - 2]) + 1) % DICTIONARY.length]
    }

    return fresh + '0'
  }

  return last.substr(0, last.length - 1) + DICTIONARY[DICTIONARY.indexOf(last[last.length - 1]) + 1]
}
