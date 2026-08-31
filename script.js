/* =====================================================
           RESPOSTAS CORRETAS
        ===================================================== */

        const respostas = {

            1: ["enoque"],

            2: ["adao"],

            3: ["daniel"],

            4: ["sara"],

            5: ["moises"],

            6: ["sodoma"],

            7: ["maria"],

            8: ["joao"],

            9: ["arao"],

            10: ["jose"],

            11: ["golias"],

            12: ["saul"],

            13: ["salomao"],

            14: ["elias"],

            15: [
                "elias",
                "jeremias",
                "daniel"
            ],

            16: [
                "jonata",
                "boaz",
                "rute",
                "neemias",
                "mordecai",
                "apolo",
                "ester",
                "marta",
                "nicodemos",
                "sara",
                "josearimateia",
                "lazaro"
            ],

            17: ["12", "doze"],

            18: ["levi"],

            19: ["pedro"],

            20: ["lucas"],

            21: ["verdadeiro"],

            22: ["verdadeiro"],

            23: ["joao"],

            24: ["lazaro"],

            25: [
                "davi",
                "salomao"
            ],

            26: ["sarai"],

            27: ["agua"],

            28: ["40", "quarenta"],

            29: ["paulo"],

            30: ["apocalipse"]

        };

        /* =====================================================
   DICAS / FEEDBACKS PERSONALIZADOS
===================================================== */

const explicacoes = {
    8: {
        pedro: "Pedro foi um dos 12 apóstolos, mas ele não batizou Jesus.",
        tiago: "Tiago era um dos apóstolos de Jesus, não quem o batizou.",
        paulo: "Paulo só se converteu anos após a ressurreição de Jesus!"
    },
    12: {
        davi: "Davi foi o segundo rei de Israel, ungido após Saul.",
        salomao: "Salomão foi o terceiro rei de Israel, filho de Davi.",
        jeroboao: "Primeiro rei do reino das dez tribos de Israel"
    }
};


        /* =====================================================
           QUESTÕES QUE SÃO DE TEXTO
        ===================================================== */

        const perguntasTexto = [
            1, 2, 3, 4, 6, 7, 9,
            11, 13, 14, 17, 19,
            23, 24, 26, 28, 29, 30
        ];


        /* =====================================================
           CONTROLE DA PONTUAÇÃO
        ===================================================== */

        const acertadas = new Set();


        /* =====================================================
           NORMALIZAR TEXTO

           Faz com que:

           José
           jose
           JOSÉ

           sejam tratados como a mesma resposta.
        ===================================================== */

        function normalizar(texto) {

            return texto
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

        }


        /* =====================================================
           VERIFICAR RESPOSTA
        ===================================================== */
function verificarQuestao(numero) {

    if (acertadas.has(numero)) {
        return;
    }

    let correto = false;
    let selecionada = null;


    /* =================================================
       1. PERGUNTAS DE TEXTO
    ================================================= */
    if (perguntasTexto.includes(numero)) {

        const campo = document.getElementById("p" + numero);
        const resposta = normalizar(campo.value);

        if (resposta === "") {
            mostrarMensagem(
                numero,
                "Digite uma resposta antes de confirmar.",
                false
            );
            campo.focus();
            return;
        }

        correto = respostas[numero].includes(resposta);

    }

    /* =================================================
       2. PERGUNTA 10 — SELECT / DROPDOWN
    ================================================= */
    else if (numero === 10) {

        const select = document.getElementById("p10");
        const resposta = normalizar(select.value);

        if (resposta === "") {
            mostrarMensagem(
                numero,
                "Selecione uma resposta antes de confirmar.",
                false
            );
            return;
        }

        correto = respostas[numero].includes(resposta);

    }

    /* =================================================
       3. PERGUNTAS 15, 16 e 25 — CHECKBOX
    ================================================= */
    else if (numero === 15 || numero === 16 || numero === 25) {

        correto = verificarCheckbox(
            numero,
            respostas[numero]
        );

    }

    /* =================================================
       4. DEMAIS PERGUNTAS — RADIO BUTTONS
    ================================================= */
    else {

        selecionada = document.querySelector(
            `input[name="p${numero}"]:checked`
        );

        if (!selecionada) {
            mostrarMensagem(
                numero,
                "Selecione uma resposta antes de confirmar.",
                false
            );
            return;
        }

        correto = respostas[numero].includes(
            normalizar(selecionada.value)
        );

    }

    /* =================================================
       MOSTRAR RESULTADO E ATUALIZAR
    ================================================= */
    if (correto) {

        acertadas.add(numero);

        mostrarMensagem(
            numero,
            "✓ Acertou, parabéns!",
            true
        );

        bloquearQuestao(numero);

        atualizarProgresso();

        if (acertadas.size === 30) {
            mostrarResultado();
        }

    } else {

        let mensagemErro = 
            "✗ Errou, tente novamente."
        if (
            selecionada &&
            explicacoes[numero] &&
            explicacoes[numero][normalizar(selecionada.value)]
        ) {
            mensagemErro = "✗ " + explicacoes[numero][normalizar(selecionada.value)];
        }

        mostrarMensagem(
            numero,
            mensagemErro,
            false    
        );

    }

}

        /* =====================================================
           CHECKBOX

           Verifica se a pessoa marcou exatamente
           todas as respostas corretas.
        ===================================================== */

        function verificarCheckbox(numero, corretas) {

            const selecionadas =
                Array.from(
                    document.querySelectorAll(
                        `input[name="p${numero}"]:checked`
                    )
                ).map(function (item) {

                    return item.value;

                });


            if (
                selecionadas.length !==
                corretas.length
            ) {

                return false;

            }


            const normalizadas =
                selecionadas.map(normalizar);


            return corretas.every(function (resposta) {

                return normalizadas.includes(
                    normalizar(resposta)
                );

            });

        }


        /* =====================================================
           MOSTRAR MENSAGEM
        ===================================================== */

        function mostrarMensagem(
            numero,
            texto,
            acertou
        ) {

            const mensagem =
                document.getElementById(
                    "msg" + numero
                );


            mensagem.textContent = texto;


            mensagem.className =
                "mensagem " +
                (acertou ? "acertou" : "errou");

        }


        /* =====================================================
           BLOQUEAR QUESTÃO DEPOIS DO ACERTO
        ===================================================== */

        function bloquearQuestao(numero) {

            const mensagem =
                document.getElementById(
                    "msg" + numero
                );


            const pergunta =
                mensagem.closest(".pergunta");


            pergunta
                .querySelectorAll(
                    "input, select"
                )
                .forEach(function (campo) {

                    campo.disabled = true;

                });


            const botao =
                pergunta.querySelector(
                    ".botao-confirmar"
                );


            botao.disabled = true;

            botao.textContent =
                "✓ Resposta correta";

        }


        /* =====================================================
           ATUALIZAR PONTUAÇÃO E BARRA
        ===================================================== */

        function atualizarProgresso() {

            const quantidade =
                acertadas.size;


            document.getElementById(
                "pontuacao"
            ).textContent = quantidade;


            document.getElementById(
                "concluidas"
            ).textContent = quantidade;


            const porcentagem =
                (quantidade / 30) * 100;


            document.getElementById(
                "barraProgresso"
            ).style.width =
                porcentagem + "%";

        }


        /* =====================================================
           RESULTADO FINAL
        ===================================================== */

        function mostrarResultado() {

            const resultado =
                document.getElementById(
                    "resultado"
                );


            resultado.style.display =
                "block";


            document.getElementById(
                "resultadoPontuacao"
            ).textContent =
                acertadas.size;


            document.getElementById(
                "mensagemFinal"
            ).textContent =
                "🎉 Parabéns! Você concluiu a fase 1, Preparado para a Fase 2?";

                const botaoNivel2 = document.getElementById("btnNivel2");
            if (botaoNivel2) {
        botaoNivel2.onclick = function() {
            window.location.href = "../quiz-nivel-2/index.html"; // Redireciona para o próximo arquivo
        };
            }


            resultado.scrollIntoView({
                behavior: "smooth"
            });

        }


        /* =====================================================
           MOSTRAR GABARITO
        ===================================================== */

        function mostrarGabarito() {

            const gabarito =
                document.getElementById(
                    "gabarito"
                );


            if (
                gabarito.style.display ===
                "block"
            ) {

                gabarito.style.display =
                    "none";

                return;

            }


            gabarito.style.display =
                "block";


            gabarito.scrollIntoView({
                behavior: "smooth"
            });

        }


        /* =====================================================
           ENTER NAS PERGUNTAS DE TEXTO
        ===================================================== */

        perguntasTexto.forEach(
            function(numero) {

                const campo =
                    document.getElementById(
                        "p" + numero
                    );


                campo.addEventListener(
                    "keydown",
                    function(event) {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            event.preventDefault();

                            verificarQuestao(
                                numero
                            );

                        }

                    }
                );

            }
        );


        /* =====================================================
           REINICIAR QUIZ
        ===================================================== */

        function reiniciarQuiz() {

            document
                .getElementById("quiz")
                .reset();


            acertadas.clear();


            document.getElementById(
                "pontuacao"
            ).textContent = "0";


            document.getElementById(
                "concluidas"
            ).textContent = "0";


            document.getElementById(
                "barraProgresso"
            ).style.width = "0%";


            document
                .querySelectorAll(".mensagem")
                .forEach(
                    function(mensagem) {

                        mensagem.textContent =
                            "";

                        mensagem.className =
                            "mensagem";

                    }
                );


            document
                .querySelectorAll(
                    "#quiz input, #quiz select"
                )
                .forEach(
                    function(campo) {

                        campo.disabled =
                            false;

                    }
                );


            document
                .querySelectorAll(
                    ".botao-confirmar"
                )
                .forEach(
                    function(botao) {

                        botao.disabled =
                            false;

                        botao.textContent =
                            "Confirmar resposta";

                    }
                );


            document.getElementById(
                "resultado"
            ).style.display =
                "none";


            document.getElementById(
                "gabarito"
            ).style.display =
                "none";


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }