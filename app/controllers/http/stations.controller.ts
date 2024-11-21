import FuelPriceService from '#services/stations.service'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'

@inject()
export default class StationsController {
  constructor(private fuelPriceService: FuelPriceService) {}

  /**
   * Search controller function to find a fuel station
   * @params: searchTerm: string
   * */
  public async search({ view, request }: HttpContext) {
    const { searchTerm } = request.qs()

    if (!searchTerm || searchTerm.length < 2) {
      return view.render('pages/stations/search', {
        stations: [],
        error: 'Veuillez saisr au moins 2 caractères',
        searchTerm: '',
      })
    }
    try {
      const stations = await this.fuelPriceService.getFuelStationsByCity(searchTerm)

      return view.render('pages/stations/search', {
        stations,
        searchTerm,
        error: stations.length === 0 ? 'Aucune station trouvée' : null,
      })
    } catch (error) {
      return view.render('pages/stations/search', {
        stations: [],
        error: 'Une erreur est survenue',
        searchTerm: searchTerm || '',
      })
    }
  }

  /**
   * Show controller function to display a fuel station by id
   * @params: id: number
   * */
  public async show({ params, view }: HttpContext) {
    try {
      const { id } = params
      const stationData = await this.fuelPriceService.getFuelStationsById(Number.parseInt(id))

      return view.render('pages/stations/show', { station: stationData })
    } catch (error) {
      return view.render('pages/stations/show', {
        stations: [],
        error: 'Une erreur est survenue',
      })
    }
  }
}
