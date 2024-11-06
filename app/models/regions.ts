import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Regions extends BaseModel {
  @column({ isPrimary: true })
  declare code: string

  @column()
  declare name: string
}
