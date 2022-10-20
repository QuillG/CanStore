
var products;
//fetch qui sert à charger tous les elements nom/image/prix/type en anglais dans la page.
fetch('produits.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      products = json;
      initialize();
    });
  } else {
    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
  }
});
//fonction qui sert a envoyer les valeur de mes id du html dans des variable si le fetch a bien chargé
function initialize() {
  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('#searchTerm');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');
  // valeur category injecté dans une variable (forcement all au chargement de la page car il est en selected)
  var lastCategory = category.value;
  var lastSearch = '';
  var categoryGroup;
  var finalGroup;
  // insertion du fichier json dans la variable 
  finalGroup = products;
  updateDisplay();
  // insertion de tableau dans les 2 variable pour la recherche
  categoryGroup = [];
  finalGroup = [];
 // au clic du bouton lance la fonction select category
  searchBtn.onclick = selectCategory;
// fonction qui sert a return les resultat en fonction de la category selectionnée
  function selectCategory(e) {
    e.preventDefault();
   // vide les tableau pour une nouvelle recherche
    categoryGroup = [];
    finalGroup = [];
    // teste les si les  ancienne et  nouvelle valeur category et searchterme sont egales et return le meme resultat dans ce cas 
    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      // autrement change la recherche par la nouvelle demandé
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      //si All est choisi tous les profuits sont affiché
      if (category.value === 'Liste complète') {
        categoryGroup = products;
        selectProducts();
      // autrement la valeur category est tester en minuscule car json en min sur les type est injecté dans categorygroup
      } else {
        var lowerCaseType = category.value.toLowerCase();
        for (var i = 0; i < products.length; i++) {
          if (products[i].type === lowerCaseType) {
            categoryGroup.push(products[i]);
          }
        }
        selectProducts();
      }
    }
  }
    //fonction qui teste si la bare de recherche est vide (transforme le resultat si vide en resultat category)
    // autrement teste les valeur 1 a 1 dans le json est les insert si il y a coresspondance
  function selectProducts() {
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      for (var i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }
      updateDisplay();
    }

  }
// fonction qui sert a suprimer les element affiché puis à afficher le finalgroup ou un message d'erreur
  function updateDisplay() {
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'Aucun résultat';
      main.appendChild(para);
    } else {
      for (var i = 0; i < finalGroup.length; i++) {
        showProduct(finalGroup[i]);
      }
    }
  }
// Fonction qui sert à créer des element sur la page et y inserer les elment JSON du groupe final
  function showProduct(product) {
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var aside = document.createElement('h2')
    var image = document.createElement('img');
    section.setAttribute('class', product.type);
    heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
    para.textContent = '€' + product.prix.toFixed(2);
    aside.txtContent = 'nutriscore' + product.nutriscore.replace(product.nutriscore.charAt(0), product.nutriscore.charAt(0).toUpperCase());
    image.src = "images/" + product.image;
    image.alt = product.nom;
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
    section.appendChild(aside);
    
    
    
    
    

  }
}
