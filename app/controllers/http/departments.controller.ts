import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import DepartmentsServices from '#services/departments.services'
@inject()
export default class DepartmentsController {
  constructor(private departmentsServices: DepartmentsServices) {}
  public async index({ view }: HttpContext) {
    try {
      const departmentsWithPrices = await this.departmentsServices.getAveragePricesByDepartment()

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
