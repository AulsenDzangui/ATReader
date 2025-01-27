// errorController.js
import multer from 'multer';

export const handleServerError = (err:any, req:any, res:any, next:any) => {
  console.error(err.stack) // Log l'erreur pour le débogage
  req.flash('error', "Une erreur de serveur s\'est produite. Veuillez réessayer.");
  // res.status(500).send('Une erreur de serveur s\'est produite')
  res.status(500).redirect('/')
}

export const handleNotFound = (req:any, res:any, next:any) => {
  res.status(404).send('404 - Page introuvable')
  // res.status(404).render('404', { title: '404 - Page introuvable' })
}

// Erreur csrf
export const handleBadRequest = (err:any, req:any, res:any, next:any) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // Gérer ici l'erreur CSRF
  // Par exemple, vous pouvez renvoyer une réponse avec un statut 403
  res.status(403)
  res.send('La validation du formulaire a échoué')
}

export const multerHandleError = (err:any, req:any, res:any, next:any) => {
  if (err instanceof multer.MulterError) {
      // Une erreur de Multer est survenue
      req.flash('error', "Une erreur de téléchargement s'est produite : " + err.message);
      console.error(err);
      return res.status(500).redirect('/');
  } else if (err) {
      // Une autre erreur est survenue
      req.flash('error', "Une erreur de téléchargement s'est produite : " + err.message);
      console.error(err);
      return res.status(500).redirect('/');
  }
  next();
};
