exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('pathway', table => {
      table.increments();
      table.string('pathway_name');
      table.string('source');
      table.string('pathway_id');
      table.string('pathway');
      table.string('gene_symbol');
      // table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('pathway')]);
};
