import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class FuelTypes extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string
}
