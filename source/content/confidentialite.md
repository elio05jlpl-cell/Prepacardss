---
title: Confidentialité et données personnelles — PrépaCards
description: Quelles données PrépaCards traite et où elles sont stockées. Ni vos cartes ni votre compte ne quittent l'ordinateur : aucun serveur, aucun traceur, aucune publicité.
slug: confidentialite
faq: true
---

# Confidentialité et données personnelles

<p class="chapeau">Position tenue par PrépaCards : l'application n'a pas de
serveur, donc elle n'a rien à collecter. Cette page détaille les trois seuls
cas où des données quittent votre ordinateur.</p>

<div class="encart encart-attention">
  <p><strong>À relire avant la mise en ligne</strong>, et à faire vérifier si
  vous vendez des abonnements : la description doit correspondre exactement à
  ce que fait votre site au moment de sa publication, notamment si vous ajoutez
  un outil de mesure d'audience ou un prestataire de paiement.</p>
</div>

## Dans l'application

**Vos cartes, votre historique de révision et votre compte** sont enregistrés
dans un fichier local, sur votre ordinateur, à l'emplacement
`%APPDATA%\PrepaCards`. Ils ne sont jamais transmis : il n'existe aucun serveur
PrépaCards.

**Le mot de passe** de votre compte local n'est pas conservé en clair. Seule
une empreinte cryptographique est stockée (PBKDF2-HMAC-SHA256, 200 000
itérations, avec un sel aléatoire). Ce compte verrouille l'ouverture de
l'application ; il ne chiffre pas le fichier de cartes, et une personne ayant
accès à votre ordinateur pourrait lire ce fichier.

**Votre voix et l'image de votre webcam** sont analysées en mémoire, sur votre
processeur, puis immédiatement abandonnées. Aucun enregistrement audio ni aucune
image n'est conservé sur le disque ni transmis.

**Aucune mesure d'audience, aucune télémétrie** n'est intégrée à
l'application : elle ne signale ni son installation, ni son usage.

## Les trois cas où une donnée sort de votre ordinateur

1. **Traduction automatique d'une carte.** Le mot à traduire — et lui seul —
   est envoyé au service MyMemory (Translated srl, Italie). Ni votre adresse
   e-mail, ni votre identifiant, ni le reste de votre collection ne sont
   transmis. Cette fonction est optionnelle.
2. **Téléchargement des modèles au premier usage.** L'application récupère les
   modèles de reconnaissance vocale, de suivi du visage et de reconnaissance de
   formules depuis Hugging Face, Google et GitHub. Ces téléchargements
   transmettent ce que transmet toute requête web : votre adresse IP et le
   fichier demandé.
3. **Consultation de ce site.** Voir ci-dessous.

## Sur ce site

Ce site est statique : il ne dépose **aucun cookie** et n'utilise aucun outil
de suivi publicitaire. Il n'y a donc pas de bandeau de consentement, faute de
quoi consentir.

L'hébergeur conserve des journaux de connexion techniques (adresse IP, page
demandée, date), pour la sécurité et la mesure de charge, pendant une durée
limitée. C'est le traitement minimal inhérent au fonctionnement d'un serveur
web.

Si vous nous écrivez, votre adresse e-mail et le contenu de votre message sont
conservés le temps de traiter votre demande, puis supprimés.

## Base légale et durées

| Traitement | Base légale | Durée |
|---|---|---|
| Journaux du serveur web | Intérêt légitime (sécurité) | [durée pratiquée par votre hébergeur] |
| Réponse à un message | Intérêt légitime | Le temps de l'échange, puis suppression |
| Liste d'attente Premium ou version Mac | Consentement | Jusqu'au retrait de votre consentement |

## Vos droits

Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation
et d'opposition sur les données vous concernant, ainsi que d'un droit à la
portabilité. Pour l'exercer :
<a href="mailto:contact@prepacards.fr">contact@prepacards.fr</a>.

En cas de désaccord, vous pouvez saisir la CNIL (Commission nationale de
l'informatique et des libertés), 3 place de Fontenoy, 75334 Paris Cedex 07,
<a href="https://www.cnil.fr" rel="nofollow">www.cnil.fr</a>.

S'agissant de vos cartes, la portabilité est immédiate et ne demande aucune
démarche : *Fichier → Exporter en CSV* dans l'application.

## Questions fréquentes

### Mes enregistrements vocaux sont-ils conservés ?

Non. L'audio est transcrit en mémoire puis abandonné. Aucun fichier audio n'est écrit sur le disque, et rien n'est envoyé sur internet : la reconnaissance vocale fonctionne sur votre processeur.

### Les images de ma webcam sont-elles enregistrées ?

Non. Les images servent uniquement à mesurer le mouvement de vos lèvres, image par image, en mémoire. L'application n'écrit aucune capture et la caméra se referme quand vous quittez la session.

### Faut-il un compte pour utiliser l'application ?

Un compte est créé au premier lancement, mais il est **entièrement local** : il n'est enregistré nulle part ailleurs que sur votre ordinateur, et aucune vérification d'adresse e-mail n'a lieu. Personne, y compris nous, ne peut le récupérer — ce qui signifie aussi qu'il n'existe pas de procédure de mot de passe oublié.

### Ce site utilise-t-il Google Analytics ?

Non. Aucun outil de mesure d'audience n'est installé.

<p style="color:var(--gris);font-size:.9rem">Dernière mise à jour :
[date de mise en ligne]</p>
