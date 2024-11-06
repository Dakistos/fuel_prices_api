import { HttpContext } from '@adonisjs/core/http'
import CitiesServices from '#services/cities.services'
import { inject } from '@adonisjs/fold'
@inject()
export default class CitiesApiController {
  constructor(private citiesServices: CitiesServices) {}
  public async search({ request, response }: HttpContext) {
    const { query } = request.qs()

    if (!query || query.length < 2) {
      return response.json([])
    }

    try {
      const cities = await this.citiesServices.getCities(query)

      return response.json(cities)
    } catch (error) {
      return response.status(500).json([])
    }
  }
}
