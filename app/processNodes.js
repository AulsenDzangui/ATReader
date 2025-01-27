export const getNodeTextContent = (elementsList) => {
    for (let j = 0; j < elementsList.length; j++) {
        const element = elementsList[j];
        return element.textContent;
    }
};
export const getAgencyIdentifierNodeTextContent = (elementsList) => {
    for (let j = 0; j < elementsList.length; j++) {
        const element = elementsList[j];
        const identifierElement = element.getElementsByTagName('Identifier');
        const identifier = getNodeTextContent(identifierElement);
        return identifier;
    }
};
export const getArchiveUnitDataOnATR = (archiveUnitsElementList) => {
    const archiveUnits = [];
    for (let i = 0; i < archiveUnitsElementList.length; i++) {
        const archiveUnit = archiveUnitsElementList[i];
        const IdsAttributs = archiveUnit.getAttribute("id");
        const systemIdElement = archiveUnit.getElementsByTagName("SystemId");
        const managementElement = archiveUnit.getElementsByTagName('Management');
        const events = getEventsArray(managementElement, true);
        const systemId = getNodeTextContent(systemIdElement);
        // Création d'un nouvel objet pour chaque itération
        const archiveUnitOBJ = {
            id: IdsAttributs,
            SystemId: systemId,
            LogBook: events || []
        };
        // Ajouter l'objet au tableau
        archiveUnits.push(archiveUnitOBJ);
    }
    return archiveUnits;
};
export const getDataObjectGroupOnATR = (elementsList) => {
    const dataObjectGroupArray = [];
    for (let i = 0; i < elementsList.length; i++) {
        const dataObjectGroup = elementsList[i];
        const binaryDataObjectElements = dataObjectGroup.getElementsByTagName('BinaryDataObject');
        const logBookElements = dataObjectGroup.getElementsByTagName('LogBook');
        function getBinaries(binaryDataObjectElements) {
            for (let j = 0; j < binaryDataObjectElements.length; j++) {
                const element = binaryDataObjectElements[j];
                return element.getAttribute('id');
            }
        }
        const id = dataObjectGroup.getAttribute('id');
        const binaryId = getBinaries(binaryDataObjectElements);
        const events = getEventsArray(logBookElements);
        const dataObjectGroupOBJ = {
            id: id,
            BinaryDataObjectId: binaryId,
            LogBook: events,
        };
        dataObjectGroupArray.push(dataObjectGroupOBJ);
    }
    return dataObjectGroupArray;
};
export const getEventsArray = (logBooksElementList, isMain = false) => {
    const eventsList = [];
    if (!isMain) {
        // Traitement des évènements des objets binaires
        for (let i = 0; i < logBooksElementList.length; i++) {
            const logBook = logBooksElementList[i];
            const eventsElement = logBook.getElementsByTagName('Event');
            for (let j = 0; j < eventsElement.length; j++) {
                const event = eventsElement[j];
                const eventTypeElement = event.getElementsByTagName("EventType");
                const outcomeElement = event.getElementsByTagName("Outcome");
                const outcomeDetailMessageElement = event.getElementsByTagName("OutcomeDetailMessage");
                const eventType = getNodeTextContent(eventTypeElement);
                const outcome = getNodeTextContent(outcomeElement);
                const outcomeDetailMessage = getNodeTextContent(outcomeDetailMessageElement);
                const eventOBJ = {
                    EventType: eventType,
                    Outcome: outcome,
                    OutcomeDetailMessage: outcomeDetailMessage
                };
                eventsList.push(eventOBJ);
            }
        }
        return eventsList;
    }
    else {
        // Traitement des évènements du SIP en général ou des évènements d'une unité archivistique
        for (let i = 0; i < logBooksElementList.length; i++) {
            const event = logBooksElementList[i];
            const eventTypeElement = event.getElementsByTagName("EventType");
            const outcomeElement = event.getElementsByTagName("Outcome");
            const outcomeDetailMessageElement = event.getElementsByTagName("OutcomeDetailMessage");
            const eventDetailDataElement = event.getElementsByTagName("EventDetailData");
            const eventType = getNodeTextContent(eventTypeElement);
            const outcome = getNodeTextContent(outcomeElement);
            const outcomeDetailMessage = getNodeTextContent(outcomeDetailMessageElement);
            const eventDetailData = getNodeTextContent(eventDetailDataElement);
            const eventOBJ = {
                EventType: eventType,
                Outcome: outcome,
                OutcomeDetailMessage: outcomeDetailMessage,
                EventDetailData: eventDetailData
            };
            eventsList.push(eventOBJ);
        }
        return eventsList;
    }
};
export const getSubElementsList = (parentElementList) => {
    for (let j = 0; j < parentElementList.length; j++) {
        const element = parentElementList[j];
        return element.getAttribute('algorithm');
    }
};
