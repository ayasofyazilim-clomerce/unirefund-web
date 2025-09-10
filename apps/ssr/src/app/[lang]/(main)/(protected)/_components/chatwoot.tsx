"use client";
import {Component} from "react";

declare global {
  interface Window {
    chatwootSettings?: {
      hideMessageBubble: boolean;
      baseDomain: string;
      position: string;
      locale: string;
      type: string;
    };
    chatwootSDK: {
      run: (options: {websiteToken: string; baseUrl: string}) => void;
      setCustomAttributes: (attributes: Record<string, string>) => void;
    };
    $chatwoot: {
      setCustomAttributes: (attributes: Record<string, string>) => void;
    };
  }
}

class ChatwootWidget extends Component<{
  baseUrl: string | undefined;
  websiteToken: string | undefined;
  accessToken: string;
  lang: string;
  name: string;
  surname: string;
}> {
  componentDidMount() {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right", // This can be left or right
      locale: "en", // Language to be set
      baseDomain: this.props.baseUrl || "",
      type: "standard", // [standard, expanded_bubble]
    };

    const baseUrl = this.props.baseUrl;
    const websiteToken = this.props.websiteToken;
    const accessToken = this.props.accessToken;
    const lang = this.props.lang;
    const name = this.props.name;
    const surname = this.props.surname;

    // Paste the script from inbox settings except the <script> tag
    (function run(d, t) {
      const g = d.createElement(t) as HTMLScriptElement,
        s = d.getElementsByTagName(t)[0];
      g.src = `${baseUrl}/packs/js/sdk.js`;
      if (s.parentNode) {
        s.parentNode.insertBefore(g, s);
      }
      g.async = !0;
      g.onload = function l() {
        if (!baseUrl || !websiteToken) return;
        window.chatwootSDK.run({
          websiteToken,
          baseUrl,
        });
      };
    })(document, "script");

    window.addEventListener("chatwoot:ready", () => {
      window.$chatwoot.setCustomAttributes({
        accessToken,
        preferredLanguage: lang,
        name,
        surname,
      });
    });
  }

  render() {
    return null;
  }
}

export default ChatwootWidget;
