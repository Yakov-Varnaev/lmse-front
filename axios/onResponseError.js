import { HttpStatusCode } from "axios";

export default (error) => {
  const alert = useAlert();
  if (error.response.status === HttpStatusCode.Unauthorized) {
    alert.reportWarning("Сессия истекла, пожалуйста, войдите заново");
    useAuth().reset();
    return Promise.reject(error);
  }

  if (error) {
    alert.reportError(error);
  }

  return Promise.reject(error);
};
