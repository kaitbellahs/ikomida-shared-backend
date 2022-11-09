import { Types } from '@ikomida/shared-types'

export class TGeometry extends Types.TBaseType {
  POINT = new TGeometry('Point')
  LINE_STRING = new TGeometry('LineString')
  POLYGON = new TGeometry('Polygon')
  MULTI_POINT = new TGeometry('MultiPoint')
  MULTI_LINE_STRING = new TGeometry('MultiLineString')
  MULTI_POLYGON = new TGeometry('MultiPolygon')
}
