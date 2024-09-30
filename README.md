# StartToImpact: Smart Contract con Solidity Advanced

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Hardhat](https://img.shields.io/badge/Hardhat-2.22.11-blue)
[![Ethereum](https://img.shields.io/badge/Powered%20by-Ethereum-blue)](https://ethereum.org/)

## Descrizione

`DAO` è un sistema di smart contract scritto in Solidity che consente la creazione e gestione di una **Organizzazione Autonoma Decentralizzata (DAO)**. Il progetto è stato sviluppato, testato e distribuito utilizzando Hardhat con TypeScript e le librerie di OpenZeppelin.

Il contratto **DAO.sol** permette agli utenti di acquistare azioni della DAO tramite il token ERC-20 definito nel contratto **TokenERC20.sol**. Gli utenti possono utilizzare queste azioni per partecipare alla governance votando sulle proposte, crearne di nuove o delegare i propri diritti di voto ad altri membri. Quando il periodo di voto di una proposta scade, questa può essere eseguita in base al risultato del voto..

### [Presentazione](https://www.canva.com/design/DAGSOPLJAAM/n4LvwbfO0rMvK5oGaUTpwA/view?utm_content=DAGSOPLJAAM&utm_campaign=designshare&utm_medium=link&utm_source=editor)

## Funzionalità

- **Acquisto di azioni**: Gli utenti possono acquistare azioni utilizzando i token ERC-20, determinando la quantità di token da convertire. Il prezzo per azione è determinato dal contratto.
- **Creazione di proposte**: I membri della DAO possono creare nuove proposte, che possono includere, ad esempio, il trasferimento di token a un indirizzo specifico.
- **Voto su proposte**: I membri possono votare sulle proposte in base al numero di azioni possedute.
- **Esecuzione delle proposte**: Dopo la scadenza del periodo di votazione, è possibile eseguire una proposta.
- **Delegazione delle azioni**: I membri possono delegare il proprio potere di voto a un altro membro della DAO.
- **Revoca della delega**: È possibile revocare la delega delle azioni precedentemente assegnata a un altro membro.

## Installazione

1. Clona il repository sul tuo computer:

```bash
git clone https://github.com/lim-haru/DAO.git
```

2. Entrare nella directory del progetto

```bash
cd DAO
```

3. Installare le dipendenze

```
npm install
```

4. Crea le variabili ambiente nel tuo sistema o crea un file nel root del progetto chiamandolo ".env" e aggiungi le seguenti variabili:

```
INFURA_KEY=key_progetto_infura
PRIVATE_KEY=chiave_privata_wallet
```

5. Compila i contratti tramite hardhat:

```
npx hardhat compile
```

### Test

Avvia il test:

```
npx hardhat test test/DAO.ts
```

### Deploy

Eseguire il deploy dei contratti sulla testnet Holesky:

```
npx hardhat run --network holesky scripts/deploy.ts
```

## Indirizzo dei Contratti

[Holesky TokenERC20](https://holesky.beaconcha.in/address/0x12bfa1b288111d903a05055515f826c709d3d003) : 0xEa0c07601567164A5C382571b9B6478aFbCde3e1  
[Holesky DAO](https://holesky.beaconcha.in/address/0xea0c07601567164a5c382571b9b6478afbcde3e1) : 0x12bfA1B288111d903a05055515F826c709D3d003

## Tecnologie utilizzate

- **Solidity**: Linguaggio di programmazione per smart contract su Ethereum.
- **Hardhat**: Strumento di sviluppo per Ethereum per compilazione, testing e distribuzione degli smart contract.
- **OpenZeppelin**: Libreria di contratti intelligenti standard e sicuri.
- **TypeScript**: Utilizzato per migliorare la robustezza del codice e l'integrazione con Hardhat.

## Licenza 📄

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per maggiori dettagli.
