import { createMarkdown } from 'safe-marked';
import removeMd from 'remove-markdown';
import htmlToText2 from 'html-to-text2';

export const cutString = (value, max) => {
  let isOver = true;
  if (max >= value.length) {
    max = value.length;
    isOver = false;
  }
  return value.substring(0, max) + (isOver ? '...' : '');
};

export const anchorConvert = contents => {
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

export const lineBreakConvert = str => {
  return str.replace(/(\n|\r\n)/g, '<br>');
};

export const safeMarkdown = contents => {
  const markdown = createMarkdown({
    marked: { breaks: true, headerIds: false },
  });
  return markdown(contents);
};

export const removeMarkdown = markdown => {
  return removeMd(markdown);
};

export const parseMarkdown = (markdown, wordwrap) => {
  markdown = markdown.replace(/(?:\r\n|\r|\n)/g, ' ');
  markdown = markdown.replace(/(<code data).*(<\/code>)/g, '');

  let text = htmlToText2.fromString(markdown, {
    ignoreHref: true,
    ignoreImage: true,
  });

  text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
  return cutString(text, wordwrap).trim();
};
