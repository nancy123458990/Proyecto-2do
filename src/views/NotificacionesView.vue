<template>
  <div class="notificaciones-container">
    <h1>NOTIFICACIONES</h1>
    <div class="info-box">
       <p class="description">
        Aquí podrá ver los cambios en el estado de sus solicitudes y otras noticias importantes.
      </p>
      <div v-if="notificaciones.length === 0" class="empty-state">
        <p>No tienes notificaciones nuevas.</p>
      </div>
      <ul v-else class="notification-list">
        <li v-for="(notificacion, index) in notificaciones" :key="index" :class="getNotificationClass(notificacion.tipo)">
          <div class="notification-header">
            <strong>{{ notificacion.tipo }}</strong>
            <span class="date">{{ notificacion.fecha }}</span>
          </div>
          <p class="notification-message">{{ notificacion.mensaje }}</p>
        </li>
      </ul>
      <button @click="$router.push('/panel')" class="secondary">Volver al Panel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificacionesView",
  data() {
    return {

      notificaciones: [
        {
          tipo: "Aprobación",
          fecha: "2025-05-15",
          mensaje: "Su solicitud de promoción ha sido aprobada. Felicitaciones."
        },
        {
          tipo: "Corrección solicitada",
          fecha: "2025-04-20",
          mensaje: "Se requiere que adjunte la publicación indexada para completar los requisitos de su solicitud."
        },
        {
          tipo: "Rechazo",
          fecha: "2025-03-10",
          mensaje: "Solicitud rechazada por falta de certificados actualizados en la plataforma."
        }
      ]
    };
  },
  methods: {
      getNotificationClass(tipo) {
          if(tipo === 'Aprobación') return 'aprobada';
          if(tipo === 'Rechazo') return 'rechazada';
          return 'correccion';
      }
  }
};
</script>

<style scoped>
.notificaciones-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f2f6fa;
  min-height: 100vh;
}
.info-box {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 700px;
}
.description {
    text-align: center;
    color: #555;
    margin-bottom: 2rem;
}
.notification-list {
    list-style-type: none;
    padding: 0;
}
.notification-list li {
    border-left-width: 5px;
    border-left-style: solid;
    padding: 15px;
    margin-bottom: 1rem;
    border-radius: 0 8px 8px 0;
    background-color: #f9f9f9;
}
.notification-list li.aprobada { border-left-color: #5cb85c; }
.notification-list li.rechazada { border-left-color: #d9534f; }
.notification-list li.correccion { border-left-color: #f0ad4e; }

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}
.notification-header strong { font-size: 1.1rem; }
.date { font-size: 0.8rem; color: #777; }
.notification-message { margin: 0; }
.secondary {
    background-color: #6c757d;
    margin-top: 2rem;
    width: auto;
    padding: 10px 20px;
}
.empty-state {
    text-align: center;
    padding: 3rem;
}
</style>