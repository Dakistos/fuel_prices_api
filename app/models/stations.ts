import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Stations extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare latitude: number | null

  @column()
  declare longitude: number | null

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare zip_code: string

  @column()
  declare department_code: string

  @column()
  declare region_code: string

  @column()
  //TODO: HANDLE THE GEOMETRY TYPE
  declare geom: string

  @column()
  declare is_24h: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
