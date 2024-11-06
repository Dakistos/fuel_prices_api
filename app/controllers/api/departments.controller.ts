import { HttpContext } from '@adonisjs/core/http'
import Department from '#models/department'
import FuelPriceService from '#services/fuel_price.service'
import { inject } from '@adonisjs/fold'
@inject()
export default class DepartmentsApiController {
  constructor(private fuelPriceService: FuelPriceService) {}

  public async index({ response }: HttpContext) {
    const departments = await Department.query().select('code', 'name')
    const averagePrices = await this.fuelPriceService.getAveragePricesByDepartment()

    const departmentsWithPrices = departments.map((dept) => ({
      ...dept.toJSON(),
      fuelPrices: averagePrices.filter((price) => price.dpt_id === dept.code),
    }))

    return response.json({
      status: 'success',
      data: departmentsWithPrices,
    })
  }
}
