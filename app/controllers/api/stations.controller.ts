import FuelPriceService from '#services/fuel_price.service'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
@inject()
export default class StationsApiController {
  constructor(private fuelPriceService: FuelPriceService) {}

  public async search({ request, response }: HttpContext) {
    const { searchTerm } = request.qs()

    if (!searchTerm || searchTerm.length < 2) {
      return response.status(400).json({
        status: 'error',
        message: 'Le terme de recherche doit faire au moins 2 caractères',
      })
    }
    try {
      const stations = await this.fuelPriceService.getFuelStationsByCity(searchTerm)

      return response.json({
        status: 'success',
        data: stations,
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erreur lors de la recherche',
      })
    }
  }
}
