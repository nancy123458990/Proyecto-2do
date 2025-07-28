import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import PanelView from '../views/PanelView.vue'
import SolicitudView from '../views/SolicitudView.vue'
import HistorialView from '../views/HistorialView.vue'
import RevisionView from '../views/RevisionView.vue'
import NotificacionesView from '../views/NotificacionesView.vue'
import RecuperarClaveView from '../views/RecuperarClaveView.vue' // <-- 1. Importa la nueva vista

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView
  },
  { // <-- 2. Añade la ruta para recuperar clave
    path: '/recuperar-clave',
    name: 'recuperar-clave',
    component: RecuperarClaveView
  },
  {
    path: '/panel',
    name: 'panel',
    component: PanelView,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitud',
    name: 'solicitud',
    component: SolicitudView,
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'historial',
    component: HistorialView,
    meta: { requiresAuth: true }
  },
  {
    path: '/revision',
    name: 'revision',
    component: RevisionView,
    meta: { requiresAuth: true, requiredRole: 'admin' }
  },
  {
    path: '/notificaciones',
    name: 'notificaciones',
    component: NotificacionesView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Tu guardián de rutas (router.beforeEach) va aquí
router.beforeEach((to, from, next) => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (to.meta.requiresAuth) {
    if (!usuarioActivo) {
      next('/');
    } else {
      if (to.meta.requiredRole && usuarioActivo.role !== to.meta.requiredRole) {
        next('/panel');
      } else {
        next();
      }
    }
  } else {
    next();
  }
});


export default router