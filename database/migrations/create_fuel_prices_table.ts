import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fuel_prices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('station_id').notNullable()
      table.integer('fuel_type_id').notNullable()
      table.float('price').nullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
