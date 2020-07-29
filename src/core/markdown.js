const anchorConvert = contents => {
  return contents
    .replace(/<a href=/gi, '<a target="_blank" href=')
    .replace(
      /<a target="_blank" href="(http:\/\/)?devhyun.com/gi,
      '<a href="https://devhyun.com',
    )
    .replace(
      /<a target="_blank" href="(https:\/\/)?devhyun.com/gi,
      '<a href="https://devhyun.com',
    );
};

export default { anchorConvert };
