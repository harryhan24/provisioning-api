import saml2 from "saml2-js";

import config from "../config";

export const sp = new saml2.ServiceProvider(config.serviceProvider.sp);
export const idp = new saml2.IdentityProvider(config.serviceProvider.idp);
