const d = (s) => new Date(s);

const mascotas = [
  {
    nombre: 'Max',
    especie: 'perro',
    raza: 'Labrador Retriever',
    sexo: 'macho',
    fechaNacimiento: d('2018-03-12'),
    pesoKg: 34.2,
    propietario: { nombre: 'Laura Gómez', telefono: '+57 300 123 4567', email: 'laura.gomez@correo.com', direccion: 'Cra 10 # 20-30, Bogotá' },
    etiquetas: ['alérgico', 'crónico'],
    metadatosVariables: {
      microchip: '985112003456789',
      alergias: ['penicilina', 'pollo'],
      dieta: { tipo: 'hipoalergénica', marca: 'VetCare', porcionesDia: 2 },
      vacunas: [
        { nombre: 'rabia', fecha: '2025-02-10', proxima: '2026-02-10' },
        { nombre: 'parvovirus', fecha: '2025-02-10' }
      ]
    },
    historialClinico: [
      {
        fecha: d('2025-06-14'),
        motivo: 'Picazón intensa y lesiones en piel',
        veterinario: 'Dra. Camila Torres',
        diagnosticos: ['dermatitis alérgica', 'otitis externa'],
        tratamiento: 'Oclacitinib 16 mg c/12h por 14 días; limpieza ótica semanal',
        metadatos: { temperatura: 38.9, pruebaAlergia: { positivo: ['pollo', 'ácaros'] }, zonasAfectadas: ['abdomen', 'orejas'] }
      },
      {
        fecha: d('2026-01-20'),
        motivo: 'Control de displasia de cadera',
        veterinario: 'Dr. Andrés Ruiz',
        diagnosticos: ['displasia de cadera', 'osteoartritis'],
        tratamiento: 'Meloxicam 0.1 mg/kg c/24h; condroprotector; fisioterapia',
        metadatos: { radiografia: { proyeccion: 'ventrodorsal', gradoDisplasia: 'moderado' }, dolor: 6, cojera: true }
      }
    ]
  },
  {
    nombre: 'Luna',
    especie: 'gato',
    raza: 'Siamés',
    sexo: 'hembra',
    fechaNacimiento: d('2020-08-01'),
    pesoKg: 4.1,
    propietario: { nombre: 'Carlos Mejía', telefono: '+57 311 222 3344', email: 'cmejia@correo.com' },
    etiquetas: ['esterilizada', 'renal'],
    metadatosVariables: {
      microchip: '985112009998877',
      esterilizada: true,
      alimentacion: 'renal seca',
      comportamiento: { agresividad: 'baja', estres: 'alto en consulta' }
    },
    historialClinico: [
      {
        fecha: d('2025-11-03'),
        motivo: 'Polidipsia, poliuria y pérdida de peso',
        veterinario: 'Dra. Camila Torres',
        diagnosticos: ['enfermedad renal crónica', 'hipertensión'],
        tratamiento: 'Dieta renal, benazepril 0.5 mg/kg, fluidoterapia subcutánea',
        metadatos: {
          laboratorio: { creatinina: 2.8, urea: 78, fosforo: 6.1, densidadUrinaria: 1.014 },
          estadioIRIS: 2,
          presionSistolica: 175
        }
      }
    ]
  },
  {
    nombre: 'Rocky',
    especie: 'perro',
    raza: 'Bulldog Francés',
    sexo: 'macho',
    fechaNacimiento: d('2022-05-20'),
    pesoKg: 12.8,
    propietario: { nombre: 'Marta Ríos', telefono: '+57 320 555 8899', email: 'marta.rios@correo.com' },
    etiquetas: ['braquicéfalo', 'cirugía'],
    metadatosVariables: { microchip: '985112001112223', alergias: [], seguro: { aseguradora: 'PetSegura', poliza: 'PS-44521' } },
    historialClinico: [
      {
        fecha: d('2026-03-08'),
        motivo: 'Ronquidos y dificultad respiratoria con el ejercicio',
        veterinario: 'Dr. Andrés Ruiz',
        diagnosticos: ['síndrome braquicefálico', 'estenosis de narinas'],
        tratamiento: 'Rinoplastia y resección de paladar blando',
        metadatos: { anestesia: { protocolo: 'propofol/isoflurano', duracionMin: 55 }, complicaciones: null, recuperacionDias: 7 }
      },
      {
        fecha: d('2026-03-22'),
        motivo: 'Control posoperatorio',
        veterinario: 'Dr. Andrés Ruiz',
        diagnosticos: ['recuperación posquirúrgica satisfactoria'],
        tratamiento: 'Retiro de puntos',
        metadatos: { temperatura: 38.5, herida: 'cicatrización completa' }
      }
    ]
  },
  {
    nombre: 'Kiwi',
    especie: 'ave',
    raza: 'Cacatúa ninfa',
    sexo: 'macho',
    pesoKg: 0.09,
    propietario: { nombre: 'Sofía Pardo', telefono: '+57 301 777 1010' },
    etiquetas: ['exótico', 'plumas'],
    metadatosVariables: { anillo: 'CO-2021-0456', jaula: { tamanoCm: [80, 50, 60], perchas: 4 }, dieta: ['semillas', 'frutas', 'pellets'] },
    historialClinico: [
      {
        fecha: d('2026-02-11'),
        motivo: 'Se arranca las plumas del pecho',
        veterinario: 'Dra. Valentina Cruz',
        diagnosticos: ['picaje de plumas', 'deficiencia nutricional'],
        tratamiento: 'Cambio de dieta, enriquecimiento ambiental, suplemento vitamínico',
        metadatos: { cultivoFecal: 'negativo', horasLuzDia: 8, comportamiento: 'estrés por aislamiento' }
      }
    ]
  },
  {
    nombre: 'Thumper',
    especie: 'conejo',
    raza: 'Cabeza de león',
    sexo: 'macho',
    fechaNacimiento: d('2023-01-15'),
    pesoKg: 1.6,
    propietario: { nombre: 'Daniel Ortiz', telefono: '+57 315 000 2211', email: 'dortiz@correo.com' },
    etiquetas: ['exótico', 'dental'],
    metadatosVariables: { dieta: { heno: 'timothy', verdurasDia: ['cilantro', 'zanahoria'] }, convivencia: 'solo', habitat: 'interior' },
    historialClinico: [
      {
        fecha: d('2026-04-02'),
        motivo: 'Deja de comer y babea',
        veterinario: 'Dra. Valentina Cruz',
        diagnosticos: ['maloclusión dental', 'estasis gastrointestinal'],
        tratamiento: 'Limado dental bajo sedación, procinéticos, alimentación asistida',
        metadatos: { dientesAfectados: ['incisivos', 'premolares'], sedacion: { farmaco: 'midazolam', dosisMgKg: 0.5 }, pesoAlIngreso: 1.45 }
      }
    ]
  },
  {
    nombre: 'Bella',
    especie: 'perro',
    raza: 'Golden Retriever',
    sexo: 'hembra',
    fechaNacimiento: d('2015-09-09'),
    pesoKg: 29.0,
    propietario: { nombre: 'Laura Gómez', telefono: '+57 300 123 4567', email: 'laura.gomez@correo.com' },
    etiquetas: ['geriátrico', 'oncología', 'crónico'],
    metadatosVariables: { microchip: '985112005554443', esterilizada: true, cuidadosPaliativos: true },
    historialClinico: [
      {
        fecha: d('2026-05-17'),
        motivo: 'Masa palpable en glándula mamaria',
        veterinario: 'Dr. Andrés Ruiz',
        diagnosticos: ['carcinoma mamario', 'sospecha de metástasis pulmonar'],
        tratamiento: 'Mastectomía regional; quimioterapia metronómica (ciclofosfamida)',
        metadatos: {
          histopatologia: { tipo: 'carcinoma tubulopapilar', grado: 2, margenes: 'limpios' },
          radiografiaTorax: 'nódulos sospechosos',
          dolor: 4
        }
      }
    ]
  },
  {
    nombre: 'Nube',
    especie: 'gato',
    raza: 'Mestizo',
    sexo: 'hembra',
    fechaNacimiento: d('2025-04-10'),
    pesoKg: 3.2,
    propietario: { nombre: 'Julián Vargas', telefono: '+57 304 888 4455', email: 'jvargas@correo.com' },
    etiquetas: ['cachorro', 'rescatado'],
    metadatosVariables: { origen: 'rescate callejero', desparasitaciones: 2, testsRapidos: { felv: 'negativo', fiv: 'negativo' } },
    historialClinico: [
      {
        fecha: d('2026-06-01'),
        motivo: 'Primera consulta, estornudos y secreción ocular',
        veterinario: 'Dra. Camila Torres',
        diagnosticos: ['complejo respiratorio felino', 'conjuntivitis'],
        tratamiento: 'Doxiciclina 10 mg/kg c/24h por 14 días, lágrimas artificiales',
        metadatos: { temperatura: 39.1, pcrHerpesvirus: 'positivo', esquemaVacunal: 'iniciado' }
      }
    ]
  },
  {
    nombre: 'Spike',
    especie: 'reptil',
    raza: 'Dragón barbudo',
    sexo: 'macho',
    pesoKg: 0.45,
    propietario: { nombre: 'Andrea Salazar', telefono: '+57 318 456 7890' },
    etiquetas: ['exótico', 'metabólico'],
    metadatosVariables: { terrario: { temperaturaZonaCalida: 38, uvb: true, sustrato: 'baldosa' }, alimentacion: ['grillos', 'verduras de hoja'] },
    historialClinico: [
      {
        fecha: d('2026-07-19'),
        motivo: 'Temblores y extremidades débiles',
        veterinario: 'Dra. Valentina Cruz',
        diagnosticos: ['enfermedad metabólica ósea', 'hipocalcemia'],
        tratamiento: 'Calcio oral con D3, corrección de iluminación UVB',
        metadatos: { calcioSerico: 6.2, radiografia: 'osteopenia generalizada', lamparaUVBAnios: 2 }
      }
    ]
  }
];

module.exports = { mascotas };
