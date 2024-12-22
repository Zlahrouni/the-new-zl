import {
  githubDarkIcon,
  githubIcon,
  handimanagementCertificate,
  jsCertificate,
  linkedInIcon,
  logoCompanieros,
  logoMeta
} from "../assets/images.ts";

export const translations = {
    navbar: {
      en: {
        home: 'Home',
        cv: 'CV',
        projects: 'Projects'
      },
      fr: {
        home: 'Accueil',
        cv: 'CV',
        projects: 'Projets'
      }
    },
    comingSoon: {
      en: {
        title: 'Website Under Improvement',
        description: 'Stay tuned for an exciting update!',
        cvButton: 'View My CV',
        socialConnect: 'Connect with Me'
      },
      fr: {
        title: 'Site Web en Amélioration',
        description: 'Restez à l\'écoute pour une mise à jour passionnante !',
        cvButton: 'Voir mon CV',
        socialConnect: 'Connectez-vous avec moi'
      }
    },
    cv: {
      en: {
        title: 'My Professional CV',
        summary: 'Full Stack Developer, specialized in Angular & Spring Boot development',
        skills: 'Skills',
        experience: 'Experience',
        personalInfo: {
          name: 'Ziad LAHROUNI',
          links: [
            {
              name: 'Github', link: 'github.com/zlahrouni', logo: githubIcon
            },
            {
              name: 'Linkedin', link: 'linkedin/zlahrouni', logo: linkedInIcon
            }
          ]
        },
        sections: {
          labels: {
            title: 'Labels & Certifications',
            items: [
              {
                title: "Companieros - Label Handimanagement",
                date: "Dec 2024",
                skills: "Integration strategies, Diversity and disability",
                id: null,
                link: "https://www.companieros.com/handimanagement/"
              },
              {
                title: "Meta - Programming with JavaScript",
                date: "Nov 2023",
                skills: "Test-Driven Development, Object-Oriented Programming (OOP)",
                id: "Credential ID W84G89KRB33M",
                link: "https://coursera.org/verify/W84G89KRB33M"
              },
            ]
          },
          skills: {
            title: 'Skills',
            categories: {
              speakingLanguages: 'Speaking Languages',
              programmingLanguages: 'Programming Languages',
              qualityCompliance: 'Quality & Compliance',
              webTechnologies: 'Web Technologies',
              frameworksLibraries: 'Frameworks & Libraries',
              databases: 'Databases',
              devOpsTools: 'DevOps & Tools',
              methodologiesPractices: 'Methodologies & Practices',
              softSkills: 'Soft Skills'
            },
            items: {
              speakingLanguages: ['French', 'English'],
              programmingLanguages: ['Java', 'JavaScript', 'TypeScript', 'Python', 'C++', 'C', 'SQL'],
              qualityCompliance: ['Accessibility (RGAA)', 'Web Performance Optimization', 'Security Best Practices', 'Cross-Browser Compatibility'],
              webTechnologies: ['HTML5', 'CSS3', 'SASS/SCSS', 'RESTful APIs', 'GraphQL'],
              frameworksLibraries: ['Spring Boot', 'Angular', 'React', 'Vue.js', 'Express.js', 'Django'],
              databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
              devOpsTools: ['Git', 'Docker', 'Jenkins', 'Kubernetes', 'AWS', 'Azure'],
              methodologiesPractices: ['Agile/Scrum', 'TDD', 'CI/CD', 'Microservices Architecture'],
              softSkills: ['Team Collaboration', 'Problem Solving', 'Communication', 'Project Management']
            }
          },
          education: {
            title: 'Education',
            items: [
              {
                institution: 'Efrei, Paris',
                degree: 'Full Stack Dev Manager',
                period: 'September 2023 - August 2025',
                details: ['Full Stack Development', 'Management', 'AI', 'DevOps']
              },
              {
                institution: 'University of Western Brittany, Brest',
                degree: 'Bachelor\'s Degree in Application Engineering and Development (Year 3)',
                period: 'September 2022 - July 2023',
                details: ['Analysis, Design, and Web and Application Development', 'Algorithms and Data Structures', 'Architecture and Operating Systems']
              },
              {
                institution: 'Campus Ozanam, Lille',
                degree: 'BTS in Digital Systems: Computer Science & Network (Year 3)',
                period: 'September 2020 - July 2023',
                details: ['Design (UML Class Diagrams)', 'Network Programming', 'Object-Oriented Programming']
              },
              {
                institution: 'Harmonie High School, Rabat',
                degree: 'Baccalaureate in Physical Sciences',
                period: 'September 2019 - July 2020',
                details: ['Physics', 'Mathematics', 'Chemistry']
              }
            ]
          },
          experience: {
            title: 'Experience',
            items: [
              {
                company: 'CDC Informatique, Paris',
                role: 'Full Stack Developer',
                period: 'September 2023 - Present',
                responsibilities: [
                  'Design, develop, and test new features with the Dev team.',
                  'Collaborate with business analysts for testing and fixing identified issues.',
                  'Ensure adherence to best development practices and manage technical aspects (environment, version control, refactoring...).',
                  'Continuously monitor technological advancements to improve our processes.'
                ],
                techStack: [
                  { category: 'Frameworks & Languages', items: ['Angular 10+', 'Java', 'Spring Framework'] },
                  { category: 'Infrastructure', items: ['REST', 'Batch', 'PostgreSQL', 'Kafka'] },
                  { category: 'Tools', items: ['Git', 'Maven', 'Eclipse', 'IntelliJ', 'Jenkins', 'Cloudbees', 'Bitbucket', 'Sonar'] }
                ]
              },
              {
                company: 'UNVOID',
                role: 'Mobile Developer (Intern)',
                period: 'April 2023 - July 2023 · 4 months',
                responsibilities: [
                  'Analyze needs and constraints for mobile application and motorized system implementation.',
                  'Develop and test mobile application features using suitable programming languages.',
                  'Ensure compatibility with Android and iOS, overseeing proper functioning on various devices.',
                  'Cooperate with multidisciplinary team for successful system integration.',
                  'Participate in testing and validation phases to guarantee quality, performance, and reliability.'
                ],
                techStack: [
                  { category: 'Frameworks & Languages', items: ['Flutter', 'Python'] },
                  { category: 'Infrastructure', items: ['MQTT', 'SQLite'] },
                  { category: 'Tools', items: ['Git', 'GitHub', 'Figma'] }
                ]
              },
              {
                company: 'Ministry of National Territory Planning, Land Planning, Housing and City Policy, Rabat, Morocco',
                role: 'Developer (Intern)',
                period: 'July 2021 - August 2021 · 2 months',
                responsibilities: [
                  'Improve the security and availability of the Technical Environment department website'
                ],
                tasks: [
                  'Conduct security audit of a website',
                  'Detect vulnerabilities',
                  'Coordinate with different teams involved in the project'
                ],
                techStack: [
                  { category: 'Tools', items: ['Owasp zap', 'Arachni', 'Hyper-v'] }
                ]
              },
              {
                company: 'ADC2I',
                role: 'Web Developer (Intern)',
                period: 'May 2021 - June 2021 · 2 months',
                location: 'Albert, Hauts-de-France, France',
                responsibilities: [
                  'Developed and enhanced a website using Smarty templates, PHP, CSS, and MySQL for the Prestashop CMS',
                  'Led the website redesign process to improve user experience and functionality'
                ],
                techStack: [
                  { category: 'Cms', items: ['Prestashop'] },
                  { category: 'Frameworks & Languages', items: ['PHP', 'MySQL', 'CSS'] },
                  { category: 'Templating', items: ['Smarty'] },
                ]
              }

            ]
          }
        }
      },
      fr: {
        title: 'Mon CV Professionnel',
        summary: 'Développeur full-stack, spécialisé en développement Angular & Spring Boot',
        skills: 'Compétences',
        experience: 'Expérience',
        personalInfo: {
          name: 'Ziad LAHROUNI',
          links: [
            {
              name: 'Github', link: 'github.com/zlahrouni', logo: githubDarkIcon
            },
            {
              name: 'Linkedin', link: 'linkedin/zlahrouni', logo: linkedInIcon
            }
          ]
        },
        sections: {
          labels: {
            title: 'Labels & Certifications',
            items: [
              {
                title: "Companieros - Label Handimanagement",
                date: "Déc 2024",
                skills: "Stratégies d'intégration, Diversité et handicap",
                id: null,
                link: null
              },
              {
                title: "Meta - Programmation avec JavaScript",
                date: "Nov 2023",
                skills: "Développement piloté par les tests, Programmation orientée objet (POO)",
                id: "ID d'identification W84G89KRB33M",
                link: "https://coursera.org/verify/W84G89KRB33M"
              }
            ]
          },
          skills: {
            title: 'Compétences',
            categories: {
              speakingLanguages: "Langue",
              programmingLanguages: 'Langages de Programmation',
              qualityCompliance: 'Qualité & Conformité',
              webTechnologies: 'Technologies Web',
              frameworksLibraries: 'Frameworks & Bibliothèques',
              databases: 'Bases de Données',
              devOpsTools: 'DevOps & Outils',
              methodologiesPractices: 'Méthodologies & Pratiques',
              softSkills: 'Compétences Douces'
            },
            items: {
              speakingLanguages: ['Français', 'Anglais'],
              programmingLanguages: ['Java', 'JavaScript', 'TypeScript', 'Python', 'C++', 'C', 'SQL'],
              qualityCompliance: ['Accessibilité (RGAA)', 'Optimisation des Performances Web', 'Meilleures Pratiques de Sécurité', 'Compatibilité Inter-navigateurs'],
              webTechnologies: ['HTML5', 'CSS3', 'SASS/SCSS', 'APIs RESTful', 'GraphQL'],
              frameworksLibraries: ['Spring Boot', 'Angular', 'React', 'Vue.js', 'Express.js', 'Django'],
              databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
              devOpsTools: ['Git', 'Docker', 'Jenkins', 'Kubernetes', 'AWS', 'Azure'],
              methodologiesPractices: ['Agile/Scrum', 'TDD', 'CI/CD', 'Architecture Microservices'],
              softSkills: ['Collaboration en Équipe', 'Résolution de Problèmes', 'Communication', 'Gestion de Projet']
            }
          },
          education: {
            title: 'Éducation',
            items: [
              {
                institution: 'Efrei, Paris',
                degree: 'Manager en Développement Full Stack',
                period: 'Septembre 2023 - Août 2025',
                details: ['Développement Full Stack', 'Management', 'IA', 'DevOps']
              },
              {
                institution: 'Université de Bretagne Occidentale, Brest',
                degree: 'Licence en Ingénierie et Développement d\'Applications (Année 3)',
                period: 'Septembre 2022 - Juillet 2023',
                details: ['Analyse, Conception, et Développement Web et Applicatif', 'Algorithmes et Structures de Données', 'Architecture et Systèmes d\'Exploitation']
              },
              {
                institution: 'Campus Ozanam, Lille',
                degree: 'BTS en Systèmes Numériques : Informatique & Réseaux (Année 3)',
                period: 'Septembre 2020 - Juillet 2023',
                details: ['Conception (Diagrammes de Classes UML)', 'Programmation Réseau', 'Programmation Orientée Objet']
              },
              {
                institution: 'Lycée Harmonie, Rabat',
                degree: 'Baccalauréat en Sciences Physiques',
                period: 'Septembre 2019 - Juillet 2020',
                details: ['Physique', 'Mathématiques', 'Chimie']
              }
            ]
          },
          experience: {
            title: 'Expérience',
            items: [
              {
                company: 'CDC Informatique, Paris',
                role: 'Développeur Full Stack',
                period: 'Septembre 2023 - Présent',
                responsibilities: [
                  'Concevoir, développer et tester de nouvelles fonctionnalités avec l\'équipe de développement.',
                  'Collaborer avec les analystes métier pour tester et corriger les problèmes identifiés.',
                  'Assurer le respect des meilleures pratiques de développement et gérer les aspects techniques (environnement, contrôle de version, refactoring...).',
                  'Surveiller en continu les avancées technologiques pour améliorer nos processus.'
                ],
                techStack: [
                  { category: 'Languages & Frameworks', items: ['Angular 10+', 'Java', 'Spring Framework'] },
                  { category: 'Infrastructure', items: ['REST', 'Batch', 'PostgreSQL', 'Kafka'] },
                  { category: 'Outils', items: ['Git', 'Maven', 'Eclipse', 'IntelliJ', 'Jenkins', 'Cloudbees', 'Bitbucket', 'Sonar'] }
                ]
              },
              {
                company: 'UNVOID',
                role: 'Developpeur Mobile',
                period: 'Avril 2023 - Juillet 2023 · 4 mois',
                responsibilities: [
                  'Analyser les besoins et les contraintes pour la mise en œuvre d\'une application mobile et d\'un système motorisé.',
                  'Développer et tester les fonctionnalités de l\'application mobile en utilisant des langages de programmation appropriés.',
                  'Assurer la compatibilité avec Android et iOS, en veillant au bon fonctionnement sur divers appareils.',
                  'Collaborer avec une équipe pluridisciplinaire pour une intégration réussie du système.',
                  'Participer aux phases de test et de validation pour garantir la qualité, la performance et la fiabilité.'
                ],
                techStack: [
                  { category: 'Languages & Frameworks', items: ['Flutter', 'Python'] },
                  { category: 'Infrastructure', items: ['MQTT', 'SQLite'] },
                  { category: 'Outils', items: ['Git', 'GitHub', 'Figma'] }
                ]
              },
              {
                company: 'Ministère de l\'Aménagement du Territoire National, de l\'Urbanisme, de l\'Habitat et de la Politique de la Ville, Rabat, Maroc',
                role: 'Developpeur (Stagiaire)',
                period: 'Juillet 2021 - Août 2021 · 2 mois',
                responsibilities: [
                  'Améliorer la sécurité et la disponibilité du site web du département Environnement Technique'
                ],
                tasks: [
                  'Réaliser un audit de sécurité d\'un site web',
                  'Détecter les vulnérabilités',
                  'Coordonner avec les différentes équipes impliquées dans le projet'
                ],
                techStack: [
                  { category: 'Outils', items: ['Owasp zap', 'Arachni', 'Hyper-v'] }
                ]
              },
              {
                company: 'ADC2I',
                role: 'Developpeur web (Stagiaire)',
                period: 'Mai 2021 - Juin 2021 · 2 mois',
                location: 'Albert, Hauts-de-France, France',
                responsibilities: [
                  'Développer et améliorer un site web en utilisant les templates Smarty, PHP, CSS et MySQL pour le CMS Prestashop.',
                  'Superviser la refonte du site afin d\'améliorer l\'expérience utilisateur et la fonctionnalité.'
                ],
                techStack: [
                  { category: 'Cms', items: ['Prestashop'] },
                  { category: 'Frameworks & Languages', items: ['PHP', 'MySQL', 'CSS'] },
                  { category: 'Templating', items: ['Smarty'] },
                ]
              }

            ]
          }
        }
      }
    }
  };

export const labelAssets = {
  companieros: {
    certificate: handimanagementCertificate,
    logo: logoCompanieros
  },
  meta: {
    certificate: jsCertificate,
    logo: logoMeta
  }
};
  
  export const translate = (namespace: keyof typeof translations, key: string, lang: 'en' | 'fr') => {
    return translations[namespace][lang][key];
  };