<template>
  <div class="historial-container">
    <div class="header-section">
      <img alt="Logo ULEAM" src="@/assets/logo.png" />
      <h1>Seguimiento de Postulaciones</h1>
      <p>Aquí puedes consultar el estado y los detalles de todos tus procesos académicos.</p>
    </div>

    <div class="info-box">
      <div v-if="solicitudes.length === 0" class="empty-state">
        <p>Aún no has enviado ninguna postulación.</p>
        <button @click="$router.push('/solicitud')" class="button primary">Crear mi primera postulación</button>
      </div>
      <div v-else class="solicitudes-list">
        <div v-for="solicitud in solicitudes" :key="solicitud.id" class="solicitud-item">
          <div class="solicitud-summary" @click="toggleDetalle(solicitud.id)">
            <div class="summary-info">
              <strong class="tipo-tramite">{{ solicitud.detalles.tipoTramite }}</strong>
              <small class="fecha">Enviado el: {{ solicitud.fecha }}</small>
            </div>
            <div class="summary-status">
              <span :class="['status', getStatusClass(solicitud.estado)]">{{ solicitud.estado }}</span>
              <span class="toggle-icon">{{ activeId === solicitud.id ? '▲' : '▼' }}</span>
            </div>
          </div>

          <div v-if="activeId === solicitud.id" class="solicitud-details">
            <h4>Detalles de la Postulación</h4>
            <ul>
              <li><strong>Fecha de Último Nombramiento:</strong> {{ solicitud.detalles.fechaNombramiento }}</li>
              <li><strong>Tesis de Grado Dirigidas:</strong> {{ solicitud.detalles.tesisDirigidas }}</li>
              <li><strong>Otros Méritos:</strong> {{ solicitud.detalles.otrosMeritos || 'No especificado' }}</li>
            </ul>
            <h4>Documentos Adjuntados</h4>
            <ul>
              <li>
                <strong>Hoja de Vida (CV):</strong>
                <span v-if="solicitud.detalles.documentos.cv">
                  <a href="#" @click.prevent="openPdf(solicitud.detalles.documentos.cv)" class="link-pdf">Ver PDF</a>
                </span>
                <span v-else>No adjuntado</span>
              </li>
              <li>
                <strong>Título Académico:</strong>
                <span v-if="solicitud.detalles.documentos.titulo">
                  <a href="#" @click.prevent="openPdf(solicitud.detalles.documentos.titulo)" class="link-pdf">Ver PDF</a>
                </span>
                <span v-else>No adjuntado</span>
              </li>
              <li>
                <strong>Certificados de Méritos:</strong>
                <span v-if="solicitud.detalles.documentos.certificados">
                  <a href="#" @click.prevent="openPdf(solicitud.detalles.documentos.certificados)" class="link-pdf">Ver PDF</a>
                </span>
                <span v-else>No adjuntado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button @click="$router.push('/panel')" class="button secondary">Volver al Panel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HistorialView",
  data() {
    return {
      solicitudes: [],
      activeId: null 
    };
  },
  methods: {
    loadHistorial() {
      const todasLasSolicitudes = JSON.parse(localStorage.getItem("solicitudes_db")) || [];
      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
      if (usuarioActivo) {
        this.solicitudes = todasLasSolicitudes
          .filter(s => s.docente_email === usuarioActivo.correo)
          .sort((a, b) => new Date(b.id) - new Date(a.id)); 
      }
    },
    getStatusClass(estado) {
      if (estado === 'Aprobada') return 'status-aprobada';
      if (estado === 'Rechazada') return 'status-rechazada';
      return 'status-pendiente';
    },
    toggleDetalle(id) {

      this.activeId = this.activeId === id ? null : id;
    },

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
    this.loadHistorial();
  },
};
</script>

<style scoped>

.historial-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', sans-serif;
  padding: 40px 20px;
}
.header-section {
  text-align: center;
  margin-bottom: 30px;
}
.header-section img { max-width: 80px; margin-bottom: 15px; }
.header-section h1 { font-size: 24px; font-weight: 700; color: #2c3e50; }
.header-section p { color: #6c757d; font-size: 16px; }

.info-box {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 900px;
}

.solicitud-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: box-shadow 0.3s;
}
.solicitud-item:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}
.solicitud-summary {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.summary-info .tipo-tramite { font-size: 18px; font-weight: 600; color: #34495e; }
.summary-info .fecha { display: block; color: #7f8c8d; font-size: 14px; margin-top: 5px; }
.summary-status { display: flex; align-items: center; gap: 15px; }
.toggle-icon { font-size: 18px; color: #95a5a6; }

.status { padding: 6px 12px; border-radius: 15px; color: white; font-size: 12px; font-weight: bold; }
.status-pendiente { background-color: #f39c12; }
.status-aprobada { background-color: #27ae60; }
.status-rechazada { background-color: #e74c3c; }

.solicitud-details {
  background-color: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #e9ecef;
}
.solicitud-details h4 { margin-top: 0; margin-bottom: 15px; color: #34495e; border-bottom: 1px solid #dee2e6; padding-bottom: 10px; }
.solicitud-details ul { list-style: none; padding-left: 0; }
.solicitud-details li { margin-bottom: 10px; font-size: 14px; color: #555; }
.solicitud-details li strong { margin-right: 5px; }
.link-pdf {
  color: #0d6efd; 
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  margin-left: 10px;
}
.link-pdf:hover {
  text-decoration: underline;
}

.button { padding: 12px 25px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
.button.primary { background-color: #27ae60; color: white; }
.button.secondary { background-color: #e9ecef; color: #495057; margin-top: 20px; }
.empty-state { text-align: center; padding: 40px; }
.empty-state p { font-size: 18px; color: #6c757d; margin-bottom: 20px; }
</style>