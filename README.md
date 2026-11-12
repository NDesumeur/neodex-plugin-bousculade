# Bousculade

Un jeu de plateau en pixel art : éléphants contre rhinocéros sur un plateau de 5 × 5, avec trois rochers au milieu. Le premier camp qui pousse un rocher hors du plateau gagne… à condition d'être le bon animal derrière lui. Contre l'ordinateur (trois niveaux) ou à deux sur le même PC.

*English version: [README.en.md](README.en.md)*

## Ton tour : une seule action

- **Entrer** : un animal de ta réserve se pose sur une case libre du bord.
- **Se déplacer** d'une case (haut, bas, gauche, droite) vers une case libre.
- **Se tourner** sur place.
- **Sortir** du plateau par un bord : l'animal retourne dans ta réserve.
- **Pousser** droit devant, dans le sens où il regarde (ou en entrant sur une case du bord occupée).

Après une entrée, un déplacement ou une rotation, tu choisis **où l'animal regarde** : c'est ce qui compte pour pousser.

## Pousser

Toute la file de pièces devant l'animal avance d'une case, si la force suffit :

- chaque animal de la file qui regarde **dans le sens de la poussée** ajoute **+1** (le pousseur compte aussi) ;
- chaque animal qui regarde **en face** retire **1** ;
- les animaux de côté ne comptent pas ;
- chaque **rocher** demande **1** de force.

Un animal poussé hors du plateau retourne dans la réserve de son camp.

## Gagner

Quand un rocher sort du plateau, c'est l'animal **le plus proche derrière lui** qui regarde dans le sens de la poussée qui fait gagner son camp, **même si c'est l'adversaire** qui a poussé !

## Commandes

- **Souris** : clique un animal (ou ta réserve), puis une cible : carré vert = y aller, flèche orange = pousser, flèche rouge = sortir. Puis clique la flèche du regard.
- **Clavier** : les flèches passent d'une zone à l'autre, **Entrée** ou **Espace** choisit, **Échap** annule.

## L'ordinateur

- **Facile** : il voit un coup à l'avance et se trompe parfois.
- **Normal** : il voit sa réponse à ton coup.
- **Difficile** : il voit trois coups à l'avance.

## Statistiques

Le panneau Records compte tes **victoires** à chaque niveau et les **parties à deux**.

## Données et synchronisation

Tes statistiques et tes choix (niveau, camp) sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Bousculade → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
