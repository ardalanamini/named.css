import { generateString } from '../utils'

const attributes = (input: string) => {
  let output = input
  let attributes: Array<{ [key: string]: any }> = []
  let last: string

  output = output.replace(/\[id(\^|\~|\||\*|\$)=[\"'](-?[_a-zA-Z]+[_a-zA-Z0-9-]*)[\"']\]/g, (match, operator, origin) => {
    console.log(match, operator, origin)
    // switch (operator) {
    //   case '*':
    //   default:
    //     attributes.push({
    //       regex: new RegExp(origin),
    //       name: last
    //     })
    // }

    return match
  })

  return {
    output,
    attributes
  }
}

export default (input: string, prefix: string = '') => {
  let output = input
  let ids: OBJ = {}
  let last: string

  let temp = attributes(output)
  let attrs = temp.attributes
  output = temp.output

  output = output.replace(/#-?[_a-zA-Z]+[_a-zA-Z0-9-]*(?=[^}]*\{)/g, (match) => {
    let origin = match.substr(1)
    let id = ids[origin]

    if (id) return `#${id}`

    last = generateString(last)

    ids[origin] = last

    return `#${last}`
  })

  return {
    output,
    ids
  }
}
