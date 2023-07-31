export const errorHandlers = (error: any) => {
  let err = '';
  // @ts-ignore
  if (error.response && error.response.data) {
    //@ts-ignore
    err = Object.values(error.response.data).reduce((acc, curValue) => {
      return [
        //@ts-ignore
        ...acc,
        //@ts-ignore
        ...curValue,
      ]
    }, []).join('.  ');
    return err;
  }
  return error;
};