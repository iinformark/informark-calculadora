const TAXAS = {
      1: 3.15,
      2: 5.45,
      3: 6.24,
      4: 7.06,
      5: 7.87,
      6: 8.70,
      7: 10.19,
      8: 11.03,
      9: 11.88,
      10: 12.71,
      11: 13.56,
      12: 14.44,
      13: 15.29,
      14: 16.15,
      15: 17.03,
      16: 17.91,
      17: 18.79,
      18: 19.65
    };

    const form = document.getElementById("calcForm");
    const btnLimpar = document.getElementById("btnLimpar");
    const btnCopiar = document.getElementById("btnCopiar");

    const produtoInput = document.getElementById("produto");
    const valorInput = document.getElementById("valor");
    const entradaInput = document.getElementById("entrada");
    const qtdSimulacoesSelect = document.getElementById("qtdSimulacoes");

    const parcela1Select = document.getElementById("parcela1");
    const parcela2Select = document.getElementById("parcela2");
    const parcela3Select = document.getElementById("parcela3");

    const bloco1 = document.getElementById("bloco1");
    const bloco2 = document.getElementById("bloco2");
    const bloco3 = document.getElementById("bloco3");

    const mensagemPronta = document.getElementById("mensagemPronta");

    function formatBRL(valor) {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
    }

    function preencherParcelas() {
      const selects = [parcela1Select, parcela2Select, parcela3Select];

      for (const select of selects) {
        select.innerHTML = "";

        for (let parcela = 1; parcela <= 18; parcela++) {
          const option = document.createElement("option");
          option.value = String(parcela);
          option.textContent = parcela + "x";
          select.appendChild(option);
        }
      }

      parcela1Select.value = "12";
      parcela2Select.value = "18";
      parcela3Select.value = "10";
    }

    function atualizarBlocosSimulacao() {
      const qtd = Number(qtdSimulacoesSelect.value);

      bloco1.classList.remove("oculto");

      if (qtd >= 2) {
        bloco2.classList.remove("oculto");
      } else {
        bloco2.classList.add("oculto");
      }

      if (qtd >= 3) {
        bloco3.classList.remove("oculto");
      } else {
        bloco3.classList.add("oculto");
      }
    }

    function calcularParcela(valorBase, parcelas) {
      const taxa = TAXAS[parcelas];
      const total = valorBase * (1 + taxa / 100);
      return total / parcelas;
    }

    function gerarLinhaMensagem(parcelas, valorParcela) {
      return "• " + parcelas + "x de " + formatBRL(valorParcela);
    }

    function gerarMensagem(produto, valorVista, entrada, saldo, simulacoes) {
      const titulo = produto ? "📲 " + produto : "📲 Produto";

      const linhas = [
        titulo,
        "",
        "💰 À vista: " + formatBRL(valorVista)
      ];

      if (entrada > 0) {
        linhas.push("💵 Entrada: " + formatBRL(entrada));
        linhas.push("📌 Saldo no restante: " + formatBRL(saldo));
      }

      linhas.push("");
      linhas.push("💳 Cartão:");

      simulacoes.forEach(function (item) {
        linhas.push(gerarLinhaMensagem(item.parcelas, item.valorParcela));
      });

      return linhas.join("\n");
    }

    function atualizarResultado() {
      const produto = produtoInput.value.trim();
      const valor = Number(valorInput.value || 0);
      const entrada = Number(entradaInput.value || 0);
      const qtd = Number(qtdSimulacoesSelect.value);

      if (!valor || valor <= 0) {
        mensagemPronta.value = "";
        return;
      }

      const entradaValida = Math.max(0, Math.min(entrada, valor));
      const saldo = Math.max(valor - entradaValida, 0);

      const simulacoes = [];

      const p1 = Number(parcela1Select.value);
      const v1 = calcularParcela(saldo, p1);
      simulacoes.push({ parcelas: p1, valorParcela: v1 });

      if (qtd >= 2) {
        const p2 = Number(parcela2Select.value);
        const v2 = calcularParcela(saldo, p2);
        simulacoes.push({ parcelas: p2, valorParcela: v2 });
      }

      if (qtd >= 3) {
        const p3 = Number(parcela3Select.value);
        const v3 = calcularParcela(saldo, p3);
        simulacoes.push({ parcelas: p3, valorParcela: v3 });
      }

      mensagemPronta.value = gerarMensagem(
        produto,
        valor,
        entradaValida,
        saldo,
        simulacoes
      );
    }

    function limparTudo() {
      form.reset();
      qtdSimulacoesSelect.value = "2";
      preencherParcelas();
      atualizarBlocosSimulacao();
      mensagemPronta.value = "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      atualizarResultado();
    });

    btnLimpar.addEventListener("click", function () {
      limparTudo();
    });

    btnCopiar.addEventListener("click", async function () {
      if (!mensagemPronta.value.trim()) {
        alert("Nada para copiar ainda.");
        return;
      }

      try {
        await navigator.clipboard.writeText(mensagemPronta.value);
        btnCopiar.textContent = "Copiado!";
        setTimeout(function () {
          btnCopiar.textContent = "Copiar mensagem";
        }, 1500);
      } catch (error) {
        alert("Não foi possível copiar a mensagem.");
      }
    });

    const camposAuto = [
      produtoInput,
      valorInput,
      entradaInput,
      qtdSimulacoesSelect,
      parcela1Select,
      parcela2Select,
      parcela3Select
    ];

    camposAuto.forEach(function (campo) {
      campo.addEventListener("input", function () {
        atualizarBlocosSimulacao();
        atualizarResultado();
      });

      campo.addEventListener("change", function () {
        atualizarBlocosSimulacao();
        atualizarResultado();
      });
    });

    preencherParcelas();
    qtdSimulacoesSelect.value = "2";
    atualizarBlocosSimulacao();
    atualizarResultado();
