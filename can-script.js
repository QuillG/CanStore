//premier affichage
addDonnee();

document.forms[0].categorie.addEventListener("change", function() {
  addDonnee();
});
document.forms[0].nutri.addEventListener("change", function() {
    addDonnee();
});
document.forms[0].searchTerm.addEventListener("change", function() {
      addDonnee();
});


// sur le click
document.getElementById('btn1').addEventListener(
  'click', function (event) {
    event.preventDefault();
    document.forms[0].reset()
    addDonnee();
  });



//recup données
function addDonnee() {
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        triage(json);
       //lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

document.getElementById('searchTerm').addEventListener("keyup", function(event){autocompleteMatch(event)});

function autocompleteMatch(event) {
  var input = event.target;//recuperation de l'element input
  var saisie = input.value;//recuperation de la saisie
  var min_characters = 1;// minimum de caractères de la saisie
  if (!isNaN(saisie) || saisie.length < min_characters ) { 
    return [];
  }
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        traiterReponse(json,saisie);
       //lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

function traiterReponse(data,saisie)
{
var listeValeurs = document.getElementById('listeValeurs');
listeValeurs.innerHTML = "";//mise à blanc des options
var reg = new RegExp(saisie, "i");//Ajout de la condition "i" sur le regexp 
let terms = data.filter(term => term.nom.match(reg));//recup des termes qui match avec la saisie
    for (i=0; i<terms.length; i++) {//création des options
      var option = document.createElement('option');
                  option.value = terms[i].nom;
                  listeValeurs.appendChild(option);
}
  }

//triage
function triage(products) {
  var valeur = { 0: "tous", 1: "legumes", 2: "soupe", 3: "viande" }
  var type = valeur[document.forms[0].categorie.value];
  var nutri = document.forms[0].nutri.value;
  var lowerCaseSearchTerm = document.querySelector('#searchTerm').value.trim().toLowerCase();

  var finalGroup = [];
  var i, j, tmp;
    for (i = products.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = products[i];
        products[i] = products[j];
        products[j] = tmp;
    }
  products.forEach(product => {
    if (product.type === type || type === 'tous') {//sur la categorie
      if (product.nutriscore === nutri || nutri === '0') {//sur le nutri
        if (product.nom.toLowerCase().indexOf(lowerCaseSearchTerm) !== -1 || lowerCaseSearchTerm === '') {//sur le searchterm
          finalGroup.push(product);
        }
      }
    }
});

  showProduct(finalGroup);
}


//Affichage
function showProduct(finalGroup) {

  var main = document.querySelector('main');
  //vidage
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  // affichage propduits
  if (finalGroup.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'Aucun résultats';
    main.appendChild(para);
  }
  else {
    finalGroup.forEach(product => {
      var section = document.createElement('div');
      section.setAttribute('class', product.type);
      section.classList.add("card");
      section.classList.add("d-grid");      
      section.classList.add("text-center");
      section.classList.add("border-warning")
      section.classList.add("mb-5")
      section.classList.add("pb-5")
      var gap = document.createElement('div');
      gap.setAttribute('class', product.type);
      gap.classList.add("col-1")
      gap.classList.add("row")
      var bouton = document.createElement('button');
      bouton.setAttribute('class', product.type);
      bouton.classList.add("btn")
      bouton.classList.add("btn-outline-dark")
      bouton.classList.add("btn-lg")
      bouton.classList.add("align-items-end")
      bouton.textContent = "Acheter"
      var heading = document.createElement('div');
      heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
      heading.className = 'card-title'; 
      var foot = document.createElement('div');
      foot.className = 'card-footer text-muted'; 
      var para = document.createElement('p');
      para.textContent = product.prix.toFixed(2) +"€";
      var nutri = document.createElement('span');
      nutri.textContent = "Nutriscore : " + product.nutriscore;
      var image = document.createElement('img');
      image.className = 'card-img-top'; 
      image.src = "images/" + product.image;
      image.alt = product.nom;
      
      section.appendChild(heading);
      section.appendChild(foot);
      foot.appendChild(para);
      foot.appendChild(nutri);
      section.appendChild(image);
      section.appendChild(bouton)  
      main.appendChild(section);
      main.appendChild(gap)
    });
  }
}

