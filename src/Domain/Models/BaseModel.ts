import { Types } from '@ikomida/shared-types'
import {
  Column,
  Model,
  IsUUID,
  PrimaryKey,
  DataType,
  AfterCreate,
  AfterFind,
  AfterRestore,
  AfterSave,
  AfterUpdate,
  BeforeCount,
  BeforeCreate,
  BeforeFind,
  BeforeSave,
  BeforeUpdate,
  BeforeValidate,
  AllowNull
} from 'sequelize-typescript'

function isObject(object: any) {
  return object && typeof object === 'object'
}

export function resolveBeforeEnums(instance: any, model: any) {
  for (const key of Reflect.ownKeys(isObject(instance) ? instance : {})) {
    if (isObject(model.rawAttributes) && key in model.rawAttributes) {
      const field = model.rawAttributes[key]
      const isArrayOfEnums = Reflect.getMetadata('design:type:array', model, key) === 'arrayOfEnums'
      const designType = Reflect.getMetadata('design:type', model, key)
      if (field.type.constructor.key === 'ENUM' && isObject(instance[key])) {
        if (Types.TBaseType.isInstance(instance[key])) {
          instance[key] = (instance[key] as Types.TBaseType).id
        } else if (isObject(instance[key])) {
          for (const subKey of Reflect.ownKeys(isObject(instance[key]) ? instance[key] : {})) {
            if (Types.TBaseType.isInstance(instance[key][subKey])) {
              instance[key] = (instance[key] as Types.TBaseType).id
            } else if (Array.isArray(instance[key][subKey])) {
              const newSubKey: string[] = []
              for (const value of instance[key][subKey]) {
                if (Types.TBaseType.isInstance(value)) {
                  newSubKey.push(value.id)
                }
              }
              instance[key][subKey] = newSubKey
            }
          }
        }
      } else if (isArrayOfEnums && Array.isArray(instance[key])) {
        const newValue = []
        for (const value of instance[key]) {
          if (isObject(value)) {
            if (Types.TBaseType.isInstance(value)) {
              newValue.push(value.id)
            } else if (value instanceof designType) {
              newValue.push(value)
            }
          }
        }
        instance[key] = newValue
      }
    } else if (typeof key === 'symbol') {
      if (Array.isArray(instance[key])) {
        for (const object of instance[key]) {
          resolveBeforeEnums(object, model)
        }
      } else if (isObject(instance[key])) {
        resolveBeforeEnums(instance[key], model)
      }
    }
  }
}

export function resolveAfterEnums(instance: any, model: any) {
  if (Array.isArray(instance)) {
    for (const object of instance) {
      handleAfterEnums(object, object)
    }
  } else {
    handleAfterEnums(instance, model)
  }
}
export function handleAfterEnums(instance: any, model: any) {
  if (isObject(instance) && 'dataValues' in instance) {
    for (const key of Reflect.ownKeys(isObject(instance.dataValues) ? instance.dataValues : {})) {
      if (isObject(model.rawAttributes) && key in model.rawAttributes) {
        const field = model.rawAttributes[key]
        const isArrayOfEnums = Reflect.getMetadata('design:type:array', model, key) === 'arrayOfEnums'
        if (field.type.constructor.key === 'ENUM') {
          instance.dataValues[key] =
            typeof instance.dataValues[key] === 'string'
              ? Reflect.getMetadata('design:type', model, key).valueOf(instance.dataValues[key])
              : instance.dataValues[key]
        } else if (isArrayOfEnums && Array.isArray(instance.dataValues[key])) {
          const designType = Reflect.getMetadata('design:type:array:type', model, key)
          const newValue = []
          for (const value of instance.dataValues[key]) {
            newValue.push(typeof value === 'string' ? designType.valueOf(value) : value)
          }
          instance.dataValues[key] = newValue
        }
        if ('_previousDataValues' in instance) {
          instance._previousDataValues = Object.assign(instance._previousDataValues, instance.dataValues)
        }
      } else {
        resolveAfterEnums(instance.dataValues[key], instance[key])
      }
    }
  }
}

function hanfleIncludes(instance: any) {
  if (instance && Array.isArray(instance)) {
    for (const object of instance) {
      if (isObject(object) && 'where' in object && 'model' in object) {
        resolveBeforeEnums(object.where, new object.model())
      }
      if (isObject(object) && 'include' in object) {
        hanfleIncludes(object.include)
      }
    }
  } else {
    if (isObject(instance) && 'where' in instance && 'model' in instance) {
      resolveBeforeEnums(instance.where, instance.model)
    }
    if (isObject(instance) && 'include' in instance) {
      hanfleIncludes(instance.include)
    }
  }
}

export default class BaseModel extends Model {
  @IsUUID(4)
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  id?: string = undefined

  @BeforeCount
  static DoBeforeCount(instance: any, options: any) {
    if (isObject(instance) && 'where' in instance) {
      resolveBeforeEnums(instance.where, this.prototype)
    }
    if (isObject(instance) && 'include' in instance) {
      hanfleIncludes(instance.include)
    }
  }
  @BeforeFind
  static DoBeforeFind(instance: any, options: any) {
    if (isObject(instance) && 'where' in instance) {
      resolveBeforeEnums(instance.where, this.prototype)
    }
    if (isObject(instance) && 'include' in instance) {
      hanfleIncludes(instance.include)
    }
  }
  @BeforeUpdate
  static DoBeforeUpdate(instance: any, options: any) {
    if (isObject(instance) && !('instanceValidated' in instance) && !instance.instanceValidated) {
      resolveBeforeEnums(instance.dataValues, this.prototype)
    }
  }
  // NOTE: this hook only available in Sequelize v4
  @BeforeSave
  static beforeSaveModel(instance: any, options: any): void {
    if (isObject(instance) && !('instanceValidated' in instance) && !instance.instanceValidated) {
      resolveBeforeEnums(instance.dataValues, this.prototype)
    }
  }
  @BeforeCreate
  static beforeCreateModel(instance: any, options: any): void {
    if (isObject(instance) && !('instanceValidated' in instance) && !instance.instanceValidated) {
      resolveBeforeEnums(instance.dataValues, this.prototype)
    }
  }
  @BeforeValidate
  static DoBeforeValidate(instance: any, options: any) {
    resolveBeforeEnums(instance.dataValues, this.prototype)
    resolveBeforeEnums(instance.where, this.prototype)
    instance.instanceValidated = true
  }

  @AfterFind
  static DoAfterFind(instance: any, options: any) {
    resolveAfterEnums(instance, this.prototype)
  }
  @AfterCreate
  static afterCreateModel(instance: any, options: any): void {
    resolveAfterEnums(instance, this.prototype)
  }

  @AfterRestore
  static afterRestoreModel(instance: any, options: any): void {
    resolveAfterEnums(instance, this.prototype)
  }

  @AfterUpdate
  static afterUpdateModel(instance: any, options: any): void {
    resolveAfterEnums(instance, this.prototype)
  }

  // NOTE: this hook only available in Sequelize v4
  @AfterSave
  static afterSaveModel(instance: any, options: any): void {
    resolveAfterEnums(instance, this.prototype)
  }
}
