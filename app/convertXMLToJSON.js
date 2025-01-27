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
import xml2js from 'xml2js';
const parser = new xml2js.Parser();
export const convertXMLToJSON = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        // Lire le fichier XML
        fs.readFile(filePath, 'utf8', (err, xml) => {
            if (err) {
                reject(new Error('Erreur lors de la lecture du fichier : ' + err));
                return;
            }
            // Convertir le XML en JSON
            parser.parseString(xml, (err, result) => {
                if (err) {
                    reject(new Error('Erreur lors de la conversion XML en JSON : ' + err));
                }
                else {
                    resolve(result);
                }
            });
        });
    });
});
