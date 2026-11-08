---
titre: "Marquer une pièce métallique : numéro de série, DataMatrix ou numéro de lot"
seoTitle: "Marquer une pièce métallique : série, DataMatrix, lot"
description: "Quel marquage pour une pièce métallique : numéro de série, DataMatrix, QR code ou numéro de lot. Comparatif par type de code, par pièce et par procédé."
chapo: "Avant de choisir un procédé, il faut savoir ce que l’on marque et pour qui on le marque. Une pièce de décolletage, une pièce emboutie, une pièce de fonderie et une pièce de rechange ne posent pas le même problème — et c’est ce problème-là, pas la machine, qui décide du marquage."
categorie: "guides-atelier"
datePublication: 2026-11-08
dateModification: 2026-11-08
couverture: "outil-metal-marque-datamatrix-laser.webp"
couvertureAlt: "Outil métallique marqué au laser d’un code DataMatrix et d’une référence"
tempsLecture: "7 min"
pilier: true
aRetenir:
  - "Le type de code se choisit avant le procédé : il décide de la surface nécessaire."
  - "Un DataMatrix tient dans quelques millimètres ; un QR code demande plus de place."
  - "Une pièce test scannée avant la série évite un lot entier illisible."
  - "Sur une pièce qui frotte, une gravure en creux tient mieux qu’un marquage de surface."
reperes:
  - label: "Ce qui décide du procédé"
    valeur: "La matière, l’état de surface, la géométrie de la pièce et ce qu’elle subira ensuite."
  - label: "Ce qui décide du code"
    valeur: "La quantité d’information à porter et la place disponible sur la pièce."
  - label: "Ce qui décide de la profondeur"
    valeur: "Le frottement, les chocs et le nettoyage auxquels la pièce sera exposée."
  - label: "À préparer"
    valeur: "Une pièce test, un tableau de données, et la distance de lecture prévue."
faq:
  - question: "Quel marquage pour un numéro de série sur une pièce en acier ?"
    reponse: "Le marquage laser est le plus courant, parce qu’il ne dépose rien : il transforme la surface, donc le numéro ne peut ni s’écailler ni partir au nettoyage. Sur une pièce très sollicitée mécaniquement, une gravure en creux tient mieux qu’un marquage de surface. Sur une pièce qui doit rester lisse, le recuit produit une marque foncée sans enlever de matière."
  - question: "DataMatrix ou QR code sur une pièce métallique ?"
    reponse: "Le DataMatrix, dans presque tous les cas industriels. À quantité d’information égale, il occupe nettement moins de place qu’un QR code et reste lisible plus petit — c’est pour cela qu’il s’est imposé sur les pièces mécaniques, où la surface disponible se compte en millimètres. Le QR code garde l’avantage quand un téléphone grand public doit le lire sans application dédiée."
  - question: "Quelle taille minimale pour un code lisible ?"
    reponse: "Il n’y a pas de chiffre universel : la taille dépend du nombre de caractères encodés, du contraste obtenu sur la matière et de la distance de lecture de vos scanners. C’est précisément ce que la pièce test sert à établir. Un code marqué puis scanné dans vos conditions réelles vaut mieux que n’importe quelle règle générale."
  - question: "Comment marquer une pièce de décolletage ?"
    reponse: "Ce sont presque toujours des pièces cylindriques et de petit diamètre : elles se marquent au mandrin rotatif, qui fait tourner la pièce sous le faisceau pour que le texte suive la circonférence sans se déformer. La vraie contrainte n’est pas le marquage mais le bridage — une pièce qui bouge d’un dixième donne un code illisible."
  - question: "Et une pièce emboutie ou de fonderie ?"
    reponse: "La difficulté est l’état de surface. Une pièce emboutie porte souvent des traces d’outil et un film d’huile ; une pièce de fonderie a une peau rugueuse et irrégulière. Le contraste y est moins franc que sur un acier usiné, et la zone de marquage doit être choisie sur la partie la plus plane. Cela se juge sur la pièce, pas sur un plan."
  - question: "Peut-on marquer un numéro de lot différent par série ?"
    reponse: "Oui, et c’est le cas le plus simple : un seul texte pour tout le lot, changé entre deux séries. Le temps de réglage est le même que pour une pièce unique. C’est quand chaque pièce porte une donnée différente qu’il faut un tableau de données variables."
  - question: "Faut-il marquer avant ou après traitement de surface ?"
    reponse: "Après, dans la grande majorité des cas. Un marquage posé avant anodisation, peinture ou traitement thermique peut être recouvert, altéré ou effacé. L’exception concerne les marquages en creux suffisamment profonds pour survivre au traitement — mais cela se décide pièce par pièce, et par un essai."
  - question: "Le marquage laser résiste-t-il aux huiles et au lavage industriel ?"
    reponse: "Oui, parce qu’il n’y a rien à décoller : le faisceau transforme la surface au lieu d’y déposer une encre. Huiles de coupe, solvants et lavages ne l’atteignent pas. La seule contrainte réelle est mécanique, sur une pièce soumise à un frottement constant."
  - question: "Marquer la pièce ou poser une étiquette ?"
    reponse: "On marque la pièce quand l’information doit lui survivre, quand elle est métallique et qu’elle travaille en atelier. On pose une étiquette quand le support ne se marque pas, quand il faut de la couleur pour un repérage visuel, ou quand l’information devra changer."
liens:
  - href: "/services/marquage-industriel/"
    label: "Marquage industriel et données variables"
  - href: "/services/gravure-metal/"
    label: "Gravure sur métal : le rendu métal par métal"
  - href: "/services/etiquettes-industrielles/"
    label: "Étiquettes industrielles et repérage"
  - href: "/realisations/metal/tracabilite-et-donnees-variables/"
    label: "Pièces marquées : numéros de série et codes"
---

## Trois questions avant de choisir quoi que ce soit

La plupart des demandes arrivent à l’envers : « on voudrait du marquage laser ».
C’est une réponse, pas une question. Les trois questions qui décident réellement
sont les suivantes.

**Qu’est-ce que l’information doit porter ?** Une référence fixe, un numéro qui
s’incrémente, une date de lot, ou un code que relira une machine. Cela détermine
la place nécessaire sur la pièce — et donc, souvent, si le projet est faisable
tel quel.

**Qui va la lire, et à quelle distance ?** Un opérateur à bout de bras, un
scanner de poste fixe, un téléphone, une caméra de contrôle. La distance de
lecture commande le contraste et la taille du module bien plus que l’esthétique.

**Que va subir la pièce ensuite ?** Du frottement, des chocs, un lavage, un
traitement de surface, dix ans en extérieur. C’est cette question qui tranche
entre un marquage de surface et une gravure en creux.

Tant que ces trois réponses ne sont pas connues, choisir un procédé revient à
tirer au sort.

## Le code : ce qu’il porte, la place qu’il prend

| Type de marquage | Ce qu’il porte | Place nécessaire | Quand le choisir |
| --- | --- | --- | --- |
| Texte simple | Une référence, un nom, une date | Faible, mais croît avec le nombre de caractères | Lecture humaine uniquement |
| Numéro de série | Un identifiant unique, incrémenté | Faible | Suivi pièce à pièce, garantie, SAV |
| Numéro de lot | Une donnée commune à toute une série | Faible | Fonderie, traitement thermique, production par bain |
| DataMatrix | Beaucoup d’information en très peu de place | La plus compacte à information égale | Pièces mécaniques, surfaces réduites |
| QR code | Une URL, une fiche, un contenu web | Plus encombrant qu’un DataMatrix | Lecture par téléphone, sans application dédiée |

La ligne qui compte est la dernière colonne du DataMatrix. Sur une pièce
mécanique, la surface disponible se mesure en millimètres, et c’est la raison
pour laquelle l’industrie a adopté ce format plutôt que le QR code : à contenu
identique, il tient dans une fraction de la place.

Le QR code garde un vrai domaine : celui où le lecteur est un téléphone
quelconque, sans application métier installée.

## Trois profondeurs, et ce qu’elles coûtent à la pièce

Le laser ne fait pas qu’une seule chose au métal. Il en fait trois, et le choix
n’est pas un réglage de confort.

**Le marquage de surface.** La couche supérieure est modifiée sans que la matière
soit enlevée. Rapide, net, suffisant dans la grande majorité des cas.

**Le recuit.** Surtout sur l’inox. Le métal est chauffé localement et s’oxyde, ce
qui produit une marque foncée **sans creuser**. C’est le choix quand la surface
doit rester parfaitement lisse — étanchéité, contact alimentaire, pièce polie.

**La gravure en creux.** La matière est enlevée. C’est la plus résistante
mécaniquement, et la seule à conseiller dès qu’une pièce frotte, se manipule
beaucoup ou subit des chocs.

Le détail de ce que chaque métal donne sous le faisceau — anodisé, inox, alu
brut, laiton, titane — est sur la page
[gravure sur métal](/services/gravure-metal/).

## Par type de pièce : ce qui change vraiment

C’est là que les demandes se ressemblent le moins, et la machine n’y est presque
pour rien. Ce qui change, c’est la surface et la façon de tenir la pièce.

| Type de pièce | La vraie difficulté | Ce qu’on fait |
| --- | --- | --- |
| Pièce de décolletage | Cylindrique, petit diamètre, difficile à brider | Mandrin rotatif, bridage soigné |
| Pièce emboutie | Traces d’outil, film d’huile, surface irrégulière | Choisir la zone la plus plane, dégraisser |
| Pièce de fonderie | Peau rugueuse, contraste moins franc | Zone usinée si elle existe, sinon essai |
| Outillage | Doit survivre au frottement constant | Gravure en creux plutôt que surface |
| Pièce de rechange | Souvent déjà peinte ou traitée | Le revêtement est attaqué avant le métal |
| Boîtier, plaque technique | Grande surface, lecture à distance | Marquage de surface, code plus grand |

**La pièce de rechange** mérite un mot de plus. Elle arrive fréquemment déjà
revêtue, et le faisceau attaque alors la couche avant le métal. Sur une peinture
claire posée sur un métal clair, le contraste peut être décevant ; sur un
revêtement sombre, excellent. Cela ne se tranche pas sur catalogue.

## Les données variables, sans mystère

C’est le point qui intimide le plus, et c’est le plus simple.

Vous transmettez un **tableau** : une ligne par pièce, une colonne par
information — numéro de série, référence, date de lot, contenu du code. Ce
tableau est relié au gabarit de marquage, et la série se déroule ensuite sans
ressaisie : chaque pièce reçoit sa propre donnée.

La conséquence est contre-intuitive. Cent pièces portant cent numéros différents
ne coûtent pas cent fois une pièce : le réglage machine est identique d’une pièce
à l’autre. **Ce qui prend du temps, c’est de préparer et de vérifier le fichier,
une seule fois.** Un tableau propre vaut mieux qu’un long cahier des charges.

## La pièce test : l’étape qu’on ne saute pas

Dès qu’un code doit être relu par une machine, une pièce est marquée puis
**scannée** avant de lancer quoi que ce soit.

Un DataMatrix ne se règle pas de la même façon sur un inox poli, qui renvoie la
lumière, et sur un aluminium anodisé, qui l’absorbe. Le contraste et la taille du
module s’ajustent à la matière et à la distance de lecture réelle.

Sauter cette étape fait courir un risque précis : un lot entier de pièces
correctement marquées, et illisibles par vos lecteurs. Un marquage laser ne se
rattrape pas — il n’y a rien à retirer.

C’est aussi à ce moment qu’on tranche entre surface et creux, au vu de la pièce
plutôt que d’une description.

## Avant ou après traitement de surface ?

Après, dans la grande majorité des cas.

Un marquage posé avant anodisation, peinture ou traitement thermique risque
d’être recouvert, altéré, ou simplement effacé. L’ordre des opérations fait
partie du sujet, et il vaut la peine d’y penser en amont plutôt que de découvrir
le problème sur le premier lot.

L’exception existe : une gravure en creux suffisamment profonde peut survivre à
certains traitements. Mais c’est une décision pièce par pièce, prise après un
essai, pas une règle générale.

## Marquer la pièce, ou poser une étiquette

Les deux solutions coexistent, et le choix se résume à une question : est-ce que
l’information doit survivre à la pièce, ou est-ce qu’elle doit pouvoir changer ?

**Marquer la pièce** quand elle est métallique, qu’elle travaille en atelier, et
que l’identification doit la suivre jusqu’au bout. Rien n’est posé, rien ne se
décolle.

**Poser une étiquette** quand le support ne se marque pas, quand il faut de la
couleur pour un repérage visuel immédiat, ou quand l’information sera remplacée.
C’est un autre métier, décrit sur la page des
[étiquettes industrielles](/services/etiquettes-industrielles/).

## Ce qu’il faut préparer pour une première série

- **Une pièce test**, de préférence issue de la vraie production, avec son état
  de surface réel.
- **Le tableau de données**, même incomplet : sa structure compte plus que son
  contenu.
- **La distance de lecture** prévue, et le modèle de scanner si vous le
  connaissez.
- **Ce que la pièce subira ensuite** : lavage, traitement, frottement, extérieur.
- **La zone de marquage souhaitée**, ou la question posée si elle n’est pas
  évidente.

Avec cela, la mise au point est rapide. Sans la pièce, elle reste théorique.

Le détail du service, les matières traitées et le fonctionnement des séries sont
sur la page [marquage industriel](/services/marquage-industriel/) ; les pièces
réellement produites sont visibles dans la galerie
[traçabilité et données variables](/realisations/metal/tracabilite-et-donnees-variables/).
