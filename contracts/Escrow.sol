// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Escrow {
    // Enumération facilitant les transitions de statut
    enum Status {Sent, Loading, Transport, Unloading, Received, Cancelled}

    address payable private seller;
    address payable private buyer;
    uint private value;
    Status private status;
    bool private loadingValidation;
    bool private fundsDeposited;

    // Evenements marquant un changement de statut, la validation du chargement, l'annulation de la transaction, le dépôt et le retrait des fonds
    event StatusUpdated(Status oldStatus, Status newStatus);
    event LoadingValidated(bool validation);
    event TransactionCancelled(address initiator, string reason, uint value);
    event FundsDeposited(address from, uint amount);
    event FundsReleased(address to, uint amount);

    // Suite de modificateurs permettant de restreindre l'accés aux fonctions selon le rôle et / ou le statut de la transaction
    // La notation _; permet d'effectuer la fonction comportant le modificateur aprés la vérification

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Seul un acheteur peut effectuer cette action.");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Seul un vendeur peut effectuer cette action.");
        _;
    }

    modifier notCancelled() {
        require(status != Status.Cancelled, "La transaction a ete annulee.");
        _;
    }

    modifier notFinalized() {
        require(status != Status.Received, "La transaction est deja finalisee.");
        _;
    }

    // Constructeur initialisant les variables et vérifiant que les 3 parties de la transaction sont présentes et qu'une valeur est bien définie
    constructor(address payable _seller, address payable _buyer, uint _value) {
        require(_seller != address(0), "L'adresse du vendeur ne peut pas etre nulle.");
        require(_buyer != address(0), "L'adresse de acheteur ne peut pas etre nulle.");
        require(_value > 0, "La valeur de la marchandise ne peut pas etre nulle.");

        seller = _seller;
        buyer = _buyer;
        value = _value;
        status = Status.Sent;
        loadingValidation = false;
        fundsDeposited = false;
    }

    function getSeller() public view returns (address payable) {
        return seller;
    }

    function getBuyer() public view returns (address payable) {
        return buyer;
    }

    // Pas de setter pour les adresses des différents acteurs, si un acteur se retire => transaction annulée

    function getValue() public view returns (uint) {
        return value;
    }

    // Pas de setter pour value, la valeur est configurée au départ, en cas de litige => transaction annulée

    // Fonction relatives au statut, le setter permet d'avancer dans les statuts 1 à 1 et de déverouiller les fonds s'il y a eu le transfert de risque
    function getStatus() public view returns (Status) {
        return status;
    }

    function getFundsDeposited() public view returns (bool) {
        return fundsDeposited;
    }

    function setStatus(Status _newStatus) public notFinalized notCancelled {
        require(fundsDeposited, "Les fonds doivent etre deposes avant de modifier le statut.");
        if (status == Status.Sent) {
            require(msg.sender == seller, "Seul le vendeur peut valider ces etapes.");
        } else {
            require(msg.sender == buyer, "Seul l'acheteur peut valider ces etapes.");
        }
        require(uint(_newStatus) == uint(status) + 1, "Transition de statut invalide.");
        emit StatusUpdated(status, _newStatus);
        status = _newStatus;
    }

    // Fonctions relatives à la validation du chargement
    function getLoadingValidation() public view returns (bool) {
        return loadingValidation;
    }

    function validateLoading() public onlyBuyer notFinalized notCancelled {
        require(status == Status.Loading, "Le statut doit etre 'Loading'.");
        loadingValidation = true;
        setStatus(Status.Transport);
        emit LoadingValidated(true);
    }

    // Fonction permettant d'annuler la transaction, les fonds sont gérés par le compte escrow en fonction d'une potentielle pénalité
    // L'incoterm FOB ne prévoit pas necessairement de pénalité mais la pratique est courante dans l'écriture des contrats
    function cancelTransaction(address payable _initiator, string memory _reason) public notFinalized notCancelled {
        require(_initiator != address(0), "Annulation de la transaction doit obligatoirement etre demandee par une partie.");
        require(bytes(_reason).length > 0, "Annulation de la transaction doit etre motivee.");
        require(loadingValidation == false, "La transaction ne peut pas etre annulee si acheteur a valide le chargement.");

        uint contractBalance = address(this).balance;

        if (_initiator == seller) {
            // Le vendeur annule => Remboursement complet des fonds à l'acheteur
            buyer.transfer(contractBalance);
            emit FundsReleased(buyer, contractBalance);
        } else {
            // Si l'acheteur annule et que la commande est Sent, 15% de pénalité vont au vendeur
            // Si l'acheteur annule et que la commande est Loading, 30% de pénalité vont au vendeur
            uint sellerPenalty = (status == Status.Sent) ? (contractBalance * 15) / 100 : (contractBalance * 30) / 100;
            uint buyerRefund = contractBalance - sellerPenalty;

            seller.transfer(sellerPenalty);
            buyer.transfer(buyerRefund);
            emit FundsReleased(seller, sellerPenalty);
            emit FundsReleased(buyer, buyerRefund);
        }

        status = Status.Cancelled;
        emit TransactionCancelled(_initiator, _reason, value);
    }

    // Fonction relatives au transfert de fond (dépôt et retrait)
    function depositFunds() external payable onlyBuyer notFinalized notCancelled {
        require(msg.value == value, "Le montant depose doit etre egal a la valeur de la marchandise.");
        require(!fundsDeposited, "Les fonds ont deja ete deposes.");
        fundsDeposited = true;
        emit FundsDeposited(msg.sender, msg.value);
    }

    function releaseFunds() external payable notFinalized notCancelled {
        require(loadingValidation == true, "Les fonds ne peuvent etre liberes que lorsque le chargement a ete valide.");
        require(fundsDeposited, "Les fonds doivent etre deposes avant liberation.");

        uint contractBalance = address(this).balance;
        require(contractBalance > 0, "Aucun fonds disponible pour le transfert.");

        emit FundsReleased(seller, contractBalance);

        (bool success, ) = payable(seller).call{value: contractBalance}("");
        require(success, "Le transfert de fonds a echoue.");
    }

}