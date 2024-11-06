import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'regions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('code').notNullable()
      table.string('name').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
