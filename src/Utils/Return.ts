import { Classes } from '@ikomida/shared-types'

export default class Return<T> {
  success: boolean
  data?: T
  status?: number
  constructor(success: boolean, data?: T, status?: number) {
    this.success = success
    this.data = data
    this.status = status
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
