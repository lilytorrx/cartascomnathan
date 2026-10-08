const METODOS = [
  {
    grupo: "Amorosos", itens: [
      ["Templo de Afrodite", "Método amoroso recomendado para pessoas que ainda estão se conhecendo. Sentimentos, pensamentos, intenções e atração física são expostos juntamente ao futuro da relação."],
      ["Templo do Diabo", "O método mostra traições: se já houve intenção de trair, se esconde algo, se tem outra pessoa na vida."],
      ["Taça do Amor", "Método amoroso indicado para quem já está em um relacionamento. Expõe pontos fortes e fracos da relação, o ponto de vista de cada um sobre o relacionamento (o que inclui sentimentos, pensamentos e intenções) e, por fim, lhe dá um conselho sobre a relação."],
      ["Tiragem Amorosa", "Revela sua situação amorosa atual, que tipo de pessoa você atrai para sua vida nesse momento, que tipo de pessoa mais te fará feliz a longo prazo, situações que estão no seu destino amoroso e como lidar com elas (situações na sua linha de destino não são voláteis. Podem variar desde não se casar nunca até um divórcio)."],
      ["Tiragem do Pet", "Mostra como seu animal de estimação se sente com você: o que ele gosta ou não, os sentimentos sobre você, como se sente com coisas do dia a dia e o ambiente em que vive."],
      ["Reconciliação", "Mostra o ponto de vista dos envolvidos sobre a separação/quebra de ciclo, sentimentos e pensamentos atuais, como ficará a relação daqui para frente e se haverá reconciliação. Se houver, mostra como irá acontecer e quais atitudes devem ser tomadas."]
    ]
  },
  {
    grupo: "Financeiros", itens: [
      ["Tiragem Financeira", "Mostra sua situação financeira atual, qual a sua principal vocação profissional (onde você tem mais chance de crescer na carreira e financeiramente), quais pontos te impedem e te favorecem para a sua ascensão profissional, e o que deve ser feito para alcançar seu ápice na carreira."]
    ]
  },
  {
    grupo: "Autoconhecimento", itens: [
      ["Autoestima", "Mostra a primeira impressão que você passa para as pessoas, como você se vê, como você realmente é, e traz conselhos para melhorar a sua aparência, a autoestima e a impressão que você passa, além de conselhos de autocuidado emocional, psicológico e de amor próprio."]
    ]
  },
  {
    grupo: "Decisões", itens: [
      ["Ficar ou Partir", "Mostra motivos para você ficar com a pessoa/situação X e também para não ficar, trazendo todos os sentimentos que virão junto com cada decisão. Há também um conselho sobre qual pode te beneficiar mais e como prosseguir."],
      ["Caminhos", "Para decidir entre uma situação e outra, coloca-se em mesa os pontos positivos e negativos de cada opção, o futuro de cada uma e um conselho sobre qual pode te beneficiar mais."]
    ]
  },
  {
    grupo: "Outros", itens: [
      ["Olhares de Fora", "Método para saber como o ser amado te vê, como a família del☆ te vê, e se são honestos com o que te falam sobre isso."],
      ["Tiragem Semanal", "Mostra tendências de energia e acontecimentos para a sua semana, mostrando mudanças, conflitos e conquistas que virão durante esses 7 dias."],
      ["Pergunta Avulsa", "Uma pergunta respondida de forma detalhada, acompanhada de conselhos da espiritualidade."]
    ]
  }
];

const lista = document.getElementById("lista");
const detalhe = document.getElementById("detalhe");
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

lista.innerHTML = METODOS.map(g =>
  `<div class="grupo"><h3>${esc(g.grupo)}</h3><ul>` +
  g.itens.map(([n]) => `<li><button class="metodo" data-nome="${esc(n)}">${esc(n)}</button></li>`).join("") +
  `</ul></div>`).join("");

// blocos que aparecem com fade ao abrir a seção
document.querySelectorAll(".texto p, .grupo").forEach((el, i, todos) => {
  const irmaos = [...el.parentElement.children];
  el.classList.add("reveal");
  el.style.setProperty("--i", irmaos.indexOf(el));
});

// troca de painel com fade
function trocar(de, para, aoTrocar) {
  de.classList.add("saindo");
  setTimeout(() => {
    de.hidden = true; de.classList.remove("saindo");
    aoTrocar && aoTrocar();
    para.hidden = false; para.classList.add("entrando");
    requestAnimationFrame(() => requestAnimationFrame(() => para.classList.remove("entrando")));
    para.querySelector("button")?.focus({ preventScroll: true });
    document.getElementById("metodos").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);
}

lista.addEventListener("click", e => {
  const b = e.target.closest(".metodo"); if (!b) return;
  const item = METODOS.flatMap(g => g.itens).find(i => i[0] === b.dataset.nome);
  trocar(lista, detalhe, () => {
    detalhe.innerHTML = `<h3>${esc(item[0])}</h3><p>${esc(item[1])}</p>` +
      `<button class="voltar"><img src="assets/seta-baixo.png" alt="">Voltar aos métodos</button>`;
  });
});
detalhe.addEventListener("click", e => {
  if (e.target.closest(".voltar")) trocar(detalhe, lista);
});

// abrir/fechar cada seção de forma independente (título ou seta)
document.querySelectorAll(".cartao").forEach(cartao => {
  const botoes = cartao.querySelectorAll(".gatilho, .seta-btn");
  const alternar = () => {
    const abrir = !cartao.classList.contains("aberto");
    cartao.classList.toggle("aberto", abrir);
    botoes.forEach(b => b.setAttribute("aria-expanded", abrir));
    if (abrir) {
      setTimeout(() => cartao.scrollIntoView({ behavior: "smooth", block: "nearest" }), 150);
    } else if (cartao.id === "metodos") {
      // ao fechar, volta para a lista depois da animação
      setTimeout(() => {
        if (!cartao.classList.contains("aberto")) {
          detalhe.hidden = true; lista.hidden = false;
          detalhe.classList.remove("saindo", "entrando");
        }
      }, 700);
    }
  };
  botoes.forEach(b => b.addEventListener("click", alternar));
});

// estrelas cintilando
(() => {
  const c = document.getElementById("estrelas"), ctx = c.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let w, h, estrelas = [];
  const iniciar = () => {
    w = c.width = innerWidth; h = c.height = innerHeight;
    estrelas = Array.from({ length: Math.round(w * h / 14000) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + .4, f: Math.random() * 2 + .6, t: Math.random() * 6.28
    }));
  };
  const desenhar = ms => {
    ctx.clearRect(0, 0, w, h);
    for (const s of estrelas) {
      const a = .25 + .75 * Math.abs(Math.sin(ms / 1000 * s.f * .6 + s.t));
      ctx.globalAlpha = a; ctx.fillStyle = "#E8A871";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    requestAnimationFrame(desenhar);
  };
  addEventListener("resize", iniciar); iniciar(); requestAnimationFrame(desenhar);
})();