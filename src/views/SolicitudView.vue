<template>
  <div class="solicitud-container">
    <div class="solicitud-box">

      <div class="header-section">
        <img alt="Logo ULEAM" src="@/assets/logo.png"/>
        <h1>Formulario de Postulación Docente</h1>
        <p>Complete los siguientes campos para su proceso de promoción o recategorización.</p>
      </div>

      <form @submit.prevent="enviarSolicitud">
        <fieldset class="form-section">
          <legend>1. Detalles del Trámite</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="tipoTramite">Tipo de Proceso</label>
              <select v-model="form.tipoTramite" id="tipoTramite" required>
                <option disabled value="">Seleccione un proceso...</option>
                <optgroup label="Ingreso a la Carrera Docente">
                    <option>Concurso de Méritos y Oposición</option>
                </optgroup>
                <optgroup label="Promoción y Escalafón">
                    <option>Ascenso de Categoría</option>
                    <option>Recategorización por Méritos</option>
                </optgroup>
                <optgroup label="Desarrollo Académico">
                    <option>Solicitud de Año Sabático</option>
                    <option>Licencia para Estudios de Posgrado</option>
                </optgroup>
                <optgroup label="Vinculaciones No Titulares">
                    <option>Aplicación para Docente Ocasional</option>
                </optgroup>
              </select>
              <p v-if="errors.tipoTramite" class="error-text">{{ errors.tipoTramite }}</p>
            </div>
            <div class="form-group">
              <label for="fechaNombramiento">Fecha de Último Nombramiento</label>
              <input v-model="form.fechaNombramiento" :max="maxDate" id="fechaNombramiento" type="date" required/>
              <p v-if="errors.fechaNombramiento" class="error-text">{{ errors.fechaNombramiento }}</p>
            </div>
          </div>
        </fieldset>

        <fieldset class="form-section">
            <legend>2. Méritos Académicos</legend>
            <div class="form-group">
              <label for="tesisDirigidas">Número de Tesis de Grado Dirigidas</label>
              <input v-model="form.tesisDirigidas" id="tesisDirigidas" min="0" max="100" type="number" placeholder="Ej: 5" required/>
              <p v-if="errors.tesisDirigidas" class="error-text">{{ errors.tesisDirigidas }}</p>
            </div>
             <div class="form-group">
                <label for="otrosMeritos">Otros Méritos Relevantes (publicaciones, congresos, etc.)</label>
                <textarea v-model="form.otrosMeritos" id="otrosMeritos" rows="4" placeholder="Describa brevemente otros méritos..."></textarea>
            </div>
        </fieldset>

        <fieldset class="form-section">
          <legend>3. Documentación Requerida (Archivos en PDF)</legend>
          <div class="file-upload-grid">
            <div class="form-group">
              <label for="cv">Hoja de Vida (CV) Actualizada</label>
              <label class="file-input-wrapper">
                <span>{{ fileNames.cv || 'Seleccionar PDF' }}</span>
                <input id="cv" @change="handleFileUpload($event, 'cv')" type="file" accept=".pdf" required/>
              </label>
              <p v-if="errors.cv" class="error-text">{{ errors.cv }}</p>
            </div>
            <div class="form-group">
              <label for="titulo">Copia de Título Académico</label>
               <label class="file-input-wrapper">
                <span>{{ fileNames.titulo || 'Seleccionar PDF' }}</span>
                <input id="titulo" @change="handleFileUpload($event, 'titulo')" type="file" accept=".pdf" required/>
              </label>
              <p v-if="errors.titulo" class="error-text">{{ errors.titulo }}</p>
            </div>
            <div class="form-group">
              <label for="certificados">Certificados de Méritos</label>
              <label class="file-input-wrapper">
                <span>{{ fileNames.certificados || 'Seleccionar PDF' }}</span>
                <input id="certificados" @change="handleFileUpload($event, 'certificados')" type="file" accept=".pdf" required/>
              </label>
              <p v-if="errors.certificados" class="error-text">{{ errors.certificados }}</p>
            </div>
          </div>
        </fieldset>

        <div class="action-buttons">
            <button type="button" @click="$router.push('/panel')" class="button secondary">Cancelar</button>
            <button type="submit" :disabled="isSubmitting" class="button primary">
              {{ isSubmitting ? 'Enviando...' : 'Enviar Postulación' }}
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SolicitudView",
  data() {
    return {
      isSubmitting: false,
      form: {
        tipoTramite: "",
        fechaNombramiento: "",
        tesisDirigidas: null,
        otrosMeritos: "",
        documentos: {
            cv: null,
            titulo: null,
            certificados: null
        }
      },

      fileNames: {
          cv: '',
          titulo: '',
          certificados: ''
      },
      errors: {}
    };
  },
  computed: {
    maxDate() {
      return new Date().toISOString().split("T")[0];
    }
  },
  methods: {
    validate() {

      this.errors = {};
      if (!this.form.tipoTramite) this.errors.tipoTramite = 'Debe seleccionar un tipo de proceso.';
      if (!this.form.fechaNombramiento) this.errors.fechaNombramiento = 'Debe seleccionar una fecha.';
      if (this.form.fechaNombramiento > this.maxDate) this.errors.fechaNombramiento = 'La fecha no puede ser en el futuro.';
      if (this.form.tesisDirigidas === null || this.form.tesisDirigidas < 0) this.errors.tesisDirigidas = 'El número no puede ser negativo.';
      if (this.form.tesisDirigidas > 100) this.errors.tesisDirigidas = 'El número máximo de tesis es 100.';
      if (!this.form.documentos.cv) this.errors.cv = 'La Hoja de Vida es requerida.';
      if (!this.form.documentos.titulo) this.errors.titulo = 'El Título Académico es requerido.';
      if (!this.form.documentos.certificados) this.errors.certificados = 'Los Certificados son requeridos.';
      return Object.keys(this.errors).length === 0;
    },
    handleFileUpload(event, docType) {
      const file = event.target.files[0];
      if (!file) {
        this.form.documentos[docType] = null;
        this.fileNames[docType] = '';
        return;
      }
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
   
          this.form.documentos[docType] = e.target.result; 
          this.fileNames[docType] = file.name;
          if (this.errors[docType]) delete this.errors[docType];
        };
        reader.readAsDataURL(file);
      } else {
        this.form.documentos[docType] = null;
        this.fileNames[docType] = '';
        this.errors[docType] = 'Debe seleccionar un archivo en formato PDF.';
      }
    },
    enviarSolicitud() {
      if (!this.validate()) return;
      this.isSubmitting = true;


      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
      const nuevaSolicitud = {
        id: Date.now(),
        docente: usuarioActivo.nombre,
        docente_email: usuarioActivo.correo,
        estado: "Pendiente",
        fecha: new Date().toLocaleDateString(),
        detalles: {
       
            ...this.form, 
        }
      };

      const solicitudes = JSON.parse(localStorage.getItem("solicitudes_db")) || [];
      solicitudes.push(nuevaSolicitud);
      localStorage.setItem("solicitudes_db", JSON.stringify(solicitudes));
      
      alert('Postulación enviada con éxito.');
      this.$router.push("/panel");
      this.isSubmitting = false;
    },
  },
};
</script>

<style scoped>

.solicitud-container { display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background-color: #f4f6f9; font-family: 'Segoe UI', sans-serif; padding: 40px 20px; }
.solicitud-box { background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); width: 100%; max-width: 800px; }
.header-section { text-align: center; margin-bottom: 30px; user-select: none; }
.header-section img { max-width: 80px; margin-bottom: 15px; }
.header-section h1 { font-size: 24px; font-weight: 700; color: #2c3e50; }
.header-section p { color: #6c757d; font-size: 16px; }
.form-section { border: 1px solid #dee2e6; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
.form-section legend { padding: 0 10px; font-weight: 600; color: #34495e; font-size: 18px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { margin-bottom: 20px; text-align: left; }
.form-group label { display: block; margin-bottom: 8px; font-size: 14px; color: #34495e; font-weight: 600; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 15px; border: 1px solid #bdc3c7; border-radius: 8px; font-size: 16px; color: #2c3e50; box-sizing: border-box; }
.file-upload-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
.file-input-wrapper { position: relative; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; background-color: #f8f9fa; height: 100%; display: flex; align-items: center; justify-content: center; }
.file-input-wrapper span { color: #495057; font-weight: 500; }
.file-input-wrapper input[type="file"] { position: absolute; width: 100%; height: 100%; top: 0; left: 0; opacity: 0; cursor: pointer; }
.action-buttons { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
.button { padding: 12px 25px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
.button.primary { background-color: #27ae60; color: white; }
.button.secondary { background-color: #e9ecef; color: #495057; }
.error-text { color: #e74c3c; font-size: 12px; margin-top: 5px; }
</style>