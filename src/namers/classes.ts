import { generateString } from '../utils'

const attributes = (input: string, prefix: string) => {
  let output = input
  let attributes: { [key: string]: any } = {}
  let last: string

  output = output.replace(/\[class(\^|\*|\$)=[\"'] *(-?[_a-zA-Z]+[_a-zA-Z0-9-]*) *[\"']\]/g, (match, operator, origin) => {
    let key = `${operator}${origin}`
    let attribute = attributes[key]

    if (attribute) return match.replace(origin, attribute.name)

    last = generateString(last)

    let regex: RegExp

    switch (operator) {
      case '$':
        attributes[key] = {
          regex: new RegExp(`(${origin})$`),
          name: `-${last}-`
        }
        return match.replace(origin, `-${last}-`)
      case '^':
        attributes[key] = {
          regex: new RegExp(`^(${origin})`),
          name: `${prefix}-${last}-`
        }
        return match.replace(origin, `${prefix}-${last}-`)
      case '*':
      default:
        attributes[key] = {
          regex: new RegExp(`(${origin})`, 'g'),
          name: `${prefix}-${last}-`
        }
        return match.replace(origin, `${prefix}-${last}-`)
    }
  })

  return {
    output,
    attributes
  }
}

export interface Named {
  [key: string]: string
}

export default (input: string, prefix: string = '', classes: Named = {}) => {
  let output = input
  let last: string

  let temp = attributes(output, prefix)
  let attrs = temp.attributes
  output = temp.output

  output = output.replace(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?![^\{]*\})/g, (match, origin) => {
    let className = classes[origin]

    if (className) return `.${className}`

    last = generateString(last)

    // TODO check if works fine
    for (let key in attrs) {
      let attr = attrs[key]

      if (!attr.regex.test(origin)) continue;

      let operator = key.substr(0, 1)

      switch (operator) {
        case '$':
          classes[origin] = `${prefix}${last}${attr.name}`
          return `.${prefix}${last}${attr.name}`
        case '^':
          // classes[origin] = `${attr.name}${last}`
          // return `.${attr.name}${last}`
        case '*':
        default:
          classes[origin] = `${attr.name}${last}`
          return `.${attr.name}${last}`
      }
    }

    classes[origin] = `${prefix}${last}`

    return `.${prefix}${last}`
  })

  return {
    output,
    classes
  }
}
