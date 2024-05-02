document.getElementById('configForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    const numPreguntas = parseInt(document.getElementById('numPreguntas').value);

    if (isNaN(numPreguntas) || numPreguntas < 1) {
        alert('Por favor, ingrese un número válido de preguntas.');
        return;
    }
    configurarPreguntas(numPreguntas);
});

function configurarPreguntas(numPreguntas) {
    const preguntasConfiguradas = [];
    const container = document.getElementById('preguntasContainer');
    container.innerHTML = ''; // Limpiamos el contenedor por si hay contenido anterior

    for (let i = 1; i <= numPreguntas; i++) {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('pregunta', 'componente-dinamico');

        const preguntaLabel = document.createElement('label');
        preguntaLabel.textContent = `Pregunta ${i}: `;
        preguntaDiv.appendChild(preguntaLabel);

        const preguntaInput = document.createElement('input');
        preguntaInput.type = 'text';
        preguntaInput.required = true; // Agrega el atributo required
        preguntaDiv.appendChild(preguntaInput);

        const tipoLabel = document.createElement('label');
        tipoLabel.textContent = `Tipo de pregunta: `;
        preguntaDiv.appendChild(tipoLabel);

        const tipoSelect = document.createElement('select');
        tipoSelect.innerHTML = `
            <option value="0">Seleccione un tipo</option>
            <option value="1">Pregunta de texto</option>
            <option value="2">Pregunta de Verdadero/Falso</option>
            <option value="3">Opción Múltiple</option>
        `;
        preguntaDiv.appendChild(tipoSelect);

        const opcionesContainer = document.createElement('div');
        opcionesContainer.classList.add('opciones-container');
        preguntaDiv.appendChild(opcionesContainer);

        tipoSelect.addEventListener('change', function() {
            const tipo = parseInt(tipoSelect.value);
            opcionesContainer.innerHTML = ''; // Limpiamos el contenedor de opciones

            if (tipo === 1) {
                const preguntaInputTexto = document.createElement('input');
                preguntaInputTexto.type = 'text';
                preguntaInputTexto.placeholder = 'Ingrese la respuesta aquí';
                preguntaDiv.appendChild(preguntaInputTexto);
            } else if (tipo === 2) {
                const verdaderoLabel = document.createElement('label');
                verdaderoLabel.textContent = 'Verdadero';
                const verdaderoInput = document.createElement('input');
                verdaderoInput.type = 'radio';
                verdaderoInput.name = `pregunta${i}`;
                verdaderoInput.value = 'verdadero';

                const falsoLabel = document.createElement('label');
                falsoLabel.textContent = 'Falso';
                const falsoInput = document.createElement('input');
                falsoInput.type = 'radio';
                falsoInput.name = `pregunta${i}`;
                falsoInput.value = 'falso';

                opcionesContainer.appendChild(verdaderoLabel);
                opcionesContainer.appendChild(verdaderoInput);
                opcionesContainer.appendChild(falsoLabel);
                opcionesContainer.appendChild(falsoInput);
            } else if (tipo === 3) {
                const numOpcionesInput = document.createElement('input');
                numOpcionesInput.type = 'number';
                numOpcionesInput.required = true;
                numOpcionesInput.min = 1;
                numOpcionesInput.placeholder = 'Número de opciones';
                opcionesContainer.appendChild(numOpcionesInput);

                numOpcionesInput.addEventListener('change', function() {
                    const numOpciones = parseInt(numOpcionesInput.value);
                    opcionesContainer.innerHTML = '';
                
                    const opcionesList = document.createElement('ul');
                    opcionesContainer.appendChild(opcionesList);
                
                    for (let j = 1; j <= numOpciones; j++) {
                        const opcionItem = document.createElement('li');
                        const opcionInput = document.createElement('input');
                        opcionInput.type = 'text';
                        opcionInput.required = true;
                        opcionInput.placeholder = `Opción ${j}`; // Texto de marcador de posición para la opción
                        const esCorrectaInput = document.createElement('input');
                        esCorrectaInput.type = 'checkbox';
                        esCorrectaInput.id = `opcion${i}-${j}`;
                
                        opcionItem.appendChild(opcionInput);
                        opcionItem.appendChild(esCorrectaInput);
                
                        // Agregar la opción a la lista
                        opcionesList.appendChild(opcionItem);
                    }
                });         
            }
        });
        container.appendChild(preguntaDiv);
        preguntasConfiguradas.push({
            pregunta: preguntaInput,
            tipo: tipoSelect,
            opcionesContainer: opcionesContainer // Asegúrate de tener referencias a los controles necesarios
        });
    }
    const continuaButton = document.createElement('button');
    continuaButton.textContent = 'Aceptar';
    continuaButton.addEventListener('click', function() {
        const todasCompletas = preguntasConfiguradas.every(config => {
            if (config.tipo.value === "3") {
                const items = config.opcionesContainer.querySelectorAll('li input[type="text"]')
                let texCompleto = true;
                items.forEach(item => {
                    if (item.value.trim() === '') {
                        texCompleto = false;
                    }
                });
                const numOpcionesInputs = config.opcionesContainer.querySelectorAll('input[type="number"]');
                let numOpcionesCompleto = true;
                numOpcionesInputs.forEach(numOpcionesInput => {
                    if (numOpcionesInput.value.trim() === '') {
                        numOpcionesCompleto = false;
                    }
                });
            
                const opcionesLists = config.opcionesContainer.querySelectorAll('ul');
                let opcionesCompleto = true;
                opcionesLists.forEach(opcionesList => {
                    if (opcionesList.children.length === 0) {
                        opcionesCompleto = false;
                    }
                });
            
                return config.pregunta.value.trim() !== '' && numOpcionesCompleto && opcionesCompleto && texCompleto;
            } else {
                return config.pregunta.value.trim() !== '' && config.tipo.value !== "0";
            }
        });

        if (!todasCompletas) {
            alert('Por favor, complete todas las preguntas antes de continuar.');
            return;
        }
        document.getElementById('configForm').style.display = 'none'; // Ocultamos el formulario de configuración
        const inputsOpciones = document.querySelectorAll('.opciones-container input[type="text"]');
        inputsOpciones.forEach(input => {
            const label = document.createElement('label');
            label.textContent = input.value;
            input.replaceWith(label);
        });
        // Agregar campo de texto para la pregunta de texto después de hacer clic en Aceptar
        preguntasConfiguradas.forEach(config => {
            if (config.tipo.value === "1") {
                const preguntaInputTexto = document.createElement('input');
                preguntaInputTexto.type = 'text';
                preguntaInputTexto.placeholder = 'Ingrese la respuesta aquí';
                config.opcionesContainer.appendChild(preguntaInputTexto);
            }
        });
        mostrarCuestionario(preguntasConfiguradas);
    });
    container.appendChild(continuaButton);
}

function mostrarCuestionario(preguntasConfiguradas) {
    const container = document.getElementById('preguntasContainer');
    container.innerHTML = '<h2>Responda a las siguientes preguntas</h2>'; // Limpia el contenedor y establece el título del cuestionario

    preguntasConfiguradas.forEach((config, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('pregunta');

        const preguntaLabel = document.createElement('label');
        preguntaLabel.textContent = `Pregunta ${index + 1}: ${config.pregunta.value}`;
        preguntaDiv.appendChild(preguntaLabel);

        const saltoLinea = document.createElement('br');
        preguntaDiv.appendChild(saltoLinea);

        config.opcionesContainer.childNodes.forEach(child => {
            preguntaDiv.appendChild(child.cloneNode(true));
        });
        container.appendChild(preguntaDiv);
    });

    const enviarButton = document.createElement('button');
    enviarButton.textContent = 'Enviar Respuestas';
    container.appendChild(enviarButton);

    enviarButton.addEventListener('click', function() {
        document.getElementById('configForm').style.display = 'none'; // Oculta el formulario
        container.innerHTML = '<h2>Gracias por responder a las preguntas</h2>';
    
        // Muestra el mensaje de éxito
        const mensajeExito = document.createElement('p');
        mensajeExito.textContent = '¡El formulario ha sido enviado correctamente!';
        container.appendChild(mensajeExito);
    });
    
}