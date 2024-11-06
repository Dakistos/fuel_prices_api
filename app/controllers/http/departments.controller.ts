import { HttpContext } from '@adonisjs/core/http'
import Department from '#models/department'
import FuelPriceService from '#services/fuel_price.service'
import { inject } from '@adonisjs/fold'

@inject()
export default class DepartmentsController {
  constructor(private fuelPriceService: FuelPriceService) {}
  async index({ view }: HttpContext) {
    try {
      const departments = await Department.query().select('code', 'name').orderBy('code', 'asc')
      const averagePrices = await this.fuelPriceService.getAveragePricesByDepartment()

      const departmentsWithPrices = departments.map((dept) => ({
        ...dept.toJSON(),
        fuelPrices: averagePrices.filter((item) => item.dpt_id === dept.code),
      }))

      return view.render('pages/start', { departments: departmentsWithPrices })
    } catch (error) {
      console.error('Error in DepartmentsController.index', error)
      return view.render('pages/start', {
        departments: [],
        error: 'Une erreur est survenues lors de la récupération des données.',
      })
    }
  }
}
