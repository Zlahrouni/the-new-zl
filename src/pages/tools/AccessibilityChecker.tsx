import { useState, useRef, useEffect } from 'react';
import { validateRGAAImages, AccessibilityIssue, getRGAAImageCriteria } from './AccessibilityChecker/service/RGAAImageValidator.ts';

const RGAAChecker: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Fichier trop volumineux. La taille maximale est de 5 Mo.');
      return;
    }

    // Check file type
    if (!file.type.includes('html') && !file.name.endsWith('.html')) {
      setError('Type de fichier non pris en charge. Veuillez téléverser un fichier HTML.');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setHtmlInput(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  // Analyze HTML for image accessibility issues
  const analyzeHtml = () => {
    if (!htmlInput.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setIssues([]);

    try {
      // Create a document parser to analyze the HTML
      const parser = new DOMParser();
      parser.parseFromString(htmlInput, 'text/html'); // Vérifier que le HTML est valide

      setTimeout(() => {
        try {
          // Utiliser le validateur RGAA pour les images
          const imageIssues = validateRGAAImages(htmlInput);
          setIssues(imageIssues);
          setIsAnalyzing(false);
          setHasAnalyzed(true);
          setSuccess(true);
        } catch (error) {
          console.error("Erreur lors de l'analyse:", error);
          setError('Erreur lors de l\'analyse du HTML. Veuillez vérifier votre code et réessayer.');
          setIsAnalyzing(false);
        }
      }, 1500); // Simuler un temps de traitement pour une meilleure expérience utilisateur
    } catch (e) {
      console.error(e);
      setError('Erreur lors de l\'analyse du HTML. Veuillez vérifier votre code et réessayer.');
      setIsAnalyzing(false);
    }
  };

  // Clear results and form
  const handleClearResults = () => {
    setHtmlInput('');
    setFileName('');
    setIssues([]);
    setHasAnalyzed(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Copy code to clipboard
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Obtenir la classe de couleur basée sur l'impact
  const getImpactColorClass = (impact: 'critique' | 'majeur' | 'mineur'): string => {
    switch (impact) {
      case 'critique':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'majeur':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'mineur':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Download report as HTML
  const handleDownloadReport = () => {
    // Récupérer le compte précis des problèmes par impact
    const issueTypes = {
      critique: issues.filter(issue => issue.impact === 'critique').length,
      majeur: issues.filter(issue => issue.impact === 'majeur').length,
      mineur: issues.filter(issue => issue.impact === 'mineur').length
    };

    const fileNameText = fileName ? `pour ${fileName}` : '';

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport d'accessibilité RGAA des images ${fileNameText}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          header {
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
          }
          h1 {
            margin-top: 0;
            color: #2563eb;
          }
          .summary {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
          }
          .stat {
            padding: 15px;
            border-radius: 8px;
            flex: 1;
          }
          .critical {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          .major {
            background-color: #ffedd5;
            color: #c2410c;
          }
          .minor {
            background-color: #fef3c7;
            color: #b45309;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f9fafb;
          }
          .issue-critique { background-color: #fee2e2; }
          .issue-majeur { background-color: #ffedd5; }
          .issue-mineur { background-color: #fef3c7; }
          code {
            display: block;
            padding: 10px;
            background-color: #f1f5f9;
            border-radius: 4px;
            white-space: pre-wrap;
            font-family: monospace;
            margin-top: 5px;
          }
          footer {
            margin-top: 40px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
            color: #666;
            font-size: 0.9em;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Rapport d'audit d'accessibilité RGAA - Images</h1>
            ${fileName ? `<p>Fichier analysé: <strong>${fileName}</strong></p>` : ''}
            <p>Date: ${new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</p>
          </header>
          
          <h2>Résumé</h2>
          <div class="summary">
            <div class="stat critical">
              <h3>Problèmes Critiques</h3>
              <p>${issueTypes.critique}</p>
            </div>
            <div class="stat major">
              <h3>Problèmes Majeurs</h3>
              <p>${issueTypes.majeur}</p>
            </div>
            <div class="stat minor">
              <h3>Problèmes Mineurs</h3>
              <p>${issueTypes.mineur}</p>
            </div>
          </div>
          
          <h2>Problèmes détaillés</h2>
          ${issues.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Élément</th>
                  <th>Ligne</th>
                  <th>Problème</th>
                  <th>Critère RGAA</th>
                  <th>Recommandation</th>
                </tr>
              </thead>
              <tbody>
                ${issues.map(issue => `
                  <tr class="issue-${issue.impact}">
                    <td>${issue.element}</td>
                    <td>${issue.line}</td>
                    <td>${issue.issue}</td>
                    <td>${issue.criterionNumber} - ${issue.criterion}</td>
                    <td>
                      ${issue.recommendation}
                      <code>${issue.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p>Aucun problème d\'accessibilité n\'a été trouvé pour les images.</p>'}
          
          <h2>Critères RGAA pour les images</h2>
          <p>Les critères suivants du RGAA (Référentiel Général d'Amélioration de l'Accessibilité) ont été évalués :</p>
          <ul>
            ${rgaaCriteria.map(criterion => `
              <li><strong>${criterion.number} - ${criterion.title}:</strong> ${criterion.description}</li>
            `).join('')}
          </ul>
          
          <footer>
            <p>Ce rapport a été généré via <a href="https://ziadlahrouni.com/tools/checker" target="_blank">ziadlahrouni.com/tools/checker</a>. RGAA Version: 4.1</p>
          </footer>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-accessibilite-images${fileName ? '-' + fileName.replace(/\.[^/.]+$/, '') : ''}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Count issues by impact
  const issueCount = {
    total: issues.length,
    critical: issues.filter(issue => issue.impact === 'critique').length,
    major: issues.filter(issue => issue.impact === 'majeur').length,
    minor: issues.filter(issue => issue.impact === 'mineur').length
  };

  // Regrouper les problèmes par critère pour la navigation
  const issuesByCriterion = issues.reduce((acc, issue) => {
    const key = issue.criterionNumber;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, AccessibilityIssue[]>);

  // Récupérer les critères RGAA pour l'affichage
  const rgaaCriteria = getRGAAImageCriteria();

  const renderResults = () => {
    if (!hasAnalyzed) return null;

    return (
        <div className="mt-10 border-t dark:border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              Résultats de l'audit d'accessibilité des images
            </h2>
            <div className="flex gap-3">
              <button
                  onClick={handleClearResults}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                Effacer les résultats
              </button>
              {issues.length > 0 && (
                  <button
                      onClick={handleDownloadReport}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Télécharger le rapport
                  </button>
              )}
            </div>
          </div>

          {issues.length > 0 ? (
              <>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-6">
                  <p className="font-medium dark:text-white mb-3">
                    {`${issueCount.total} problèmes d'accessibilité d'image trouvés :`}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100 rounded-lg">
                      {`Problèmes critiques : ${issueCount.critical}`}
                    </div>
                    <div className="p-3 bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-100 rounded-lg">
                      {`Problèmes majeurs : ${issueCount.major}`}
                    </div>
                    <div className="p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100 rounded-lg">
                      {`Problèmes mineurs : ${issueCount.minor}`}
                    </div>
                  </div>
                </div>

                {/* Navigation par critère */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium dark:text-white mb-3">Navigation par critère</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(issuesByCriterion).sort().map(criterionNumber => (
                        <a
                            key={criterionNumber}
                            href={`#criterion-${criterionNumber}`}
                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          {criterionNumber} ({issuesByCriterion[criterionNumber].length})
                        </a>
                    ))}
                  </div>
                </div>

                {/* Résultats groupés par critère */}
                {Object.keys(issuesByCriterion).sort().map(criterionNumber => (
                    <div key={criterionNumber} className="mb-8" id={`criterion-${criterionNumber}`}>
                      <h3 className="text-lg font-medium dark:text-white mb-3 border-b dark:border-gray-700 pb-2">
                        Critère {criterionNumber} - {issuesByCriterion[criterionNumber][0].criterion}
                      </h3>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="p-3 text-left text-gray-600 dark:text-gray-300 font-medium">Type de problème</th>
                            <th className="p-3 text-left text-gray-600 dark:text-gray-300 font-medium">Élément</th>
                            <th className="p-3 text-left text-gray-600 dark:text-gray-300 font-medium">Ligne</th>
                            <th className="p-3 text-left text-gray-600 dark:text-gray-300 font-medium">Recommandation</th>
                            <th className="p-3 text-left text-gray-600 dark:text-gray-300 font-medium">Code problématique</th>
                          </tr>
                          </thead>
                          <tbody>
                          {issuesByCriterion[criterionNumber].map(issue => (
                              <tr key={issue.id} className="border-b dark:border-gray-700">
                                <td className="p-3">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${getImpactColorClass(issue.impact)}`}>
                              {issue.impact}
                            </span>
                                </td>
                                <td className="p-3 font-mono text-sm dark:text-gray-300">{issue.element}</td>
                                <td className="p-3 dark:text-gray-300">{issue.line}</td>
                                <td className="p-3 dark:text-gray-300">{issue.recommendation}</td>
                                <td className="p-3">
                                  <div className="relative">
                              <pre className="font-mono text-xs bg-gray-100 dark:bg-gray-100 p-2 rounded overflow-x-auto max-w-xs">
                                {issue.code.length > 50 ? `${issue.code.substring(0, 47)}...` : issue.code}
                              </pre>
                                    <button
                                        onClick={() => handleCopyCode(issue.id, issue.code)}
                                        className="absolute top-1 right-1 text-xs bg-white dark:bg-blue-400 px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      {copiedId === issue.id ? 'Copié !' : 'Copier'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                ))}
              </>
          ) : (
              <div className="p-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 text-center rounded-lg">
                Aucun problème d'accessibilité d'image trouvé !
              </div>
          )}

          {/* Informations sur RGAA */}
          <div className="mt-10 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-3">
              À propos du RGAA (Référentiel Général d'Amélioration de l'Accessibilité)
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Quelques exemples de critères RGAA vérifiés dans cette analyse :
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {rgaaCriteria.slice(0, 4).map(criterion => (
                  <div key={criterion.id} className="border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="font-medium text-blue-700 dark:text-blue-300">
                      {criterion.number} - {criterion.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {criterion.description}
                    </div>
                  </div>
              ))}
            </div>
            <div className="text-center">
              <p className="mb-3 text-gray-700 dark:text-gray-300">
                Voir plus de critères et comprendre comment améliorer l'accessibilité de votre site :
              </p>
              <a
                  href="https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Consulter toutes les règles RGAA
              </a>
            </div>
          </div>
        </div>
    );
  };

  return (
      <main className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20 bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Bandeau d'information sur la langue */}
          <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-600">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                <span className="font-bold">FR :</span> Cet outil est uniquement disponible en français.
              </p>
            </div>
            <div className="flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 opacity-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                <span className="font-bold">EN :</span> This tool is only available in French.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center dark:text-white">
              Vérificateur d'Accessibilité RGAA - Images
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Vérifiez l'accessibilité des images de votre code HTML selon les règles RGAA 4.1
            </p>

            {/* Input Section */}
            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Pour l'instant, cet outil vérifie uniquement les critères d'accessibilité liés aux images selon le
                  <strong> Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1)</strong>. D'autres critères seront ajoutés au fur et à mesure.
                </p>
              </div>
              <label className="block mb-2 font-medium dark:text-gray-300">
                Collez votre code HTML
              </label>
              <textarea
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="<div><img src='image.jpg' alt='Description de mon image'></div>"
                  rows={8}
                  className="w-full p-3 border rounded-md font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />

              <div className="mt-4 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 mx-3">ou</span>
              </div>

              <div className="mt-4">
                <label className="block mb-2 font-medium dark:text-gray-300">
                  Téléverser un fichier HTML
                </label>
                <div className="flex items-center gap-3">
                  <input
                      type="file"
                      accept=".html"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      className="hidden"
                  />
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Choisir un fichier
                  </button>
                  {fileName && (
                      <span className="text-gray-600 dark:text-gray-300 text-sm flex-1 truncate">
                    {fileName}
                  </span>
                  )}
                </div>
              </div>

              {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 rounded-lg">
                    {error}
                  </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                    onClick={analyzeHtml}
                    disabled={!htmlInput.trim() || isAnalyzing}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                        !htmlInput.trim() || isAnalyzing
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {isAnalyzing ? 'Analyse en cours...' : 'Vérifier l\'accessibilité des images'}
                </button>
              </div>

              {success && (
                  <div className="mt-4 p-3 flex items-center justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Analyse terminée avec succès !
                  </div>
              )}
            </div>

            {/* Résultats */}
            {renderResults()}
          </div>
        </div>
      </main>
  );
};

export default RGAAChecker;