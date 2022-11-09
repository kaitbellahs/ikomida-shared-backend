import { Types } from '@ikomida/shared-types'

export default class TGeometry extends Types.TBaseType {
  static POINT = new TGeometry('Point')
  static LINE_STRING = new TGeometry('LineString')
  static POLYGON = new TGeometry('Polygon')
  static MULTI_POINT = new TGeometry('MultiPoint')
  static MULTI_LINE_STRING = new TGeometry('MultiLineString')
  static MULTI_POLYGON = new TGeometry('MultiPolygon')
  static COLECTION = new TGeometry('GeometryCollection')
}
