import { generateString } from '../utils'

export interface Named {
  [key: string]: string
}

export default (input: string, prefix: string = '', ids: Named = {}) => {
  let output = input
  let last: string

  output = output.replace(/#-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?=[^}]*\{)/g, (match) => {
    let origin = match.substr(1)
    let id = ids[origin]

    if (id) return `#${id}`

    last = generateString(last)

    ids[origin] = `${prefix}${last}`

    return `#${prefix}${last}`
  })

  return {
    output,
    ids
  }
}
