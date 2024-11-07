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
      const getStations = await db
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

      const fuelTypesGrouped = getStations.reduce((acc, station) => {
        const fuelType = station.fuel_type.toLowerCase()

        // Initialize fuel type if it doesn't exist
        if (!acc[fuelType]) {
          acc[fuelType] = {
            stations: [],
            averagePrice: 0,
            lowestPrice: Infinity,
            highestPrice: -Infinity,
          }
        }

        const existingStation = acc[fuelType].stations.find(
          (s: { id: any }) => s.id === station.station_id
        )

        if (!existingStation) {
          acc[fuelType].stations.push({
            id: station.station_id,
            address: station.address,
            city: station.city,
            postal_code: station.zip_code,
            price: station.price,
            last_update: station.updated_at,
          })

          acc[fuelType].lowestPrice = Math.min(acc[fuelType].lowestPrice, station.price)
          acc[fuelType].highestPrice = Math.max(acc[fuelType].highestPrice, station.price)
        }

        return acc
      }, {})

      Object.keys(fuelTypesGrouped).forEach((fuelType) => {
        const stations = fuelTypesGrouped[fuelType].stations
        const total = stations.reduce((sum: any, station: { price: any }) => sum + station.price, 0)
        fuelTypesGrouped[fuelType].averagePrice = Number((total / stations.length).toFixed(3))

        if (fuelTypesGrouped[fuelType].lowestPrice === Infinity) {
          fuelTypesGrouped[fuelType].lowestPrice = 0
        }

        if (fuelTypesGrouped[fuelType].highestPrice === -Infinity) {
          fuelTypesGrouped[fuelType].highestPrice = 0
        }
      })

      return fuelTypesGrouped
    } catch (error) {
      console.error('Error in getFuelStationsByCity', error)
      throw error
    }
  }
}
