const Services = (api, queryBody, requestType) => {
  let isFormData = false;
  // setLoaderData(true);
  if (queryBody) {
    if (queryBody instanceof FormData) {
      isFormData = true;
    }
  }
  const requestOptions = {
    method: requestType
      ? requestType.toUpperCase()
      : queryBody
      ? "POST"
      : "GET",
    headers: {
      // "Content-Type": 'application/json'
    },

    body: isFormData ? queryBody : JSON.stringify(queryBody),
    // body: JSON.stringify(queryBody),
  };

  if (!isFormData) {
    requestOptions.headers["Content-Type"] = "application/json";
  }
  // console.log(api, requestOptions);
  return fetch(api, requestOptions)
    .then((response) =>
      response.json().then((response) => {
        return Promise.resolve(response);
      })
    )
    .catch((error) => {
      // console.log("error for api", error);
      // setLoaderData(false);
      if (error.message === "Failed to fetch") {
        alert("Please check your Internet connection");
      } else {
        alert("Sorry something went wrong");
      }
    });
};
export default Services;
