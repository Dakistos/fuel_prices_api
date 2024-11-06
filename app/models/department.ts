import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Department extends BaseModel {
  @column({ isPrimary: true })
  declare code: string

  @column()
  declare name: string

  @column()
  declare region_code: string
}
