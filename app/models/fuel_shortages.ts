import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class FuelShortages extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare station_id: number

  @column()
  declare fuel_type_id: number

  @column()
  declare start_date: DateTime

  @column()
  declare end_date: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
