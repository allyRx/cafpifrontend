const mongoose = require('mongoose');

const AnalysisResultSchema = new mongoose.Schema({
  dossier_number: { type: String, required: true },
  borrower_name: { type: String, required: true },
  document_type: { type: String },
  bank_account_info: {
    titulaire: String,
    numero_compte: String,
    banque: String,
    periode: String,
    solde_debut: String,
    solde_fin: String,
    iban: String,
  },
  financial_analysis: {
    equilibre_compte: String,
    frais_bancaires_detectes: Boolean,
    nombre_frais: Number,
    revenus_reguliers: Boolean,
    prets_en_cours: Boolean,
    revenus_fonciers: Boolean,
  },
  validations_cafpi: {
    nom_conforme: String,
    frais_excessifs: String,
    gestion_equilibree: String,
    revenus_detectes: String,
    prets_en_cours: String,
  },
  transactions_analysis: {
    credits_reguliers: [mongoose.Schema.Types.Mixed],
    debits_reguliers: [mongoose.Schema.Types.Mixed],
    frais_bancaires: [mongoose.Schema.Types.Mixed],
    operations_inhabituelles: [String],
  },
  revenus_detectes: {
    salaire: String,
    foncier: String,
    autres: String,
  },
  quality_metrics: {
    overall_confidence: Number,
    needs_review: Boolean,
    missing_fields: [String],
    confidence_breakdown: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    dossier_number: String,
    borrower_name: String,
    filename: String,
    timestamp: Date,
    comments: String,
    processing_status: String,
  },
  recommendations: [String],
  risk_assessment: {
    financial_stability: String,
    banking_behavior: String,
    income_reliability: String,
    creditworthiness: String,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('AnalysisResult', AnalysisResultSchema);
