<template>
  <div class="login-container">
    <div class="login-box">

      <div class="image-section">
        <img alt="Logo ULEAM" src="@/assets/logo.png"/>
        <h1>Sistema de Validación de Documentos</h1>
        <p>Plataforma para la gestión de solicitudes docentes.</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Correo Institucional o de Soporte</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" v-model="form.password" type="password" placeholder="••••••••" required />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Verificando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <p v-if="error" class="error-message">{{ error }}</p>

      <div class="links-section">
        <router-link to="/recuperar-clave">¿Olvidaste tu contraseña?</router-link>
        <router-link to="/registro">Crear una cuenta de docente</router-link>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      isLoading: false,
      error: null
    }
  },
  methods: {
    handleLogin() {
      this.isLoading = true;
      this.error = null;
      setTimeout(() => {
        // --- LÓGICA DE ROLES MEJORADA ---

        // 1. VERIFICAR SI ES ADMINISTRADOR
        const adminCredentials = {
            email: 'Admin@Soporte.com',
            password: 'Admin12345'
        };

        if (this.form.email.toLowerCase() === adminCredentials.email.toLowerCase() && this.form.password === adminCredentials.password) {
          const adminUser = {
              nombre: 'Secretaría Académica',
              correo: adminCredentials.email,
              role: 'admin'
          };
          localStorage.setItem('usuarioActivo', JSON.stringify(adminUser));

          // Redirige al panel de revisión de solicitudes
          this.$router.push('/revision');
          return;
        }

        // 2. SI NO ES ADMIN, BUSCAR COMO DOCENTE
        const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
        const usuarioEncontrado = usuarios.find(
          user => user.correo.toLowerCase() === this.form.email.toLowerCase() && user.clave === this.form.password
        );

        if (usuarioEncontrado) {
          localStorage.setItem('usuarioActivo', JSON.stringify(usuarioEncontrado));

          // Redirige al panel normal de docente
          this.$router.push('/panel');
        } else {
          this.error = 'Las credenciales proporcionadas son incorrectas.';
          this.form.password = '';
        }

        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>

<style scoped>
/* Tus estilos van aquí */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}
.login-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
}
.image-section {
  margin-bottom: 25px;
  user-select: none;
}
.image-section img {
  max-width: 80px;
  margin-bottom: 15px;
}
.image-section h1 {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}
.image-section p {
    font-size: 16px;
    color: #6c757d;
}
.form-group {
  margin-bottom: 20px;
  text-align: left;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #34495e;
  font-weight: 600;
}
.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-size: 16px;
  color: #2c3e50;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 14px 15px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.error-message {
  color: #e74c3c;
  margin-top: 15px;
  font-weight: 500;
}
.links-section {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
}
.links-section a {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
}
</style>