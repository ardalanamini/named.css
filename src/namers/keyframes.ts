import { generateString } from '../utils'

export default (input: string) => {
  let output = input
  let keyframes: OBJ = {}
  let last: string

  output = output.replace(/keyframes [_a-zA-Z]+[_a-zA-Z0-9-]*(?=[^}]*\{)/g, (match) => {
    let origin = match.substr(10)
    let keyframe = keyframes[origin]

    if (keyframe) return `keyframes ${keyframe}`

    last = generateString(last)

    keyframes[origin] = last

    return `keyframes ${last}`
  })

  output = output.replace(/([_a-zA-Z]+[_a-zA-Z0-9-]*)[^:]/g, (match, origin) => {
    let keyframe = keyframes[origin]

    if (keyframe) return match.replace(origin, keyframe)

    return match
  })

  return output
}
