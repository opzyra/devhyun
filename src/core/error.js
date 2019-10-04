import { errorLogger } from "./logger";

export const endpoint = (req, res, next) => {
  res.statusCode = 404;

  if (req.is("json") || req.is("multipart/form-data")) {
    res.status(404).json({ message: "요청하신 API는 존재하지 않습니다." });
    return;
  }

  res.render("error/404", {
    layout: false
  });
};

export const error = (error, req, res, next) => {
  errorLogger.error(error.stack);

  if (req.is("json") || req.is("multipart/form-data")) {
    res.status(500).json({ message: "시스템 오류가 발생하였습니다." });
    return;
  }

  res.render("error/500", {
    layout: false
  });
};
