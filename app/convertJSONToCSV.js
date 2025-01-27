import { parse } from 'json2csv';
import fs from 'fs';
import path from 'path';
// Path
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const convertToCSVandDowload = (req, res) => {
    const data = req.session.data;
    const jsonData = data;
    const csv = parse(jsonData);
    const filePath = path.join(__dirname, 'data.csv');
    // Écrire le fichier CSV sur le serveur
    fs.writeFileSync(filePath, csv);
    // Envoyer le fichier CSV en réponse
    res.download(filePath, 'data.csv', (err) => {
        if (err) {
            console.error('Erreur lors du téléchargement du fichier:', err);
            res.status(500).send('Erreur lors du téléchargement du fichier.');
        }
        // Optionnel : Supprimer le fichier après le téléchargement
        fs.unlinkSync(filePath);
    });
};
