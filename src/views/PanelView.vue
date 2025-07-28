<template>
  <div class="panel-container">
    <div v-if="isLoading" class="loading-overlay">
      <p>Cargando plataforma...</p>
    </div>
    <div v-else>
      <header class="panel-header">
        <div class="header-title">
          <img src="@/assets/logo.png" alt="Logo" class="header-logo">
          <h2>Plataforma Docente</h2>
        </div>
        <div class="user-actions">
          <div class="notification-wrapper">
            <div @click="toggleNotifications" class="notification-bell animated-bell">
              <span v-if="unreadNotificationsCount > 0" class="notification-badge">{{ unreadNotificationsCount }}</span>
            </div>
            <div v-if="showNotifications" class="dropdown-menu notifications-dropdown">
              <div class="dropdown-header">Notificaciones</div>
              <ul v-if="notifications.length > 0">
                <li v-for="notif in notifications" :key="notif.id" :class="notif.type">
                  <strong>{{ notif.title }}</strong>
                  <p>{{ notif.message }}</p>
                  <small>{{ notif.date }}</small>
                </li>
              </ul>
              <div v-else class="no-items">No hay notificaciones.</div>
            </div>
          </div>
          <div class="profile-wrapper">
            <img v-if="user.avatar" :src="user.avatar" alt="Avatar" class="profile-avatar" @click="toggleProfileMenu">
            <div v-if="showProfileMenu" class="dropdown-menu profile-dropdown">
              <div class="dropdown-header">
                <strong>{{ user.nombre }}</strong>
                <small>{{ user.correo }}</small>
              </div>
              <ul class="profile-details">
                <li><strong>Facultad:</strong> {{ user.facultad }}</li>
                <li><strong>Categoría:</strong> {{ user.categoria }}</li>
                <li v-if="user.tituloPDF">
                  <strong>Título Académico:</strong>
                  <a @click="openTitlePdf" href="#" class="link-pdf">Ver PDF</a>
                </li>
              </ul>
              <button @click="logout" class="logout-button">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </header>
      <main class="panel-content">
        <div class="welcome-message">
          <h3>Bienvenido de nuevo, {{ user.nombre ? user.nombre.split(' ')[0] : '' }}</h3>
          <p>Aquí tienes un resumen de tu actividad reciente.</p>
        </div>
        <div class="info-box summary-box">
          <div class="summary-grid">
            <div class="stat-card"><h4>{{ summary.total }}</h4><p>Totales</p></div>
            <div class="stat-card pending"><h4>{{ summary.pendientes }}</h4><p>Pendientes</p></div>
            <div class="stat-card approved"><h4>{{ summary.aprobadas }}</h4><p>Aprobadas</p></div>
            <div class="stat-card rejected"><h4>{{ summary.rechazadas }}</h4><p>Rechazadas</p></div>
          </div>
        </div>
        <div class="info-box actions-box">
          <h3>Acciones Rápidas</h3>
          <div class="actions-grid">
            <button @click="navigate('/solicitud')" class="action-button"><span class="icon">📄</span> Nueva Solicitud</button>
            <button @click="navigate('/historial')" class="action-button"><span class="icon">📚</span> Ver Historial</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelView',
  data() {
    return {
      isLoading: true,
      user: {},
      summary: { total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 },
      notifications: [],
      unreadNotificationsCount: 0,
      showNotifications: false,
      showProfileMenu: false,
    };
  },
  methods: {

    logout() { localStorage.removeItem('usuarioActivo'); this.$router.push('/'); },
    navigate(path) { this.$router.push(path); },
    toggleNotifications() { this.showNotifications = !this.showNotifications; this.showProfileMenu = false; if (this.showNotifications) this.unreadNotificationsCount = 0; },
    toggleProfileMenu() { this.showProfileMenu = !this.showProfileMenu; this.showNotifications = false; },
    

    openTitlePdf() {
      if (this.user && this.user.tituloPDF) {
        const pdfWindow = window.open("");
        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + this.user.tituloPDF + "'></iframe>");
      }
    },

    loadDashboardData() {
      setTimeout(() => {
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        if (usuarioActivo) {
          this.user = usuarioActivo;
        } else {
          this.logout();
          return;
        }
        const solicitudes = JSON.parse(localStorage.getItem('solicitudes_db')) || [];
        const misSolicitudes = solicitudes.filter(s => s.docente_email === this.user.correo);
        this.summary.total = misSolicitudes.length;
        this.summary.pendientes = misSolicitudes.filter(s => s.estado === 'Pendiente').length;
        this.summary.aprobadas = misSolicitudes.filter(s => s.estado === 'Aprobada').length;
        this.summary.rechazadas = misSolicitudes.filter(s => s.estado === 'Rechazada').length;
        this.notifications = misSolicitudes
          .filter(s => s.estado === 'Aprobada' || s.estado === 'Rechazada')
          .map(s => ({
            id: s.id,
            title: `Solicitud ${s.estado}`,
            message: `Tu solicitud de "${s.detalles.tipoTramite}" fue actualizada.`,
            date: s.fecha,
            type: s.estado.toLowerCase()
          }));
        this.unreadNotificationsCount = this.notifications.length;
        this.isLoading = false;
      }, 500);
    }
  },
  mounted() {
    this.loadDashboardData();
  }
};
</script>

<style scoped>

.loading-overlay { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 1.5rem; color: #555; }
.panel-container { background-color: #f8f9fa; min-height: 100vh; }
.panel-header { background-color: #ffffff; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.header-title { display: flex; align-items: center; }
.header-logo { height: 40px; margin-right: 15px; }
.header-title h2 { font-size: 22px; color: #343a40; font-weight: 600; }
.user-actions { display: flex; align-items: center; gap: 20px; }
.notification-bell { width: 24px; height: 24px; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235a6a7b"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>'); background-size: contain; background-repeat: no-repeat; cursor: pointer; border: none; background-color: transparent; position: relative; transition: transform 0.2s ease; }
.notification-bell:hover { transform: rotate(15deg); }
.notification-badge { position: absolute; top: -5px; right: -5px; background-color: #e74c3c; color: white; border-radius: 50%; padding: 2px 6px; font-size: 10px; font-weight: bold; }
.profile-avatar { height: 40px; width: 40px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: border-color 0.3s; object-fit: cover; }
.profile-avatar:hover { border-color: #0d6efd; }
.dropdown-menu { position: absolute; top: 70px; right: 40px; background: white; border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); width: 320px; z-index: 100; border: 1px solid #eee; }
.dropdown-header { padding: 15px; border-bottom: 1px solid #f0f0f0; }
.dropdown-header strong { font-size: 16px; }
.dropdown-header small { display: block; color: #6c757d; font-size: 12px; }
.dropdown-menu ul { list-style: none; padding: 0; margin: 0; }
.dropdown-menu li { padding: 12px 15px; }
.profile-details li { font-size: 14px; color: #333; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;}
.link-pdf { color: #0d6efd; text-decoration: none; font-weight: 500; cursor: pointer; }
.logout-button { width: calc(100% - 30px); margin: 15px; padding: 10px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 6px; cursor: pointer; text-align: center; }
.logout-button:hover { background-color: #f1b0b7; }
.no-items { padding: 20px; text-align: center; color: #777; }
.panel-content { padding: 40px; max-width: 980px; margin: 0 auto; }
.welcome-message { margin-bottom: 30px; }
.welcome-message h3 { font-size: 26px; color: #343a40; }
.welcome-message p { font-size: 16px; color: #6c757d; }
.info-box { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); width: 100%; max-width: 900px; margin: 20px auto; }
.info-box h3 { font-size: 20px; color: #34495e; border-bottom: 1px solid #ecf0f1; padding-bottom: 15px; margin-top: 0; margin-bottom: 20px; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; text-align: center; }
.stat-card { padding: 20px; border-radius: 8px; }
.stat-card h4 { font-size: 36px; margin: 0; }
.stat-card p { margin: 5px 0 0; color: #7f8c8d; font-weight: 500; }
.stat-card.pending { background: #fdf3e6; } .stat-card.pending h4 { color: #f39c12; }
.stat-card.approved { background: #eafaf1; } .stat-card.approved h4 { color: #27ae60; }
.stat-card.rejected { background: #fdedec; } .stat-card.rejected h4 { color: #e74c3c; }
.actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.action-button { background-color: #3498db; color: white; border: none; padding: 20px; border-radius: 8px; font-size: 18px; text-align: center; cursor: pointer; transition: transform 0.2s; }
.action-button:hover { transform: translateY(-3px); }
.action-button .icon { font-size: 24px; display: block; margin-bottom: 10px; }
</style>