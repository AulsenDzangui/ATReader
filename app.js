/**
 * Module dependencies.
 */
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path';
import favicon from 'serve-favicon';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import nunjucks from 'nunjucks';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { convertToCSVandDowload } from './app/convertJSONToCSV.js';
import * as errorController from './app/errorController.js';
import { analyzer } from './app/analyzer.js';
import { deleteFilesAfterDelay, cleanUpOldFiles } from './app/deleteFilesAfterDelay.js';
import { getObject } from './app/getObject.js';
const app = express();
// Lancer le nettoyage périodique toutes les heures
// setInterval(cleanUpOldFiles, 60 * 60 * 1000); // Vérifier toutes les heures
setInterval(cleanUpOldFiles, 1000); // Vérifier toutes les secondes
// Configuration
nunjucks.configure(__dirname + '/views', {
    autoescape: true,
    express: app,
});
dotenv.config();
// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');
// Configuration de la session
const sessionStore = new session.MemoryStore();
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
    rolling: true
}));
// Configuration de connect-flash
app.use(flash());
// routing
app.get('/', (req, res) => {
    res.render('index', {
        messages: {
            notification: req.flash('notification'),
            error: req.flash('error')
        }
    });
});
app.get('/mentions-legales', (req, res) => {
    res.render('legals');
});
app.get('/a-propos', (req, res) => {
    res.render('about');
});
app.post('/analyse', analyzer);
app.get('/object/:DataObjectGroupReferenceId/:ArchiveUnitId', getObject);
// Route pour effacer les données de session
app.post('/reset', (req, res) => {
    req.flash('notification', "Vos données ont bien été effacées !");
    const userFiles = req.session.userFiles;
    userFiles === null || userFiles === void 0 ? void 0 : userFiles.forEach((file) => {
        if (file) {
            deleteFilesAfterDelay(file, 1000);
        }
    });
    res.redirect('/');
});
// Fonction pour convertir JSON en CSV et envoyer le fichier
app.get('/download-csv', convertToCSVandDowload);
// Gestion de la session
app.use((req, res, next) => {
    if (!req.session) {
        req.session.error = "Votre session a expiré.";
        return res.status(401).send('Votre session a expiré.');
    }
    next(); // Si la session est active, continuez
});
// Routes d'erreur
app.use(errorController.handleServerError);
app.use(errorController.handleNotFound);
app.use(errorController.multerHandleError);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
