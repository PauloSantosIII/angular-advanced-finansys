import { BaseRosourceModel } from '../../../shared/models/base-resource.model'

export class Category extends BaseRosourceModel {
  constructor(
    public id?:number,
    public name?: string,
    public description?: string
  ){ super() }
}