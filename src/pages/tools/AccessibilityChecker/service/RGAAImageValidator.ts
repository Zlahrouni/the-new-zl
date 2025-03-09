/**
 * Validateur d'accessibilité des images selon les critères RGAA 4.1
 * Ce module utilise le fichier JSON RGAA existant pour valider les images
 */
import rgaaData from '../../../../assets/db/tools-data/rgaa-criteres-images.json';

// Types pour les problèmes d'accessibilité
export interface AccessibilityIssue {
    id: string;
    element: string;
    line: number;
    column: number;
    criterion: string;
    criterionNumber: string;
    issue: string;
    impact: 'critique' | 'majeur' | 'mineur';
    recommendation: string;
    code: string;
}

// Interface pour le format du JSON RGAA
export interface RGAACriterion {
    id: string;
    number: string;
    title: string;
    description: string;
    tests: string[];
    references: {
        wcag: string;
        techniques?: string; // Rendre techniques optionnel pour éviter l'erreur de typage
    };
    cas_particuliers?: string;
    notes?: string;
}

// Cache des critères d'image pour améliorer les performances
const imageRGAACriteria = rgaaData.rgaaCriteria.filter(
    criterion => criterion.number.startsWith('1.')
);

/**
 * Obtient les détails d'un critère RGAA par son numéro
 */
const getRGAACriterionDetails = (criterionNumber: string): RGAACriterion | undefined => {
    return imageRGAACriteria.find(criterion => criterion.number === criterionNumber);
};

/**
 * Obtient la position (ligne et colonne) d'un élément dans le code HTML
 */
const getElementPosition = (html: string, element: string): { line: number; column: number } => {
    const lines = html.split('\n');
    const elementLower = element.toLowerCase();

    for (let i = 0; i < lines.length; i++) {
        const index = lines[i].toLowerCase().indexOf(elementLower);
        if (index !== -1) {
            return { line: i + 1, column: index + 1 };
        }
    }

    return { line: 1, column: 1 };
};

/**
 * Crée un problème d'accessibilité avec les informations du critère RGAA
 */
const createRGAAIssue = (
    id: string,
    element: string,
    line: number,
    column: number,
    criterionNumber: string,
    issue: string,
    impact: 'critique' | 'majeur' | 'mineur',
    recommendation: string,
    code: string
): AccessibilityIssue => {
    const criterionDetails = getRGAACriterionDetails(criterionNumber);

    return {
        id,
        element,
        line,
        column,
        criterion: criterionDetails?.title || `Critère RGAA ${criterionNumber}`,
        criterionNumber,
        issue,
        impact,
        recommendation,
        code
    };
};

/**
 * Critère RGAA 1.1 - Chaque image porteuse d'information a-t-elle une alternative textuelle ?
 */
export const checkRGAAImageAlternatives = (document: Document, htmlSource: string): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Vérification des images avec balise <img>
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        const alt = img.getAttribute('alt');

        if (alt === null) {
            const element = img.outerHTML.split('>')[0] + '>';
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `img-alt-missing-${index}`,
                'img',
                line,
                column,
                '1.1',
                "L'image ne possède pas d'alternative textuelle",
                'critique',
                "Ajouter un attribut alt à l'image décrivant son contenu ou sa fonction. Si l'image est décorative, utiliser alt=\"\".",
                element
            ));
        }
    });

    // Vérification des images vectorielles SVG
    const svgs = document.querySelectorAll('svg[role="img"]');
    svgs.forEach((svg, index) => {
        const hasTitle = svg.querySelector('title');
        const hasAriaLabel = svg.hasAttribute('aria-label');
        const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
            const element = svg.outerHTML.slice(0, 100) + (svg.outerHTML.length > 100 ? '...' : '');
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `svg-alt-missing-${index}`,
                'svg',
                line,
                column,
                '1.1',
                "L'image vectorielle (SVG) avec role=\"img\" ne possède pas d'alternative textuelle",
                'critique',
                "Ajouter un élément <title>, un attribut aria-label ou aria-labelledby à l'élément SVG.",
                element
            ));
        }
    });

    // Vérification des zones réactives
    const areas = document.querySelectorAll('area[href]');
    areas.forEach((area, index) => {
        const alt = area.getAttribute('alt');

        if (alt === null) {
            const element = area.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `area-alt-missing-${index}`,
                'area',
                line,
                column,
                '1.1',
                "La zone réactive ne possède pas d'alternative textuelle",
                'critique',
                "Ajouter un attribut alt à la balise <area> décrivant la destination du lien.",
                element
            ));
        }
    });

    // Vérification des boutons images
    const inputImages = document.querySelectorAll('input[type="image"]');
    inputImages.forEach((input, index) => {
        const alt = input.getAttribute('alt');

        if (alt === null) {
            const element = input.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `input-image-alt-missing-${index}`,
                'input type="image"',
                line,
                column,
                '1.1',
                "Le bouton image ne possède pas d'alternative textuelle",
                'critique',
                "Ajouter un attribut alt au bouton image décrivant sa fonction.",
                element
            ));
        }
    });

    return issues;
};

/**
 * Critère RGAA 1.2 - Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ?
 */
export const checkRGAADecorativeImages = (document: Document, htmlSource: string): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Vérification des images décoratives (avec alt="")
    const images = document.querySelectorAll('img[alt=""]');
    images.forEach((img, index) => {
        // Vérifier si l'image est correctement ignorée
        const hasAriaRole = img.hasAttribute('role');
        const ariaRole = img.getAttribute('role');

        if (!hasAriaRole || (ariaRole !== 'presentation' && ariaRole !== 'none')) {
            const element = img.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `img-decorative-${index}`,
                'img',
                line,
                column,
                '1.2',
                "L'image avec alt=\"\" n'a pas role=\"presentation\" ou role=\"none\"",
                'mineur',
                "Ajouter l'attribut role=\"presentation\" ou role=\"none\" à l'image décorative pour garantir qu'elle soit ignorée par les technologies d'assistance.",
                element
            ));
        }
    });

    return issues;
};

/**
 * Critère RGAA 1.3 - Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente ?
 */
export const checkRGAARelevantAlternatives = (document: Document, htmlSource: string): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Vérification des alternatives trop courtes ou génériques
    const images = document.querySelectorAll('img[alt]:not([alt=""])');
    images.forEach((img, index) => {
        const alt = img.getAttribute('alt') || '';

        // Vérifier les alternatives trop courtes (moins de 3 caractères)
        if (alt.length < 3) {
            const element = img.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `img-alt-too-short-${index}`,
                'img',
                line,
                column,
                '1.3',
                "L'alternative textuelle est trop courte pour être pertinente",
                'majeur',
                "Fournir une alternative textuelle plus descriptive qui exprime le contenu et la fonction de l'image.",
                element
            ));
        }

        // Vérifier les alternatives génériques
        const genericAlts = ['image', 'photo', 'picture', 'img', 'photo', 'icon', 'icône', 'logo'];
        if (genericAlts.some(term => alt.toLowerCase() === term.toLowerCase())) {
            const element = img.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `img-alt-generic-${index}`,
                'img',
                line,
                column,
                '1.3',
                "L'alternative textuelle est générique et ne décrit pas le contenu spécifique de l'image",
                'majeur',
                "Remplacer l'alternative générique par une description spécifique du contenu et de la fonction de l'image.",
                element
            ));
        }

        // Vérifier si l'alternative contient des extensions de fichier ou des chemins
        if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(alt) || alt.includes('/')) {
            const element = img.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `img-alt-filename-${index}`,
                'img',
                line,
                column,
                '1.3',
                "L'alternative textuelle contient un nom de fichier ou un chemin",
                'majeur',
                "Remplacer le nom de fichier par une description du contenu de l'image.",
                element
            ));
        }
    });

    return issues;
};

/**
 * Critère RGAA 1.8 - Chaque image texte porteuse d'information doit si possible être remplacée par du texte stylé
 */
export const checkRGAATextImages = (document: Document, htmlSource: string): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Tentative de détection d'images contenant du texte
    const images = document.querySelectorAll('img[alt]');
    images.forEach((img, index) => {
        const alt = img.getAttribute('alt') || '';
        const src = img.getAttribute('src') || '';
        const filename = src.split('/').pop() || '';

        // Indices qu'une image pourrait contenir du texte
        const textIndicatorsInAlt = [
            /titre/i, /heading/i, /text/i, /texte/i, /slogan/i, /citation/i, /quote/i,
            /paragraphe/i, /paragraph/i, /phrase/i, /sentence/i
        ];

        const textIndicatorsInFilename = [
            /text/i, /texte/i, /titre/i, /heading/i, /title/i, /banner/i, /header/i,
            /slogan/i, /quote/i, /citation/i, /typo/i
        ];

        // Si l'alt ou le nom de fichier suggère du texte dans l'image
        if (textIndicatorsInAlt.some(regex => regex.test(alt)) ||
            textIndicatorsInFilename.some(regex => regex.test(filename))) {
            const element = img.outerHTML;
            const { line, column } = getElementPosition(htmlSource, element);

            issues.push(createRGAAIssue(
                `img-text-${index}`,
                'img',
                line,
                column,
                '1.8',
                "Image susceptible de contenir du texte",
                'mineur',
                "Si possible, remplacer cette image contenant du texte par du texte réel stylé avec CSS. Les images de texte compliquent la personnalisation et l'adaptation pour les utilisateurs.",
                element
            ));
        }
    });

    return issues;
};

/**
 * Critère RGAA 1.9 - Chaque légende d'image est-elle, si nécessaire, correctement reliée à l'image correspondante ?
 */
export const checkRGAAImageCaptions = (document: Document, htmlSource: string): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];

    // Vérification des figures avec figcaption
    const figures = document.querySelectorAll('figure');
    figures.forEach((figure, index) => {
        const hasImage = figure.querySelector('img, svg, canvas');
        const figcaption = figure.querySelector('figcaption');

        // Figure avec image mais sans attribut d'accessibilité
        if (hasImage && figcaption) {
            const hasRoleGroup = figure.getAttribute('role') === 'group';
            const hasAriaLabel = figure.hasAttribute('aria-label') || figure.hasAttribute('aria-labelledby');

            if (!hasRoleGroup && !hasAriaLabel) {
                const element = figure.outerHTML.slice(0, 100) + (figure.outerHTML.length > 100 ? '...' : '');
                const { line, column } = getElementPosition(htmlSource, element);

                issues.push(createRGAAIssue(
                    `figure-no-role-${index}`,
                    'figure',
                    line,
                    column,
                    '1.9',
                    "Figure sans role=\"group\"",
                    'mineur',
                    "Ajouter role=\"group\" à l'élément figure pour garantir que la légende soit correctement associée à l'image pour les technologies d'assistance.",
                    element
                ));
            }
        }
    });

    return issues;
};

/**
 * Fonction principale qui vérifie toutes les règles RGAA relatives aux images
 * Optimisée pour la performance et la consommation mémoire
 */
export const validateRGAAImages = (htmlSource: string): AccessibilityIssue[] => {
    try {
        // Parser le HTML en document DOM
        const parser = new DOMParser();
        const document = parser.parseFromString(htmlSource, 'text/html');

        // Effectuer toutes les vérifications
        const issues: AccessibilityIssue[] = [];

        // Enchaîner les vérifications et ajouter directement au tableau issues
        issues.push(...checkRGAAImageAlternatives(document, htmlSource));
        issues.push(...checkRGAADecorativeImages(document, htmlSource));
        issues.push(...checkRGAARelevantAlternatives(document, htmlSource));
        issues.push(...checkRGAATextImages(document, htmlSource));
        issues.push(...checkRGAAImageCaptions(document, htmlSource));

        return issues;
    } catch (error) {
        console.error("Erreur lors de l'analyse RGAA des images:", error);
        return [];
    }
}

/**
 * Fonction pour obtenir tous les critères d'image RGAA
 */
export const getRGAAImageCriteria = (): RGAACriterion[] => {
    return imageRGAACriteria;
};