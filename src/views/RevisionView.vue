<template>
  <div class="admin-container">
    <header class="panel-header">
      <div class="header-title">
        <img src="@/assets/logo.png" alt="Logo" class="header-logo">
        <h2>Panel de Administración</h2>
      </div>
      <div class="user-actions">
        <div class="profile-wrapper">
          <div class="profile-avatar-initials" @click="toggleProfileMenu">A</div>
          <div v-if="showProfileMenu" class="dropdown-menu profile-dropdown">
            <div class="dropdown-header">
              <strong>{{ adminUser.nombre }}</strong>
              <small>Panel de Control</small>
            </div>
            <ul class="profile-details">
              <li>
                <strong>Categoría:</strong>
                <span>Administrador</span>
              </li>
              <li>
                <strong>Credenciales:</strong>
                <span>{{ adminUser.correo }}</span>
              </li>
            </ul>
            <button @click="logout" class="logout-button">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </header>

    <main class="panel-content">
      <div class="content-header">
        <h1>Gestión de Postulaciones Docentes</h1>
        <div class="filter-group">
          <label for="filtroEstado">Filtrar por estado:</label>
          <select v-model="filtro" id="filtroEstado">
            <option value="Todos">Todas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Aprobada">Aprobadas</option>
            <option value="Rechazada">Rechazadas</option>
          </select>
        </div>
      </div>

      <div class="info-box">
        <div v-if="solicitudesFiltradas.length === 0" class="empty-state">
          <p>No hay postulaciones que coincidan con el filtro seleccionado.</p>
        </div>
        <div v-else class="solicitudes-list">
          <div v-for="solicitud in solicitudesFiltradas" :key="solicitud.id" class="solicitud-item">
            <div class="solicitud-summary" @click="toggleDetalle(solicitud.id)">
              <div class="summary-info">
                <strong class="docente-nombre">{{ solicitud.docente }}</strong>
                <small class="fecha">Postulación para: {{ solicitud.detalles.tipoTramite }}</small>
              </div>
              <div class="summary-status">
                <span :class="['status', getStatusClass(solicitud.estado)]">{{ solicitud.estado }}</span>
                <span class="toggle-icon">{{ activeId === solicitud.id ? '▲' : '▼' }}</span>
              </div>
            </div>

            <div v-if="activeId === solicitud.id" class="solicitud-details">
              <h4>Detalles del Docente</h4>
              <ul>
                <li><strong>Correo:</strong> {{ solicitud.docente_email }}</li>
                <li><strong>Facultad:</strong> {{ solicitud.detalles.facultad }}</li>
                <li><strong>Categoría Actual:</strong> {{ solicitud.detalles.categoria }}</li>
              </ul>
              <h4>Detalles de la Postulación</h4>
              <ul>
                <li><strong>Fecha de Envío:</strong> {{ solicitud.fecha }}</li>
                <li><strong>Fecha de Último Nombramiento:</strong> {{ solicitud.detalles.fechaNombramiento }}</li>
                <li><strong>Tesis Dirigidas:</strong> {{ solicitud.detalles.tesisDirigidas }}</li>
              </ul>
              <h4>Documentos Adjuntados</h4>
              <ul class="document-links">
                <li v-if="solicitud.detalles.documentos && solicitud.detalles.documentos.cv">
                  <strong>Hoja de Vida (CV):</strong> <a href="#" @click.prevent="openPdf(solicitud.detalles.documentos.cv)" class="link-pdf">Ver PDF</a>
                </li>
                 <li v-else>
                   <strong>Hoja de Vida (CV):</strong> No adjuntado
                 </li>

                <li v-if="solicitud.detalles.documentos && solicitud.detalles.documentos.titulo">
                  <strong>Título Académico:</strong> <a href="#" @click.prevent="openPdf(solicitud.detalles.documentos.titulo)" class="link-pdf">Ver PDF</a>
                </li>
                <li v-else>
                  <strong>Título Académico:</strong> No adjuntado
                </li>

                <li v-if="solicitud.detalles.documentos && solicitud.detalles.documentos.certificados">
                  <strong>Certificados de Méritos:</strong> <a href="#" @click.prevent="openPdf(solicitud.detalles.documentos.certificados)" class="link-pdf">Ver PDF</a>
                </li>
                 <li v-else>
                   <strong>Certificados de Méritos:</strong> No adjuntado
                 </li>
                <li v-if="solicitud.detalles.tituloPDF && !solicitud.detalles.documentos"> 
                    <strong>Título Académico (antiguo):</strong> <a href="#" @click.prevent="openPdf(solicitud.detalles.tituloPDF)" class="link-pdf">Ver PDF</a>
                </li>
              </ul>

              <div v-if="solicitud.estado === 'Pendiente'" class="action-buttons">
                <button @click="cambiarEstado(solicitud.id, 'Rechazada')" class="button reject">Rechazar</button>
                <button @click="cambiarEstado(solicitud.id, 'Aprobada')" class="button approve">Aprobar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "RevisionView",
  data() {
    return {
      adminUser: {},
      todasLasSolicitudes: [],
      filtro: "Pendiente",
      activeId: null,
      showProfileMenu: false,
    };
  },
  computed: {
    solicitudesFiltradas() {
      if (this.filtro === "Todos") {
        return this.todasLasSolicitudes;
      }
      return this.todasLasSolicitudes.filter(s => s.estado === this.filtro);
    },
  },
  methods: {
    loadAdminData() {
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        if (usuarioActivo && usuarioActivo.role === 'admin') {
            this.adminUser = usuarioActivo;
        } else {
            this.$router.push('/');
        }
    },
    loadSolicitudes() {
      const solicitudes = JSON.parse(localStorage.getItem("solicitudes_db")) || [];
      this.todasLasSolicitudes = solicitudes.sort((a, b) => b.id - a.id);
    },
    toggleDetalle(id) {
      this.activeId = this.activeId === id ? null : id;
    },
    cambiarEstado(id, nuevoEstado) {
      const solicitudIndex = this.todasLasSolicitudes.findIndex(s => s.id === id);
      if (solicitudIndex !== -1) {
        this.todasLasSolicitudes[solicitudIndex].estado = nuevoEstado;
        localStorage.setItem("solicitudes_db", JSON.stringify(this.todasLasSolicitudes));
      }
    },
    getStatusClass(estado) {
      if (estado === 'Aprobada') return 'status-aprobada';
      if (estado === 'Rechazada') return 'status-rechazada';
      return 'status-pendiente';
    },
    toggleProfileMenu() {
        this.showProfileMenu = !this.showProfileMenu;
    },
    logout() {
      localStorage.removeItem('usuarioActivo');
      this.$router.push('/');
    },
    // Añade el método openPdf aquí, idéntico al de HistorialView
    openPdf(pdfUrl) {
      if (pdfUrl) {
        const pdfWindow = window.open("");
        if (pdfWindow) {
            pdfWindow.document.write("<iframe width='100%' height='100%' src='" + pdfUrl + "' style='border:none;'></iframe>");
            pdfWindow.document.close();
        } else {
            alert('El navegador bloqueó la apertura de la ventana emergente. Por favor, permítelas para ver el PDF.');
        }
      } else {
        alert('El documento no está disponible.');
      }
    }
  },
  mounted() {
    this.loadAdminData();
    this.loadSolicitudes();
  },
};
</script>

<style scoped>
/* ESTILOS COMPLETOS Y CORREGIDOS - NO SE NECESITAN CAMBIOS AQUÍ */
.admin-container { background-color: #f8f9fa; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
.panel-header { background-color: #ffffff; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.header-title { display: flex; align-items: center; }
.header-logo { height: 40px; margin-right: 15px; }
.header-title h2 { font-size: 22px; color: #343a40; font-weight: 600; }
.user-actions { display: flex; align-items: center; gap: 20px; }
.profile-wrapper { position: relative; }

.profile-avatar-initials {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
}

.dropdown-menu { position: absolute; top: 60px; right: 0; background: white; border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); width: 280px; z-index: 100; border: 1px solid #eee; }
.dropdown-header { padding: 15px; border-bottom: 1px solid #f0f0f0; }
.dropdown-header strong { font-size: 16px; }
.dropdown-header small { display: block; color: #6c757d; font-size: 12px; }
.profile-details { list-style: none; padding: 0; margin: 0 15px; }
.profile-details li { padding: 10px 0; font-size: 14px; display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; }
.profile-details li:last-child { border-bottom: none; }
.profile-details span { color: #6c757d; font-weight: 500; }
.logout-button { width: calc(100% - 30px); margin: 15px; padding: 10px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 6px; cursor: pointer; text-align: center; }

.panel-content { padding: 40px; max-width: 1200px; margin: 0 auto; }
.content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.content-header h1 { font-size: 26px; color: #2c3e50; }
.filter-group label { margin-right: 10px; font-weight: 500; }
.filter-group select { padding: 8px 12px; border-radius: 6px; border: 1px solid #ced4da; }

.info-box { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); }
.solicitud-item { border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 15px; }
.solicitud-summary { padding: 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.summary-info .docente-nombre { font-size: 18px; font-weight: 600; }
.summary-info .fecha { display: block; color: #7f8c8d; font-size: 14px; margin-top: 5px; }
.summary-status { display: flex; align-items: center; gap: 15px; }
.status { padding: 6px 12px; border-radius: 15px; color: white; font-size: 12px; font-weight: bold; }
.status-pendiente { background-color: #f39c12; }
.status-aprobada { background-color: #27ae60; }
.status-rechazada { background-color: #e74c3c; }
.toggle-icon { font-size: 18px; color: #95a5a6; }

.solicitud-details { background-color: #f8f9fa; padding: 20px; border-top: 1px solid #e9ecef; }
.solicitud-details h4 { margin-top: 0; margin-bottom: 15px; color: #34495e; }
.solicitud-details ul { list-style: none; padding-left: 0; margin-bottom: 20px; }
.solicitud-details li { margin-bottom: 10px; font-size: 14px; }
.document-links .link-pdf { color: #0d6efd; text-decoration: none; font-weight: 500; }
.action-buttons { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; border-top: 1px solid #e9ecef; padding-top: 20px; }
.button { padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
.button.approve { background-color: #27ae60; color: white; }
.button.reject { background-color: #e74c3c; color: white; }
.empty-state { text-align: center; padding: 40px; }
</style>