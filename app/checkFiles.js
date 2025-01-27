var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';
export const checkFiles = (filePath, expectedRoot) => __awaiter(void 0, void 0, void 0, function* () {
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
                }
                else {
                    resolve(false); // L'attribut xmlns est incorrect
                }
            }
            else {
                resolve(false); // La racine est incorrecte
            }
        });
    });
});
