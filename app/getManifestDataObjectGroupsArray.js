/**
* Impléméntation pour récupérer l'ensemble des groupes d'objets binaires et les données suivantes : GroupId, BinaryId, Uri, MessageDigest et attribut algorithm, Size, FormatIdentification/FormatLitteral, FormatIdentification/ MimeType, FormatIdentification/FormatId, FileInfo/Filename, FileInfo/LastModified
*
*/
import { getNodeTextContent, getSubElementsList } from "./processNodes.js";
export const getManifestDataObjectGroupsArray = (dataObjectPackageElement) => {
    var _a, _b;
    const dataObjectGroups = [];
    for (let i = 0; i < dataObjectPackageElement.length; i++) {
        const dataObjectGroup = dataObjectPackageElement[i];
        const binaryDataObjectsElement = dataObjectGroup.getElementsByTagName('BinaryDataObject');
        let binarydataObjectOBJ; // Tableaux des objets binaires au sein de chaque groupe d'objets
        for (let k = 0; k < binaryDataObjectsElement.length; k++) {
            const binaryDataObject = binaryDataObjectsElement[k];
            const dataObjectGroupId = (_a = binaryDataObject.getElementsByTagName('DataObjectGroupId')[0]) === null || _a === void 0 ? void 0 : _a.textContent;
            const dataObjectGroupIdAttribute = (_b = binaryDataObject.parentNode) === null || _b === void 0 ? void 0 : _b.getAttribute('id');
            const binaryDataObjectId = binaryDataObject.getAttribute('id');
            const dataObjectVersionElement = binaryDataObject.getElementsByTagName('DataObjectVersion');
            const uriElement = binaryDataObject.getElementsByTagName('Uri');
            const messageDigestElement = binaryDataObject.getElementsByTagName('MessageDigest');
            const sizeElement = dataObjectGroup.getElementsByTagName('Size');
            const formatLitteralElement = binaryDataObject.getElementsByTagName('FormatLitteral');
            const mimeTypeElement = binaryDataObject.getElementsByTagName('MimeType');
            const FormatIdElement = binaryDataObject.getElementsByTagName('FormatId');
            const filenameElement = binaryDataObject.getElementsByTagName('Filename');
            const lastModifiedElement = binaryDataObject.getElementsByTagName('LastModified');
            const messageDigestAlgorithm = getSubElementsList(messageDigestElement);
            const dataObjectVersion = getNodeTextContent(dataObjectVersionElement);
            const uri = getNodeTextContent(uriElement);
            const messageDigest = getNodeTextContent(messageDigestElement);
            const size = getNodeTextContent(sizeElement);
            const formatLitteral = getNodeTextContent(formatLitteralElement);
            const mimeType = getNodeTextContent(mimeTypeElement);
            const formatId = getNodeTextContent(FormatIdElement);
            const filename = getNodeTextContent(filenameElement);
            const lastModified = getNodeTextContent(lastModifiedElement);
            // Création de l'objet de l'objet binaire
            const _binarydataObjectOBJ = {
                id: binaryDataObjectId,
                DataObjectVersion: dataObjectVersion,
                Uri: uri,
                MessageDigest: messageDigest,
                Algorithm: messageDigestAlgorithm,
                Size: size,
                FormatIdentification: {
                    FormatLitteral: formatLitteral,
                    MimeType: mimeType,
                    FormatId: formatId,
                },
                FileInfo: {
                    Filename: filename,
                    LastModified: lastModified
                }
            };
            // Création de l'objet du groupe d'objet technique
            binarydataObjectOBJ = {
                id: dataObjectGroupId || dataObjectGroupIdAttribute,
                binaryDataObject: _binarydataObjectOBJ
            };
            dataObjectGroups.push(binarydataObjectOBJ);
        }
    }
    return dataObjectGroups;
};
