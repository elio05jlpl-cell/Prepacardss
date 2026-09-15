// Le mot qui s'ecrit lettre par lettre dans le titre.
//
// Chaque lettre est un <span> a part : c'est ce qui permet de la faire
// apparaitre individuellement. Le degrade, lui, est pose sur le conteneur
// et decoupe sur le texte, de sorte qu'il traverse le mot ENTIER et non
// chaque lettre - sans quoi chacune aurait le degrade complet et l'effet
// se perdrait.
//
// Le titre etant le premier element de la page, l'animation demarre tout
// de suite : un observateur n'aurait rien a observer.
(function () {
  var bloc = document.querySelector('.mot-anime');
  if (!bloc) return;

  var cible = bloc.querySelector('.mot-lettres');
  var mots = (bloc.getAttribute('data-mots') || '').split('|')
               .map(function (m) { return m.trim(); })
               .filter(Boolean);
  if (!cible || !mots.length) return;

  // Le premier mot est ecrit tout de suite, sans animation : c'est celui
  // que voit un visiteur dont le script echoue, et celui que lit un moteur
  // d'indexation. L'attribut aria-label porte la meme valeur.
  function poser(mot) {
    cible.textContent = mot;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    poser(mots[0]);
    return;
  }

  var index = 0;
  var minuteurs = [];

  function plus_tard(delai, action) {
    minuteurs.push(window.setTimeout(action, delai));
  }

  // Les arrets du degrade, du bleu de la marque au rose. La couleur de
  // chaque lettre est interpolee entre eux selon sa position dans le mot.
  var ARRETS = [[37, 99, 235], [99, 102, 241], [168, 85, 247], [236, 72, 153]];

  function couleur(part) {
    var echelle = part * (ARRETS.length - 1);
    var bas = Math.min(Math.floor(echelle), ARRETS.length - 2);
    var reste = echelle - bas;
    var a = ARRETS[bas], b = ARRETS[bas + 1];
    var c = [0, 1, 2].map(function (i) {
      return Math.round(a[i] + (b[i] - a[i]) * reste);
    });
    return 'rgb(' + c.join(',') + ')';
  }

  function ecrire(mot, apres) {
    cible.textContent = '';
    for (var i = 0; i < mot.length; i++) {
      var lettre = document.createElement('span');
      lettre.textContent = mot[i];
      lettre.style.animationDelay = (i * 55) + 'ms';
      // Un mot d'une seule lettre n'a pas de progression : on le place au
      // depart du degrade plutot que de diviser par zero.
      lettre.style.color = couleur(mot.length > 1 ? i / (mot.length - 1) : 0);
      cible.appendChild(lettre);
    }
    plus_tard(mot.length * 55 + 320, apres);
  }

  function effacer(apres) {
    var lettres = cible.children;
    var total = lettres.length;
    if (!total) { apres(); return; }
    for (var i = total - 1; i >= 0; i--) {
      (function (element, rang) {
        plus_tard((total - 1 - rang) * 28, function () {
          if (element.parentNode) element.parentNode.removeChild(element);
        });
      })(lettres[i], i);
    }
    plus_tard(total * 28 + 120, apres);
  }

  function tour() {
    var mot = mots[index];
    bloc.setAttribute('aria-label', mot);
    ecrire(mot, function () {
      // Une pause sur le mot complet : sans elle, l'oeil n'a pas le temps
      // de le lire et l'effet devient un scintillement.
      plus_tard(1900, function () {
        effacer(function () {
          index = (index + 1) % mots.length;
          tour();
        });
      });
    });
  }

  tour();
})();
