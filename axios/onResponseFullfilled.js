import camelcaseKeys from "camelcase-keys";

const responseCaseMiddleware = (data, enable = true) =>
  enable
    ? camelcaseKeys(data, {
        deep: true,
        exclude: [
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        ],
      })
    : data;

const onResponseFulfilled = (response, enableCaseMiddleware) => {
  // Convert data keys to target case
  if (response.data) {
    response.data = responseCaseMiddleware(response.data, enableCaseMiddleware);
  }

  return response;
};

export default onResponseFulfilled;
