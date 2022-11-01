//premier affichage
addDonnee();

//Fonction onchange pour le select categorie
document.forms[0].categorie.addEventListener("change", function() {
  addDonnee();
});
//Fonction onchange pour le select nutri
document.forms[0].nutri.addEventListener("change", function() {
    addDonnee();
});
//Fonction qui change le contenu afficher apres avoir appuyer sur entrer 
document.forms[0].searchTerm.addEventListener("keypress", function(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    addDonnee();
  }     
});


// sur le click
document.getElementById('btn1').addEventListener(
  'click', function (event) {
    event.preventDefault();
    document.forms.recherche.reset()
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

//Autocomplession de l'input searchTerm
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

//triage + ajout d'un randomizer avant le push dans finalgroup
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
  DynamicAutoC(finalGroup);  
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
      var cadre = document.createElement('div');//creation d'une div qui englobe la carde (sert au espacement)
      cadre.setAttribute('class', "cadre");
      var section = document.createElement('div');
      section.setAttribute('class', "card");
      section.classList.add("card","text-center","border-warning","text-warning","bg-dark","h6","mb-4"); //ajout de style bootstrap dans les cards en avec les d'elements dans class    
      var bouton = document.createElement('button');//ajout d'un bouton acheter sur chaque card + onclick pour un compteur sur le panier
      bouton.setAttribute('class', 'button');
      bouton.setAttribute("onclick", "ajouterPanier()");
      bouton.classList.add("btn","btn-dark","btn-outline-warning","btn-lg")
      bouton.textContent = "Acheter"
      var heading = document.createElement('div');
      heading.setAttribute('class', product.type);
      heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
      heading.className = 'card-title'; 
      var foot = document.createElement('div');
      foot.className = 'card-footer text-muted'; 
      var para = document.createElement('p');
      para.setAttribute('class', 'para')
      para.classList.add("text-danger")//ajout du prix en rouge
      para.textContent = "Prix : " + product.prix.toFixed(2) +"€";
      var nutri = document.createElement('span');
      nutri.setAttribute('class', 'nutri')
      nutri.classList.add("text-white","h6")//ajout du nutri en blanc
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
      main.appendChild(cadre);
      cadre.appendChild(section)
     });
  }
}
//Fonction simple qui ajoute 1 elements au panier à chaque clic
var nbProduits = 0
function ajouterPanier(){
  var nombre = document.getElementById('count')
  nbProduits +=1
  nombre.textContent = (nbProduits);
}

// en dessous se trouve mon debut d'autocompletion dynamique qui fonctionne en petite partie mais qui a deux probleme important :/
// function DynamicAutoC(finalGroup) {

//   var selectType = document.getElementById('categorie');
//   while (selectType.options.length > 1) {
//     selectType.remove(1);
//   }
//     finalGroup.forEach(product => {
//       var valeur = { 1: "legumes", 2: "soupe", 3: "viande" }
//       var type = valeur[product.type];
//       var opt = document.createElement('option')
//       var opttxt = document.createTextNode(product.type);
//       opt.appendChild(opttxt)
//       opt.setAttribute('value', type);
//       opt.value = valeur;
//       selectType.add(opt, null);
//       })
      
  
// }








