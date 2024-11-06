import { inject } from '@adonisjs/fold'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class FuelPriceService {
  constructor() {}

  public async getAveragePricesByDepartment() {
    try {
      return await db
        .query()
        .from(`fuel_prices`)
        .join('stations', 'stations.id', 'fuel_prices.station_id')
        .join('fuel_types', 'fuel_types.id', 'fuel_prices.fuel_type_id')
        .join('departments', 'departments.code', 'stations.department_code')
        .groupBy('departments.code', 'fuel_types.name')
        .select(
          'departments.code as dpt_id',
          'fuel_types.name as fuel_type',
          db.raw('ROUND(AVG(fuel_prices.price)::numeric, 3) as average_price')
        )
        .orderBy('departments.code', 'asc')
    } catch (error) {
      console.error('Error in getAveragepricesByDpt:', error)
      throw error
    }
  }

  public async getFuelStationsByCity(searchTerm: string) {
    try {
      const stations = await db
        .query()
        .from('fuel_prices')
        .join('stations', 'stations.id', 'fuel_prices.station_id')
        .join('fuel_types', 'fuel_types.id', 'fuel_prices.fuel_type_id')
        .where('stations.city', 'ilike', `%${searchTerm}%`)
        .orWhere('stations.zip_code', 'like', `%${searchTerm}%`)
        .select(
          'stations.id as station_id',
          'stations.address',
          'stations.city',
          'stations.zip_code',
          'fuel_types.name as fuel_type',
          'fuel_prices.price',
          'fuel_prices.updated_at'
        )
        .orderBy(['stations.address', 'fuel_types.name'])

      const stationsGrouped = stations.reduce((acc, station) => {
        if (!acc[station.station_id]) {
          acc[station.station_id] = {
            id: station.station_id,
            address: station.address,
            city: station.city,
            postal_code: station.zip_code,
            fuels: [],
          }
        }

        acc[station.station_id].fuels.push({
          type: station.fuel_type,
          price: station.price,
          last_update: station.updated_at,
        })
        return acc
      }, {})

      return Object.values(stationsGrouped)
    } catch (error) {
      console.error('Error in getFuelStationsByCity', error)
      throw error
    }
  }
}
