const INTERCEPTOR_CLEANUP_KEY = "__nemthangloiInterceptorCleanup";

export function setupAxiosInterceptors(client, options = {}) {
  const { onUnauthorized } = options;

  // HMR-safe: remove previously attached interceptors to avoid duplicate handlers.
  if (typeof client?.[INTERCEPTOR_CLEANUP_KEY] === "function") {
    client[INTERCEPTOR_CLEANUP_KEY]();
  }

  const requestId = client.interceptors.request.use((config) => {
    config.headers.set("Accept", "application/json");

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (!isFormData && !config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }

    // cookie auth => cần gửi cookie
    config.withCredentials = true;

    return config;
  });

  const responseId = client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const status = error.response?.status;
      const skipAuthLogout = Boolean(error?.config?._skipAuthLogout);

      if ((status === 401 || status === 403) && !skipAuthLogout) {
        onUnauthorized?.(error);
      }
      return Promise.reject(error);
    }
  );

  const cleanup = () => {
    client.interceptors.request.eject(requestId);
    client.interceptors.response.eject(responseId);
    if (client[INTERCEPTOR_CLEANUP_KEY] === cleanup) {
      delete client[INTERCEPTOR_CLEANUP_KEY];
    }
  };

  client[INTERCEPTOR_CLEANUP_KEY] = cleanup;
  return cleanup;
}

// 

// 

// export function setupAxiosInterceptors(
//   client,
//   options = {},
// ) {
//   const { getAccessToken, onUnauthorized, onError } = options;

//   const reqId = client.interceptors.request.use(
//     (config) => {
//       config.headers.set("Accept", "application/json");

//       const isFormData =
//         typeof FormData !== "undefined" && config.data instanceof FormData;
//       if (!isFormData && !config.headers.has("Content-Type")) {
//         config.headers.set("Content-Type", "application/json");
//       }

//       if (getAccessToken) {
//         const token = getAccessToken();
//         if (token && !config.headers.has("Authorization")) {
//           config.headers.set("Authorization", `Bearer ${token}`);
//         }
//       }

//       return config;
//     },
//     (error) => Promise.reject(error),
//   );

//   const resId = client.interceptors.response.use((response) => response.data,
//     (error) => {
//       const status = error.response?.status;

//       if (status === 401 || status === 403) {
//         onUnauthorized?.(error);
//       }

//       onError?.(error);
//       return Promise.reject(error);
//     },
//   );

//   return () => {
//     client.interceptors.request.eject(reqId);
//     client.interceptors.response.eject(resId);
//   };
// }
