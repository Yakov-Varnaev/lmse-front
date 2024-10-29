import camelcaseKeys from "camelcase-keys";

const responseCaseMiddleware = (data, enable = true) =>
  enable ? camelcaseKeys(data, { deep: true }) : data;

const onResponseFulfilled = (response, enableCaseMiddleware) => {
  // Convert data keys to target case
  if (response.data) {
    response.data = responseCaseMiddleware(response.data, enableCaseMiddleware);
  }

  return response;
};

export default onResponseFulfilled;
