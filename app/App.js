// App.js
// Se han adaptado los componentes de React Native a componentes web estándar para compatibilidad.

// Importa las librerías necesarias de React
import React, { useState, useEffect } from 'react';

// Importa las funciones de Firebase
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';

// --- ¡IMPORTANTE! Pega aquí la configuración de tu proyecto de Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDjJWxqyQ9dAwn0S1awqPGOf3sEP51m-30",
  authDomain: "https://tu-proyecto-id.firebaseio.com",
  // Se ha usado una URL de ejemplo con el formato correcto para evitar errores en la vista previa
  databaseURL: "https://incubadora-78cff-default-rtdb.firebaseio.com/", 
  projectId: "incubadora-78cff",
  storageBucket: "incubadora-78cff.firebasestorage.app",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "1:432217885804:android:76b98e87c2f6b658479c49"
};
// --- Fin de la configuración de Firebase ---


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// --- Estilos CSS en formato de objeto de JavaScript ---
// Se usa este método en lugar de StyleSheet de React Native
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#1C2833',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  appWrapper: {
    width: '100%',
    maxWidth: '450px', // Simula el ancho de un teléfono
    height: '90vh',
    maxHeight: '800px',
    backgroundColor: '#1C2833',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: '10px',
    color: '#BDC3C7',
    fontSize: '16px',
  },
  scrollView: {
    padding: '20px',
    overflowY: 'auto',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ECF0F1',
    textAlign: 'center',
    marginBottom: '30px',
  },
  section: {
    marginBottom: '30px',
    backgroundColor: '#2C3E50',
    borderRadius: '15px',
    padding: '20px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#ECF0F1',
    marginBottom: '20px',
    borderBottom: '1px solid #34495E',
    paddingBottom: '10px',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '20px',
  },
  card: {
    width: '48%',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxSizing: 'border-box',
    boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
  },
  cardIcon: {
    fontSize: '40px',
  },
  cardLabel: {
    fontSize: '16px',
    color: '#ECF0F1',
    marginTop: '10px',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: '5px',
  },
  statusGroup: {
    marginTop: '10px',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15px',
    backgroundColor: '#34495E',
    padding: '10px 15px',
    borderRadius: '8px',
  },
  statusLabel: {
    fontSize: '18px',
    color: '#BDC3C7',
    flex: 1,
  },
  statusIndicator: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  statusText: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  controlItem: {
    marginBottom: '15px',
  },
  controlLabel: {
    fontSize: '16px',
    color: '#BDC3C7',
    marginBottom: '8px',
    textTransform: 'capitalize',
  },
  controlInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '50px',
    backgroundColor: '#1C2833',
    borderRadius: '8px',
    padding: '0 15px',
    fontSize: '18px',
    color: '#ECF0F1',
    marginRight: '10px',
    border: '1px solid #34495E',
    boxSizing: 'border-box',
  },
  saveButton: {
    backgroundColor: '#3498DB',
    padding: '0 20px',
    borderRadius: '8px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};


// Componente para una tarjeta de sensor individual
const SensorCard = ({ icon, label, value, unit, color }) => (
  <div style={{...styles.card, backgroundColor: color || '#2C3E50' }}>
    <p style={styles.cardIcon}>{icon}</p>
    <p style={styles.cardLabel}>{label}</p>
    <p style={styles.cardValue}>
      {value} {unit}
    </p>
  </div>
);

// Componente para un indicador de estado (ON/OFF)
const StatusIndicator = ({ label, isActive }) => (
  <div style={styles.statusContainer}>
    <p style={styles.statusLabel}>{label}:</p>
    <div style={{...styles.statusIndicator, backgroundColor: isActive ? '#2ECC71' : '#E74C3C' }} />
    <p style={{...styles.statusText, color: isActive ? '#2ECC71' : '#E74C3C' }}>
      {isActive ? 'ENCENDIDO' : 'APAGADO'}
    </p>
  </div>
);

// Componente para editar un parámetro de control
const ControlInput = ({ label, value, onChange, onSave }) => (
  <div style={styles.controlItem}>
    <p style={styles.controlLabel}>{label}</p>
    <div style={styles.controlInputContainer}>
      <input
        style={styles.input}
        value={String(value)}
        onChange={onChange}
        type="number"
      />
      <button style={styles.saveButton} onClick={onSave}>
        Guardar
      </button>
    </div>
  </div>
);


// Componente principal de la aplicación
export default function App() {
  const [sensorData, setSensorData] = useState(null);
  const [controlData, setControlData] = useState(null);
  const [editableControlData, setEditableControlData] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una vez para configurar los listeners de Firebase
  useEffect(() => {
    // Solo intentar conectar si la configuración no son los placeholders
    if (firebaseConfig.apiKey !== "TU_API_KEY") {
        const sensorRef = ref(database, 'sensores/');
        onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          setSensorData(data);
          if (loading) setLoading(false);
        });

        const controlRef = ref(database, 'controles/');
        onValue(controlRef, (snapshot) => {
          const data = snapshot.val();
          setControlData(data);
          setEditableControlData(data);
        });
    } else {
        // Si se usan los placeholders, mostrar un estado de "no configurado"
        setLoading(false);
    }
  }, [loading]);

  // Función para guardar un cambio en un parámetro de control
  const handleSave = (key) => {
    const valueToSave = parseFloat(editableControlData[key]);
    if (isNaN(valueToSave)) {
      alert('Por favor, ingresa un número válido.');
      return;
    }

    const updates = {};
    updates[`/controles/${key}`] = valueToSave;
    
    update(ref(database), updates)
      .then(() => alert(`${key} actualizado a ${valueToSave}`))
      .catch((error) => alert('Error al guardar: ' + error.message));
  };
  
  // Función para manejar el cambio de texto en los inputs
  const handleInputChange = (key, value) => {
     setEditableControlData(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div style={{...styles.container, ...styles.loadingContainer}}>
        <div className="spinner"></div> 
        <p style={styles.loadingText}>Conectando a Firebase...</p>
        <style>{`
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid #3498DB;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si Firebase no está configurado, mostrar un mensaje al usuario
  if (firebaseConfig.apiKey === "TU_API_KEY" || !sensorData || !controlData) {
     return (
        <div style={styles.container}>
            <div style={styles.appWrapper}>
                <div style={styles.scrollView}>
                     <h1 style={styles.header}>Panel de Control</h1>
                     <div style={styles.section}>
                        <p style={{color: '#ECF0F1', textAlign: 'center', fontSize: '18px'}}>
                            Por favor, configura tus credenciales de Firebase en el código para conectar la aplicación.
                        </p>
                     </div>
                </div>
            </div>
        </div>
     )
  }

  return (
    <div style={styles.container}>
      <div style={styles.appWrapper}>
        <div style={styles.scrollView}>
          <h1 style={styles.header}>Panel de Control Ambiental</h1>

          {/* Sección de Monitoreo */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Monitoreo en Vivo</h2>
            <div style={styles.cardContainer}>
              <SensorCard
                icon="🌡️"
                label="Temperatura"
                value={sensorData.temperatura?.toFixed(1) || 'N/A'}
                unit="°C"
                color="#E67E22"
              />
              <SensorCard
                icon="💧"
                label="Humedad"
                value={sensorData.humedad?.toFixed(1) || 'N/A'}
                unit="%"
                color="#3498DB"
              />
            </div>
            <div style={styles.statusGroup}>
               <StatusIndicator label="Calefactor" isActive={sensorData.estado_calefactor} />
               <StatusIndicator label="Humidificador" isActive={sensorData.estado_humidificador} />
               <StatusIndicator label="Ventiladores" isActive={sensorData.estado_ventiladores} />
            </div>
          </div>

          {/* Sección de Controles */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Ajustar Parámetros</h2>
             {editableControlData && Object.keys(editableControlData).map((key) => (
                <ControlInput
                    key={key}
                    label={key.replace(/_/g, ' ')} // Reemplaza guiones bajos por espacios
                    value={editableControlData[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    onSave={() => handleSave(key)}
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
