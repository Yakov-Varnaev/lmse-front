import { HttpStatusCode } from "axios";

export default (error) => {
  const alert = useAlert();
  if (!error.response) {
    console.log(error);
    return;
  }
  if (error.response.status === HttpStatusCode.Unauthorized) {
    alert.reportWarning("Сессия истекла, пожалуйста, войдите заново");
    useAuth().reset();
    return Promise.reject(error);
  }

  let errs = error.response?.data || {};
  for (const [k, v] of Object.entries(errs)) {
    v.forEach((msg) => {
      alert.reportError(msg);
    });
  }

  // if (error) {
  //   if (error.response?.data) {
  //     for (const [key, value] of Object.entries(error.response.data)) {
  //       alert.reportError(`${key}: ${value[0]}`);
  //     }
  //   } else {
  //     alert.reportError(error);
  //   }
  // }

  return Promise.reject(error);
};
