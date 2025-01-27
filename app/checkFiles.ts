import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';

export const checkFiles = async (filePath: fs.PathOrFileDescriptor, expectedRoot: string) => {
    return new Promise((resolve, reject) => {
        // Lire le fichier XML
        fs.readFile(filePath, 'utf8', (err, xml) => {
            if (err) {
                reject(new Error('Erreur lors de la lecture du fichier : ' + err));
                return;
            }

            const doc = new DOMParser().parseFromString(xml, "text/xml");
            const rootElement = doc.documentElement;

            // Vérifier si le nom de l'élément racine correspond à celui attendu
            if (rootElement && rootElement.nodeName === expectedRoot) {
                // Vérifier si l'attribut xmlns a la valeur attendue
                const xmlnsValue = rootElement.getAttribute('xmlns');
                if (xmlnsValue === 'fr:gouv:culture:archivesdefrance:seda:v2.1' || xmlnsValue === 'fr:gouv:culture:archivesdefrance:seda:v2.2') {
                    resolve(true); // La racine et l'attribut sont corrects
                } else {
                    resolve(false); // L'attribut xmlns est incorrect
                }
            } else {
                resolve(false); // La racine est incorrecte
            }
        });
    });
};
