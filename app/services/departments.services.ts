import db from '@adonisjs/lucid/services/db'
import Department from '#models/department'

export default class DepartmentsServices {
  constructor() {}

  /**
   * Function to find average fuel prices by department
   * */
  public async getAveragePricesByDepartment() {
    try {
      const department = await Department.query().select('code', 'name')
      const averagePrices = await db
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

      return department.map((dept) => ({
        ...dept.toJSON(),
        fuelPrices: averagePrices.filter((price) => price.dpt_id === dept.code),
      }))
    } catch (error) {
      console.error('Error in getAveragepricesByDpt:', error)
      throw error
    }
  }
}
