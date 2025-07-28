<template>
  <div class="recovery-container">
    <div class="recovery-box">

      <div class="image-section">
        <img alt="Logo ULEAM" src="@/assets/logo.png"/>
        <h1>Restablecer Contraseña</h1>
      </div>

      <div v-if="step === 1">
        <p class="step-description">Ingresa tu correo institucional para comenzar el proceso de recuperación.</p>
        <form @submit.prevent="findUser">
          <div class="form-group">
            <label for="email">Correo Institucional</label>
            <input id="email" v-model="email" type="email" required />
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" :disabled="isLoading">{{ isLoading ? 'Verificando...' : 'Verificar Correo' }}</button>
        </form>
      </div>

      <div v-if="step === 2">
        <p class="step-description">Para continuar, responde a tu pregunta de seguridad:</p>
        <form @submit.prevent="checkAnswer">
          <div class="form-group">
            <label class="security-question">{{ securityQuestion }}</label>
            <input v-model="securityAnswer" type="text" placeholder="Escribe tu respuesta aquí" required />
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" :disabled="isLoading">{{ isLoading ? 'Verificando...' : 'Verificar Respuesta' }}</button>
        </form>
      </div>

      <div v-if="step === 3">
        <p class="step-description">Tu respuesta es correcta. Por favor, establece una nueva contraseña.</p>
        <form @submit.prevent="updatePassword">
          <div class="form-group">
            <label for="newPassword">Nueva Contraseña</label>
            <input id="newPassword" v-model="newPassword" type="password" required />
          </div>
           <div class="form-group">
            <label for="confirmPassword">Confirmar Nueva Contraseña</label>
            <input id="confirmPassword" v-model="confirmPassword" type="password" required />
          </div>
          <p v-if="error" class="error-message">{{ error }}</p>
          <button type="submit" :disabled="isLoading">{{ isLoading ? 'Actualizando...' : 'Cambiar Contraseña' }}</button>
        </form>
      </div>
      
      <div v-if="step === 4" class="success-message">
        <h3>¡Éxito!</h3>
        <p>Tu contraseña ha sido actualizada correctamente.</p>
        <router-link to="/" class="button-link">Volver a Inicio de Sesión</router-link>
      </div>

      <div v-if="step !== 4" class="links-section">
        <router-link to="/">Cancelar y volver</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecuperarClaveView',
  data() {
    return {
      step: 1,
      email: '',
      userToRecover: null,
      securityQuestion: '',
      securityAnswer: '',
      newPassword: '',
      confirmPassword: '',
      error: null,
      isLoading: false
    };
  },
  methods: {
    findUser() {
      this.isLoading = true;
      this.error = null;
      setTimeout(() => {
        const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
        const user = usuarios.find(u => u.correo === this.email);
        if (user && user.preguntaSecreta) {
          this.userToRecover = user;
          this.securityQuestion = user.preguntaSecreta;
          this.step = 2;
        } else {
          this.error = "No se encontró una cuenta con ese correo o no tiene una pregunta de seguridad configurada.";
        }
        this.isLoading = false;
      }, 1000);
    },
    checkAnswer() {
      this.isLoading = true;
      this.error = null;
      setTimeout(() => {
        if (this.securityAnswer.trim().toLowerCase() === this.userToRecover.respuestaSecreta.trim().toLowerCase()) {
          this.step = 3;
        } else {
          this.error = "La respuesta de seguridad es incorrecta. Inténtalo de nuevo.";
        }
        this.isLoading = false;
      }, 1000);
    },
    updatePassword() {
      this.error = null;
      if (this.newPassword !== this.confirmPassword) {
        this.error = "Las contraseñas no coinciden.";
        return;
      }
      if (this.newPassword.length < 4) {
          this.error = "La nueva contraseña debe tener al menos 4 caracteres.";
          return;
      }
      this.isLoading = true;
      setTimeout(() => {
        let usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
        const userIndex = usuarios.findIndex(u => u.correo === this.userToRecover.correo);
        
        if (userIndex !== -1) {
          usuarios[userIndex].clave = this.newPassword;
          localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
          this.step = 4;
        } else {
          this.error = "Ocurrió un error inesperado al actualizar la contraseña.";
        }
        this.isLoading = false;
      }, 1000);
    }
  }
}
</script>

<style scoped>
.recovery-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}
.recovery-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
}
.image-section { margin-bottom: 25px; }
.image-section img { max-width: 80px; margin-bottom: 15px; }
.image-section h1 { font-size: 24px; font-weight: 700; color: #2c3e50; margin-bottom: 10px; }
.step-description, .image-section p { font-size: 16px; color: #6c757d; line-height: 1.5; }
.form-group { margin-bottom: 20px; text-align: left; }
.form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #34495e; font-weight: 600; }
.form-group input { width: 100%; padding: 12px 15px; border: 1px solid #bdc3c7; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
.security-question {
    background-color: #e9ecef;
    padding: 12px 15px;
    border-radius: 8px;
    font-style: italic;
    color: #495057;
}
button {
  width: 100%;
  padding: 14px 15px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
button:disabled { background-color: #95a5a6; cursor: not-allowed; }
.error-message { color: #e74c3c; margin-top: 15px; font-weight: 500; }
.success-message { text-align: center; }
.success-message h3 { font-size: 22px; color: #27ae60; }
.button-link {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 25px;
    background-color: #27ae60;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
}
.links-section { margin-top: 25px; font-size: 14px; }
.links-section a { color: #3498db; text-decoration: none; font-weight: 500; }
</style>