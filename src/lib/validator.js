import Joi from "@hapi/joi";
import { debugLogger } from "../core/logger";

export { Joi };

export default {
  query(joi) {
    return (req, res, next) => {
      const schema = Joi.object(joi);
      const result = schema.validate(req.query, { allowUnknown: true });

      if (!result.error) {
        next();
        return;
      }

      if (req.is("json") || req.is("multipart/form-data")) {
        res.status(400).json({
          message: "잘못된 접근입니다.",
          payload: result.error
        });
      } else {
        res.render("error/404", { layout: false });
      }
    };
  },
  params(joi) {
    return (req, res, next) => {
      const schema = Joi.object(joi);
      const result = schema.validate(req.params, { allowUnknown: true });

      if (!result.error) {
        next();
        return;
      }

      if (req.is("json") || req.is("multipart/form-data")) {
        res.status(400).json({
          message: "잘못된 접근입니다.",
          payload: result.error
        });
      } else {
        res.render("error/404", { layout: false });
      }
    };
  },
  body(joi) {
    return (req, res, next) => {
      const schema = Joi.object().keys(joi);
      const keys = Object.keys(joi);
      const data = {};
      keys.forEach(e => {
        data[e] = req.body[e];
      });

      debugLogger.info(`REQUEST BODY - ${JSON.stringify(data)}`);

      const result = schema.validate(req.body, { allowUnknown: true });

      if (!result.error) {
        next();
        return;
      }

      if (req.is("json") || req.is("multipart/form-data")) {
        res.status(400).json({
          message: "데이터 검증에서 오류가 발생했습니다.",
          payload: result.error
        });
      } else {
        res.render("error/404", { layout: false });
      }
    };
  }
};
