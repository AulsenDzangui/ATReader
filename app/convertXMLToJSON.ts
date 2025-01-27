import fs from 'fs';
import xml2js from 'xml2js';
const parser = new xml2js.Parser();

export const convertXMLToJSON = async (filePath: fs.PathOrFileDescriptor) => {
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
                } else {
                    resolve(result);
                }
            });
        });
    });
};
