/**
 * Decision Trackr privacy policy at /decision-trackr/privacy
 *
 * Static code route. This page is not a Sanity document, so publishing
 * it does not depend on a CMS edit. next-sitemap includes the route
 * from the build output; it is not excluded in next-sitemap.config.js.
 */
import type { Metadata } from "next";
import { Section } from "@/components/section";

export const metadata: Metadata = {
  title: "Decision Trackr privacy policy",
  description:
    "Privacy policy for Decision Trackr, a Figma and FigJam plugin. What stays in your Figma file, what is stored on your device, and what is sent to Google Analytics.",
  alternates: {
    canonical: "https://nicharalambous.com/decision-trackr/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "Decision Trackr privacy policy | Nic Haralambous",
    description:
      "Privacy policy for Decision Trackr, a Figma and FigJam plugin. What stays in your Figma file, what is stored on your device, and what is sent to Google Analytics.",
    url: "https://nicharalambous.com/decision-trackr/privacy",
  },
};

export default function DecisionTrackrPrivacyPage() {
  return (
    <div className="page-bg">
      <Section as="article" width="content">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Decision Trackr privacy policy
          </h1>
          <p className="mt-3 text-sm text-brand-600">
            Last updated: 31 October 2026
          </p>
        </header>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            This policy applies to versions of the plugin published from 31
            October 2026.
          </p>
          <p>
            Decision Trackr is a Figma and FigJam plugin. It lets a person log
            a design decision against a selected layer, and it writes a
            Decision History page into that file.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">Who we are</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            The data controller is Nic Haralambous, trading as One Guy Can,
            Netherlands, KVK 99703424.
          </p>
          <p>
            Contact:{" "}
            <a
              href="mailto:nic@nharry.com"
              className="text-accent-600 hover:underline"
            >
              nic@nharry.com
            </a>
            .
          </p>
          <p>
            The plugin does not create a Decision Trackr account. It has no
            server of its own, and it does not include a support inbox.
            Questions about this policy go to the email address above.
          </p>
          <p>
            The only third party is Google Analytics 4 (property
            G-D2DV9DRM33). Google Analytics 4 is the processor for the usage
            events described below.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">
          Data stored in the Figma file
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            When you log a decision, the plugin stores it in the Figma file.
            It stores the decision as plugin data, and it also writes a page
            named Decision History.
          </p>
          <p>Each record in the plugin data contains:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>the layer&rsquo;s Figma node id</li>
            <li>the layer path (the page name and the layer names)</li>
            <li>the title, details, and decision-maker names you typed</li>
            <li>
              the date and time, as DD/MM/YYYY and HH:MM, from the
              editor&rsquo;s clock
            </li>
            <li>a version number, and earlier versions of that same record</li>
          </ul>
          <p>
            The Decision History page contains the same titles, details, maker
            names, dates, and layer names, as ordinary text layers. Anyone who
            can open the file can read that page.
          </p>
          <p>
            Other plugins cannot read this plugin data. It is private to
            plugin id 1432332696794120370. Figma&rsquo;s own documentation says
            plugin data is not a security boundary: a person with the file can
            try to decode it from a .fig export. See{" "}
            <a
              href="https://developers.figma.com/docs/plugins/api/properties/nodes-setplugindata/"
              className="text-accent-600 hover:underline"
            >
              setPluginData
            </a>
            .
          </p>
          <p>
            The plugin does not send this file content to a Decision Trackr
            server. The fields above are not included in analytics events.
            Maker names are whatever you type. The plugin does not ask for
            your age or for an email address.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">
          Data stored on your device
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            The plugin uses <code className="font-mono text-sm">figma.clientStorage</code>,
            which{" "}
            <a
              href="https://developers.figma.com/docs/plugins/api/figma-clientStorage/"
              className="text-accent-600 hover:underline"
            >
              Figma documents
            </a>{" "}
            as storage on your machine for this plugin id. It is not in the
            file, and it is not synced to other people.
          </p>
          <p>That device storage holds:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              a random 32-character fallback id, used only if Figma did not
              provide <code className="font-mono text-sm">figma.currentUser.id</code>
            </li>
            <li>
              a small retry queue of analytics events that failed to send.
              Each item has the event name, the parameters described below,
              and a timestamp. The queue holds at most 100 events.
            </li>
          </ul>
          <p>
            If the plugin finds a queue stored in an older format, it deletes
            that queue. The older queue may contain titles, names, layer
            paths, and node ids. The plugin writes a warning to the Figma
            console that a previous queue was cleared. It does not print the
            queue. If that deletion fails, the plugin sends no analytics
            requests for that session.
          </p>
          <p>
            Clearing the browser cache can delete this device storage. Figma
            documents that.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">
          Data sent to Google Analytics
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            When analytics is on, the plugin sends usage events to the Google
            Analytics 4 Measurement Protocol at{" "}
            <a
              href="https://www.google-analytics.com/mp/collect"
              className="break-all text-accent-600 hover:underline"
            >
              https://www.google-analytics.com/mp/collect
            </a>
            . The measurement id, G-D2DV9DRM33, is a public identifier.
          </p>
          <p>
            An API secret is included so Google will accept the event. That
            secret is not information about you, and it is not set out in this
            policy. If the secret is missing, the plugin sends nothing.
          </p>
          <p>
            Network access is limited to www.google-analytics.com. The plugin
            manifest allows requests only to https://www.google-analytics.com.
            The plugin interface loads the plugin script and no third-party
            script. It talks to the plugin sandbox only with{" "}
            <code className="font-mono text-sm">postMessage</code>.
          </p>
          <p>
            The plugin reads <code className="font-mono text-sm">figma.currentUser.id</code>{" "}
            (the <code className="font-mono text-sm">currentuser</code>{" "}
            permission). It does not read your name, photo, or email address.
            The user id is not sent raw. It is sent only as a salted SHA-256
            hash, which is pseudonymous.
          </p>
          <p>
            <code className="font-mono text-sm">client_id</code> and{" "}
            <code className="font-mono text-sm">user_id</code> on the request
            are the same SHA-256 hex digest of this string:
          </p>
          <p className="break-all font-mono text-sm text-brand-900">
            decision-tracker:1432332696794120370:
          </p>
          <p>followed by the Figma user id.</p>
          <p>
            The salt is that fixed prefix. It is in the plugin source, and it
            is not a secret. Anyone who already knows a Figma user id can
            recompute the digest. The hash is a stable pseudonymous identifier
            for that Figma user. It is not the raw id.
          </p>
          <p>
            If there is no user id, the random fallback id from device storage
            is hashed in the same way, with the same prefix.
          </p>

          <h3 className="pt-2 text-xl font-semibold text-brand-900">
            Events we send
          </h3>
          <p>
            These are usage events with no decision content. They do not
            include titles, details, maker names, layer names, or node ids.
          </p>
          <dl className="space-y-4">
            <div>
              <dt className="font-mono text-sm font-semibold text-brand-900">
                figma_plugin_opened
              </dt>
              <dd>
                <code className="font-mono text-sm">editorType</code> (
                <code className="font-mono text-sm">figma.editorType</code>)
              </dd>
            </div>
            <div>
              <dt className="font-mono text-sm font-semibold text-brand-900">
                figma_plugin_closed
              </dt>
              <dd>
                <code className="font-mono text-sm">editorType</code>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-sm font-semibold text-brand-900">
                ui_decision_logged
              </dt>
              <dd>
                <code className="font-mono text-sm">version</code> (an
                integer), <code className="font-mono text-sm">titleLength</code>,{" "}
                <code className="font-mono text-sm">detailsLength</code>,{" "}
                <code className="font-mono text-sm">makersCount</code>,{" "}
                <code className="font-mono text-sm">editorType</code>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-sm font-semibold text-brand-900">
                ui_decision_selected
              </dt>
              <dd>
                <code className="font-mono text-sm">editorType</code>
              </dd>
            </div>
          </dl>
          <p>
            <code className="font-mono text-sm">titleLength</code> and{" "}
            <code className="font-mono text-sm">detailsLength</code> are
            JavaScript string lengths, not the text.{" "}
            <code className="font-mono text-sm">makersCount</code> is how many
            non-empty names were typed, not the names.{" "}
            <code className="font-mono text-sm">editorType</code> distinguishes
            the editor the plugin was opened in. The plugin can run in Figma
            Design and FigJam.
          </p>
          <p>
            These are not sent: the decision title, details, maker names,
            layer names, node id, layer path, or the raw Figma user id.{" "}
            <code className="font-mono text-sm">figma_element_selected</code>{" "}
            and{" "}
            <code className="font-mono text-sm">figma_element_deselected</code>{" "}
            are not sent. Selecting a layer still passes the node id and the
            layer path into the plugin interface. That message stays inside
            Figma.
          </p>
          <p>
            If a send fails, the plugin tries again up to three times, after 1
            second, then 2 seconds, then 4 seconds. It then writes the event
            to the retry queue on your device. A later session that can reach
            Google sends that queue to the same address, with the same hashed
            id. The plugin will not send a queue that is not in the current
            format.
          </p>
          <p>
            The plugin does not put an IP address in the event body. The
            request is an HTTPS POST to Google, so Google receives the
            connection. What Google stores about that connection is
            Google&rsquo;s setting.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">
          When analytics is off
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            A development version does not send analytics. In that version,
            tracking is off and the analytics secret is empty, so the plugin
            returns before it makes a request.
          </p>
          <p>
            If the analytics secret is missing, the plugin logs a console
            warning and sends nothing.
          </p>
          <p>
            Event details are written to the console only in development, and
            only in the local Figma console. Those details are the limited
            parameters above, not the decision text.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">
          What we do not do
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            The plugin does not sell personal data. Decision Trackr does not
            use it for advertising. It does not send it to any domain other
            than www.google-analytics.com.
          </p>
          <p>
            The plugin code does not write a cookie. This policy does not say
            that Google sets no cookies.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">
          How long data is kept
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            Decisions stay in the Figma file until they are deleted. That
            includes someone deleting them, replacing the plugin data, or
            deleting the file. The plugin has no separate retention job.
          </p>
          <p>
            The hashed id stays the same for as long as the Figma user id and
            the salt stay the same. The random fallback id stays in device
            storage until that storage is cleared.
          </p>
          <p>
            Google Analytics retention is as configured in Google Analytics,
            see Google&rsquo;s policy:{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-accent-600 hover:underline"
            >
              https://policies.google.com/privacy
            </a>
            .
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">Children</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            The plugin is not directed at children. A person can type any name
            into Decision makers. That text is stored in the Figma file, as
            described above, and is not sent to Google Analytics. Only the
            count of names is sent.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">Your choices</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-brand-700">
          <li>
            Logging a decision is optional. If you do not log one, the plugin
            does not write decision text into the file.
          </li>
          <li>
            A version prepared without the analytics secret sends no
            analytics.
          </li>
          <li>A development version sends no analytics.</li>
          <li>
            Removing the plugin from a file does not, by itself, delete plugin
            data already written there. Deleting the Decision History page
            removes the visible page. The plugin data in the file is separate.
          </li>
          <li>
            To ask about this policy, write to{" "}
            <a
              href="mailto:nic@nharry.com"
              className="text-accent-600 hover:underline"
            >
              nic@nharry.com
            </a>
            . There is no account in the plugin to delete.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-brand-900">Your rights</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-700">
          <p>
            Under the GDPR you can ask for access, ask for deletion, or
            object, by writing to{" "}
            <a
              href="mailto:nic@nharry.com"
              className="text-accent-600 hover:underline"
            >
              nic@nharry.com
            </a>
            . You can also complain to the Dutch Autoriteit Persoonsgegevens
            (
            <a
              href="https://www.autoriteitpersoonsgegevens.nl/"
              className="text-accent-600 hover:underline"
            >
              autoriteitpersoonsgegevens.nl
            </a>
            ).
          </p>
          <p>
            These rights are not buttons in the plugin. For the text stored in
            a Figma file, the file&rsquo;s owner controls that file. For events
            already sent to Google, the request has to go to{" "}
            <a
              href="mailto:nic@nharry.com"
              className="text-accent-600 hover:underline"
            >
              nic@nharry.com
            </a>{" "}
            and, where it applies, to Google.
          </p>
        </div>
      </Section>
    </div>
  );
}
