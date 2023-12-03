import {waitAllRequests} from '@demo-cypress/support/helpers/wait-requests.util';
import {stubExternalIcons} from '@demo-cypress/support/stubs/stub-external-icons.util';
import {stubMetrics} from '@demo-cypress/support/stubs/stub-metrics';

const NEXT_URL_STORAGE_KEY = `env`;
const REPEATED_SLASH_REG = /\/\//g;

interface TuiVisitOptions {
    clock?: Date | null;
    enableNightMode?: boolean;
    headers?: Record<string, string>;
    hideCursor?: boolean;
    hideGetHelpLinks?: boolean;
    hideHeader?: boolean;
    hideLanguageSwitcher?: boolean;
    hideNavigation?: boolean;
    hideScrollbar?: boolean;
    hideVersionManager?: boolean;
    /**
     * Cypress runs all tests within an iframe.
     * Sometimes our app can behave differently if it runs under iframe or not (see util {@link isInsideIframe}).
     * This parameter can help to falsify result of {@link isInsideIframe} for certain test run.
     */
    inIframe?: boolean;
    noSmoothScroll?: boolean;
    /**
     * WARNING: this flag does not provide fully emulation of touch mobile device.
     * Cypress can't do it (https://docs.cypress.io/faq/questions/general-questions-faq#Do-you-support-native-mobile-apps).
     * But you can control token `TUI_IS_MOBILE` by this flag.
     */
    pseudoMobile?: boolean;
    rootSelector?: string;
    skipDecodingUrl?: boolean;
    skipExpectUrl?: boolean;
    waitAllIcons?: boolean;
    waitRenderedFont?: RegExp;
}

const setBeforeLoadOptions = (
    win: Window,
    {inIframe}: Pick<Required<TuiVisitOptions>, 'inIframe'>,
): void => {
    if (!inIframe) {
        // @ts-ignore window.parent is readonly property
        // eslint-disable-next-line @typescript-eslint/dot-notation
        win[`parent`] = win;
    }
};

const MOBILE_USER_AGENT = `Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1`;

export function tuiVisit(path: string, options: TuiVisitOptions = {}): void {
    const {
        inIframe = true,
        waitAllIcons = true,
        enableNightMode = false,
        hideCursor = true,
        hideScrollbar = true,
        hideHeader = true,
        skipExpectUrl = false,
        skipDecodingUrl = false,
        hideNavigation = true,
        hideVersionManager = true,
        hideLanguageSwitcher = true,
        hideGetHelpLinks = true,
        headers = {},
        pseudoMobile = false,
        waitRenderedFont,
        clock = Date.UTC(2018, 10, 1),
        rootSelector = `app`,
    } = options;

    if (clock) {
        cy.clock(clock, [`Date`]);
    }

    stubExternalIcons();
    stubMetrics();

    const encodedPath = skipDecodingUrl
        ? path
        : encodeURI(
              decodeURIComponent(path), // @note: prevent twice encoding
          );

    // eslint-disable-next-line no-restricted-syntax
    Cypress.on(`uncaught:exception`, () => false);

    cy.visit(`/`, {
        headers,
        onBeforeLoad: window => {
            if (headers[`userAgent`]) {
                Object.defineProperty(window.navigator, `userAgent`, {
                    value: headers[`userAgent`],
                });
            }

            const baseHref =
                window.document.baseURI.replace(`${window.location.origin}/`, ``) ?? `/`;
            const nextUrl = `/${baseHref}${encodedPath}`.replace(REPEATED_SLASH_REG, `/`);

            setBeforeLoadOptions(window, {inIframe});

            window.localStorage.setItem(NEXT_URL_STORAGE_KEY, nextUrl);
            window.localStorage.setItem(`tuiNight`, enableNightMode.toString());

            if (pseudoMobile) {
                Object.defineProperty(window.navigator, `userAgent`, {
                    value: MOBILE_USER_AGENT,
                });
            }
        },
    }).then(() => {
        if (skipExpectUrl) {
            cy.tuiWaitBeforeScreenshot();
        } else {
            cy.url().should(`include`, encodedPath);
        }
    });

    if (waitAllIcons) {
        cy.intercept(`*.svg`).as(`icons`);
    }

    cy.window().should(`have.property`, `Cypress`);

    cy.clearLocalStorage(NEXT_URL_STORAGE_KEY);

    cy.document().its(`fonts.size`).should(`be.greaterThan`, 0);
    cy.document().its(`fonts.status`).should(`equal`, `loaded`);
    cy.document()
        // https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready
        // The promise will only resolve once the document has completed loading fonts,
        // layout operations are completed, and no further font loads are needed.
        .then(document => (document as any)?.fonts.ready)
        .then(() => cy.log(`Font loading completed`));

    if (waitRenderedFont) {
        cy.get(`body`, {log: false})
            .should(`have.css`, `font-family`)
            .and(`match`, waitRenderedFont);
    }

    if (waitAllIcons) {
        waitAllRequests(`@icons`);
    }

    cy.get(`${rootSelector}._is-cypress-mode`).as(`app`);

    if (hideCursor) {
        cy.get(`@app`).invoke(`addClass`, `_hide-cursor`);
    }

    if (hideScrollbar) {
        cy.get(`@app`).invoke(`addClass`, `_hide-scrollbar`);
    }

    cy.get(rootSelector).should(`have.class`, `_loaded`);

    if (hideHeader) {
        cy.tuiHide(`[tuidocheader]`);
    }

    if (hideNavigation) {
        cy.tuiHide(`.tui-doc-navigation`);
    }

    if (hideVersionManager) {
        cy.tuiHide(`version-manager`);
    }

    if (hideLanguageSwitcher) {
        cy.tuiHide(`tui-language-switcher`);
    }

    if (hideGetHelpLinks) {
        cy.tuiHide(`community-links`);
    }
}
