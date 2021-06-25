exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('cell', table => {
      table.increments();
      table.string('gene_id');
      table.string('protein_id');
      table.string('uberon_ontology_id');
      table.string('cell_ontology_id');
      table.string('gene_symbol');
      table.string('pmid');
      table.string('species_type');
      table.string('tissue_type');
      table.string('cancer_type');
      table.string('cell_type');
      table.string('cell_name');
      table.string('cell_marker');
      table.string('protein_name');
      table.string('marker_resource');
      table.string('company');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('comment')]);
};
