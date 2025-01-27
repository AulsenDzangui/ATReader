
// Bouton copyText
function copyToClipboard(text: string) {
    navigator
        .clipboard
        .writeText(text)
        .then(() => {
            console.log(text);
        })
        .catch(err => {
            console.error('Erreur lors de la copie : ', err);
        });
}

function changeImageSource(button: HTMLButtonElement) {
    const img = button.querySelector('img');

    if (img) {
        const originalSrc = img.src;
        img.src = './images/done_icon.svg';

        // Remet la source d'origine après un délai de 2 secondes
        setTimeout(() => {
            img.src = originalSrc;
        }, 2000);
    }
}

// Gliser déposer des fichiers
const fileDropArea = document.getElementById('fileDropArea');
const fileInput = (<HTMLInputElement>document.getElementById('files'));
const fileList = document.getElementById('fileList');
const invitationDiv = document.getElementById('invitation');

function handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 2) {
        alert("Vous ne pouvez déposer que 2 fichiers maximum.");
        return;
    } else if (files && files.length < 2) {
        alert("Veuillez déposer l'ATR et le manifeste en même temps.");
        return;
    }

    updateFileList(files);
}

function handleDragOver(event: DragEvent) {
    event.preventDefault();
}

function updateFileList(files: FileList | { name: any; size: number }[] | undefined) {
    if (files) {
        if (fileList && invitationDiv) {
            fileList.innerHTML = '';
            const sizeInKoItemO = Math.round(files[0].size / 1000);
            const sizeInKoItem1 = Math.round(files[1]?.size / 1000);

            invitationDiv.innerHTML =
                `<ul id="fileList" class="text-base text-white pl-5 flex flex-col space-y-2">
            <li>
                <span>${files[0].name}</span>
                <span>| ${sizeInKoItemO} ko</span>
            </li>
            <li>
                <span>${files[1]?.name}</span> 
                <span>| ${sizeInKoItem1} ko</span>
            </li>
        </ul>`;
        }
    }
}

fileDropArea?.addEventListener('click', () => fileInput?.click());

fileInput?.addEventListener('change', (event: any) => {
    const files = event.target?.files;
    if (files.length > 2) {
        alert("Vous ne pouvez sélectionner que 2 fichiers maximum.");
        fileInput.value = '';
        if (fileList) fileList.innerHTML = '';
    } else if (files.length < 2) {
        alert("Veuillez déposer l'ATR et le manifeste en même temps.");
        return;
    }
    else {
        updateFileList(files);
    }
});

document.getElementById('resetButton')?.addEventListener('click', () => {
    fetch('/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Erreur lors de la réinitialisation de la session.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        });
});

// Tooltip du bouton copier d'un élément spécifique
const items = document.querySelectorAll('.item-info');
items.forEach((item) => {
    const copyButton = (<HTMLButtonElement>item.lastElementChild); // Récupère le dernier enfant (le bouton de copie)

    item.addEventListener('mouseover', function () {
        copyButton.style.display = "block"; // Affiche le bouton de copie
    });

    item.addEventListener('mouseout', function () {
        copyButton.style.display = "none"; // Masque le bouton de copie
    });
});


function renderObject(DataObjectGroupReferenceId: any, ArchiveUnitId: any) {
    try {
        // Vérification des paramètres d'entrée
        if (!DataObjectGroupReferenceId) {
            throw new Error("La référence au groupe d'objet technique est indisponible.");
        }

        if (!ArchiveUnitId) {
            throw new Error("La référence à l'unité archivistique est indisponible.");
        }

        const url = `/object/${DataObjectGroupReferenceId}/${ArchiveUnitId}`;

        // Utilisation de fetch pour récupérer les données
        fetch(url)
            .then(async response => {
                // Vérification si la réponse est correcte (status 200-299)
                if (!response.ok) {
                    const errorData = await response.text(); // Lire la réponse comme du texte
                    throw new Error(errorData); // Lancer une erreur avec les détails
                }

                // Vérification du type de contenu
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    // Conversion de la réponse en JSON
                    return response.json();
                } else {
                    const errorData = await response.text(); // Lire la réponse comme du texte
                    throw new Error(`Type de contenu inattendu: ${contentType}. Réponse: ${errorData}`);
                }
            })
            .then(data => {
                // Traitement des données récupérées
                renderObjectView(data);
            })
            .catch(error => {
                // Gestion des erreurs
                handleFetchError(error);
            });
    } catch (error) {
        // Gérer les erreurs de validation des paramètres
        handleFetchError(error);
    }
}

// Fonction pour gérer les erreurs
function handleFetchError(error: any) {
    let errorMessage;

    try {
        // Analyser le message d'erreur
        const errorDetails = JSON.parse(error.message);
        errorMessage = errorDetails.error || 'Une erreur inconnue est survenue.';

        if (errorDetails.code === 'SESSION_EXPIRED') {
            console.error('Erreur de session:', errorMessage);
            window.location.href = '/';
        } else {
            console.error('Erreur:', errorMessage);
        }
    } catch (parseError) {
        // Si l'analyse échoue, afficher un message d'erreur générique
        console.error('Erreur:', error.message);
    }
}

function renderObjectView(data: import("./types").Data) {
    const parentElement = document.getElementById('modals');

    if (parentElement) {
        const { atr, sip } = data;

        const showTitle = atr.object.LogBook.length > 0;

        const logBookTemplate = `
        ${showTitle ? '<h4 class="text-lg font-bold mt-2 mb-2">Journal de bord (LogBook)</h4>' : ''}
        <ul class="list-disc pl-5 space-y-3">
            ${atr.object.LogBook.map((log: { EventType: string; Outcome: string; OutcomeDetailMessage: string; }, index: number) => `
                <li class="overflow-auto custom-scrollbar">
                    <strong>Type d'évènement : </strong>
                    <span>${log.EventType || 'Non spécifié'}</span>
                    <br>
                    <strong>Résultat de l'événement : </strong>
                    <span>${log.Outcome || 'Non spécifié'}</span>
                    <br>
                    <strong>Message complet de description du résultat : </strong>
                    <span>${log.OutcomeDetailMessage || 'Aucun détail disponible'}</span>
                    <br>
                </li>
                ${index < atr.object.LogBook.length - 1 ? '<hr>' : ''}
            `).join('')}
        </ul>`;

        function getParagraph(key: string, value: string) {
            const safeValue = value !== undefined ? value : '<i>Donnée absente</i>';

            return (
                `<p class="overflow-auto custom-scrollbar">
                    <strong>${key} : </strong>
                    <span>${safeValue}</span>
                </p>`
            );
        }

        const markup = `
        <div class="w3-modal-content rounded-md overflow-hidden shadow w-96">
            <div class="flex justify-between items-center shadow-md">
                <button onclick="copyToClipboard(document.getElementById('item-details-content-10').innerText); changeImageSource(this);" class="py-2 px-4 copy-text-button tooltip" data-title="Copier les données">
                    <img class="h-6 w-6 copy-text-icon" src="./images/copy_icon.svg" alt="Copy text icon">
                </button>
                <button onclick="closeDiv(this)" class="py-2 px-4">
                    <img class="h-4 w-4 tooltip" src="./images/close_icon.svg" alt="Close window" data-title="Fermer la fenêtre">
                </button>
            </div>
            <div class="px-4 py-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                <div id="item-details-content-10" class="mt-5">
                    <h3 class="text-xl font-bold mb-2">${sip.archiveUnit.Title}</h3>
                    ${getParagraph('ID', sip.archiveUnit.id)}
                    ${getParagraph('Niveau de description', sip.archiveUnit.DescriptionLevel)}
                    ${getParagraph('Identifiant système ', atr.archiveUnit.SystemId)}
                    ${getParagraph("Version de l'objet", sip.object.binaryDataObject.DataObjectVersion)}
                    ${getParagraph("Taille", sip.object.binaryDataObject.Size)}                   
                    ${getParagraph("Uri", sip.object.binaryDataObject.Uri)}
                    ${getParagraph("Dernière modification", sip.object.binaryDataObject.FileInfo.LastModified)}
                    ${getParagraph("Empreinte", sip.object.binaryDataObject.MessageDigest)}
                    ${getParagraph("Algorithme", sip.object.binaryDataObject.Algorithm)}
                    ${getParagraph("Nom du format", sip.object.binaryDataObject.FormatIdentification.FormatLitteral)}
                    ${getParagraph("Type mime", sip.object.binaryDataObject.FormatIdentification.MimeType)}
                    ${getParagraph("Identifiant du format", sip.object.binaryDataObject.FormatIdentification.FormatId)}
                    ${logBookTemplate}
                </div>
            </div>
        </div>
    `;
        parentElement.innerHTML = '';
        parentElement.classList.add('flex');
        parentElement.insertAdjacentHTML('beforeend', markup);
    }
}

function closeDiv(button: HTMLButtonElement) {
    // Cible l'élément parent de la div
    if (button && button.parentElement && button.parentElement.parentElement) {
        {
            button.parentElement.parentElement.style.display = 'none';
            document.getElementById('modals')?.classList.remove('flex');
        }
    }
}