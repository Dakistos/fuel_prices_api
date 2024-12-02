import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import DepartmentsServices from '#services/departments.services'
@inject()
export default class DepartmentsApiController {
  constructor(private departmentsServices: DepartmentsServices) {}

  public async getPricesByDepartment({ response }: HttpContext) {
    const departmentsWithPrices = await this.departmentsServices.getAveragePricesByDepartment()

    return response.json({
      status: 'success',
      data: departmentsWithPrices,
    })
  }
}
