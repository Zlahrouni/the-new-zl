import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
declare global {
    interface Window {
        PayPal: never; // Replace `any` with the correct type if known
    }
}
// Variables de module pour suivre l'état du script PayPal et du bouton
let paypalScriptLoaded: boolean = false;
let paypalButtonInitialized: boolean = false;

const PayPalDonateButton: React.FC = () => {
    const { language } = useLanguage();

    useEffect(() => {
        // Vider le conteneur pour éviter les doublons
        const donateButtonContainer = document.getElementById('donate-button');
        if (donateButtonContainer) {
            donateButtonContainer.innerHTML = "";
        }

        // Vérifier si le script PayPal est déjà présent
        const paypalScriptId = 'paypal-donate-sdk';
        let paypalScript = document.getElementById(paypalScriptId) as HTMLScriptElement | null;

        // Fonction qui initialise le bouton PayPal
        const initializeButton = () => {
            // Si le bouton a déjà été initialisé, vider le conteneur pour mettre à jour la langue
            if (paypalButtonInitialized && donateButtonContainer) {
                donateButtonContainer.innerHTML = "";
            }

            // Vérifier si le SDK PayPal est disponible
            if (typeof window.PayPal  !== 'undefined') {
                // Créer un script d'initialisation pour le bouton
                const buttonScript = document.createElement('script') as HTMLScriptElement;
                buttonScript.id = 'paypal-button-init';
                buttonScript.innerHTML = `
          PayPal.Donation.Button({
            env: 'production',
            hosted_button_id: '2JWN6FDDMYSBU',
            image: {
              src: 'https://www.paypalobjects.com/en_US/FR/i/btn/btn_donateCC_LG.gif',
              alt: '${language === 'en' ? 'Donate with PayPal button' : 'Faire un don avec PayPal'}',
              title: '${language === 'en' ? 'PayPal - The safer, easier way to pay online!' : 'PayPal - Un moyen plus sûr et plus simple de payer en ligne !'}',
            }
          }).render('#donate-button');
        `;

                // Supprimer l'ancien script d'initialisation s'il existe
                const oldButtonScript = document.getElementById('paypal-button-init');
                if (oldButtonScript) {
                    document.body.removeChild(oldButtonScript);
                }

                document.body.appendChild(buttonScript);
                paypalButtonInitialized = true;
            } else {
                // Réessayer dans 100ms si le SDK n'est pas encore chargé
                setTimeout(initializeButton, 100);
            }
        };

        // Si le script PayPal n'est pas déjà présent, le créer et l'ajouter
        if (!paypalScript) {
            paypalScript = document.createElement('script') as HTMLScriptElement;
            paypalScript.id = paypalScriptId;
            paypalScript.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
            paypalScript.charset = 'UTF-8';
            paypalScript.async = true;

            paypalScript.onload = () => {
                paypalScriptLoaded = true;
                initializeButton();
            };

            document.body.appendChild(paypalScript);
        } else {
            // Si le script existe déjà, initialiser directement le bouton
            if (paypalScriptLoaded) {
                initializeButton();
            }
        }
    }, [language]);

    return (
        <div id="donate-button-container">
            <div id="donate-button"></div>
        </div>
    );
};

export default PayPalDonateButton;
