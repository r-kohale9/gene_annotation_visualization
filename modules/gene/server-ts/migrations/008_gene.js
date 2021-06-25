exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('gene', table => {
      table.increments();
      table.string('gene_id');
      table.string('omim_id');
      table.string('ensembl_id');
      table.string('gene_symbol');
      table.string('cosmic_symbol');
      table.string('gene_name');
      table.string('status');
      table.string('ref_seq_accession');
      table.string('chromosome_location');
      table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('comment')]);
};
