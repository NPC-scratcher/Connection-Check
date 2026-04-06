
export type Language = string;

export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
];

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
  drop: string;
  recovery: string;
  day: string;
  disconnection: string;
  reconnection: string;
  waiting: string;
  devNote: string;
  redirectUriMismatch: string;
  checkInterval: string;
  preferencesSystem: string;
  languageLabel: string;
  autoSync: string;
  autoSyncDesc: string;
  restoreDefaults: string;
  downloadError: string;
  readError: string;
  testError: string;
  syncSuccess: string;
  backupCreated: string;
  syncError: string;
  authError: string;
  autoSyncSuccess: string;
  autoSyncError: string;
  date: string;
  stability: string;
  uptimeLabel: string;
  notifIframeError: string;
  notifDeniedError: string;
  notifEnvError: string;
  popupBlockedError: string;
  hello: string;
  defaultUser: string;
  withGoogle: string;
  logout: string;
  connectedAs: string;
  drivePermissionError: string;
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
    exportCsv: 'Exportar CSV',
    drop: 'Caída',
    recovery: 'Regreso',
    day: 'Día',
    disconnection: 'Desconexión',
    reconnection: 'Reconexión',
    waiting: 'Esperando...',
    devNote: 'Nota para el desarrollador',
    redirectUriMismatch: 'Si ves el error redirect_uri_mismatch, debes añadir la siguiente URL a los "URIs de redireccionamiento autorizados" en tu Consola de Google Cloud:',
    checkInterval: 'Intervalo de comprobación',
    preferencesSystem: 'Preferencias y Sistema',
    languageLabel: 'Idioma / Language',
    autoSync: 'Sincronización Automática',
    autoSyncDesc: 'Tus datos se están sincronizando automáticamente con Google Drive. Puedes acceder a ellos desde cualquier dispositivo.',
    restoreDefaults: 'Restaurar valores por defecto',
    downloadError: 'Error en la descarga',
    readError: 'No se pudo leer la respuesta',
    testError: 'Error al realizar la prueba. Comprueba tu conexión.',
    syncSuccess: 'Historial sincronizado desde Google Drive.',
    backupCreated: 'Copia de seguridad creada en Google Drive.',
    syncError: 'Error al sincronizar con Google Drive.',
    authError: 'Error de autenticación con Google: ',
    autoSyncSuccess: 'Sincronización automática con Google Drive completada.',
    autoSyncError: 'Error en sincronización automática:',
    date: 'Fecha',
    stability: 'Estabilidad de Conexión (7 días)',
    uptimeLabel: 'Uptime',
    notifIframeError: 'Las notificaciones están bloqueadas en esta vista previa. Abre la app en una pestaña nueva (icono ↗ arriba a la derecha) para activarlas.',
    notifDeniedError: 'Permiso denegado. Haz clic en el candado de la barra de direcciones para permitir notificaciones.',
    notifEnvError: 'No se pudieron solicitar los permisos en este entorno.',
    popupBlockedError: 'El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes para sincronizar con Google Drive.',
    hello: 'Hola',
    defaultUser: 'Usuario',
    withGoogle: 'con Google',
    logout: 'Cerrar Sesión',
    connectedAs: 'Conectado como',
    drivePermissionError: 'Es necesario conceder acceso a Google Drive para sincronizar tus datos.'
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
    exportCsv: 'Export CSV',
    drop: 'Drop',
    recovery: 'Recovery',
    day: 'Day',
    disconnection: 'Disconnection',
    reconnection: 'Reconnection',
    waiting: 'Waiting...',
    devNote: 'Developer Note',
    redirectUriMismatch: 'If you see the redirect_uri_mismatch error, you must add the following URL to the "Authorized redirect URIs" in your Google Cloud Console:',
    checkInterval: 'Check Interval',
    preferencesSystem: 'Preferences & System',
    languageLabel: 'Language',
    autoSync: 'Automatic Sync',
    autoSyncDesc: 'Your data is being automatically synced with Google Drive. You can access it from any device.',
    restoreDefaults: 'Restore Defaults',
    downloadError: 'Download error',
    readError: 'Could not read response',
    testError: 'Error performing test. Check your connection.',
    syncSuccess: 'History synced from Google Drive.',
    backupCreated: 'Backup created in Google Drive.',
    syncError: 'Error syncing with Google Drive.',
    authError: 'Google authentication error: ',
    autoSyncSuccess: 'Automatic sync with Google Drive completed.',
    autoSyncError: 'Error in automatic sync:',
    date: 'Date',
    stability: 'Connection Stability (7 days)',
    uptimeLabel: 'Uptime',
    notifIframeError: 'Notifications are blocked in this preview. Open the app in a new tab (↗ icon top right) to enable them.',
    notifDeniedError: 'Permission denied. Click the lock in the address bar to allow notifications.',
    notifEnvError: 'Permissions could not be requested in this environment.',
    popupBlockedError: 'The browser blocked the popup. Please allow popups to sync with Google Drive.',
    hello: 'Hello',
    defaultUser: 'User',
    withGoogle: 'with Google',
    logout: 'Logout',
    connectedAs: 'Connected as',
    drivePermissionError: 'You must grant Google Drive access to sync your data.'
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
    exportCsv: 'Exportar CSV',
    drop: 'Queda',
    recovery: 'Recuperação',
    day: 'Dia',
    disconnection: 'Desconexão',
    reconnection: 'Reconexão',
    waiting: 'Aguardando...',
    devNote: 'Nota para o Desenvolvedor',
    redirectUriMismatch: 'Se você vir o erro redirect_uri_mismatch, deve adicionar a seguinte URL aos "URIs de redirecionamento autorizados" no seu Console do Google Cloud:',
    checkInterval: 'Intervalo de Verificação',
    preferencesSystem: 'Preferências e Sistema',
    languageLabel: 'Idioma',
    autoSync: 'Sincronização Automática',
    autoSyncDesc: 'Seus dados estão sendo sincronizados automaticamente com o Google Drive. Você pode acessá-los de qualquer dispositivo.',
    restoreDefaults: 'Restaurar Padrões',
    downloadError: 'Erro no download',
    readError: 'Não foi possível ler a resposta',
    testError: 'Erro ao realizar o teste. Verifique sua conexão.',
    syncSuccess: 'Histórico sincronizado do Google Drive.',
    backupCreated: 'Backup criado no Google Drive.',
    syncError: 'Erro ao sincronizar com o Google Drive.',
    authError: 'Erro de autenticação do Google: ',
    autoSyncSuccess: 'Sincronização automática com o Google Drive concluída.',
    autoSyncError: 'Erro na sincronização automática:',
    date: 'Data',
    stability: 'Estabilidade de Conexão (7 dias)',
    uptimeLabel: 'Uptime',
    notifIframeError: 'As notificações estão bloqueadas nesta visualização. Abra o aplicativo em uma nova guia (ícone ↗ no canto superior direito) para ativá-las.',
    notifDeniedError: 'Permissão negada. Clique no cadeado na barra de endereço para permitir notificações.',
    notifEnvError: 'Não foi possível solicitar permissões neste ambiente.',
    popupBlockedError: 'O navegador bloqueou o pop-up. Por favor, permita pop-ups para sincronizar com o Google Drive.',
    hello: 'Olá',
    defaultUser: 'Usuário',
    withGoogle: 'com Google',
    logout: 'Sair',
    connectedAs: 'Conectado como',
    drivePermissionError: 'Você deve conceder acesso ao Google Drive para sincronizar seus dados.'
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
    exportCsv: 'Exporter CSV',
    drop: 'Coupure',
    recovery: 'Rétablissement',
    day: 'Jour',
    disconnection: 'Déconnexion',
    reconnection: 'Reconnexion',
    waiting: 'En attente...',
    devNote: 'Note pour le développeur',
    redirectUriMismatch: 'Si vous voyez l\'erreur redirect_uri_mismatch, vous devez ajouter l\'URL suivante aux "URI de redirection autorisés" dans votre console Google Cloud :',
    checkInterval: 'Intervalle de vérification',
    preferencesSystem: 'Préférences et Système',
    languageLabel: 'Langue',
    autoSync: 'Synchronisation Automatique',
    autoSyncDesc: 'Vos données sont automatiquement synchronisées avec Google Drive. Vous pouvez y accéder depuis n\'importe quel appareil.',
    restoreDefaults: 'Restaurer les paramètres par défaut',
    downloadError: 'Erreur de téléchargement',
    readError: 'Impossible de lire la réponse',
    testError: 'Erreur lors du test. Vérifiez votre connexion.',
    syncSuccess: 'Historique synchronisé depuis Google Drive.',
    backupCreated: 'Sauvegarde créée dans Google Drive.',
    syncError: 'Erreur de synchronisation avec Google Drive.',
    authError: 'Erreur d\'authentification Google : ',
    autoSyncSuccess: 'Synchronisation automatique avec Google Drive terminée.',
    autoSyncError: 'Erreur de synchronisation automatique :',
    date: 'Date',
    stability: 'Stabilité de la Connexion (7 jours)',
    uptimeLabel: 'Uptime',
    notifIframeError: 'Les notifications sont bloquées dans cet aperçu. Ouvrez l\'application dans un nouvel onglet (icône ↗ en haut à droite) pour les activer.',
    notifDeniedError: 'Permission refusée. Cliquez sur le cadenas dans la barre d\'adresse pour autoriser les notifications.',
    notifEnvError: 'Les autorisations n\'ont pas pu être demandées dans cet environnement.',
    popupBlockedError: 'Le navigateur a bloqué la fenêtre contextuelle. Veuillez autoriser les fenêtres contextuelles pour synchroniser avec Google Drive.',
    hello: 'Bonjour',
    defaultUser: 'Utilisateur',
    withGoogle: 'avec Google',
    logout: 'Déconnexion',
    connectedAs: 'Connecté en tant que',
    drivePermissionError: 'Vous devez accorder l\'accès à Google Drive pour synchroniser vos données.'
  }
};
