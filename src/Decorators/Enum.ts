type anotationFunction = (target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor) => void;

export function Enum(dataType?: any): anotationFunction {
  return (target: any, propertyName: string, propertyDescriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata('design:type:array', 'arrayOfEnums', target, propertyName);
    Reflect.defineMetadata('design:type:array:type', dataType, target, propertyName);
  };
}
