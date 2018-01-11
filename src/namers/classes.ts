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
        regex = new RegExp(`(${origin})$`)
        break;
      case '^':
        regex = new RegExp(`^(${origin})`)
        break;
      case '*':
      default:
        regex = new RegExp(`(${origin})`, 'g')
    }

    attributes[key] = {
      regex,
      name: `-${last}-`
    }

    return match.replace(origin, `-${last}-`)
  })

  return {
    output,
    attributes
  }
}

export default (input: string, prefix: string = '') => {
  let output = input
  let classes: OBJ = {}
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
          classes[origin] = `${last}${attr.name}`
          return `.${last}${attr.name}`
        case '^':
          // classes[origin] = `${attr.name}${last}`
          // return `.${attr.name}${last}`
        case '*':
        default:
          classes[origin] = `${attr.name}${last}`
          return `.${attr.name}${last}`
      }
    }

    classes[origin] = last

    return `.${last}`
  })

  return {
    output,
    classes
  }
}
