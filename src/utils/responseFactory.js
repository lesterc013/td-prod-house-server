function createJsonResponse(data, error = null) {
  return {
    data,
    error,
  };
}

export default { createJsonResponse };
