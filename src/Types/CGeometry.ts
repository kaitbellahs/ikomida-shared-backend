import { Classes, Decorators, Types } from '@ikomida/shared-types'
import TGeometry from './TGeometry.js'

export default class CGeometry extends Classes.BaseJSON {
  @Decorators.Property.Property
  type?: TGeometry
  @Decorators.Property.Property
  coordinates?: number[]

  static init(type?: TGeometry, coordinates?: number[], id?: string, timestamp?: number): CGeometry {
    // eslint-disable-next-line prefer-rest-params
    return this.createInitObject(arguments, ['type', 'coordinates', 'id', 'timestamp'])
  }
}
