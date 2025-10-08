export default {
  header: {
    title: "Inventaire Scolaire Tunisie",
    language: "العربية"
  },
  dashboard: {
    title: "Tableau de Bord de l'Inventaire",
    subtitle: "Gestion du stock du magasin scolaire",
    exportCSV: "Exporter en CSV",
    addItem: "Ajouter un Article",
    totalItems: "Articles Totals",
    totalValue: "Valeur Totale",
    categories: "Catégories",
    lowStock: "Stock Bas",
    expiredItems: "Articles Expirés",
  },
  filters: {
    search: "Rechercher",
    searchPlaceholder: "Nom, catégorie, fournisseur...",
    filterByDate: "Filtrer par date",
    dateType: "-- Type de date --",
    lastRestock: "Dernier Réappro.",
    expirationDate: "Date d'expiration",
    from: "Du",
    to: "Au",
    reset: "Réinitialiser",
  },
  table: {
    noItems: "Aucun article trouvé.",
    header: {
      name: "Nom de l'article",
      category: "Catégorie",
      quantity: "Quantité",
      price: "Prix Unitaire",
      supplier: "Fournisseur",
      lastRestock: "Dernier Réappro.",
      expirationDate: "Date d'exp.",
      actions: "Actions",
    },
    notAvailable: "N/A"
  },
  modal: {
    editTitle: "Modifier l'article",
    addTitle: "Ajouter un nouvel article",
    labels: {
      name: "Nom de l'article",
      category: "Catégorie",
      quantity: "Quantité",
      price: "Prix (TND)",
      supplier: "Fournisseur",
      lowStockThreshold: "Seuil de stock bas",
      restockDate: "Date de Réapprovisionnement",
      expirationDate: "Date d'expiration (Optionnel)",
    },
    cancel: "Annuler",
    save: "Enregistrer"
  },
  alerts: {
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet article ?",
    noDataToExport: "Aucune donnée à exporter."
  },
  csvHeaders: {
    id: "ID",
    name: "Nom de l'article",
    category: "Catégorie",
    quantity: "Quantité",
    price: "Prix Unitaire (TND)",
    supplier: "Fournisseur",
    lastRestock: "Dernier Réappro.",
    lowStockThreshold: "Seuil de Stock Bas",
    expirationDate: "Date d'expiration"
  },
  charts: {
    title: "Aperçu Visuel",
    topCategories: "Top 5 Catégories par Quantité",
    stockStatus: "Statut du Stock",
    legend: {
      inStock: "En Stock",
      lowStock: "Stock Bas",
      expired: "Expiré"
    }
  }
};