import { inject } from '@adonisjs/fold'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class CitiesServices {
  constructor() {}

  public async getCities(query: string) {
    try {
      return await db
        .from('stations')
        .distinct('city', 'zip_code')
        .where('city', 'ilike', `${query}%`)
        .orWhere('zip_code', 'like', `${query}%`)
        .orderBy('city')
        .limit(10)
    } catch (error) {
      console.error('Error in getCities', error)
      throw error
    }
  }
}
