exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('cell', table => {
      table.increments();
      table.string('species_type');
      table.string('tissue_type');
      table.string('uberon_ontology_id');
      table.string('cancer_type');
      table.string('cell_type');
      table.string('cell_name');
      table.string('cell_ontology_id');
      table.text('cell_marker', ['string']);
      table.text('gene_symbol', ['string']);
      table.text('gene_id', ['string']);
      table.text('protein_name', ['string']);
      table.text('protein_id', ['string']);
      table.string('marker_resource');
      table.string('pmid');
      table.string('company');
      // table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('cell')]);
};
