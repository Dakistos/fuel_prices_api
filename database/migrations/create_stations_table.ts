import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('latitude').nullable()
      table.integer('longitude').nullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('zip_code').nullable()
      table.string('department_code').nullable()
      table.string('region_code').nullable()
      table.string('geom').nullable() // TODO: Handle geometry type field
      table.boolean('is_24h').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
