import FuelPriceService from '#services/fuel_price.service'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'

@inject()
export default class StationsController {
  constructor(private fuelPriceService: FuelPriceService) {}

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

  public async show({ params, view }: HttpContext) {
    try {
      const { id } = params
      const station = await this.fuelPriceService.getFuelStationsById(Number.parseInt(id))

      // group data
      const stationData = station.reduce((acc, item) => {
        if (!acc.details) {
          acc.details = {
            id: item.station_id,
            address: item.address,
            city: item.city,
            postal_code: item.zip_code,
            coordinates: item.coordinates,
            is_24h: item.fuel_pomp_schedules,
          }
        }

        acc.fuels = acc.fuels || []
        acc.fuels.push({
          type: item.fuel_type,
          price: item.price,
          last_update: item.updated_at,
        })

        return acc
      }, {})

      return view.render('pages/stations/show', { station: stationData })
    } catch (error) {
      return view.render('pages/stations/search', {
        stations: [],
        error: 'Une erreur est survenue',
      })
    }
  }
}
