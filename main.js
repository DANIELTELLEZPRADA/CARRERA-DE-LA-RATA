// Estado del Jugador (Valores de 0 a 100)
let stats = {
    mind: 100,
    social: 100,
    bio: 100,
    psy: 100
};

let currentStep = 0;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const barMind = document.getElementById('bar-mind');
const barSocial = document.getElementById('bar-social');
const barBio = document.getElementById('bar-bio');
const barPsy = document.getElementById('bar-psy');

const phaseIndicator = document.getElementById('phase-indicator');
const scenarioTitle = document.getElementById('scenario-title');
const scenarioText = document.getElementById('scenario-text');
const choicesContainer = document.getElementById('choices-container');
const endTitle = document.getElementById('end-title');
const endMessage = document.getElementById('end-message');
const endIcon = document.getElementById('end-icon');

// Guion de Decisiones (Simulando la entrada rápida y el doloroso laberinto de salida)
const storyNodes = [
    {
        phase: "Fase 1: La Ilusión de Control",
        title: "Una fiesta de viernes por la noche",
        text: "Estás con un grupo social nuevo. Te ofrecen una sustancia para 'encajar' y pasarla bien sin complicaciones. Te dicen que todo el mundo lo hace y que no pasa nada.",
        choices: [
            {
                text: "Aceptar para no ser rechazado y probar 'por curiosidad'.",
                nextStep: 1,
                effect: { mind: -10, social: +10, bio: -5, psy: 0 }
            },
            {
                text: "Rechazar firmemente y alejarte de ese grupo.",
                nextStep: 2,
                effect: { mind: +5, social: -15, bio: 0, psy: -5 }
            }
        ]
    },
    {
        phase: "Fase 1: El Inicio del Círculo",
        title: "La primera vez se vuelve costumbre",
        text: "Te gustó la sensación de escape. Ahora tus amigos te invitan más seguido. Sientes que lo controlas perfectamente y que puedes dejarlo cuando quieras.",
        choices: [
            {
                text: "Seguir consumiendo cada fin de semana. Al fin y al cabo, rinde mejor tu dinero y te diviertes.",
                nextStep: 3,
                effect: { mind: -25, social: -10, bio: -20, psy: -10 }
            },
            {
                text: "Intentar parar por cuenta propia porque notas pequeños mareos y falta de concentración.",
                nextStep: 3,
                effect: { mind: -10, social: -5, bio: -10, psy: -25 } // El intento de parar genera bajón psicológico inicial
            }
        ]
    },
    {
        phase: "Fase 1: La Presión Social",
        title: "El aislamiento temporal",
        text: "Al rechazar la sustancia, el grupo te aparta. Te sientes solo y aburrido, cuestionando si debiste aceptar para encajar.",
        choices: [
            {
                text: "Buscar nuevos pasatiempos y amigos sanos (El camino difícil pero seguro).",
                nextStep: 4,
                effect: { mind: +10, social: +10, bio: +5, psy: +10 }
            },
            {
                text: "Volver a buscar al grupo inicial y aceptar para encajar de una vez por todas.",
                nextStep: 1,
                effect: { mind: -20, social: +5, bio: -15, psy: -15 }
            }
        ]
    },
    {
        phase: "Fase 2: Dentro del Círculo (La Realidad)",
        title: "La tolerancia y el vacío",
        text: "Ya no consumes por diversión, sino por necesidad fisiológica. Tu cuerpo pide más dosis para sentir lo mismo. Tus notas bajan y tus familiares empiezan a sospechar.",
        choices: [
            {
                text: "Intentar dejarlo de golpe ('En seco') sin ayuda profesional.",
                nextStep: 5,
                effect: { mind: -20, social: -10, bio: -30, psy: -40 } // Abstinencia brutal
            },
            {
                text: "Ocultarlo con mentiras y robar pequeños objetos para costear la siguiente dosis.",
                nextStep: 6,
                effect: { mind: -35, social: -30, bio: -20, psy: -30 }
            }
        ]
    },
    {
        phase: "Fase de Prevención Exitosa",
        title: "Una decisión consciente",
        text: "Mantuviste tus principios firmes. Construiste un entorno sano, aunque al principio fue solitario. Tu mente y tu cuerpo están intactos para cumplir tus metas.",
        isEnd: true,
        win: true,
        message: "¡Lo lograste! Elegiste proteger tu futuro. La presión social es pasajera, pero las consecuencias de las drogas son permanentes. Mantenerse firme requiere carácter."
    },
    {
        phase: "Fase 2: El Abismo de la Abstinencia",
        title: "El síndrome de abstinencia",
        text: "Decidiste dejarlo de golpe. El cuerpo te tiembla, tienes insomnio total, ataques de pánico y una depresión profunda. Sientes que la vida no tiene sentido sin la sustancia.",
        choices: [
            {
                text: "No soportar el dolor físico y mental y volver a consumir con urgencia.",
                nextStep: 6,
                effect: { mind: -30, social: -20, bio: -30, psy: -40 }
            },
            {
                text: "Confesarle todo a tu familia y buscar un centro de rehabilitación especializado.",
                nextStep: 7,
                effect: { mind: +10, social: +10, bio: -10, psy: -10 }
            }
        ]
    },
    {
        phase: "Fase 2: El Colapso Total",
        title: "El punto de no retorno",
        text: "Tu vida gira 100% en torno a la sustancia. Tu familia está destrozada, perdiste tu empleo o estudios, y tu salud biológica y psicológica están al borde del colapso.",
        isEnd: true,
        win: false,
        message: "El círculo se cerró por completo. Salir de este punto requiere años de terapia, dolor y cicatrices imborrables. La dinámica demuestra la cruda realidad: entrar toma segundos, pero salir es una batalla titánica donde muchos se quedan en el camino. ¡La mejor decisión siempre es nunca entrar!"
    },
    {
        phase: "Fase 2: La Larga Recuperación",
        title: "El camino de la rehabilitación",
        text: "Estás en un centro de apoyo. La rehabilitación es lenta, llena de recaídas emocionales, días de llanto y ansiedad constante. Aprendes que la adicción es una enfermedad crónica.",
        isEnd: true,
        win: true,
        message: "Sobreviviste al proceso, pero tus estadísticas vitales muestran cicatrices profundas. Has recuperado el control con un esfuerzo monumental, entendiendo que el verdadero poder radica en la prevención inicial."
    }
];

// Iniciar Juego
startBtn.addEventListener('click', () => {
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    resetStats();
    currentStep = 0;
    loadStep();
});

restartBtn.addEventListener('click', () => {
    endScreen.classList.remove('active');
    startScreen.classList.add('active');
});

function resetStats() {
    stats = { mind: 100, social: 100, bio: 100, psy: 100 };
    updateStatsUI();
}

function updateStatsUI() {
    updateBar(barMind, stats.mind);
    updateBar(barSocial, stats.social);
    updateBar(barBio, stats.bio);
    updateBar(barPsy, stats.psy);
}

function updateBar(barElement, value) {
    let val = Math.max(0, Math.min(100, value));
    barElement.style.width = val + '%';
    
    if (val > 60) {
        barElement.style.backgroundColor = 'var(--fill-high)';
    } else if (val > 30) {
        barElement.style.backgroundColor = 'var(--fill-med)';
    } else {
        barElement.style.backgroundColor = 'var(--fill-low)';
    }
}

function loadStep() {
    const node = storyNodes[currentStep];

    phaseIndicator.textContent = node.phase;
    scenarioTitle.textContent = node.title;
    scenarioText.textContent = node.text;

    choicesContainer.innerHTML = '';

    if (node.isEnd) {
        gameScreen.classList.remove('active');
        endScreen.classList.add('active');
        endTitle.textContent = node.win ? "¡Superaste la Prueba!" : "Colapso en el Círculo";
        endMessage.textContent = node.message;
        endIcon.textContent = node.win ? "🛡️" : "⚠️";
        return;
    }

    node.choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.classList.add('choice-btn');
        btn.textContent = choice.text;
        btn.addEventListener('click', () => {
            applyEffect(choice.effect);
            currentStep = choice.nextStep;
            
            // Revisar si alguna estadística llegó a 0 (Colapso por salud o mente)
            if (stats.mind <= 0 || stats.psy <= 0 || stats.bio <= 0) {
                currentStep = 6; // Ir directo al nodo de colapso total
            }
            
            loadStep();
        });
        choicesContainer.appendChild(btn);
    });
}

function applyEffect(effect) {
    stats.mind += effect.mind;
    stats.social += effect.social;
    stats.bio += effect.bio;
    stats.psy += effect.psy;
    updateStatsUI();
}
