# Escrow Smart Contract FOB

| Nom    | Prénom   |
|--------|----------|
| Duvieu | Baptiste |

Le TP est à réaliser individuellement.

## Présentation

Les Incoterms [1] régissent les transactions commerciales internationales en définissant les responsabilités des vendeurs et des acheteurs concernant la livraison des marchandises, les risques de transport, les frais et les obligations douanières. Un Smart Contract, que nous appelerons maintenant Escrow Smart Contract [5] peut automatiser les paiements en fonction des conditions spécifiques liées à un Incoterm particulier, comme le transfert de propriété ou le risque une fois que la marchandise a atteint un point défini (par exemple, lors de la remise à un transporteur ou à l'arrivée à un port).

Le projet consiste à concevoir un Escrow Smart Contract, où les paiements sont automatiquement déclenchés en fonction de la conformité aux termes de l'Incoterm choisi (FOB (Free on Board) [2], CIF (Cost, Insurance, Freight) [3] ou encore DAP (Delivered at Place)) [4]. L'Escrow Smart Contract verrouille les fonds de l'acheteur, qui ne seront déploqués qu'une fois que certaines conditions de livraison ou de transfert de risques, définies par l'incoterm, seront satisfaites. Pour ce projet, on s'intéresse uniquement à l'Incoterm FOB.

- [1] « Les nouvelles règles Incoterms® 2020 et la valeur en douane », Le portail de la direction générale des douanes et droits indirects. [En ligne]. Disponible sur: http://www.douane.gouv.fr/les-nouvelles-regles-incotermsr-2020-et-la-valeur-en-douane
- [2] « Ce qu’il faut savoir sur l’incoterm FOB ». [En ligne]. Disponible sur: https://fiches-pratiques.chefdentreprise.com/Thematique/export-1101/FichePratique/Ce-qu-il-faut-savoir-sur-l-incoterm-FOB-361564.htm
- [3] « Incoterm CIF : une solution adaptée aux formalités douanières – SupplyChainInfo ». [En ligne]. Disponible sur: https://www.supplychaininfo.eu/incoterm-cif/
- [4] « Qu’est-ce que l’Incoterm DAP ? – SupplyChainInfo ». [En ligne]. Disponible sur: https://www.supplychaininfo.eu/incoterm-dap/
- [5] V. Iehlé, E. Lécuyer, et M. Vernay, « Escrow Smart Contracts et Risque de Liquidité dans le Commerce International Maritime », juin 2023. [En ligne]. Disponible sur: https://shs.hal.science/halshs-04124060

## Restitution

Il est nécessaire de tester le Smart Contract, il est donc demandé de rédiger des tests unitaires ainsi que de la documentation à propos du Smart Contract mais aussi de l'application décentralisée.

## Mise en place

### _FOB_

Dans l'incoterm FOB on distingue plusieurs étapes : 
- L'envoi de la marchandise
- Le chargement à bord
- Le transport maritime
- Le déchargement
- L'arrivée de la marchandise

Le transfert de frais entre vendeur et acheteur se fait lorsque le chargement à bord est terminé, le statut de la marchandise est donc une composante primordiale.

### _Smart contract_

Globalement, ce qu'on a dit précédemment implique déjà un certain nombre de variables à inclure dans le smart contract : 
- Un acheteur : adresse eth
- Un vendeur : adresse eth
- Un agent intermédiaire : adresse eth
- La valeur : valeur eth
- Le statut : variable dynamique avec états définis
- Une validation à la fin du chargement : confirmation manuelle

On choisit ici d'avoir un agent intermédiaire sur lequel les fonds transitent pour que la transaction se fasse au mieux. Seule la valeur est stockée pour éviter d'afficher publiquement dans la blockchain ce qui constitue la marchandise. 
Dans une amélioration future on peut imaginer ajouter un hash contenant toutes les infos sur la marchandise servant de source en cas de litige, un système utilisant IPFS pourrait être mis en place.
En ce qui concerne le statut, il faudra ajouter des checkpoints permettant d'avoir un suivi de l'avancement. 
La validation à la fin du chargement permet de savoir quand est-ce que le transfert de frais / risque se fait et quand est-ce que l'agent intermédiaire envoie l'argent au vendeur.
Dans le cas d'une mise en place réelle la validation à la fin du chargement peut être fait via un oracle, une API directement liée au contenu du bateau / ce qu'il y a à envoyer, cela permet d'automatiser le processus.
