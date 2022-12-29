import { Classes, Interfaces } from '@ikomida/shared-types'

export default class Return<T> {
  success: boolean
  data?: T
  status?: number
  headers?: Interfaces.IMetadata
  constructor(success: boolean, data?: T, status?: number, headers?: Interfaces.IMetadata) {
    this.success = success
    this.data = data
    this.status = status
    this.headers = headers
  }
  toString() {
    let data
    if (Array.isArray(this.data)) {
      data = []
      for (const value of this.data) {
        data.push(
          value && typeof value === 'object' && 'toJSON' in (value as Classes.BaseJSON)
            ? (value as Classes.BaseJSON).toJSON()
            : value
        )
      }
    } else {
      data =
        this.data && typeof this.data === 'object' && 'toJSON' in (this.data as any)
          ? (this.data as any).toJSON()
          : this.data
    }
    return JSON.stringify({ success: this.success, data, status: this.status })
  }
}
