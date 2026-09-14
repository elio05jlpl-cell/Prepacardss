// Animations de la section « Comment ca marche ».
//
// Trois boucles, chacune pilotee par une suite d'etapes datees. Le CSS
// fait ce qu'il sait faire seul - ondes du micro, rayon du scan - et le
// JavaScript ne s'occupe que de ce qu'il ne sait pas faire : ecrire lettre
// par lettre, et enchainer les phases.
//
// Une boucle ne tourne que pendant que son bloc est visible. Trois
// animations qui tournent en permanence sur une page d'accueil font
// chauffer un portable pour rien, et ce n'est pas un detail sur une
// machine d'etudiant.
(function () {
  var blocs = document.querySelectorAll('.etape[data-anim]');
  if (!blocs.length) return;

  var doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Un minuteur par bloc, pour pouvoir tout annuler d'un coup a la sortie
  // du champ de vision : sans cela, les minuteurs en attente reprendraient
  // la main au milieu d'une phase et l'animation redemarrerait de travers.
  function Sequenceur(element, phases) {
    this.element = element;
    this.phases = phases;
    this.minuteurs = [];
    this.actif = false;
  }

  Sequenceur.prototype.plus_tard = function (delai, action) {
    this.minuteurs.push(window.setTimeout(action, delai));
  };

  Sequenceur.prototype.arreter = function () {
    this.actif = false;
    this.minuteurs.forEach(window.clearTimeout);
    this.minuteurs = [];
  };

  Sequenceur.prototype.demarrer = function () {
    if (this.actif) return;
    this.actif = true;
    this.tour();
  };

  Sequenceur.prototype.tour = function () {
    if (!this.actif) return;
    var moi = this;
    var duree = this.phases(this);
    this.plus_tard(duree, function () { moi.tour(); });
  };

  // Ecrit un texte lettre par lettre. Renvoie la duree totale, pour que la
  // phase suivante sache quand commencer.
  function frapper(sequenceur, cible, texte, pas, apres) {
    cible.textContent = '';
    cible.classList.remove('fini');
    for (var i = 1; i <= texte.length; i++) {
      (function (n) {
        sequenceur.plus_tard(n * pas, function () {
          cible.textContent = texte.slice(0, n);
        });
      })(i);
    }
    sequenceur.plus_tard(texte.length * pas, function () {
      cible.classList.add('fini');
      if (apres) apres();
    });
    return texte.length * pas;
  }

  function construire(bloc) {
    var genre = bloc.getAttribute('data-anim');

    if (genre === 'voix') {
      var ligne = bloc.querySelector('.transcription');
      var coche = bloc.querySelector('.coche');
      var phrase = ligne.getAttribute('data-texte') || '';
      return new Sequenceur(bloc, function (s) {
        coche.classList.remove('vue');
        var frappe = frapper(s, ligne, phrase, 85);
        s.plus_tard(frappe + 250, function () { coche.classList.add('vue'); });
        s.plus_tard(frappe + 1500, function () {
          coche.classList.remove('vue');
          ligne.textContent = '';
          ligne.classList.remove('fini');
        });
        // Le cycle complet dure autant que le rayon du scan voisin : les
        // trois blocs restent ainsi a peu pres en phase.
        return frappe + 2100;
      });
    }

    if (genre === 'scan') {
      var carte = bloc.querySelector('.carte-issue');
      var champs = bloc.querySelectorAll('.carte-issue .champ');
      // Cale sur les 4 s de l'animation CSS « balayer » : les champs se
      // remplissent au passage du rayon, pas avant.
      return new Sequenceur(bloc, function (s) {
        champs.forEach(function (c) { c.classList.remove('rempli'); });
        carte.classList.remove('complete');
        s.plus_tard(700,  function () { champs[0].classList.add('rempli'); });
        s.plus_tard(1300, function () { champs[1].classList.add('rempli'); });
        s.plus_tard(1800, function () { champs[2].classList.add('rempli'); });
        s.plus_tard(2100, function () { carte.classList.add('complete'); });
        return 4000;
      });
    }

    if (genre === 'formule') {
      var viseur = bloc.querySelector('.viseur');
      var rendu = bloc.querySelector('.rendu');
      // Cale sur les 4,6 s des animations CSS « viser » et « declic » :
      // le flash part au moment du declenchement, la carte arrive ensuite.
      return new Sequenceur(bloc, function (s) {
        viseur.classList.remove('parti', 'declenche');
        rendu.classList.remove('vu');
        s.plus_tard(1300, function () { viseur.classList.add('declenche'); });
        s.plus_tard(1700, function () {
          viseur.classList.add('parti');
          rendu.classList.add('vu');
        });
        s.plus_tard(4100, function () {
          viseur.classList.remove('parti', 'declenche');
          rendu.classList.remove('vu');
        });
        return 4600;
      });
    }

    return null;
  }

  if (doux) {
    // Mouvement reduit : on pose l'etat final une fois pour toutes, et on
    // ne lance aucune boucle. Le CSS s'occupe du reste.
    blocs.forEach(function (bloc) {
      var ligne = bloc.querySelector('.transcription');
      if (ligne) ligne.textContent = ligne.getAttribute('data-texte') || '';
      var rendu = bloc.querySelector('.rendu');
      if (rendu) rendu.classList.add('vu');
      bloc.querySelector('.carte-issue') &&
        bloc.querySelector('.carte-issue').classList.add('complete');
    });
    return;
  }

  var sequenceurs = [];
  blocs.forEach(function (bloc) {
    var s = construire(bloc);
    if (s) sequenceurs.push(s);
  });

  if (!('IntersectionObserver' in window)) {
    sequenceurs.forEach(function (s) {
      s.element.classList.add('anime');
      s.demarrer();
    });
    return;
  }

  var observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
      var s = sequenceurs.filter(function (x) {
        return x.element === entree.target;
      })[0];
      if (!s) return;
      if (entree.isIntersecting) {
        entree.target.classList.add('anime');
        s.demarrer();
      } else {
        entree.target.classList.remove('anime');
        s.arreter();
      }
    });
  // Seuil volontairement au ras : un bloc fait environ 440 px de haut,
  // et un seuil de 0,25 exigeait 110 px visibles. Dans une fenetre
  // courte - petit ecran, navigateur pas en plein ecran - l'animation
  // ne demarrait jamais alors que le bloc etait bien a l'ecran.
  }, { threshold: 0.01 });

  sequenceurs.forEach(function (s) { observateur.observe(s.element); });
})();
