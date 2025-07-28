<template>
  <div class="registro-container">
    <div class="registro-box">

      <div class="image-section">
        <img alt="Logo ULEAM" src="@/assets/logo.png"/>
        <h1>Crear una Cuenta de Docente</h1>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">Nombres y Apellidos</label>
            <input id="nombre" v-model="form.nombre" @input="validateName" type="text" required />
          </div>
          <div class="form-group">
            <label for="cedula">Cédula</label>
            <input id="cedula" v-model="form.cedula" @input="validateCedula" maxlength="10" type="text" required />
          </div>
        </div>
        
        <div class="form-group">
          <label for="correo">Correo Institucional</label>
          <input id="correo" v-model="form.correo" type="email" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="facultad">Facultad</label>
            <select id="facultad" v-model="form.facultad" required>
              <option disabled value="">Seleccione una facultad...</option>
              <optgroup label="Facultad de Ciencias de la Educación">
                <option>Educación Inicial</option>
                <option>Educación Especial</option>
                <option>Psicología Educativa</option>
                <option>Educación Básica</option>
              </optgroup>
              <optgroup label="Facultad de Ciencias Administrativas">
                <option>Administración de Empresas</option>
                <option>Mercadotecnia</option>
                <option>Contabilidad y Auditoría</option>
                <option>Auditoría y Control de Gestión</option>
                <option>Finanzas</option>
                <option>Comercio Exterior</option>
                <option>Gestión de la Información Gerencial</option>
                <option>Gestión del Talento Humano</option>
              </optgroup>
              <optgroup label="Facultad de Odontología">
                <option>Odontología</option>
              </optgroup>
              <optgroup label="Facultad de Ciencias Médicas">
                <option>Medicina</option>
                <option>Enfermería</option>
                <option>Fisioterapia</option>
                <option>Fonoaudiología</option>
                <option>Laboratorio Clínico</option>
                <option>Terapia Ocupacional</option>
                <option>Psicología</option>
              </optgroup>
              <optgroup label="Facultad de Jurisprudencia">
                <option>Derecho</option>
                <option>Criminología y Ciencias Forenses</option>
              </optgroup>
              <optgroup label="Facultad de Arquitectura">
                <option>Arquitectura</option>
              </optgroup>
              <optgroup label="Facultad de Ingeniería">
                <option>Ingeniería Civil</option>
                <option>Ingeniería Marítima</option>
                <option>Electricidad</option>
                <option>Ingeniería Industrial</option>
                <option>Ingeniería de Alimentos</option>
              </optgroup>
              <optgroup label="Facultad de Ciencias de la Vida y Tecnologías">
                <option>Ingeniería Agropecuaria</option>
                <option>Agronegocios</option>
                <option>Ingeniería Agroindustrial</option>
                <option>Ingeniería Ambiental</option>
                <option>Ingeniería en Tecnologías de la Información</option>
                <option>Ingeniería en Software</option>
                <option>Ingeniería en Sistemas</option>
                <option>Biología</option>
              </optgroup>
              <optgroup label="Facultad de Ciencias Sociales">
                <option>Economía</option>
                <option>Trabajo Social</option>
                <option>Comunicación</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group">
            <label for="categoria">Categoría Docente</label>
            <select id="categoria" v-model="form.categoria" required>
              <option disabled value="">Seleccione...</option>
              <option>Profesor Titular</option><option>Profesor Agregado</option><option>Profesor Auxiliar</option><option>Docente Contratado</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="clave">Contraseña</label>
          <input id="clave" v-model="form.clave" type="password" required />
        </div>
        
        <fieldset class="form-section">
          <legend>Seguridad de la Cuenta</legend>
          <div class="form-group">
            <label for="preguntaSecreta">Seleccione una pregunta de seguridad</label>
            <p class="label-description">Esta pregunta se usará si olvidas tu contraseña.</p>
            <select id="preguntaSecreta" v-model="form.preguntaSecreta" required>
              <option disabled value="">Seleccione una pregunta...</option>
              <option>¿Cuál fue el nombre de su primera mascota?</option>
              <option>¿Cuál es su libro favorito?</option>
              <option>¿En qué ciudad nacieron sus padres?</option>
              <option>¿Cuál fue su primer modelo de automóvil?</option>
            </select>
          </div>
          <div class="form-group">
            <label for="respuestaSecreta">Respuesta Secreta</label>
            <input id="respuestaSecreta" v-model="form.respuestaSecreta" type="text" placeholder="Escriba su respuesta aquí" required />
          </div>
        </fieldset>
        
        <div class="form-group file-upload-group">
          <label>Adjuntar Título Académico (PDF)</label>
          <label for="titulo-pdf" class="file-input-wrapper">
            <span class="file-input-label">{{ titleFileName || 'Seleccionar archivo...' }}</span>
            <input id="titulo-pdf" @change="onTitleFileChange" type="file" accept=".pdf" required />
          </label>
        </div>
        
        <div class="form-group avatar-upload">
          <label for="avatar-input" class="avatar-label">
            <img :src="previewImage" alt="Avatar" class="avatar-preview">
            <span>Seleccionar Foto de Perfil</span>
          </label>
          <input id="avatar-input" @change="onAvatarFileChange" type="file" accept="image/*" />
        </div>

        <button type="submit">Crear Cuenta</button>
      </form>

      <div class="links-section">
        <router-link to="/">¿Ya tienes una cuenta? Inicia Sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/logo.png';

export default {
  name: 'RegistroView',
  data() {
    return {
      previewImage: defaultAvatar,
      titleFileName: null,
      form: {
        nombre: '',
        cedula: '',
        correo: '',
        facultad: '',
        categoria: '',
        tituloPDF: null,
        clave: '',
        avatar: null,
        preguntaSecreta: '',
        respuestaSecreta: ''
      }
    };
  },
  methods: {
    validateName() {
      this.form.nombre = this.form.nombre.replace(/[^a-zA-Z\s]/g, '');
    },
    validateCedula() {
      this.form.cedula = this.form.cedula.replace(/[^0-9]/g, '');
    },
    onFileChange(e, fileType) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (fileType === 'avatar') {
          this.previewImage = event.target.result;
          this.form.avatar = event.target.result;
        } else if (fileType === 'title') {
          this.titleFileName = file.name;
          this.form.tituloPDF = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    },
    onAvatarFileChange(e) {
      this.onFileChange(e, 'avatar');
    },
    onTitleFileChange(e) {
      this.onFileChange(e, 'title');
    },
    handleRegister() {
      if (!this.form.tituloPDF) {
        alert("Por favor, adjunte su título académico en formato PDF.");
        return;
      }
       if (!this.form.preguntaSecreta || !this.form.respuestaSecreta) {
          alert("Por favor, seleccione y responda su pregunta de seguridad.");
          return;
      }
      const usuarios = JSON.parse(localStorage.getItem('usuarios_db')) || [];
      const correoExistente = usuarios.some(user => user.correo === this.form.correo);
      if (correoExistente) {
        alert('Este correo electrónico ya está registrado.');
        return;
      }
      if (!this.form.avatar) {
          this.form.avatar = this.previewImage;
      }
      const nuevoUsuario = { ...this.form, role: 'docente' };
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
      alert('¡Registro exitoso!');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>

.registro-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f6f9;
  font-family: 'Segoe UI', sans-serif;
  padding: 40px 20px;
}
.registro-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
}
.image-section {
  text-align: center;
  margin-bottom: 25px;
  user-select: none;
}
.image-section img { max-width: 80px; margin-bottom: 15px; }
.image-section h1 { font-size: 24px; font-weight: 700; color: #2c3e50; }
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e9ecef;
  margin-bottom: 10px;
  cursor: pointer;
}
.avatar-label {
  color: #495057;
  cursor: pointer;
  font-weight: 500;
  text-align: center;
}
.avatar-label span {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: #0d6efd;
    text-decoration: underline;
}
.avatar-upload input[type="file"] { display: none; }
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
.form-group { margin-bottom: 20px; text-align: left; }
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #34495e;
  font-weight: 600;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-size: 16px;
  color: #2c3e50;
  box-sizing: border-box;
}
.file-upload-group .file-input-wrapper {
    position: relative;
    border: 2px dashed #dee2e6;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    background-color: #f8f9fa;
}
.file-upload-group .file-input-wrapper:hover {
    border-color: #3498db;
}
.file-upload-group .file-input-wrapper input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}
.file-upload-group .file-input-label {
    color: #495057;
    font-weight: 500;
}
.form-section {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  margin-top: 20px;
}
.form-section legend {
  padding: 0 10px;
  font-weight: 600;
  color: #34495e;
  font-size: 18px;
}
.label-description {
    font-size: 12px;
    color: #6c757d;
    margin-top: -5px;
    margin-bottom: 10px;
}
button {
  width: 100%;
  padding: 14px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}
.links-section {
  margin-top: 25px;
  text-align: center;
}
.links-section a { color: #3498db; text-decoration: none; font-weight: 500; }
</style>