function minifyLua(text) {
    // Remover comentários de bloco
    text = text.replace(/--\[\[.*?\]\]/gs, '');
    // Remover comentários de linha
    text = text.replace(/--.*?\n/g, '');
    // Remover espaços em branco extras e quebras de linha
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\s*([{}();,=+\-/*<>])\s*/g, '$1');
    return text.trim();
}

function minifyPython(text) {
    // Remover comentários de bloco ("""...""" ou '''...''')
    text = text.replace(/""".*?"""/gs, '');
    text = text.replace(/'''.*?'''/gs, '');
    
    // Remover comentários de linha
    text = text.replace(/#.*?\n/g, '');
    
    // Remover espaços em branco extras e quebras de linha
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\s*([{}();,=+\-/*<>])\s*/g, '$1');
    
    return text.trim();
}

function minifyJs(text) {
    // Remover comentários de bloco (/* ... */)
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remover comentários de linha (// ...)
    text = text.replace(/\/\/.*?(\r?\n|$)/g, '');
    
    // Remover espaços em branco extras e quebras de linha
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\s*([{}();,=+\-/*<>])\s*/g, '$1');
    
    return text.trim();
}

function minifyHTML(text) {
    // Remover comentários de HTML
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    
    // Remover espaços em branco extras entre tags
    text = text.replace(/\s*(<[^>]+>)\s*/g, '$1');
    
    // Remover espaços em branco extras dentro de tags (atributos)
    text = text.replace(/\s{2,}/g, ' ');
    
    // Remover quebras de linha e espaços em branco no início e no final
    text = text.replace(/\n+/g, '');
    text = text.replace(/^\s+|\s+$/g, '');

    return text.trim();
}

function minifyCSS(text) {
    // Remover comentários de bloco (/* ... */)
    text = text.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remover espaços em branco extras e quebras de linha
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\s*([{}:;,+>])\s*/g, '$1');
    text = text.replace(/;\s*}/g, '}');  // Remover o ponto e vírgula antes das chaves de fechamento
    
    return text.trim();
}

function minTXT(text) {
    // Remover espaços extras no início e no final do texto
    text = text.trim();

    // Remover múltiplos espaços e substituir por um único espaço
    text = text.replace(/\s+/g, '');

    return text;
}

function addtoreplacelist() {
    var replacein = document.getElementById('replacein').value
    var replaceout = document.getElementById('replaceout').value

    replacements[replacein] = replaceout;

    console.log('Replacements:', replacements);

    updatelist()

    document.getElementById('replacein').value = '';
    document.getElementById('replaceout').value = '';
}

function updatelist() {
    const listaEl = document.getElementById('replacementlistEl')
    listaEl.innerHTML = ''

    for (const [key, value] of Object.entries(replacements)) {
        const li = document.createElement('li');
        li.textContent = ` "${key}" to "${value}"`;
        listaEl.appendChild(li);
    }

}


function removeLast() {
    const keys = Object.keys(replacements)
    if (keys.length > 0) {
        const lastKey = keys[keys.length - 1]
        delete replacements[lastKey]
        console.log('Replacements:', replacements)
        updatelist()
    } else {
        console.log('no items in list')
    }
}

var replacein = document.getElementById('replacein')
var replaceout = document.getElementById('replaceout')

var replacements = {}

function replacew(textr) {

    for (var word in replacements) {
        var replacement = replacements[word]
        var regex = new RegExp("\\b" + word + "\\b", "gi")
        textr = textr.replace(regex,replacement)
    }

    return textr

}

var html = document.documentElement
var select1 = document.getElementById('select1')

var btncopyout = document.getElementById('btncopyout')

function theme(value) {
    html.classList.remove('text', 'js', 'python', 'html', 'lua', 'css');
    if(value){
        html.classList.add(value)
    }
}

var textinput = document.getElementById('textinput')
var textoutput = document.getElementById('textoutput')

document.addEventListener('DOMContentLoaded', () =>{
    textinput.value = ''
    textoutput.value = ''
    var savedvalue = localStorage.getItem('select1value')
    if (savedvalue) {
        select1.value = savedvalue
        theme(savedvalue)
    }
})

select1.addEventListener('change', () => {
    var select1value = select1.value
    theme(select1value)
    localStorage.setItem('select1value', select1value)
})

var replacechk = false
var checkbox = document.getElementById('checkreplace')
checkbox.addEventListener('change', (e) => {
    replacechk = e.target.checked

    var replacehide = document.querySelectorAll('.replacehide')
    if (replacechk) {
        
        replacehide.forEach(a => {
            a.style.display = 'block'
        })
    }else{
        replacehide.forEach(a => {
            a.style.display = 'none'
        })
    }
})


var btnconvert = document.getElementById('btnconvert')
btnconvert.addEventListener('click', ()=> {
    var textinput = document.getElementById('textinput').value
    var textoutput = document.getElementById('textoutput')

    var outputxt = textinput

    if (replacechk) {
        outputxt = replacew(outputxt)
    }

    if (document.getElementById('select1').value == 'lua') {
        outputxt = minifyLua(outputxt);
    }else if (document.getElementById('select1').value == 'python') {
        outputxt = minifyPython(outputxt);
    }else if (document.getElementById('select1').value == 'js') {
        outputxt = minifyJs(outputxt);
    }else if (document.getElementById('select1').value == 'html') {
        outputxt = minifyHTML(outputxt);
    }else if (document.getElementById('select1').value == 'css') {
        outputxt = minifyCSS(outputxt);
    }else if (document.getElementById('select1').value == 'text') {
        outputxt = minTXT(outputxt);
    }

    textoutput.value = outputxt
    btncopyout.style.display = 'block'
})

function copyoutout() {
    var textoutput = document.getElementById('textoutput')
    textoutput.select()

    document.execCommand('copy')
}