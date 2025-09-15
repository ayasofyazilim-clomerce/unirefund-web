"use client";
import type {Session} from "@repo/utils/auth";
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
      setUser: (id: string, user: Record<string, string>) => void;
    };
  }
}

class ChatwootWidget extends Component<{
  baseUrl: string | undefined;
  websiteToken: string | undefined;
  lang: string;
  session: Session | null;
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
    const lang = this.props.lang;
    const session = this.props.session;

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
        accessToken: session?.user?.access_token || "",
        preferredLanguage: lang,
        name: session?.user?.name || "",
        surname: session?.user?.surname || "",
        userId: session?.user?.sub || "",
      });
      window.$chatwoot.setUser(session?.user?.sub || "", {
        email: session?.user?.email || "",
        name: session?.user?.name || "",
        surname: session?.user?.surname || "",
      });
    });
  }

  render() {
    return null;
  }
}

export default ChatwootWidget;
