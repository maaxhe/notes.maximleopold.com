import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface AnnotationsOverviewOptions {
  limit?: number
}

const defaultOptions: AnnotationsOverviewOptions = {
  limit: 50,
}

export default ((opts?: Partial<AnnotationsOverviewOptions>) => {
  const options: AnnotationsOverviewOptions = { ...defaultOptions, ...opts }

  const AnnotationsOverview: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "annotations-overview")}>
        <div class="annotations-header">
          <a href="/" class="back-button" title="Zurück zur Startseite">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Zurück
          </a>
          <h1>Alle Annotationen</h1>
        </div>

        <p class="annotations-description">
          Alle Annotationen auf dieser Website sind in der Hypothesis-Gruppe{" "}
          <strong>CIMEC Auditory Cortex</strong> organisiert.
        </p>

        <div class="annotations-group-links">
          <a
            href="https://hypothes.is/groups/7DzYpr4y/cimec-auditory-cortex"
            target="_blank"
            rel="noopener noreferrer"
            class="group-link primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Alle Annotationen in Hypothesis ansehen
          </a>
        </div>

        <div class="hypothesis-embed-container">
          <h2>Neueste Annotationen</h2>
          <iframe
            src="https://hypothes.is/stream?q=group:7DzYpr4y"
            class="hypothesis-stream"
            title="Hypothesis Annotations Stream"
          ></iframe>
        </div>

        <div class="usage-instructions">
          <h3>Wie funktioniert's?</h3>
          <ol>
            <li>Markiere Text auf einer beliebigen Seite</li>
            <li>
              Klicke auf "Annotate" im Hypothesis-Popup (erscheint automatisch beim Markieren)
            </li>
            <li>
              Wähle die Gruppe <strong>"CIMEC Auditory Cortex"</strong> aus
            </li>
            <li>Schreibe deinen Kommentar und klicke auf "Post to CIMEC Auditory Cortex"</li>
          </ol>
          <p class="note">
            💡 Alle Annotationen in dieser Gruppe sind öffentlich und werden hier angezeigt.
          </p>
        </div>
      </div>
    )
  }

  AnnotationsOverview.css = `
    .annotations-overview {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .annotations-header {
      position: relative;
      margin-bottom: 2rem;
    }

    .annotations-header h1 {
      margin: 0.5rem 0;
      font-size: 2.5rem;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      background: var(--lightgray);
      color: var(--darkgray);
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .back-button:hover {
      background: var(--secondary);
      color: white;
      transform: translateX(-4px);
    }

    .back-button svg {
      width: 18px;
      height: 18px;
    }

    .annotations-description {
      color: var(--gray);
      margin-bottom: 2rem;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .annotations-group-links {
      margin: 2rem 0;
    }

    .group-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: var(--secondary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .group-link:hover {
      background: var(--tertiary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .group-link svg {
      width: 20px;
      height: 20px;
    }

    .hypothesis-embed-container {
      margin: 3rem 0;
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      overflow: hidden;
    }

    .hypothesis-embed-container h2 {
      margin: 0;
      padding: 1.5rem;
      background: var(--lightgray);
      border-bottom: 1px solid var(--gray);
      font-size: 1.5rem;
    }

    .hypothesis-stream {
      width: 100%;
      height: 800px;
      border: none;
      display: block;
    }

    .usage-instructions {
      margin: 3rem 0;
      padding: 2rem;
      background: var(--highlight);
      border-left: 4px solid var(--secondary);
      border-radius: 8px;
    }

    .usage-instructions h3 {
      margin-top: 0;
      color: var(--secondary);
      font-size: 1.3rem;
    }

    .usage-instructions ol {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
    }

    .usage-instructions li {
      margin: 0.75rem 0;
      line-height: 1.6;
      font-size: 1rem;
    }

    .usage-instructions strong {
      color: var(--secondary);
    }

    .usage-instructions .note {
      margin: 1.5rem 0 0 0;
      padding: 1rem;
      background: var(--light);
      border-radius: 6px;
      font-size: 0.95rem;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .annotations-overview {
        padding: 1rem 0.5rem;
      }

      .annotations-header h1 {
        font-size: 2rem;
      }

      .hypothesis-stream {
        height: 600px;
      }

      .usage-instructions {
        padding: 1.5rem;
      }
    }
  `

  return AnnotationsOverview
}) satisfies QuartzComponentConstructor
