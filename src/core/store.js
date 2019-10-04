export default function(res) {
  return {
    setState(value) {
      res.locals.STATE = value;
    }
  };
}
