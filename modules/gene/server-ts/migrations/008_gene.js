exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('gene', table => {
      table.increments();
      table.string('gene_id');
      table.string('status');
      table.string('gene_symbol');
      table.string('gene_name');
      table.string('cosmic_symbol');
      table.string('ref_seq_accession');
      table.string('ensembl_id');
      table.string('chromosome_location');
      table.string('omim_id');
      // table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('gene')]);
};
