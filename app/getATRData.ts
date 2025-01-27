/**
 *  Récupération des données génériques de l'ATR
 */
import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import { getDataObjectGroupOnATR, getArchiveUnitDataOnATR, getNodeTextContent, getEventsArray } from './processNodes.js';
import { ATRData } from './types.js';

export const getATRData = (atrPath: fs.PathOrFileDescriptor): Promise<ATRData> => {
    return new Promise((resolve, reject) => {
        fs.readFile(atrPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return reject(err); // Rejette la promesse en cas d'erreur
            }

            const doc = new DOMParser().parseFromString(data, "text/xml");

            if (!doc.documentElement) {
                return reject(new Error('Invalid XML document: documentElement is null'));
            }

            const dateElement = doc.documentElement.getElementsByTagName('Date');
            const messageIdentifierElement = doc.documentElement.getElementsByTagName('MessageIdentifier');
            const messageRequestIdentifierElement =  doc.documentElement.getElementsByTagName('MessageRequestIdentifier');
            const archivalAgreementElement = doc.documentElement.getElementsByTagName('ArchivalAgreement');
            const replyCodeElement = doc.documentElement.getElementsByTagName('ReplyCode');
            const archivalAgencyElement = doc.documentElement.getElementsByTagName('ArchivalAgency');
            const transferringAgencyElement = doc.documentElement.getElementsByTagName('TransferringAgency');
            const grantDateElement = doc.documentElement.getElementsByTagName('GrantDate');
            const operationElement = doc.documentElement.getElementsByTagName('Operation');
            
           const getMainEventsArray = () => {
                const mainEventsArray = [];

                for (let k = 0; k < operationElement.length; k++) {
                    const operation = operationElement[k];
                    const mainEventsElement = operation.getElementsByTagName('Event');
                    const events = getEventsArray(Array.from(mainEventsElement), true);
                    mainEventsArray.push(events)
                    }

                return mainEventsArray[0];
           }

            const mainEvents = getMainEventsArray()

            const dates = getNodeTextContent(Array.from(dateElement));
            const replyCode = getNodeTextContent(Array.from(replyCodeElement));
            const messageIdentifier = getNodeTextContent(Array.from(messageIdentifierElement));
            const messageRequestIdentifier = getNodeTextContent(Array.from(messageRequestIdentifierElement));
            const archivalAgreement = getNodeTextContent(Array.from(archivalAgreementElement));
            const archivalAgency = getNodeTextContent(Array.from(archivalAgencyElement));
            const transferringAgency = getNodeTextContent(Array.from(transferringAgencyElement))
            const grantDate = getNodeTextContent(Array.from(grantDateElement));
                       
            const generalInfos = {
                Date: dates,
                MessageIdentifier: messageIdentifier,
                MessageRequestIdentifier: messageRequestIdentifier,
                ArchivalAgreement: archivalAgreement,
                ReplyCode: replyCode,
                GrantDate: grantDate,
                ArchivalAgency: archivalAgency?.trim(),
                TransferringAgency: transferringAgency?.trim(),
                LogBook: mainEvents
            }; 

            const archiveUnitElements = doc.documentElement.getElementsByTagName('ArchiveUnit') || [];
            const archiveUnits = getArchiveUnitDataOnATR(Array.from(archiveUnitElements));

            const dataObjectGroupsElement = doc.documentElement.getElementsByTagName('DataObjectGroup') || [];
            const dataObjectGroups = getDataObjectGroupOnATR(Array.from(dataObjectGroupsElement));

            const ATRData:ATRData = { generalInfos, archiveUnits, dataObjectGroups };

            resolve(ATRData);

        })
    })
}

export { ATRData };
