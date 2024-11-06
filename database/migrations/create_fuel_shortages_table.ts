import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fuel_shortages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('station_id').notNullable()
      table.integer('fuel_type_id').notNullable()
      table.timestamp('start_date').nullable()
      table.timestamp('end_date').nullable()
      table.string('shortage_type').nullable()

      table.timestamp('created_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
