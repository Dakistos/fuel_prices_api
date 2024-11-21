import FuelPriceService from '#services/stations.service'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
@inject()
export default class StationsApiController {
  constructor(private fuelPriceService: FuelPriceService) {}

  /**
   * Search controller function to find a fuel station
   * @params: searchTerm: string
   * */
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

  /**
   * Show controller function to display a fuel station by id
   * @params: id: number
   * */
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params

      if (!id || Number.isNaN(Number.parseInt(id))) {
        return response.status(400).json({
          status: 'error',
          message: 'ID de station invalide',
        })
      }

      const station = await this.fuelPriceService.getFuelStationsById(id)

      if (!station || station.length === 0) {
        return response.status(404).json({
          status: 'error',
          message: 'Station non trouvée',
        })
      }

      return response.json({
        status: 'success',
        data: station,
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Erreur lors de la recherche',
      })
    }
  }
}
