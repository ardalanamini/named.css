import { keyframes as keyframeNamer, ids as idNamer, classes as classNamer } from './namers'
import { generateString } from './utils'

export interface Named {
  [key: string]: string
}

export default (input: string, prefix: string = '', classes: Named = {}, ids: Named = {}) => {
  let named: { [key: string]: any } = {}
  let output = input

  // replace keyframes with generated ones
  output = keyframeNamer(output)

  // replace ids with generated ones
  named = idNamer(output, prefix, ids)
  output = named.output
  ids = named.ids

  // replace classes with generated ones
  named = classNamer(output, prefix, classes)
  output = named.output
  classes = named.classes

  return {
    output,
    classes,
    ids
  }
}
