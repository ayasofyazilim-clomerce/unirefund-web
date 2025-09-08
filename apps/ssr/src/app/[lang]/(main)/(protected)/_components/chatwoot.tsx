"use client";
import {Component} from "react";

declare global {
  interface Window {
    chatwootSettings?: {
      hideMessageBubble: boolean;
      position: string;
      locale: string;
      type: string;
    };
    chatwootSDK: {
      run: (options: {websiteToken: string; baseUrl: string}) => void;
    };
  }
}

class ChatwootWidget extends Component<{baseUrl: string | undefined; websiteToken: string | undefined}> {
  componentDidMount() {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right", // This can be left or right
      locale: "en", // Language to be set
      type: "standard", // [standard, expanded_bubble]
    };
    const baseUrl = this.props.baseUrl;
    const websiteToken = this.props.websiteToken;
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
  }

  render() {
    return null;
  }
}

export default ChatwootWidget;
