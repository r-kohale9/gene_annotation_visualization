exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('disease', table => {
      table.increments();
      table.string('gene_id');
      table.string('disease_id');
      table.string('gene_symbol');
      table.string('dsi');
      table.string('dpi');
      table.string('disease_name');
      table.string('disease_type');
      table.string('disease_class');
      table.string('disease_semantic_type');
      table.string('score');
      table.string('ei');
      table.string('year_initial');
      table.string('year_final');
      table.string('nof_pmids');
      table.string('nof_snps');
      table.string('source');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('disease')]);
};
