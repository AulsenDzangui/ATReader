import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';
import { getAgencyIdentifierNodeTextContent, getNodeTextContent } from './processNodes.js';
import { getManifestDataObjectGroupsArray } from './getManifestDataObjectGroupsArray.js';
export const getSIPData = (manifestPath) => {
    console.log(manifestPath);
    return new Promise((resolve, reject) => {
        fs.readFile(manifestPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return reject(err); // Rejette la promesse en cas d'erreur
            }
            const doc = new DOMParser().parseFromString(data, "text/xml");
            if (!doc.documentElement) {
                return reject(new Error('Invalid XML document: documentElement is null'));
            }
            const dateElement = doc.documentElement.getElementsByTagName('Date');
            const commentElement = doc.documentElement.getElementsByTagName('Comment');
            const messageIdentifierElement = doc.documentElement.getElementsByTagName('MessageIdentifier');
            const archivalAgreementElement = doc.documentElement.getElementsByTagName('ArchivalAgreement');
            const archivalAgencyElement = doc.documentElement.getElementsByTagName('ArchivalAgency');
            const transferringAgencyElement = doc.documentElement.getElementsByTagName('TransferringAgency');
            const dates = getNodeTextContent(Array.from(dateElement));
            const comment = getNodeTextContent(Array.from(commentElement));
            const messageIdentifier = getNodeTextContent(Array.from(messageIdentifierElement));
            const archivalAgreement = getNodeTextContent(Array.from(archivalAgreementElement));
            const archivalAgencyId = getAgencyIdentifierNodeTextContent(Array.from(archivalAgencyElement));
            const transferringAgencyId = getAgencyIdentifierNodeTextContent(Array.from(transferringAgencyElement));
            const generalInfos = {
                Date: dates,
                Comment: comment,
                MessageIdentifier: messageIdentifier,
                ArchivalAgreement: archivalAgreement,
                ArchivalAgency: archivalAgencyId,
                TransferringAgency: transferringAgencyId
            };
            const archiveUnitElements = doc.documentElement.getElementsByTagName('ArchiveUnit') || [];
            let archiveUnits = [];
            for (let i = 0; i < archiveUnitElements.length; i++) {
                const _archiveUnit = archiveUnitElements[i];
                if (isFile(_archiveUnit)) {
                    console.log(`ArchiveUnit ${_archiveUnit.getAttribute("id")} est un fichier.`);
                    const dataObjectGroupReferenceIdElement = _archiveUnit.getElementsByTagName('DataObjectGroupReferenceId');
                    const dataObjectGroupReferenceId = getNodeTextContent(Array.from(dataObjectGroupReferenceIdElement));
                    console.log(`DataObjectGroupReferenceId: ${dataObjectGroupReferenceId}`);
                    const archiveUnit = {
                        id: _archiveUnit.getAttribute("id"),
                        DataObjectGroupReferenceId: dataObjectGroupReferenceId,
                        DescriptionLevel: getNodeTextContent(Array.from(_archiveUnit.getElementsByTagName("DescriptionLevel"))),
                        Title: getNodeTextContent(Array.from(_archiveUnit.getElementsByTagName("Title")))
                    };
                    archiveUnits.push(archiveUnit);
                }
                else {
                    console.log(`ArchiveUnit ${_archiveUnit.getAttribute("id")} est un dossier.`);
                    const archiveUnit = {
                        id: _archiveUnit.getAttribute("id"),
                        DataObjectGroupReferenceId: null,
                        DescriptionLevel: getNodeTextContent(Array.from(_archiveUnit.getElementsByTagName("DescriptionLevel"))),
                        Title: getNodeTextContent(Array.from(_archiveUnit.getElementsByTagName("Title")))
                    };
                    archiveUnits.push(archiveUnit);
                }
            }
            function isFile(archiveUnit) {
                const dataObjectReferenceElements = archiveUnit.getElementsByTagName("DataObjectReference");
                for (let i = 0; i < dataObjectReferenceElements.length; i++) {
                    if (dataObjectReferenceElements[i].parentNode === archiveUnit) {
                        return true;
                    }
                }
                return false;
            }
            const dataObjectGroupsElement = doc.documentElement.getElementsByTagName('DataObjectPackage') || [];
            const dataObjectGroups = getManifestDataObjectGroupsArray(Array.from(dataObjectGroupsElement));
            const SIPData = { generalInfos, archiveUnits, dataObjectGroups };
            resolve(SIPData);
        });
    });
};
