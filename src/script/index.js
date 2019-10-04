import * as admin from "./admin";
import * as client from "./client";

window.CONFIG = (scope, namespace) => {
  $(document).ready(function() {
    const config = scope == "admin" ? admin.init() : client.init();
    namespace && config(namespace);
  });
};
