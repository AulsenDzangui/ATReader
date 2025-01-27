import fs from 'fs/promises';

// Fonction pour supprimer les fichiers après un délai
export const deleteFilesAfterDelay = (filename: string, delay: number) => {
    if (!filename) {
        console.error("Le nom du fichier est indéfini. Aucune suppression effectuée.");
        return; // Sortir de la fonction si le nom du fichier est indéfini
    }

    setTimeout(async () => {
        const filePath = 'uploads/' + filename;
        try {
            await fs.unlink(filePath);
            console.log(`Fichier ${filename} supprimé après ${delay / 1000} secondes`);
        } catch (error) {
            console.error("Erreur lors de la suppression du fichier :", error);
        }
    }, delay);
};

// Fonction de nettoyage périodique
export const cleanUpOldFiles = async () => {
    try {
        const files = await fs.readdir('uploads');
        for (const file of files) {
            const filePath = 'uploads/' + file;
            const stats = await fs.stat(filePath);
            const now = Date.now();
            // const expirationTime = 24 * 60 * 60 * 1000; // 24 heures
            const expirationTime = 10 * 1000; // 10 secondes

            if (now - stats.mtimeMs > expirationTime) {
                await fs.unlink(filePath);
                console.log(`Fichier ${file} supprimé après expiration.`);
            }
        }
    } catch (error) {
        console.error("Erreur lors du nettoyage des fichiers :", error);
    }
};
