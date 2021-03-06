exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('drug', table => {
      table.increments();
      table.string('gene_name');
      table.string('genea_claim_name');
      table.string('entrez_id');
      table.string('interaction_claim_source');
      table.string('interaction_type');
      table.string('drug_claim_name');
      table.string('drug_claim_primary_name');
      table.string('drug_name');
      table.string('drug_concept_id');
      table.string('interaction_group_score');
      table.text('pmid', ['string']);
      // table.timestamps(false, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('drug')]);
};
