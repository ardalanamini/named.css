import { keyframes as keyframeNamer, ids as idNamer, classes as classNamer } from './namers'
import { generateString } from './utils'

export default (input: string, prefix: string = '') => {
  let named: { [key: string]: any } = {}
  let output = input
  let classes: Array<OBJ> = []
  let ids: Array<OBJ> = []

  // TODO replace keyframes with generated ones
  output = keyframeNamer(output)

  // replace ids with generated ones
  named = idNamer(output, prefix)
  output = named.output
  ids = named.ids

  // replace classes with generated ones
  named = classNamer(output, prefix)
  output = named.output
  classes = named.classes

  return {
    output,
    classes,
    ids
  }
}
