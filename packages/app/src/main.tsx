import "@aws-amplify/ui-react/styles.css";
import { Authenticator, translations } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { I18n } from "aws-amplify/utils";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import awsConfig from "./aws-exports";

I18n.putVocabularies(translations);
I18n.setLanguage("ja");
Amplify.configure(awsConfig);

const rootDom = document.getElementById("root");
if (!rootDom) {
	throw new Error("Root element not found");
}
if (!rootDom.innerHTML) {
	ReactDOM.createRoot(rootDom).render(
		<React.StrictMode>
			<Authenticator>
				<App />
			</Authenticator>
		</React.StrictMode>,
	);
}
