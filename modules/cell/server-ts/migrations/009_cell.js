exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('cell', table => {
      table.increments();
      table.string('gene_id', 5000);
      table.string('protein_id', 5000);
      table.string('uberon_ontology_id');
      table.string('cell_ontology_id');
      table.string('gene_symbol', 5000);
      table.string('pmid');
      table.string('species_type');
      table.string('tissue_type');
      table.string('cancer_type');
      table.string('cell_type');
      table.string('cell_name');
      table.string('cell_marker', 5000);
      table.string('protein_name', 5000);
      table.string('marker_resource');
      table.string('company');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('comment')]);
};
