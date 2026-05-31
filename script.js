let allData = {};
let typeWriterTimeout;

async function loadData() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/gh/Akzo777/Oraculo/dados.json');
    allData = await response.json();
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
    document.getElementById('quote-text').innerText = "O destino está em silêncio... (Erro de conexão)";
  }
}

// Controladores da Animação do Livro
window.openBook = function() {
  const book = document.getElementById('book');
  
  if (!book.classList.contains('open')) {
    book.classList.add('open');
    document.getElementById('prompt').classList.add('hidden');
    document.getElementById('close-book-btn').classList.add('visible');
    
    if (Object.keys(allData).length === 0) {
      loadData();
    }
  }
}

window.closeBook = function() {
  const book = document.getElementById('book');
  book.classList.remove('open');
  document.getElementById('prompt').classList.remove('hidden');
  document.getElementById('close-book-btn').classList.remove('visible');
  
  clearTimeout(typeWriterTimeout);
  document.getElementById('quote-text').innerText = "As páginas aguardam em silêncio... Clique no botão abaixo para revelar um encanto.";
  document.getElementById('quote-author').classList.remove('visible');
}

// Controlador do Sorteio
window.readSomething = async function(event) {
  event.stopPropagation(); 
  
  const btn = document.getElementById('btn-read');
  btn.disabled = true; 
  
  if (Object.keys(allData).length === 0) {
    await loadData();
  }
  
  const categories = Object.keys(allData);
  if (categories.length === 0) {
      btn.disabled = false;
      return;
  }

  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  const items = allData[randomCat];
  const item = items[Math.floor(Math.random() * items.length)];
  
  let mainText = "";
  let subText = "";

  if (typeof item === 'string') {
    mainText = item;
  } else {
    mainText = item.texto;
    
    let credits = [];
    if (item.autor) credits.push(item.autor);
    if (item.artista) credits.push(item.artista);
    if (item.personagem) credits.push(item.personagem);
    if (item.obra) credits.push(`(${item.obra})`);
    if (item.musica) credits.push(`(${item.musica})`);
    
    if (credits.length > 0) {
      subText = "— " + credits.join(" ");
    }
  }
  
  typeWriter(mainText, subText, btn);
}

// Efeito da Máquina de Escrever com Cursor
function typeWriter(text, subText, btn) {
  const display = document.getElementById('quote-text');
  const authorDisplay = document.getElementById('quote-author');
  
  clearTimeout(typeWriterTimeout);
  
  // Prepara a estrutura do HTML para suportar o cursor piscante
  display.innerHTML = '<span id="typing-content"></span><span class="typing-cursor"></span>';
  const contentSpan = document.getElementById('typing-content');
  const cursorSpan = document.querySelector('.typing-cursor');
  
  authorDisplay.innerHTML = subText;
  authorDisplay.classList.remove('visible'); 
  
  let i = 0;
  function addChar() {
    if (i < text.length) {
      if (text.charAt(i) === '\n') {
        contentSpan.innerHTML += '<br>';
      } else {
        contentSpan.innerHTML += text.charAt(i);
      }
      i++;
      typeWriterTimeout = setTimeout(addChar, 35);
    } else {
      if (subText) {
        authorDisplay.classList.add('visible');
      }
      btn.disabled = false; 
      // Esconde o cursor ao terminar
      if (cursorSpan) cursorSpan.style.display = 'none'; 
    }
  }
  addChar();
}