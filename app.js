import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = window.firebaseDB;

document.addEventListener("DOMContentLoaded", async () => {
  const celulas = document.querySelectorAll(".celula");
  const mensagem = document.getElementById("mensagem");
  const botaoResetar = document.querySelector("button");

  await carregarEstadoSalvo();

  celulas.forEach((celula, index) => {
    celula.addEventListener("click", async () => {
      if (celula.innerHTML.trim() !== "") return;

      const escolha = prompt("Escolha: X (espadas) ou O (escudo)").toUpperCase();

      if (escolha === "X") {
        celula.innerHTML = `<img src="imagem/espada.png" alt="Espadas" class="icone">`;
        celula.setAttribute("data-jogador", "X");
      } else if (escolha === "O") {
        celula.innerHTML = `<img src="imagem/escudo.png" alt="Escudo" class="icone">`;
        celula.setAttribute("data-jogador", "O");
      } else {
        alert("Escolha inválida! Digite apenas X ou O.");
        return;
      }

      await salvarEstado(celulas);
      verificarVencedor(celulas, mensagem);
    });
  });

  botaoResetar.addEventListener("click", async () => {
    celulas.forEach(celula => {
      celula.innerHTML = "";
      celula.removeAttribute("data-jogador");
      celula.style.pointerEvents = "auto";
    });
    mensagem.textContent = "";
    await salvarEstado(celulas);
  });
});

async function salvarEstado(celulas) {
  const estado = {};
  celulas.forEach((celula, index) => {
    estado[index] = celula.getAttribute("data-jogador") || null;
  });

  await setDoc(doc(db, "jogo", "estadoAtual"), estado);
}

async function carregarEstadoSalvo() {
  const celulas = document.querySelectorAll(".celula");
  const docRef = doc(db, "jogo", "estadoAtual");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const estado = docSnap.data();
    celulas.forEach((celula, index) => {
      const valor = estado[index];
      if (valor === "X") {
        celula.innerHTML = `<img src="imagem/espada.png" alt="Espadas" class="icone">`;
        celula.setAttribute("data-jogador", "X");
      } else if (valor === "O") {
        celula.innerHTML = `<img src="imagem/escudo.png" alt="Escudo" class="icone">`;
        celula.setAttribute("data-jogador", "O");
      }
    });
  }
}

function verificarVencedor(celulas, mensagem) {
  const combinacoes = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const [a, b, c] of combinacoes) {
    const jogadorA = celulas[a].getAttribute("data-jogador");
    const jogadorB = celulas[b].getAttribute("data-jogador");
    const jogadorC = celulas[c].getAttribute("data-jogador");

    if (jogadorA && jogadorA === jogadorB && jogadorA === jogadorC) {
      mensagem.textContent = `Vitória do jogador ${jogadorA === "X" ? "⚔️" : "🛡️"}!`;

      celulas.forEach(celula => (celula.style.pointerEvents = "none"));
      break;
    }
  }
}

    }
  }
}
