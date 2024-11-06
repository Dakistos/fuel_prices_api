import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Stations from '#models/stations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FuelTypes from '#models/fuel_types'

export default class FuelPrices extends BaseModel {
  @belongsTo(() => Stations)
  declare station_id: BelongsTo<typeof Stations>

  @belongsTo(() => FuelTypes)
  declare fuel_type_id: BelongsTo<typeof FuelTypes>

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
