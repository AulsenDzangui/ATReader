# ATReader

Logiciel permettant la lecture des accusés de réception (ATR) de la solution logicielle Vitam.

## Description

ATReader est un outil destiné à simplifier l'analyse des accusés de réception, également appelés Archive Transfer Reply (ATR), au format SEDA 2.1 et 2.2. Il optimise l'identification des objets à l'origine des avertissements ou des rejets lors d'un versement, fournissant ainsi une vue d'ensemble des erreurs potentielles. Il est principalement testé sur la solution logicielle Vitam.

## Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)

### Étapes

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/AulsenDzangui/ATReader.git
    cd ATReader
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet et en y ajoutant les variables nécessaires.

## Utilisation

1. Démarrez l'application :

    ```bash
    npm start
    ```

2. Ouvrez votre navigateur et accédez à `http://localhost:3000`.

3. Chargez vos fichiers ATR et MANIFEST pour commencer l'analyse.

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité ou correction de bug (`git checkout -b feature/ma-fonctionnalite`).
3. Commitez vos modifications (`git commit -m 'Ajout de ma fonctionnalité'`).
4. Poussez votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteurs

- Aulsen Dzangui
