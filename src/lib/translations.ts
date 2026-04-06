
export type Language = 'es' | 'en' | 'pt' | 'fr';

export interface Translation {
  home: string;
  speedtest: string;
  history: string;
  profile: string;
  connected: string;
  disconnected: string;
  networkInfo: string;
  publicIp: string;
  provider: string;
  location: string;
  quickSpeedTest: string;
  quickSpeedTestDesc: string;
  goToSpeed: string;
  uptimeToday: string;
  dropsToday: string;
  dropsMonth: string;
  dropsYear: string;
  disconnectionHistory: string;
  csv: string;
  excel: string;
  clear: string;
  confirm: string;
  settings: string;
  notifications: string;
  darkMode: string;
  autoSpeedtest: string;
  autoSpeedtestDesc: string;
  userName: string;
  googleSync: string;
  googleSyncDesc: string;
  download: string;
  upload: string;
  ping: string;
  startTest: string;
  measuring: string;
  speedHistory: string;
  noHistory: string;
  time: string;
  duration: string;
  status: string;
  connectionSummary: string;
  checkingEvery: string;
  minutes: string;
  seconds: string;
  score: string;
  exportCsv: string;
}

export const translations: Record<Language, Translation> = {
  es: {
    home: 'Inicio',
    speedtest: 'Velocidad',
    history: 'Historial',
    profile: 'Perfil',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    networkInfo: 'Información de Red',
    publicIp: 'IP Pública',
    provider: 'Proveedor',
    location: 'Ubicación',
    quickSpeedTest: 'Prueba de Velocidad Rápida',
    quickSpeedTestDesc: 'Comprueba tu velocidad de descarga, subida y ping al instante.',
    goToSpeed: 'Ir a Velocidad',
    uptimeToday: 'Uptime Hoy',
    dropsToday: 'Caídas Hoy',
    dropsMonth: 'Caídas Mes',
    dropsYear: 'Caídas Año',
    disconnectionHistory: 'Historial de Desconexiones',
    csv: 'CSV',
    excel: 'Excel',
    clear: 'Borrar',
    confirm: '¿Confirmar?',
    settings: 'Ajustes',
    notifications: 'Notificaciones',
    darkMode: 'Modo Oscuro',
    autoSpeedtest: 'Auto-Speedtest',
    autoSpeedtestDesc: '0 = Desactivado. Mínimo 5 minutos.',
    userName: 'Nombre de Usuario',
    googleSync: 'Sincronización con Google Drive',
    googleSyncDesc: 'Guarda tu historial de forma segura en la nube.',
    download: 'Descarga',
    upload: 'Subida',
    ping: 'Ping',
    startTest: 'Iniciar Prueba',
    measuring: 'Midiendo...',
    speedHistory: 'Historial de Pruebas',
    noHistory: 'No hay registros aún.',
    time: 'Hora',
    duration: 'Duración',
    status: 'Estado',
    connectionSummary: 'Resumen de Conexión',
    checkingEvery: 'Verificando cada',
    minutes: 'Min',
    seconds: 's',
    score: 'Score',
    exportCsv: 'Exportar CSV'
  },
  en: {
    home: 'Home',
    speedtest: 'Speed',
    history: 'History',
    profile: 'Profile',
    connected: 'Connected',
    disconnected: 'Disconnected',
    networkInfo: 'Network Info',
    publicIp: 'Public IP',
    provider: 'Provider',
    location: 'Location',
    quickSpeedTest: 'Quick Speed Test',
    quickSpeedTestDesc: 'Check your download, upload, and ping instantly.',
    goToSpeed: 'Go to Speed',
    uptimeToday: 'Uptime Today',
    dropsToday: 'Drops Today',
    dropsMonth: 'Drops Month',
    dropsYear: 'Drops Year',
    disconnectionHistory: 'Disconnection History',
    csv: 'CSV',
    excel: 'Excel',
    clear: 'Clear',
    confirm: 'Confirm?',
    settings: 'Settings',
    notifications: 'Notifications',
    darkMode: 'Dark Mode',
    autoSpeedtest: 'Auto-Speedtest',
    autoSpeedtestDesc: '0 = Disabled. Minimum 5 minutes.',
    userName: 'User Name',
    googleSync: 'Google Drive Sync',
    googleSyncDesc: 'Save your history securely in the cloud.',
    download: 'Download',
    upload: 'Upload',
    ping: 'Ping',
    startTest: 'Start Test',
    measuring: 'Measuring...',
    speedHistory: 'Speed Test History',
    noHistory: 'No records yet.',
    time: 'Time',
    duration: 'Duration',
    status: 'Status',
    connectionSummary: 'Connection Summary',
    checkingEvery: 'Checking every',
    minutes: 'Min',
    seconds: 's',
    score: 'Score',
    exportCsv: 'Export CSV'
  },
  pt: {
    home: 'Início',
    speedtest: 'Velocidade',
    history: 'Histórico',
    profile: 'Perfil',
    connected: 'Conectado',
    disconnected: 'Desconectado',
    networkInfo: 'Informações de Rede',
    publicIp: 'IP Público',
    provider: 'Provedor',
    location: 'Localização',
    quickSpeedTest: 'Teste de Velocidade Rápido',
    quickSpeedTestDesc: 'Verifique sua velocidade de download, upload e ping instantaneamente.',
    goToSpeed: 'Ir para Velocidade',
    uptimeToday: 'Uptime Hoje',
    dropsToday: 'Quedas Hoje',
    dropsMonth: 'Quedas Mês',
    dropsYear: 'Quedas Ano',
    disconnectionHistory: 'Histórico de Desconexões',
    csv: 'CSV',
    excel: 'Excel',
    clear: 'Limpar',
    confirm: 'Confirmar?',
    settings: 'Configurações',
    notifications: 'Notificações',
    darkMode: 'Modo Escuro',
    autoSpeedtest: 'Auto-Speedtest',
    autoSpeedtestDesc: '0 = Desativado. Mínimo 5 minutos.',
    userName: 'Nome de Usuário',
    googleSync: 'Sincronização com Google Drive',
    googleSyncDesc: 'Salve seu histórico com segurança na nuvem.',
    download: 'Download',
    upload: 'Upload',
    ping: 'Ping',
    startTest: 'Iniciar Teste',
    measuring: 'Medindo...',
    speedHistory: 'Histórico de Testes',
    noHistory: 'Nenhum registro ainda.',
    time: 'Hora',
    duration: 'Duração',
    status: 'Status',
    connectionSummary: 'Resumo da Conexão',
    checkingEvery: 'Verificando a cada',
    minutes: 'Min',
    seconds: 's',
    score: 'Score',
    exportCsv: 'Exportar CSV'
  },
  fr: {
    home: 'Accueil',
    speedtest: 'Vitesse',
    history: 'Historique',
    profile: 'Profil',
    connected: 'Connecté',
    disconnected: 'Déconnecté',
    networkInfo: 'Infos Réseau',
    publicIp: 'IP Publique',
    provider: 'Fournisseur',
    location: 'Emplacement',
    quickSpeedTest: 'Test de Vitesse Rapide',
    quickSpeedTestDesc: 'Vérifiez instantanément votre vitesse de téléchargement, d\'envoi et votre ping.',
    goToSpeed: 'Aller à la Vitesse',
    uptimeToday: 'Uptime Aujourd\'hui',
    dropsToday: 'Coupures Aujourd\'hui',
    dropsMonth: 'Coupures Mois',
    dropsYear: 'Coupures Année',
    disconnectionHistory: 'Historique des Coupures',
    csv: 'CSV',
    excel: 'Excel',
    clear: 'Effacer',
    confirm: 'Confirmer ?',
    settings: 'Paramètres',
    notifications: 'Notifications',
    darkMode: 'Mode Sombre',
    autoSpeedtest: 'Auto-Speedtest',
    autoSpeedtestDesc: '0 = Désactivé. Minimum 5 minutes.',
    userName: 'Nom d\'utilisateur',
    googleSync: 'Sync Google Drive',
    googleSyncDesc: 'Sauvegardez votre historique en toute sécurité dans le cloud.',
    download: 'Téléchargement',
    upload: 'Envoi',
    ping: 'Ping',
    startTest: 'Lancer le Test',
    measuring: 'Mesure...',
    speedHistory: 'Historique des Tests',
    noHistory: 'Aucun enregistrement pour le moment.',
    time: 'Heure',
    duration: 'Durée',
    status: 'Statut',
    connectionSummary: 'Résumé de la Connexion',
    checkingEvery: 'Vérification toutes les',
    minutes: 'Min',
    seconds: 's',
    score: 'Score',
    exportCsv: 'Exporter CSV'
  }
};
